const CSPOptimizer = require('./src/services/CSPMotor');
const validarCrucesHorario = require('./src/services/motorAntiCruces');

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
        console.log("Iniciando Motor CSP (Backtracking)...");
        const assignments = optimizer.solve();

        if (!assignments) {
            return {
                success: false,
                message: 'Error de Optimización: No hay recursos suficientes (aulas o disponibilidad de profesores) para generar un horario sin cruces.',
                errors: ['No se encontró solución viable.'],
                total_assigned: 0
            };
        }

        console.log(`CSP encontró solución con ${assignments.length} asignaciones. Guardando en BD...`);

        for (const assignment of assignments) {
            const startStr = `${assignment.start_time.toString().padStart(2, '0')}:00:00`;
            const endStr = `${assignment.end_time.toString().padStart(2, '0')}:00:00`;

            await this.pool.execute(
                "INSERT INTO schedules (term_id, group_id, room_id, day_of_week, start_time, end_time) VALUES (?, ?, ?, ?, ?, ?)",
                [termId, assignment.group.id, assignment.room.id, assignment.day, startStr, endStr]
            );
        }

        try {
            const [finalSchedules] = await this.pool.execute(`
                SELECT s.*, r.name as aula, c.name as materia, t.name as profesor
                FROM schedules s
                JOIN student_groups sg ON s.group_id = sg.id
                JOIN courses c ON sg.course_id = c.id
                JOIN teachers t ON sg.teacher_id = t.id
                JOIN rooms r ON s.room_id = r.id
                WHERE s.term_id = ?
            `, [termId]);

            const horarioValidar = finalSchedules.map(s => ({
                id: s.id,
                dia: s.day_of_week,
                horaInicio: s.start_time,
                horaFin: s.end_time,
                profesor: s.profesor,
                aula: s.aula,
                materia: s.materia
            }));

            const validadorResult = validarCrucesHorario(horarioValidar);
            if (!validadorResult.valido) {
                console.warn("⚠️ Validador Anti-Cruces detectó advertencias:", validadorResult.errores);
            } else {
                console.log("✅ Validador Anti-Cruces: Horario 100% libre de cruces.");
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
            metrics: response.metrics
        };
    }
}

module.exports = GeneratorService;
