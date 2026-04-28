<?php

namespace App\Controllers;

use App\Models\Course;

class CourseController {
    private $courseModel;

    public function __construct() {
        $this->courseModel = new Course();
    }

    public function index() {
        $courses = $this->courseModel->getAll();
        echo json_encode(['success' => true, 'data' => $courses]);
    }

    public function show($id) {
        $course = $this->courseModel->getById($id);
        if ($course) {
            echo json_encode(['success' => true, 'data' => $course]);
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Course not found']);
        }
    }

    public function store() {
        $data = json_decode(file_get_contents('php://input'), true);
        if (!isset($data['name']) || !isset($data['weekly_hours'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Name and weekly_hours are required']);
            return;
        }

        $id = $this->courseModel->create($data);
        echo json_encode(['success' => true, 'message' => 'Course created successfully', 'id' => $id]);
    }

    public function update($id) {
        $data = json_decode(file_get_contents('php://input'), true);
        if (!isset($data['name']) || !isset($data['weekly_hours'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Name and weekly_hours are required']);
            return;
        }

        $this->courseModel->update($id, $data);
        echo json_encode(['success' => true, 'message' => 'Course updated successfully']);
    }

    public function destroy($id) {
        $this->courseModel->delete($id);
        echo json_encode(['success' => true, 'message' => 'Course deleted successfully']);
    }
}
