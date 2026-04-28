<?php

namespace App\Generator\Models;

class ScheduleSlot {
    public string $day;
    public string $startTime;
    public string $endTime;
    public int $durationHours;

    public function __construct(string $day, string $startTime, int $durationHours = 1) {
        $this->day = $day;
        $this->startTime = $startTime;
        $this->durationHours = $durationHours;
        $this->endTime = date('H:i', strtotime($startTime) + ($durationHours * 3600));
    }

    public function overlapsWith(ScheduleSlot $other): bool {
        if ($this->day !== $other->day) {
            return false;
        }
        return $this->startTime === $other->startTime;
    }

    public function getHourInt(): int {
        return (int) substr($this->startTime, 0, 2);
    }

    public function getShift(): string {
        $hour = $this->getHourInt();
        if ($hour >= 8 && $hour <= 12) return 'Mañana';
        if ($hour >= 13 && $hour <= 17) return 'Tarde';
        if ($hour >= 18 && $hour <= 21) return 'Noche';
        return 'Noche';
    }

    public function __toString(): string {
        return "{$this->day} {$this->startTime}-{$this->endTime}";
    }
}