<?php

namespace App\Controllers;

use App\Services\GeneratorService;
use App\Config\Database;

class ScheduleController {
    
    private $generatorService;
    private $db;

    public function __construct() {
        $this->generatorService = new GeneratorService();
        $this->db = Database::getInstance();
    }

    public function generate() {
        $result = $this->generatorService->generate();
        echo json_encode($result);
    }

    public function getAll() {
        // Obtener el periodo activo
        $term = $this->db->query("SELECT id FROM academic_terms WHERE is_active = true LIMIT 1")->fetch();
        
        if (!$term) {
            echo json_encode(['success' => true, 'data' => []]);
            return;
        }

        $termId = $term['id'];

        // Obtener todos los horarios generados SOLO del periodo activo
        $query = "SELECT s.*, c.name as course_name, t.name as teacher_name, r.name as room_name 
                  FROM schedules s 
                  JOIN student_groups sg ON s.group_id = sg.id 
                  JOIN courses c ON sg.course_id = c.id 
                  JOIN teachers t ON sg.teacher_id = t.id 
                  JOIN rooms r ON s.room_id = r.id
                  WHERE s.term_id = :term_id
                  ORDER BY FIELD(s.day_of_week, 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'), s.start_time";
        
        $stmt = $this->db->prepare($query);
        $stmt->execute(['term_id' => $termId]);
        $schedules = $stmt->fetchAll();
        
        echo json_encode([
            'success' => true,
            'data' => $schedules
        ]);
    }
}
