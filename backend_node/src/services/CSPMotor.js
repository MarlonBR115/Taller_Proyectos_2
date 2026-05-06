class CSPOptimizer {
  constructor(inputData) {
    this.groups = inputData.groups;
    this.teachers = inputData.teachers;
    this.rooms = inputData.rooms;
    this.settings = inputData.settings;
    
    this.scheduleMatrix = {};
    this.teacherSchedule = {};
    
    this.startTime = performance.now(); 

    // A003-02: Heurística MRV (Minimum Remaining Values)
    // Ordenamos los grupos de más restrictivo a menos restrictivo antes de asignar.
    this.sortGroupsByMRV();
  }

  sortGroupsByMRV() {
    this.groups.sort((a, b) => {
      // 1. Mayor carga horaria (weekly_hours)
      const hoursDiff = (b.weekly_hours || 1) - (a.weekly_hours || 1);
      if (hoursDiff !== 0) return hoursDiff;
      
      // 2. Aulas menos comunes (requieren aulas específicas que escasean)
      const aRooms = this.rooms.filter(r => r.room_type === a.room_type_required && r.capacity >= a.quota).length;
      const bRooms = this.rooms.filter(r => r.room_type === b.room_type_required && r.capacity >= b.quota).length;
      
      return aRooms - bRooms; // Menos aulas disponibles -> va primero
    });
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

  // Motor de Búsqueda CSP (Backtracking con Heurísticas LCV)
  solve(groupIndex = 0, currentAssignments = []) {
    if (groupIndex === this.groups.length) {
      return currentAssignments;
    }

    const group = this.groups[groupIndex];
    const requiredHours = group.weekly_hours || 1; 

    // Recopilar todas las asignaciones válidas para aplicar LCV (Least Constraining Value)
    let validAssignments = [];

    for (const room of this.rooms) {
      for (const day of this.settings.allowed_days) {
        
        const availableSlots = this.getAvailableSlotsForDay(day); 

        for (let i = 0; i <= availableSlots.length - requiredHours; i++) {
          // A003-02: Integridad de sesiones (Bloques contiguos).
          // Se toman los slots consecutivos garantizando que la sesión no se fraccione.
          const timeSlots = availableSlots.slice(i, i + requiredHours);

          if (this.isValidAssignment(group, room, day, timeSlots)) {
            const assignment = { 
              group, 
              room, 
              day, 
              timeSlots,
              start_time: timeSlots[0],
              end_time: timeSlots[timeSlots.length - 1] + 1
            };
            
            // Calculamos el score basado en satisfacción del estudiante y reglas blandas
            const score = this.calculateStudentSatisfactionScore(assignment, currentAssignments);
            validAssignments.push({ assignment, score });
          }
        }
      }
    }

    // Ordenar opciones de asignación por score descendente (mejor satisfacción primero)
    validAssignments.sort((a, b) => b.score - a.score);

    // Intentar las asignaciones en el orden heurístico
    for (const { assignment } of validAssignments) {
      this.markAsOccupied(assignment.group, assignment.room, assignment.day, assignment.timeSlots);
      currentAssignments.push(assignment);

      const result = this.solve(groupIndex + 1, currentAssignments);
      if (result) return result;

      // Backtracking
      this.markAsFree(assignment.group, assignment.room, assignment.day, assignment.timeSlots);
      currentAssignments.pop();
    }

    return null; 
  }

  // A003-02: Criterios de desempate basados en satisfacción del estudiante
  calculateStudentSatisfactionScore(candidate, currentAssignments) {
    let score = 0;

    // 1. Preferencia de horarios (Horarios más céntricos reciben mejor puntuación)
    // Se prefiere evitar clases en horas extremas del día (muy temprano o muy tarde).
    const midDay = 13;
    const avgSlot = candidate.timeSlots.reduce((a, b) => a + b, 0) / candidate.timeSlots.length;
    const timePenalty = Math.abs(avgSlot - midDay);
    score -= timePenalty;

    // 2. Huecos académicos (Evitar horas muertas)
    // Como proxy de cohorte estudiantil, evaluamos si las clases del mismo programa/curso 
    // o del mismo docente quedan dispersas generando huecos ese día.
    const sameDayAssignments = currentAssignments.filter(
      a => (a.group.course_id === candidate.group.course_id || a.group.teacher_id === candidate.group.teacher_id) && a.day === candidate.day
    );

    if (sameDayAssignments.length > 0) {
      let hasGap = false;
      let isAdjacent = false;
      
      for (const existing of sameDayAssignments) {
        if (candidate.end_time === existing.start_time || candidate.start_time === existing.end_time) {
          isAdjacent = true;
        } else if (candidate.timeSlots[0] > existing.end_time || existing.start_time > candidate.end_time) {
          hasGap = true;
        }
      }
      
      if (isAdjacent) {
         score += 5; // Premio por clases contiguas (evita desplazamientos innecesarios)
      } else if (hasGap) {
         score -= 5; // Penalización por dejar un hueco académico
      }
    }

    return score;
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
