<?php

namespace App\Generator\Models;

class ScheduleAssignment {
    public int $id;
    public int $groupId;
    public string $groupName;
    public int $teacherId;
    public string $teacherName;
    public int $roomId;
    public string $roomName;
    public string $dayOfWeek;
    public string $startTime;
    public string $endTime;

    public function __construct(array $data = []) {
        if (!empty($data)) {
            $this->id = (int) ($data['id'] ?? 0);
            $this->groupId = (int) $data['group_id'];
            $this->groupName = $data['group_name'] ?? '';
            $this->teacherId = (int) $data['teacher_id'];
            $this->teacherName = $data['teacher_name'] ?? '';
            $this->roomId = (int) $data['room_id'];
            $this->roomName = $data['room_name'] ?? '';
            $this->dayOfWeek = $data['day_of_week'];
            $this->startTime = $data['start_time'];
            $this->endTime = $data['end_time'];
        }
    }

    public function getSlot(): ScheduleSlot {
        return new ScheduleSlot($this->dayOfWeek, $this->startTime);
    }

    public function toArray(): array {
        return [
            'id' => $this->id,
            'group_id' => $this->groupId,
            'group_name' => $this->groupName,
            'teacher_id' => $this->teacherId,
            'teacher_name' => $this->teacherName,
            'room_id' => $this->roomId,
            'room_name' => $this->roomName,
            'day_of_week' => $this->dayOfWeek,
            'start_time' => $this->startTime,
            'end_time' => $this->endTime
        ];
    }
}