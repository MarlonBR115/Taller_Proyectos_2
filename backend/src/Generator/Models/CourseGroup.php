<?php

namespace App\Generator\Models;

class CourseGroup {
    public int $id;
    public int $courseId;
    public string $courseName;
    public int $teacherId;
    public string $teacherName;
    public int $quota;
    public int $weeklyHours;
    public ?int $termId;
    public array $teacherShifts;

    public function __construct(array $data) {
        $this->id = (int) $data['id'];
        $this->courseId = (int) $data['course_id'];
        $this->courseName = $data['course_name'] ?? '';
        $this->teacherId = (int) $data['teacher_id'];
        $this->teacherName = $data['teacher_name'] ?? '';
        $this->quota = (int) ($data['quota'] ?? 30);
        $this->weeklyHours = (int) $data['weekly_hours'];
        $this->termId = isset($data['term_id']) ? (int) $data['term_id'] : null;
        
        $availability = $data['teacher_availability'] ?? null;
        $this->teacherShifts = is_array($availability) ? $availability : 
            (is_string($availability) ? json_decode($availability, true) : ['Mañana', 'Tarde', 'Noche']);
        
        if (!is_array($this->teacherShifts) || empty($this->teacherShifts)) {
            $this->teacherShifts = ['Mañana', 'Tarde', 'Noche'];
        }
    }
}