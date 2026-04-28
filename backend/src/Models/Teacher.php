<?php

namespace App\Models;

use App\Config\Database;
use PDO;

class Teacher {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    public function getAll() {
        $stmt = $this->db->query("SELECT * FROM teachers ORDER BY created_at DESC");
        return $stmt->fetchAll();
    }

    public function getById($id) {
        $stmt = $this->db->prepare("SELECT * FROM teachers WHERE id = :id");
        $stmt->execute(['id' => $id]);
        return $stmt->fetch();
    }

    public function create($data) {
        $stmt = $this->db->prepare("INSERT INTO teachers (name, availability) VALUES (:name, :availability)");
        $availability = isset($data['availability']) ? json_encode($data['availability']) : null;
        $stmt->execute([
            'name' => $data['name'],
            'availability' => $availability
        ]);
        return $this->db->lastInsertId();
    }

    public function update($id, $data) {
        $stmt = $this->db->prepare("UPDATE teachers SET name = :name, availability = :availability WHERE id = :id");
        $availability = isset($data['availability']) ? json_encode($data['availability']) : null;
        return $stmt->execute([
            'id' => $id,
            'name' => $data['name'],
            'availability' => $availability
        ]);
    }

    public function delete($id) {
        $stmt = $this->db->prepare("DELETE FROM teachers WHERE id = :id");
        return $stmt->execute(['id' => $id]);
    }
}
