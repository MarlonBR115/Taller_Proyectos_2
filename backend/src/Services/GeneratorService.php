<?php

namespace App\Services;

use App\Config\Database;
use App\Generator\Models\ScheduleAssignment;
use App\Generator\Services\ScheduleBuilder;
use PDO;

class GeneratorService {
    private $db;
    private ScheduleBuilder $builder;

    public function __construct() {
        $this->db = Database::getInstance();
        $this->builder = new ScheduleBuilder();
    }

    public function generate() {
        $term = $this->db->query("SELECT id FROM academic_terms WHERE is_active = true LIMIT 1")->fetch();
        if (!$term) {
            return [
                'success' => false,
                'message' => 'No hay ningún periodo académico activo. Por favor, crea y activa un semestre primero.',
                'errors' => []
            ];
        }
        $termId = $term['id'];

        $stmtDel = $this->db->prepare("DELETE FROM schedules WHERE term_id = ?");
        $stmtDel->execute([$termId]);

        $groups = $this->db->prepare("SELECT sg.*, c.weekly_hours, c.name as course_name, t.name as teacher_name 
                                    FROM student_groups sg 
                                    JOIN courses c ON sg.course_id = c.id
                                    LEFT JOIN teachers t ON sg.teacher_id = t.id
                                    WHERE sg.term_id = ? OR sg.term_id IS NULL");
        $groups->execute([$termId]);
        $groups = $groups->fetchAll();

        $rooms = $this->db->query("SELECT * FROM rooms ORDER BY capacity ASC")->fetchAll();

        $days = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'];
        $slots = [
            '08:00', '09:00', '10:00', '11:00', '12:00',
            '13:00', '14:00', '15:00', '16:00', '17:00',
            '18:00', '19:00', '20:00', '21:00'
        ];

        $this->builder->setGroups($groups)
                      ->setRooms($rooms)
                      ->setDaysAndSlots($days, $slots);

        $result = $this->builder->build();
        
        $assignments = $result['assignments'];
        $errors = $result['errors'];

        foreach ($assignments as $assignment) {
            $stmt = $this->db->prepare("INSERT INTO schedules (term_id, group_id, room_id, day_of_week, start_time, end_time) VALUES (?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $termId,
                $assignment->groupId,
                $assignment->roomId,
                $assignment->dayOfWeek,
                $assignment->startTime . ':00',
                $assignment->endTime . ':00'
            ]);
        }

        return [
            'success' => count($errors) === 0,
            'message' => 'Generación completada.',
            'errors' => $errors,
            'total_assigned' => count($assignments)
        ];
    }
}