<?php

namespace App\Models;

use App\Config\Database;
use PDO;

class Room {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    public function getAll() {
        $stmt = $this->db->query("SELECT * FROM rooms ORDER BY created_at DESC");
        return $stmt->fetchAll();
    }

    public function getById($id) {
        $stmt = $this->db->prepare("SELECT * FROM rooms WHERE id = :id");
        $stmt->execute(['id' => $id]);
        return $stmt->fetch();
    }

    public function create($data) {
        $stmt = $this->db->prepare("INSERT INTO rooms (name, capacity, room_type) VALUES (:name, :capacity, :room_type)");
        $stmt->execute([
            'name' => $data['name'],
            'capacity' => $data['capacity'],
            'room_type' => $data['room_type'] ?? 'theory'
        ]);
        return $this->db->lastInsertId();
    }

    public function update($id, $data) {
        $stmt = $this->db->prepare("UPDATE rooms SET name = :name, capacity = :capacity, room_type = :room_type WHERE id = :id");
        return $stmt->execute([
            'id' => $id,
            'name' => $data['name'],
            'capacity' => $data['capacity'],
            'room_type' => $data['room_type']
        ]);
    }

    public function delete($id) {
        $stmt = $this->db->prepare("DELETE FROM rooms WHERE id = :id");
        return $stmt->execute(['id' => $id]);
    }
}
