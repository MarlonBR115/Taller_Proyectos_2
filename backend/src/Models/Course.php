<?php

namespace App\Models;

use App\Config\Database;
use PDO;

class Course {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    public function getAll() {
        $stmt = $this->db->query("SELECT * FROM courses ORDER BY created_at DESC");
        return $stmt->fetchAll();
    }

    public function getById($id) {
        $stmt = $this->db->prepare("SELECT * FROM courses WHERE id = :id");
        $stmt->execute(['id' => $id]);
        return $stmt->fetch();
    }

    public function create($data) {
        $stmt = $this->db->prepare("INSERT INTO courses (name, credits, weekly_hours) VALUES (:name, :credits, :weekly_hours)");
        $stmt->execute([
            'name' => $data['name'],
            'credits' => $data['credits'] ?? 3,
            'weekly_hours' => $data['weekly_hours']
        ]);
        return $this->db->lastInsertId();
    }

    public function update($id, $data) {
        $stmt = $this->db->prepare("UPDATE courses SET name = :name, credits = :credits, weekly_hours = :weekly_hours WHERE id = :id");
        return $stmt->execute([
            'id' => $id,
            'name' => $data['name'],
            'credits' => $data['credits'],
            'weekly_hours' => $data['weekly_hours']
        ]);
    }

    public function delete($id) {
        $stmt = $this->db->prepare("DELETE FROM courses WHERE id = :id");
        return $stmt->execute(['id' => $id]);
    }
}
