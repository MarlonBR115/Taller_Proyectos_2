const mysql = require('mysql2/promise');

async function seed() {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'generador_horarios',
            multipleStatements: true
        });

        console.log("Limpiando base de datos...");
        await connection.query('SET FOREIGN_KEY_CHECKS = 0;');
        await connection.query('TRUNCATE TABLE schedules;');
        await connection.query('TRUNCATE TABLE student_groups;');
        await connection.query('TRUNCATE TABLE academic_terms;');
        await connection.query('TRUNCATE TABLE rooms;');
        await connection.query('TRUNCATE TABLE courses;');
        await connection.query('TRUNCATE TABLE teachers;');
        await connection.query('SET FOREIGN_KEY_CHECKS = 1;');

        console.log("Insertando periodos académicos...");
        const [termRes] = await connection.query(`
            INSERT INTO academic_terms (name, is_active) VALUES ('Semestre 2026-I', true)
        `);
        const termId = termRes.insertId;

        console.log("Insertando profesores...");
        const [teacher1Res] = await connection.query(`INSERT INTO teachers (name, availability) VALUES ('Prof. Alan Turing', '["Mañana", "Tarde"]')`);
        const [teacher2Res] = await connection.query(`INSERT INTO teachers (name, availability) VALUES ('Prof. Ada Lovelace', '["Mañana", "Noche"]')`);
        const [teacher3Res] = await connection.query(`INSERT INTO teachers (name, availability) VALUES ('Prof. Grace Hopper', '["Tarde", "Noche"]')`);
        
        console.log("Insertando cursos...");
        const [course1Res] = await connection.query(`INSERT INTO courses (name, credits, weekly_hours) VALUES ('Algoritmos', 4, 4)`);
        const [course2Res] = await connection.query(`INSERT INTO courses (name, credits, weekly_hours) VALUES ('Bases de Datos', 3, 3)`);
        const [course3Res] = await connection.query(`INSERT INTO courses (name, credits, weekly_hours) VALUES ('Ingeniería de Software', 3, 3)`);
        const [course4Res] = await connection.query(`INSERT INTO courses (name, credits, weekly_hours) VALUES ('Estructuras de Datos', 4, 4)`);

        console.log("Insertando aulas...");
        const [room1Res] = await connection.query(`INSERT INTO rooms (name, capacity, room_type) VALUES ('Lab A', 30, 'lab')`);
        const [room2Res] = await connection.query(`INSERT INTO rooms (name, capacity, room_type) VALUES ('Aula 101', 40, 'theory')`);
        const [room3Res] = await connection.query(`INSERT INTO rooms (name, capacity, room_type) VALUES ('Aula 102', 40, 'theory')`);
        const [room4Res] = await connection.query(`INSERT INTO rooms (name, capacity, room_type) VALUES ('Aula 201', 50, 'theory')`);

        console.log("Insertando grupos de estudiantes...");
        await connection.query(`
            INSERT INTO student_groups (term_id, course_id, teacher_id, quota) VALUES
            (?, ?, ?, 25),
            (?, ?, ?, 35),
            (?, ?, ?, 40),
            (?, ?, ?, 30)
        `, [
            termId, course1Res.insertId, teacher1Res.insertId,
            termId, course2Res.insertId, teacher2Res.insertId,
            termId, course3Res.insertId, teacher3Res.insertId,
            termId, course4Res.insertId, teacher1Res.insertId
        ]);

        console.log('✅ Base de datos poblada exitosamente con datos de prueba.');
        process.exit(0);
    } catch (err) {
        console.error('Error al poblar la base de datos:', err);
        process.exit(1);
    }
}
seed();
