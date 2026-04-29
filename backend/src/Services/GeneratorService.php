<?php

namespace App\Services;

use App\Config\Database;
use PDO;

class GeneratorService {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    public function generate() {
        // 1. Obtener periodo activo
        $term = $this->db->query("SELECT id FROM academic_terms WHERE is_active = true LIMIT 1")->fetch();
        if (!$term) {
            return [
                'success' => false,
                'message' => 'No hay ningún periodo académico activo. Por favor, crea y activa un semestre primero.',
                'errors' => []
            ];
        }
        $termId = $term['id'];

        // 2. Limpiar horarios anteriores SOLO del periodo activo
        $stmtDel = $this->db->prepare("DELETE FROM schedules WHERE term_id = ?");
        $stmtDel->execute([$termId]);

        // 3. Obtener todos los datos necesarios (Grupos del periodo activo o sin periodo)
        $groups = $this->db->prepare("SELECT sg.*, c.weekly_hours, c.name as course_name 
                                    FROM student_groups sg 
                                    JOIN courses c ON sg.course_id = c.id
                                    WHERE sg.term_id = ? OR sg.term_id IS NULL");
        $groups->execute([$termId]);
        $groups = $groups->fetchAll();

        $rooms = $this->db->query("SELECT * FROM rooms ORDER BY capacity ASC")->fetchAll();
        
        // Días y slots configurables (Algoritmo Heurístico Greedy)
        $days = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'];
        $slots = [
            '08:00', '09:00', '10:00', '11:00', '12:00', // Mañana
            '13:00', '14:00', '15:00', '16:00', '17:00', // Tarde
            '18:00', '19:00', '20:00', '21:00'           // Noche (hasta 22:00 fin)
        ];
        
        $schedules = [];
        $errors = [];

        // Pre-cargar profesores para rápido acceso a disponibilidad
        $teachersData = $this->db->query("SELECT id, availability FROM teachers")->fetchAll(PDO::FETCH_KEY_PAIR);

        foreach ($groups as $group) {
            $hoursToAssign = $group['weekly_hours'];
            $teacherId = $group['teacher_id'];
            $quota = $group['quota'];
            
            // Decodificar turnos del profesor
            $teacherShifts = json_decode($teachersData[$teacherId] ?? '[]', true);
            if (!is_array($teacherShifts) || empty($teacherShifts)) {
                $teacherShifts = ['Mañana', 'Tarde', 'Noche']; // Default todo
            }

            // Buscar horas disponibles para este grupo
            for ($i = 0; $i < $hoursToAssign; $i++) {
                $assigned = false;
                
                // Mezclar días para balancear la carga en la semana
                $shuffledDays = $days;
                shuffle($shuffledDays);

                // Buscar un hueco libre en los días y horas
                foreach ($shuffledDays as $day) {
                    if ($assigned) break;

                    foreach ($slots as $slot) {
                        if ($assigned) break;

                        // Validar preferencia de turno del profesor
                        if (!$this->isSlotInTeacherShift($slot, $teacherShifts)) {
                            continue; // Profesor no quiere dar clases a esta hora
                        }

                        // Validar restricción: Máximo 2 horas por materia por día
                        $hoursToday = $this->getHoursForGroupOnDay($group['id'], $day, $schedules);
                        if ($hoursToday >= 2) {
                            continue; // Ya tiene 2 horas asignadas este día, intentar otro día o slot
                        }

                        // Verificar si el profesor ya tiene clase este día a esta hora
                        if ($this->isTeacherBusy($teacherId, $day, $slot, $schedules)) {
                            continue;
                        }

                        // Buscar un aula disponible y que cumpla la capacidad
                        foreach ($rooms as $room) {
                            if ($room['capacity'] < $quota) {
                                continue; // Aula muy pequeña
                            }

                            if ($this->isRoomBusy($room['id'], $day, $slot, $schedules)) {
                                continue; // Aula ocupada
                            }

                            // ¡Hemos encontrado un hueco válido!
                            $endTime = date('H:i', strtotime($slot) + 3600); // +1 hora

                            $newSchedule = [
                                'group_id' => $group['id'],
                                'room_id' => $room['id'],
                                'day_of_week' => $day,
                                'start_time' => $slot,
                                'end_time' => $endTime,
                                'teacher_id' => $teacherId
                            ];

                            $schedules[] = $newSchedule;
                            
                            // Guardar en BD
                            $stmt = $this->db->prepare("INSERT INTO schedules (term_id, group_id, room_id, day_of_week, start_time, end_time) VALUES (?, ?, ?, ?, ?, ?)");
                            $stmt->execute([$termId, $group['id'], $room['id'], $day, $slot . ':00', $endTime . ':00']);

                            $assigned = true;
                            break; // Romper loop de aulas
                        }
                    }
                }

                if (!$assigned) {
                    $errors[] = "No se pudo encontrar espacio para el grupo de " . $group['course_name'] . " (1 hora faltante).";
                }
            }
        }

        return [
            'success' => count($errors) === 0,
            'message' => 'Generación finalizada.',
            'errors' => $errors,
            'total_assigned' => count($schedules)
        ];
    }

    private function getHoursForGroupOnDay($groupId, $day, &$schedules) {
        $count = 0;
        foreach ($schedules as $s) {
            if ($s['group_id'] == $groupId && $s['day_of_week'] === $day) {
                $count++;
            }
        }
        return $count;
    }

    private function isSlotInTeacherShift($slot, $shifts) {
        $hour = (int) substr($slot, 0, 2);
        
        $currentShift = '';
        if ($hour >= 8 && $hour <= 12) {
            $currentShift = 'Mañana';
        } elseif ($hour >= 13 && $hour <= 17) {
            $currentShift = 'Tarde';
        } elseif ($hour >= 18 && $hour <= 21) {
            $currentShift = 'Noche';
        }

        return in_array($currentShift, $shifts);
    }

    private function isTeacherBusy($teacherId, $day, $slot, &$schedules) {
        foreach ($schedules as $s) {
            if ($s['teacher_id'] == $teacherId && $s['day_of_week'] === $day && $s['start_time'] === $slot) {
                return true;
            }
        }
        return false;
    }

    private function isRoomBusy($roomId, $day, $slot, &$schedules) {
        foreach ($schedules as $s) {
            if ($s['room_id'] == $roomId && $s['day_of_week'] === $day && $s['start_time'] === $slot) {
                return true;
            }
        }
        return false;
    }
}
