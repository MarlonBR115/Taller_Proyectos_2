<?php

namespace App\Controllers;

use App\Models\Teacher;

class TeacherController {
    private $teacherModel;

    public function __construct() {
        $this->teacherModel = new Teacher();
    }

    public function index() {
        $teachers = $this->teacherModel->getAll();
        echo json_encode(['success' => true, 'data' => $teachers]);
    }

    public function show($id) {
        $teacher = $this->teacherModel->getById($id);
        if ($teacher) {
            echo json_encode(['success' => true, 'data' => $teacher]);
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Teacher not found']);
        }
    }

    public function store() {
        $data = json_decode(file_get_contents('php://input'), true);
        if (!isset($data['name'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Name is required']);
            return;
        }

        $id = $this->teacherModel->create($data);
        echo json_encode(['success' => true, 'message' => 'Teacher created successfully', 'id' => $id]);
    }

    public function update($id) {
        $data = json_decode(file_get_contents('php://input'), true);
        if (!isset($data['name'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Name is required']);
            return;
        }

        $this->teacherModel->update($id, $data);
        echo json_encode(['success' => true, 'message' => 'Teacher updated successfully']);
    }

    public function destroy($id) {
        $this->teacherModel->delete($id);
        echo json_encode(['success' => true, 'message' => 'Teacher deleted successfully']);
    }
}
