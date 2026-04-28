<?php

namespace App\Controllers;

use App\Models\StudentGroup;

class StudentGroupController {
    private $groupModel;

    public function __construct() {
        $this->groupModel = new StudentGroup();
    }

    public function index() {
        $groups = $this->groupModel->getAll();
        echo json_encode(['success' => true, 'data' => $groups]);
    }

    public function show($id) {
        $group = $this->groupModel->getById($id);
        if ($group) {
            echo json_encode(['success' => true, 'data' => $group]);
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Group not found']);
        }
    }

    public function store() {
        $data = json_decode(file_get_contents('php://input'), true);
        if (!isset($data['course_id']) || !isset($data['teacher_id']) || !isset($data['quota'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Missing required fields']);
            return;
        }

        $id = $this->groupModel->create($data);
        echo json_encode(['success' => true, 'message' => 'Group created successfully', 'id' => $id]);
    }

    public function update($id) {
        $data = json_decode(file_get_contents('php://input'), true);
        if (!isset($data['course_id']) || !isset($data['teacher_id']) || !isset($data['quota'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Missing required fields']);
            return;
        }

        $this->groupModel->update($id, $data);
        echo json_encode(['success' => true, 'message' => 'Group updated successfully']);
    }

    public function destroy($id) {
        $this->groupModel->delete($id);
        echo json_encode(['success' => true, 'message' => 'Group deleted successfully']);
    }
}
