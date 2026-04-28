<?php

namespace App\Controllers;

use App\Models\Room;

class RoomController {
    private $roomModel;

    public function __construct() {
        $this->roomModel = new Room();
    }

    public function index() {
        $rooms = $this->roomModel->getAll();
        echo json_encode(['success' => true, 'data' => $rooms]);
    }

    public function show($id) {
        $room = $this->roomModel->getById($id);
        if ($room) {
            echo json_encode(['success' => true, 'data' => $room]);
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Room not found']);
        }
    }

    public function store() {
        $data = json_decode(file_get_contents('php://input'), true);
        if (!isset($data['name']) || !isset($data['capacity'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Name and capacity are required']);
            return;
        }

        $id = $this->roomModel->create($data);
        echo json_encode(['success' => true, 'message' => 'Room created successfully', 'id' => $id]);
    }

    public function update($id) {
        $data = json_decode(file_get_contents('php://input'), true);
        if (!isset($data['name']) || !isset($data['capacity'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Name and capacity are required']);
            return;
        }

        $this->roomModel->update($id, $data);
        echo json_encode(['success' => true, 'message' => 'Room updated successfully']);
    }

    public function destroy($id) {
        $this->roomModel->delete($id);
        echo json_encode(['success' => true, 'message' => 'Room deleted successfully']);
    }
}
