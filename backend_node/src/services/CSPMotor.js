class CSPOptimizer {
  constructor(inputData) {
    this.groups = inputData.groups;
    this.teachers = inputData.teachers;
    this.rooms = inputData.rooms;
    this.settings = inputData.settings;
    
    // Diccionarios en memoria para acceso rápido O(1)
    this.scheduleMatrix = {}; // Para rastrear ocupación: { "Aula_5_Lunes_0800": true }
    this.teacherSchedule = {}; // Para rastrear profesores: { "Prof_12_Lunes_0800": true }
    
    // Tiempo de inicio para la métrica "execution_time_ms"
    this.startTime = performance.now(); 
  }

  // --- RESTRICCIONES (Constraints) ---
  isValidAssignment(group, room, day, timeSlots) {
    // 1. Validar capacidad
    if (room.capacity < group.quota) return false;
    
    // 2. Validar tipo de aula
    if (room.room_type !== group.room_type_required) return false;
    
    // Validar cada hora del bloque requerido
    for (const slot of timeSlots) {
      // 3. Validar choque de aula
      const roomKey = `${room.id}_${day}_${slot}`;
      if (this.scheduleMatrix[roomKey]) return false;

      // 4. Validar choque de profesor
      const teacherKey = `${group.teacher_id}_${day}_${slot}`;
      if (this.teacherSchedule[teacherKey]) return false;

      // 5. Validar disponibilidad (Turnos del profesor)
      if (!this.isTeacherAvailable(group.teacher_id, slot)) return false;
    }

    return true;
  }

  isTeacherAvailable(teacherId, slot) {
    const teacher = this.teachers.find(t => t.id === teacherId);
    if (!teacher || !teacher.availability) return true; // Si no hay data, asume disponible
    
    let shifts = [];
    try {
        shifts = typeof teacher.availability === 'string' ? JSON.parse(teacher.availability) : teacher.availability;
        if (typeof shifts === 'string') shifts = JSON.parse(shifts); // doble parse por si acaso
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

  // --- MOTOR DE BÚSQUEDA (Backtracking) ---
  solve(groupIndex = 0, currentAssignments = []) {
    // Caso base: Se asignaron todos los grupos
    if (groupIndex === this.groups.length) {
      return currentAssignments;
    }

    const group = this.groups[groupIndex];
    // Horas requeridas por este grupo. Por defecto 1 si no está definido.
    const requiredHours = group.weekly_hours || 1; 

    // Iterar sobre dominios (Aulas y Tiempos)
    for (const room of this.rooms) {
      for (const day of this.settings.allowed_days) {
        
        // Generar los bloques de tiempo dinámicamente según settings
        const availableSlots = this.getAvailableSlotsForDay(day); 

        // Buscar bloques contiguos del tamaño requerido (requiredHours)
        for (let i = 0; i <= availableSlots.length - requiredHours; i++) {
          const timeSlots = availableSlots.slice(i, i + requiredHours);

          if (this.isValidAssignment(group, room, day, timeSlots)) {
            
            // Asignar temporalmente (Forward)
            this.markAsOccupied(group, room, day, timeSlots);
            
            const assignment = { 
              group, 
              room, 
              day, 
              timeSlots, // Array de horas, ej: [8, 9, 10]
              start_time: timeSlots[0], // Hora de inicio (numérica, ej: 8 para 08:00)
              end_time: timeSlots[timeSlots.length - 1] + 1 // Hora fin (ej: 11 para 11:00)
            };
            currentAssignments.push(assignment);

            // Llamada recursiva al siguiente grupo
            const result = this.solve(groupIndex + 1, currentAssignments);
            if (result) return result; // ¡Solución encontrada!

            // Deshacer asignación si no llevó a una solución (Backtracking)
            this.markAsFree(group, room, day, timeSlots);
            currentAssignments.pop();
          }
        }
      }
    }

    // Si agota todas las opciones y no puede asignar, retorna null
    return null; 
  }

  // Métodos auxiliares para marcar ocupación y liberación
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
    // Generación dinámica basada en la configuración de la universidad
    const start = this.settings.start_time || 8; // Por defecto 08:00
    const end = this.settings.end_time || 20;    // Por defecto 20:00
    
    const slots = [];
    for (let i = start; i < end; i++) {
      slots.push(i);
    }
    return slots; 
  }

  // --- FORMATEO DE SALIDA ---
  buildResponse(assignments) {
    const executionTime = Math.round(performance.now() - this.startTime);
    
    return {
      status: assignments ? "success" : "partial",
      message: assignments ? "Horario generado exitosamente." : "No se pudo generar un horario completo.",
      schedules: assignments || [], 
      unassigned_groups: [], // Pendiente para análisis futuro (si assignments es null, devolver los fallidos)
      metrics: {
        execution_time_ms: executionTime,
        total_groups: this.groups.length,
        assigned_groups: assignments ? this.groups.length : 0 
      }
    };
  }
}

module.exports = CSPOptimizer;
