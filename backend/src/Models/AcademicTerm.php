<?php

namespace App\Models;

use App\Config\Database;
use PDO;

class AcademicTerm {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    public function getAll() {
        $stmt = $this->db->query("SELECT * FROM academic_terms ORDER BY created_at DESC");
        return $stmt->fetchAll();
    }

    public function getActiveTerm() {
        $stmt = $this->db->query("SELECT * FROM academic_terms WHERE is_active = true LIMIT 1");
        return $stmt->fetch();
    }

    public function getById($id) {
        $stmt = $this->db->prepare("SELECT * FROM academic_terms WHERE id = :id");
        $stmt->execute(['id' => $id]);
        return $stmt->fetch();
    }

    public function create($data) {
        // Si este es marcado como activo, desactivar los demás
        if (isset($data['is_active']) && $data['is_active']) {
            $this->db->query("UPDATE academic_terms SET is_active = false");
        }

        $stmt = $this->db->prepare("INSERT INTO academic_terms (name, is_active) VALUES (:name, :is_active)");
        $stmt->execute([
            'name' => $data['name'],
            'is_active' => isset($data['is_active']) ? (int)$data['is_active'] : 0
        ]);
        return $this->db->lastInsertId();
    }

    public function update($id, $data) {
        if (isset($data['is_active']) && $data['is_active']) {
            $this->db->query("UPDATE academic_terms SET is_active = false");
        }

        $stmt = $this->db->prepare("UPDATE academic_terms SET name = :name, is_active = :is_active WHERE id = :id");
        return $stmt->execute([
            'id' => $id,
            'name' => $data['name'],
            'is_active' => isset($data['is_active']) ? (int)$data['is_active'] : 0
        ]);
    }

    public function delete($id) {
        $stmt = $this->db->prepare("DELETE FROM academic_terms WHERE id = :id");
        return $stmt->execute(['id' => $id]);
    }
}
