require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'generador_horarios',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function seedMassive() {
    try {
        console.log('Iniciando Seeding Masivo para ~3000 registros...');
        const conn = await pool.getConnection();

        // Desactivar FK checks para limpiar las tablas existentes
        await conn.query('SET FOREIGN_KEY_CHECKS = 0');
        await conn.query('TRUNCATE TABLE schedules');
        await conn.query('TRUNCATE TABLE student_groups');
        await conn.query('TRUNCATE TABLE academic_terms');
        await conn.query('TRUNCATE TABLE teachers');
        await conn.query('TRUNCATE TABLE courses');
        await conn.query('TRUNCATE TABLE rooms');
        await conn.query('SET FOREIGN_KEY_CHECKS = 1');
        console.log('✅ Tablas limpiadas.');

        // 1. Term
        const [termRes] = await conn.query("INSERT INTO academic_terms (name, is_active) VALUES ('Semestre 2026-I (Masivo)', true)");
        const termId = termRes.insertId;
        console.log('✅ 1 academic_term creado.');

        // 2. Teachers (300)
        console.log('⏳ Generando 300 teachers...');
        const availabilities = [
            JSON.stringify(['Mañana']),
            JSON.stringify(['Tarde']),
            JSON.stringify(['Noche']),
            JSON.stringify(['Mañana', 'Tarde']),
            JSON.stringify(['Tarde', 'Noche']),
            JSON.stringify(['Mañana', 'Tarde', 'Noche'])
        ];
        
        const teacherIds = [];
        let teacherValues = [];
        for (let i = 1; i <= 300; i++) {
            const avail = availabilities[Math.floor(Math.random() * availabilities.length)];
            teacherValues.push([`Profesor Masivo ${i}`, `profesor${i}@universidad.edu`, avail]);
        }
        const [tRes] = await conn.query("INSERT INTO teachers (name, email, availability) VALUES ?", [teacherValues]);
        const firstTeacherId = tRes.insertId;
        for (let i = 0; i < 300; i++) teacherIds.push(firstTeacherId + i);
        console.log('✅ 300 teachers creados.');

        // 3. Courses (1300)
        console.log('⏳ Generando 1300 courses...');
        const courseValues = [];
        const courseIds = [];
        const creditsArr = [3, 4, 5];
        const hoursArr = [3, 4, 5];
        for (let i = 1; i <= 1300; i++) {
            const credits = creditsArr[Math.floor(Math.random() * creditsArr.length)];
            const hours = hoursArr[Math.floor(Math.random() * hoursArr.length)];
            courseValues.push([`CUR-${i}`, `Asignatura Masiva ${i}`, credits, hours]);
        }
        const [cRes] = await conn.query("INSERT INTO courses (code, name, credits, weekly_hours) VALUES ?", [courseValues]);
        const firstCourseId = cRes.insertId;
        for (let i = 0; i < 1300; i++) courseIds.push(firstCourseId + i);
        console.log('✅ 1300 courses creados.');

        // 4. Rooms (100)
        console.log('⏳ Generando 100 rooms...');
        const roomValues = [];
        const roomIds = [];
        for (let i = 1; i <= 100; i++) {
            const type = (i <= 70) ? 'theory' : 'lab';
            const cap = (type === 'theory') ? 40 : 25;
            roomValues.push([`AULA-M${i}`, cap, type]);
        }
        const [rRes] = await conn.query("INSERT INTO rooms (name, capacity, room_type) VALUES ?", [roomValues]);
        const firstRoomId = rRes.insertId;
        for (let i = 0; i < 100; i++) roomIds.push(firstRoomId + i);
        console.log('✅ 100 rooms creados.');

        // 5. Student Groups (1300) - 1 por cada curso, teacher asignado en round-robin
        console.log('⏳ Generando 1300 student_groups...');
        const groupValues = [];
        for (let i = 0; i < 1300; i++) {
            const courseId = courseIds[i];
            const teacherId = teacherIds[i % 300]; // Round robin
            const quota = 30;
            groupValues.push([termId, courseId, teacherId, quota]);
        }
        await conn.query("INSERT INTO student_groups (term_id, course_id, teacher_id, quota) VALUES ?", [groupValues]);
        console.log('✅ 1300 student_groups creados.');

        console.log('🎉 ¡Seeding masivo completado con éxito! Total de registros creados: 3001');
        conn.release();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error durante el seeding masivo:', error);
        process.exit(1);
    }
}

seedMassive();
