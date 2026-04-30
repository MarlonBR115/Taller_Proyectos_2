class CSPOptimizer {
  constructor(inputData) {
    this.groups = inputData.groups;
    this.teachers = inputData.teachers;
    this.rooms = inputData.rooms;
    this.settings = inputData.settings;
    
    this.scheduleMatrix = {};
    this.teacherSchedule = {};
    
    this.startTime = performance.now(); 
  }

  isValidAssignment(group, room, day, timeSlots) {
    if (room.capacity < group.quota) return false;
    if (room.room_type !== group.room_type_required) return false;
    
    for (const slot of timeSlots) {
      const roomKey = `${room.id}_${day}_${slot}`;
      if (this.scheduleMatrix[roomKey]) return false;

      const teacherKey = `${group.teacher_id}_${day}_${slot}`;
      if (this.teacherSchedule[teacherKey]) return false;

      if (!this.isTeacherAvailable(group.teacher_id, slot)) return false;
    }

    return true;
  }

  isTeacherAvailable(teacherId, slot) {
    const teacher = this.teachers.find(t => t.id === teacherId);
    if (!teacher || !teacher.availability) return true;
    
    let shifts = [];
    try {
        shifts = typeof teacher.availability === 'string' ? JSON.parse(teacher.availability) : teacher.availability;
        if (typeof shifts === 'string') shifts = JSON.parse(shifts);
    } catch(e) {
        return true;
    }
    
    if (!Array.isArray(shifts) || shifts.length === 0) return true;

    const hour = parseInt(slot);
    let currentShift = '';
    if (hour >= 8 && hour < 13) currentShift = 'Mañana';
    else if (hour >= 13 && hour < 18) currentShift = 'Tarde';
    else if (hour >= 18 && hour <= 22) currentShift = 'Noche';

    return shifts.includes(currentShift);
  }

  // Motor de Búsqueda CSP (Backtracking)
  solve(groupIndex = 0, currentAssignments = []) {
    if (groupIndex === this.groups.length) {
      return currentAssignments;
    }

    const group = this.groups[groupIndex];
    const requiredHours = group.weekly_hours || 1; 

    for (const room of this.rooms) {
      for (const day of this.settings.allowed_days) {
        
        const availableSlots = this.getAvailableSlotsForDay(day); 

        for (let i = 0; i <= availableSlots.length - requiredHours; i++) {
          const timeSlots = availableSlots.slice(i, i + requiredHours);

          if (this.isValidAssignment(group, room, day, timeSlots)) {
            
            this.markAsOccupied(group, room, day, timeSlots);
            
            const assignment = { 
              group, 
              room, 
              day, 
              timeSlots,
              start_time: timeSlots[0],
              end_time: timeSlots[timeSlots.length - 1] + 1
            };
            currentAssignments.push(assignment);

            const result = this.solve(groupIndex + 1, currentAssignments);
            if (result) return result;

            this.markAsFree(group, room, day, timeSlots);
            currentAssignments.pop();
          }
        }
      }
    }

    return null; 
  }

  markAsOccupied(group, room, day, timeSlots) {
    for (const slot of timeSlots) {
      const roomKey = `${room.id}_${day}_${slot}`;
      const teacherKey = `${group.teacher_id}_${day}_${slot}`;
      this.scheduleMatrix[roomKey] = true;
      this.teacherSchedule[teacherKey] = true;
    }
  }

  markAsFree(group, room, day, timeSlots) {
    for (const slot of timeSlots) {
      const roomKey = `${room.id}_${day}_${slot}`;
      const teacherKey = `${group.teacher_id}_${day}_${slot}`;
      delete this.scheduleMatrix[roomKey];
      delete this.teacherSchedule[teacherKey];
    }
  }

  getAvailableSlotsForDay(day) {
    const start = this.settings.start_time || 8;
    const end = this.settings.end_time || 20;
    
    const slots = [];
    for (let i = start; i < end; i++) {
      slots.push(i);
    }
    return slots; 
  }

  buildResponse(assignments) {
    const executionTime = Math.round(performance.now() - this.startTime);
    
    return {
      status: assignments ? "success" : "partial",
      message: assignments ? "Horario generado exitosamente." : "No se pudo generar un horario completo.",
      schedules: assignments || [], 
      unassigned_groups: [],
      metrics: {
        execution_time_ms: executionTime,
        total_groups: this.groups.length,
        assigned_groups: assignments ? this.groups.length : 0 
      }
    };
  }
}

module.exports = CSPOptimizer;
