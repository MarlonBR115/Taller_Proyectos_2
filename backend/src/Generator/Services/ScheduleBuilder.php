<?php

namespace App\Generator\Services;

use App\Generator\Models\CourseGroup;
use App\Generator\Models\ScheduleAssignment;

class ScheduleBuilder {
    private array $assignments = [];
    private array $groups = [];
    private array $rooms = [];
    private array $days;
    private array $slots;
    private array $errors = [];

    private array $teacherSchedule = [];
    private array $roomSchedule = [];
    private array $groupDayHours = [];

    public function __construct() {
        $this->days = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'];
        $this->slots = [
            '08:00', '09:00', '10:00', '11:00', '12:00',
            '13:00', '14:00', '15:00', '16:00', '17:00',
            '18:00', '19:00', '20:00', '21:00'
        ];
    }

    public function setGroups(array $groups): self {
        $this->groups = array_map(fn($g) => new CourseGroup($g), $groups);
        return $this;
    }

    public function setRooms(array $rooms): self {
        $this->rooms = $rooms;
        return $this;
    }

    public function setDaysAndSlots(array $days, array $slots): self {
        $this->days = $days;
        $this->slots = $slots;
        return $this;
    }

    public function build(): array {
        $this->assignments = [];
        $this->errors = [];
        $this->teacherSchedule = [];
        $this->roomSchedule = [];
        $this->groupDayHours = [];
        
        $this->sortGroupsByPriority();
        
        foreach ($this->groups as $group) {
            $this->assignHoursForGroup($group);
        }
        
        return [
            'assignments' => $this->assignments,
            'errors' => $this->errors
        ];
    }

    private function sortGroupsByPriority(): void {
        usort($this->groups, function($a, $b) {
            if ($a->weeklyHours !== $b->weeklyHours) {
                return $b->weeklyHours - $a->weeklyHours;
            }
            return $a->quota - $b->quota;
        });
    }

    private function assignHoursForGroup(CourseGroup $group): void {
        $hoursToAssign = $group->weeklyHours;
        
        for ($i = 0; $i < $hoursToAssign; $i++) {
            $assigned = $this->findAvailableSlot($group);
            
            if (!$assigned) {
                $this->errors[] = "No se pudo asignar 1 hora para: {$group->courseName} (Grupo ID: {$group->id})";
            }
        }
    }

    private function findAvailableSlot(CourseGroup $group): bool {
        $shuffledDays = $this->days;
        shuffle($shuffledDays);
        $shuffledSlots = $this->slots;
        shuffle($shuffledSlots);

        foreach ($shuffledDays as $day) {
            if ($this->getHoursAssignedForGroupOnDay($group->id, $day) >= 2) {
                continue;
            }

            foreach ($shuffledSlots as $slot) {
                if ($this->isTeacherBusy($group->teacherId, $day, $slot)) {
                    continue;
                }

                $availableRoom = $this->findAvailableRoom($group->quota, $day, $slot);
                if (!$availableRoom) {
                    continue;
                }

                $this->assignments[] = new ScheduleAssignment([
                    'group_id' => $group->id,
                    'group_name' => $group->courseName,
                    'teacher_id' => $group->teacherId,
                    'teacher_name' => $group->teacherName,
                    'room_id' => $availableRoom['id'],
                    'room_name' => $availableRoom['name'],
                    'day_of_week' => $day,
                    'start_time' => $slot,
                    'end_time' => date('H:i', strtotime($slot) + 3600)
                ]);

                $this->teacherSchedule[$group->teacherId][$day][] = $slot;
                $this->roomSchedule[$availableRoom['id']][$day][] = $slot;
                
                if (!isset($this->groupDayHours[$group->id])) {
                    $this->groupDayHours[$group->id] = [];
                }
                if (!isset($this->groupDayHours[$group->id][$day])) {
                    $this->groupDayHours[$group->id][$day] = 0;
                }
                $this->groupDayHours[$group->id][$day]++;
                
                return true;
            }
        }

        return false;
    }

    private function findAvailableRoom(int $requiredCapacity, string $day, string $slot): ?array {
        $suitableRooms = array_filter($this->rooms, function($room) use ($requiredCapacity) {
            return $room['capacity'] >= $requiredCapacity;
        });
        
        $suitableRooms = array_values($suitableRooms);
        shuffle($suitableRooms);

        foreach ($suitableRooms as $room) {
            if ($this->isRoomBusy($room['id'], $day, $slot)) {
                continue;
            }
            return $room;
        }
        
        return null;
    }

    private function isTeacherBusy(int $teacherId, string $day, string $slot): bool {
        if (!isset($this->teacherSchedule[$teacherId][$day])) {
            return false;
        }
        return in_array($slot, $this->teacherSchedule[$teacherId][$day], true);
    }

    private function isRoomBusy(int $roomId, string $day, string $slot): bool {
        if (!isset($this->roomSchedule[$roomId][$day])) {
            return false;
        }
        return in_array($slot, $this->roomSchedule[$roomId][$day], true);
    }

    private function getHoursAssignedForGroupOnDay(int $groupId, string $day): int {
        return $this->groupDayHours[$groupId][$day] ?? 0;
    }

    public function getAssignments(): array {
        return $this->assignments;
    }

    public function getErrors(): array {
        return $this->errors;
    }
}