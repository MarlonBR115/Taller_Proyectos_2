<?php

namespace App\Models;

use App\Config\Database;
use PDO;

class StudentGroup {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    public function getAll() {
        $query = "SELECT sg.*, c.name as course_name, t.name as teacher_name 
                  FROM student_groups sg 
                  LEFT JOIN courses c ON sg.course_id = c.id 
                  LEFT JOIN teachers t ON sg.teacher_id = t.id 
                  ORDER BY sg.created_at DESC";
        $stmt = $this->db->query($query);
        return $stmt->fetchAll();
    }

    public function getById($id) {
        $stmt = $this->db->prepare("SELECT * FROM student_groups WHERE id = :id");
        $stmt->execute(['id' => $id]);
        return $stmt->fetch();
    }

    public function create($data) {
        $termId = null;
        if (isset($data['term_id']) && $data['term_id'] !== '') {
            $termId = $data['term_id'];
        } else {
            $term = $this->db->query("SELECT id FROM academic_terms WHERE is_active = true LIMIT 1")->fetch();
            if ($term) $termId = $term['id'];
        }

        $stmt = $this->db->prepare("INSERT INTO student_groups (term_id, course_id, teacher_id, quota) VALUES (:term_id, :course_id, :teacher_id, :quota)");
        $stmt->execute([
            'term_id' => $termId,
            'course_id' => $data['course_id'],
            'teacher_id' => $data['teacher_id'],
            'quota' => $data['quota'] ?? 30
        ]);
        return $this->db->lastInsertId();
    }

    public function update($id, $data) {
        $stmt = $this->db->prepare("UPDATE student_groups SET course_id = :course_id, teacher_id = :teacher_id, quota = :quota WHERE id = :id");
        return $stmt->execute([
            'id' => $id,
            'course_id' => $data['course_id'],
            'teacher_id' => $data['teacher_id'],
            'quota' => $data['quota']
        ]);
    }

    public function delete($id) {
        $stmt = $this->db->prepare("DELETE FROM student_groups WHERE id = :id");
        return $stmt->execute(['id' => $id]);
    }
}
