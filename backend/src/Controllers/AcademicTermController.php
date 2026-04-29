<?php

namespace App\Controllers;

use App\Models\AcademicTerm;

class AcademicTermController {
    private $termModel;

    public function __construct() {
        $this->termModel = new AcademicTerm();
    }

    public function index() {
        $terms = $this->termModel->getAll();
        echo json_encode(['success' => true, 'data' => $terms]);
    }
    
    public function getActive() {
        $term = $this->termModel->getActiveTerm();
        echo json_encode(['success' => true, 'data' => $term]);
    }

    public function store() {
        $data = json_decode(file_get_contents('php://input'), true);
        if (!isset($data['name'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Name is required']);
            return;
        }

        $id = $this->termModel->create($data);
        echo json_encode(['success' => true, 'message' => 'Term created successfully', 'id' => $id]);
    }

    public function update($id) {
        $data = json_decode(file_get_contents('php://input'), true);
        if (!isset($data['name'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Name is required']);
            return;
        }

        $this->termModel->update($id, $data);
        echo json_encode(['success' => true, 'message' => 'Term updated successfully']);
    }

    public function destroy($id) {
        $this->termModel->delete($id);
        echo json_encode(['success' => true, 'message' => 'Term deleted successfully']);
    }
}
