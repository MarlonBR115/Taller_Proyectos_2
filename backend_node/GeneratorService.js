class GeneratorService {
    constructor(pool) {
        this.pool = pool;
    }

    async generate() {
        const [termRows] = await this.pool.execute("SELECT id FROM academic_terms WHERE is_active = true LIMIT 1");
        if (termRows.length === 0) {
            return {
                success: false,
                message: 'No hay ningún periodo académico activo. Por favor, crea y activa un semestre primero.',
                errors: []
            };
        }
        const termId = termRows[0].id;

        // Limpiar horarios del periodo activo
        await this.pool.execute("DELETE FROM schedules WHERE term_id = ?", [termId]);

        // Obtener grupos y materias
        const [groups] = await this.pool.execute(`
            SELECT sg.*, c.weekly_hours, c.name as course_name 
            FROM student_groups sg 
            JOIN courses c ON sg.course_id = c.id
            WHERE sg.term_id = ? OR sg.term_id IS NULL
        `, [termId]);

        // Obtener aulas ordenadas de menor a mayor capacidad para optimizar espacio
        const [rooms] = await this.pool.execute("SELECT * FROM rooms ORDER BY capacity ASC");

        // Pre-cargar profesores
        const [teachers] = await this.pool.execute("SELECT id, availability FROM teachers");
        const teachersData = {};
        teachers.forEach(t => {
            teachersData[t.id] = t.availability;
        });

        const days = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'];
        const slots = [
            '08:00', '09:00', '10:00', '11:00', '12:00',
            '13:00', '14:00', '15:00', '16:00', '17:00',
            '18:00', '19:00', '20:00', '21:00'
        ];

        let schedules = [];
        let errors = [];

        for (const group of groups) {
            const hoursToAssign = group.weekly_hours;
            const teacherId = group.teacher_id;
            const quota = group.quota;

            // Decodificar turnos del profesor de forma segura
            let teacherShifts = [];
            try {
                let parsed = teachersData[teacherId];
                if (typeof parsed === 'string') parsed = JSON.parse(parsed);
                if (typeof parsed === 'string') parsed = JSON.parse(parsed); // doble parse por si acaso
                if (Array.isArray(parsed) && parsed.length > 0) {
                    teacherShifts = parsed;
                } else {
                    teacherShifts = ['Mañana', 'Tarde', 'Noche'];
                }
            } catch(e) {
                teacherShifts = ['Mañana', 'Tarde', 'Noche'];
            }

            for (let i = 0; i < hoursToAssign; i++) {
                let assigned = false;

                // Shuffle de días para balancear carga semanal
                let shuffledDays = [...days].sort(() => Math.random() - 0.5);

                for (const day of shuffledDays) {
                    if (assigned) break;

                    for (const slot of slots) {
                        if (assigned) break;

                        // Validar turno del profesor
                        if (!this.isSlotInTeacherShift(slot, teacherShifts)) continue;

                        // Restricción dura: máximo 2 horas por materia en un solo día
                        const hoursToday = this.getHoursForGroupOnDay(group.id, day, schedules);
                        if (hoursToday >= 2) continue;

                        // Validar si el profesor está ocupado
                        if (this.isTeacherBusy(teacherId, day, slot, schedules)) continue;

                        for (const room of rooms) {
                            // Validar capacidad
                            if (room.capacity < quota) continue;
                            
                            // Validar si el aula está ocupada
                            if (this.isRoomBusy(room.id, day, slot, schedules)) continue;

                            // ¡Hemos encontrado un bloque válido!
                            const hourInt = parseInt(slot.split(':')[0]);
                            const endSlot = `${(hourInt + 1).toString().padStart(2, '0')}:00`;

                            const newSchedule = {
                                group_id: group.id,
                                room_id: room.id,
                                day_of_week: day,
                                start_time: slot,
                                end_time: endSlot,
                                teacher_id: teacherId
                            };

                            schedules.push(newSchedule);

                            // Guardar en Base de Datos
                            await this.pool.execute(
                                "INSERT INTO schedules (term_id, group_id, room_id, day_of_week, start_time, end_time) VALUES (?, ?, ?, ?, ?, ?)",
                                [termId, group.id, room.id, day, `${slot}:00`, `${endSlot}:00`]
                            );

                            assigned = true;
                            break; // Romper loop de aulas, pasar a la siguiente hora a asignar
                        }
                    }
                }

                if (!assigned) {
                    errors.push(`No se pudo encontrar espacio para el grupo de ${group.course_name} (1 hora faltante).`);
                }
            }
        }

        return {
            success: errors.length === 0,
            message: 'Generación finalizada.',
            errors: errors,
            total_assigned: schedules.length
        };
    }

    getHoursForGroupOnDay(groupId, day, schedules) {
        return schedules.filter(s => s.group_id === groupId && s.day_of_week === day).length;
    }

    isSlotInTeacherShift(slot, shifts) {
        const hour = parseInt(slot.split(':')[0]);
        let currentShift = '';
        if (hour >= 8 && hour <= 12) currentShift = 'Mañana';
        else if (hour >= 13 && hour <= 17) currentShift = 'Tarde';
        else if (hour >= 18 && hour <= 21) currentShift = 'Noche';

        return shifts.includes(currentShift);
    }

    isTeacherBusy(teacherId, day, slot, schedules) {
        return schedules.some(s => s.teacher_id === teacherId && s.day_of_week === day && s.start_time === slot);
    }

    isRoomBusy(roomId, day, slot, schedules) {
        return schedules.some(s => s.room_id === roomId && s.day_of_week === day && s.start_time === slot);
    }
}

module.exports = GeneratorService;
