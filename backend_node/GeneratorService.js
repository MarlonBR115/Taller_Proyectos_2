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

        await this.pool.execute("DELETE FROM schedules WHERE term_id = ?", [termId]);

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

        const optimizer = new CSPOptimizer(inputData);
        console.log("Iniciando Motor CSP Optimizado (Fast Greedy)...");
        const assignments = optimizer.solve();

        if (!assignments || assignments.length === 0) {
            return {
                success: false,
                message: 'Error de Optimización: No se pudo asignar ningún grupo (posible falta total de recursos).',
                errors: ['No se encontró solución parcial viable.'],
                total_assigned: 0
            };
        }

        console.log(`Greedy CSP encontró solución con ${assignments.length} asignaciones. Grupos sin asignar: ${optimizer.unassignedGroups.length}. Guardando en BD...`);

        for (const assignment of assignments) {
            const startStr = `${assignment.start_time.toString().padStart(2, '0')}:00:00`;
            const endStr = `${assignment.end_time.toString().padStart(2, '0')}:00:00`;

            await this.pool.execute(
                "INSERT INTO schedules (term_id, group_id, room_id, day_of_week, start_time, end_time) VALUES (?, ?, ?, ?, ?, ?)",
                [termId, assignment.group.id, assignment.room.id, assignment.day, startStr, endStr]
            );
        }

        let validation = null;

        try {
            const [finalSchedules] = await this.pool.execute(`
                SELECT s.*,
                       sg.teacher_id,
                       sg.course_id,
                       sg.quota,
                       r.name as aula,
                       r.capacity as capacidad_aula,
                       r.room_type as tipo_aula,
                       c.name as materia,
                       t.name as profesor
                FROM schedules s
                JOIN student_groups sg ON s.group_id = sg.id
                JOIN courses c ON sg.course_id = c.id
                JOIN teachers t ON sg.teacher_id = t.id
                JOIN rooms r ON s.room_id = r.id
                WHERE s.term_id = ?
            `, [termId]);

            const horarioValidar = finalSchedules.map(s => ({
                id: s.id,
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
                profesor: s.profesor,
                aula: s.aula,
                materia: s.materia
            }));

            const validadorResult = validarAntiCruces(this.adaptarHorariosParaValidacion(horarioValidar));
            validation = {
                valido: validadorResult.valido,
                totalConflictos: validadorResult.totalConflictos,
                totalAdvertencias: validadorResult.totalAdvertencias,
                metricas: validadorResult.metricas
            };

            if (!validadorResult.valido) {
                console.warn("Validador Anti-Cruces detecto conflictos:", validadorResult.totalConflictos);
            } else {
                console.log("Validador Anti-Cruces: horario libre de conflictos duros.");
            }
        } catch(e) {
            console.error("Error en validador anti-cruces:", e);
        }

        const response = optimizer.buildResponse(assignments);
        return {
            success: true,
            message: response.message,
            errors: [],
            total_assigned: response.metrics.assigned_groups,
            unassigned_groups: response.unassigned_groups,
            metrics: response.metrics,
            validation
        };
    }
}

module.exports = GeneratorService;
