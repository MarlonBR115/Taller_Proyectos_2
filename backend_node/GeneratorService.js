const CSPOptimizer = require('./src/services/CSPMotor');
const {
    adaptarHorarioGenerado,
    validarAntiCruces
} = require('./src/services/motorAntiCruces');

class GeneratorService {
    constructor(pool) {
        this.pool = pool;
    }

    adaptarHorariosParaValidacion(horarios) {
        return adaptarHorarioGenerado(horarios);
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

        const [groups] = await this.pool.execute(`
            SELECT sg.*, c.weekly_hours, c.name as course_name 
            FROM student_groups sg 
            JOIN courses c ON sg.course_id = c.id
            WHERE sg.term_id = ? OR sg.term_id IS NULL
        `, [termId]);

        const [rooms] = await this.pool.execute("SELECT id, name, capacity, room_type FROM rooms");
        const [teachers] = await this.pool.execute("SELECT id, name, availability FROM teachers");

        if (groups.length === 0 || rooms.length === 0) {
            return {
                success: false,
                message: 'Faltan datos. Asegúrate de tener grupos y aulas creados.',
                errors: ['Grupos o aulas insuficientes.']
            };
        }

        // CSPMotor espera groups con: quota, room_type_required, weekly_hours, teacher_id
        const formattedGroups = groups.map(g => ({
            ...g,
            room_type_required: 'theory',
        }));

        const inputData = {
            groups: formattedGroups,
            teachers: teachers,
            rooms: rooms,
            settings: {
                allowed_days: ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'],
                start_time: 8,
                end_time: 21
            }
        };

        const numAlternatives = 3;

        const alternativePromises = Array.from({ length: numAlternatives }).map((_, i) => {
            return new Promise((resolve) => {
                setImmediate(() => {
                    const optimizer = new CSPOptimizer({
                        ...inputData,
                        settings: {
                            ...inputData.settings,
                            randomize: true
                        }
                    });
                    console.log(`Iniciando Motor CSP (Alternativa ${i + 1})...`);
                    const assignments = optimizer.solve();

                    // Formatear asignaciones para frontend y validación
                    const formattedAssignments = assignments.map(a => ({
                        group_id: a.group.id,
                        course_id: a.group.course_id,
                        teacher_id: a.group.teacher_id,
                        room_id: a.room.id,
                        day_of_week: a.day,
                        start_time: `${a.start_time.toString().padStart(2, '0')}:00:00`,
                        end_time: `${a.end_time.toString().padStart(2, '0')}:00:00`,
                        // Campos extra visuales
                        course_name: a.group.course_name,
                        teacher_name: teachers.find(t => t.id === a.group.teacher_id)?.name,
                        room_name: a.room.name,
                        capacidad_aula: a.room.capacity,
                        tipo_aula: a.room.room_type,
                        quota: a.group.quota
                    }));

                    let validation = null;
                    try {
                        const horarioValidar = formattedAssignments.map((s, index) => ({
                            id: `TEMP_${i}_${index}`,
                            docenteId: s.teacher_id,
                            aulaId: s.room_id,
                            grupoId: s.group_id,
                            cursoId: s.course_id,
                            dia: s.day_of_week,
                            horaInicio: s.start_time,
                            horaFin: s.end_time,
                            capacidadAula: s.capacidad_aula,
                            estudiantesEstimados: s.quota,
                            tipoAula: s.tipo_aula,
                            tipoSesion: 'theory',
                            profesor: s.teacher_name,
                            aula: s.room_name,
                            materia: s.course_name
                        }));

                        const validadorResult = validarAntiCruces(this.adaptarHorariosParaValidacion(horarioValidar));
                        validation = {
                            valido: validadorResult.valido,
                            totalConflictos: validadorResult.totalConflictos,
                            totalAdvertencias: validadorResult.totalAdvertencias,
                            metricas: validadorResult.metricas
                        };
                    } catch(e) {
                        console.error("Error en validador anti-cruces:", e);
                    }

                    const response = optimizer.buildResponse(assignments);
                    
                    resolve({
                        id: `alt_${i + 1}`,
                        name: `Opción ${i + 1}`,
                        schedules: formattedAssignments,
                        metrics: {
                            ...response.metrics,
                            validation_score: validation && validation.valido ? 100 : (validation ? Math.max(0, 100 - validation.totalConflictos * 5) : 0),
                        },
                        validation,
                        unassigned_groups: response.unassigned_groups
                    });
                });
            });
        });

        const alternatives = await Promise.all(alternativePromises);

        return {
            success: true,
            message: 'Alternativas generadas exitosamente.',
            alternatives
        };
    }

    async saveSchedules(termId, schedules) {
        // Envolver en una simulación de transacción manual
        try {
            await this.pool.execute("DELETE FROM schedules WHERE term_id = ?", [termId]);
            
            for (const s of schedules) {
                await this.pool.execute(
                    "INSERT INTO schedules (term_id, group_id, room_id, day_of_week, start_time, end_time) VALUES (?, ?, ?, ?, ?, ?)",
                    [termId, s.group_id, s.room_id, s.day_of_week, s.start_time, s.end_time]
                );
            }
            return { success: true, message: 'Horario guardado correctamente en la base de datos.' };
        } catch (error) {
            console.error("Error guardando horario:", error);
            throw new Error("Fallo al guardar el horario: " + error.message);
        }
    }
}

module.exports = GeneratorService;
