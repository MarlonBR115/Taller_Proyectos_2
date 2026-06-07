require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const { exec } = require('child_process');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const queryDB = async (sql, params = []) => {
    const [rows, fields] = await pool.execute(sql, params);
    return rows;
};

pool.getConnection()
    .then(conn => {
        console.log('✅ Conectado exitosamente a la base de datos MySQL!');
        conn.release();
    })
    .catch(err => {
        console.log('\n❌ ERROR CRÍTICO DE BASE DE DATOS ❌');
        console.log('No se pudo conectar a MySQL. Detalles del error:');
        console.log(err.message);
        console.log('\nPor favor, verifica lo siguiente:');
        console.log('1. XAMPP/MySQL está encendido y corriendo en el puerto 3306.');
        console.log('2. Has ejecutado "node init_db.js" para crear las tablas.');
        console.log('--------------------------------------------------\n');
    });

// --- TEACHERS ---
app.get('/api/teachers', async (req, res) => {
    try {
        const data = await queryDB("SELECT * FROM teachers ORDER BY created_at DESC");
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

app.post('/api/teachers', async (req, res) => {
    try {
        const { name, email, availability } = req.body;
        const availJson = availability ? JSON.stringify(availability) : null;
        const result = await pool.execute("INSERT INTO teachers (name, email, availability) VALUES (?, ?, ?)", [name, email, availJson]);
        res.json({ success: true, message: 'Teacher created successfully', id: result[0].insertId });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

app.put('/api/teachers/:id', async (req, res) => {
    try {
        const { name, email, availability } = req.body;
        const availJson = availability ? JSON.stringify(availability) : null;
        await pool.execute("UPDATE teachers SET name = ?, email = ?, availability = ? WHERE id = ?", [name, email, availJson, req.params.id]);
        res.json({ success: true, message: 'Teacher updated successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

app.delete('/api/teachers/:id', async (req, res) => {
    try {
        await pool.execute("DELETE FROM teachers WHERE id = ?", [req.params.id]);
        res.json({ success: true, message: 'Teacher deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// --- COURSES ---
app.get('/api/courses', async (req, res) => {
    try {
        const data = await queryDB("SELECT * FROM courses ORDER BY created_at DESC");
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

app.post('/api/courses', async (req, res) => {
    try {
        const { code, name, credits, weekly_hours } = req.body;
        const result = await pool.execute("INSERT INTO courses (code, name, credits, weekly_hours) VALUES (?, ?, ?, ?)", [code, name, credits, weekly_hours]);
        res.json({ success: true, message: 'Course created successfully', id: result[0].insertId });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

app.put('/api/courses/:id', async (req, res) => {
    try {
        const { code, name, credits, weekly_hours } = req.body;
        await pool.execute("UPDATE courses SET code = ?, name = ?, credits = ?, weekly_hours = ? WHERE id = ?", [code, name, credits, weekly_hours, req.params.id]);
        res.json({ success: true, message: 'Course updated successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

app.delete('/api/courses/:id', async (req, res) => {
    try {
        await pool.execute("DELETE FROM courses WHERE id = ?", [req.params.id]);
        res.json({ success: true, message: 'Course deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// --- ROOMS ---
app.get('/api/rooms', async (req, res) => {
    try {
        const data = await queryDB("SELECT * FROM rooms ORDER BY created_at DESC");
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

app.post('/api/rooms', async (req, res) => {
    try {
        const { name, capacity, room_type } = req.body;
        const result = await pool.execute("INSERT INTO rooms (name, capacity, room_type) VALUES (?, ?, ?)", [name, capacity, room_type]);
        res.json({ success: true, message: 'Room created successfully', id: result[0].insertId });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

app.put('/api/rooms/:id', async (req, res) => {
    try {
        const { name, capacity, room_type } = req.body;
        await pool.execute("UPDATE rooms SET name = ?, capacity = ?, room_type = ? WHERE id = ?", [name, capacity, room_type, req.params.id]);
        res.json({ success: true, message: 'Room updated successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

app.delete('/api/rooms/:id', async (req, res) => {
    try {
        await pool.execute("DELETE FROM rooms WHERE id = ?", [req.params.id]);
        res.json({ success: true, message: 'Room deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// --- TERMS (Periodos) ---
app.get('/api/terms', async (req, res) => {
    try {
        const data = await queryDB("SELECT * FROM academic_terms ORDER BY is_active DESC, created_at DESC");
        const mapped = data.map(t => ({ ...t, is_active: !!t.is_active }));
        res.json({ success: true, data: mapped });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

app.get('/api/terms/active', async (req, res) => {
    try {
        const data = await queryDB("SELECT * FROM academic_terms WHERE is_active = true LIMIT 1");
        if (data.length > 0) {
            res.json({ success: true, data: data[0] });
        } else {
            res.json({ success: true, data: null });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

app.post('/api/terms', async (req, res) => {
    try {
        const { name, is_active } = req.body;
        if (is_active) {
            await pool.execute("UPDATE academic_terms SET is_active = false");
        }
        const result = await pool.execute("INSERT INTO academic_terms (name, is_active) VALUES (?, ?)", [name, is_active ? 1 : 0]);
        res.json({ success: true, message: 'Term created successfully', id: result[0].insertId });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

app.put('/api/terms/:id', async (req, res) => {
    try {
        const { name, is_active } = req.body;
        if (is_active) {
            await pool.execute("UPDATE academic_terms SET is_active = false");
        }
        await pool.execute("UPDATE academic_terms SET name = ?, is_active = ? WHERE id = ?", [name, is_active ? 1 : 0, req.params.id]);
        res.json({ success: true, message: 'Term updated successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

app.delete('/api/terms/:id', async (req, res) => {
    try {
        await pool.execute("DELETE FROM academic_terms WHERE id = ?", [req.params.id]);
        res.json({ success: true, message: 'Term deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// --- GROUPS ---
app.get('/api/groups', async (req, res) => {
    try {
        const term = await queryDB("SELECT id FROM academic_terms WHERE is_active = true LIMIT 1");
        if (term.length === 0) return res.json({ success: true, data: [] });

        const sql = `
            SELECT sg.*, c.name as course_name, t.name as teacher_name 
            FROM student_groups sg 
            JOIN courses c ON sg.course_id = c.id 
            JOIN teachers t ON sg.teacher_id = t.id
            WHERE sg.term_id = ?
            ORDER BY sg.created_at DESC
        `;
        const data = await queryDB(sql, [term[0].id]);
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

app.post('/api/groups', async (req, res) => {
    try {
        const { course_id, teacher_id, quota } = req.body;
        const term = await queryDB("SELECT id FROM academic_terms WHERE is_active = true LIMIT 1");
        if (term.length === 0) return res.status(400).json({ success: false, message: 'No hay un periodo activo' });

        const result = await pool.execute(
            "INSERT INTO student_groups (course_id, teacher_id, quota, term_id) VALUES (?, ?, ?, ?)", 
            [course_id, teacher_id, quota, term[0].id]
        );
        res.json({ success: true, message: 'Group created successfully', id: result[0].insertId });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

app.put('/api/groups/:id', async (req, res) => {
    try {
        const { course_id, teacher_id, quota } = req.body;
        await pool.execute("UPDATE student_groups SET course_id = ?, teacher_id = ?, quota = ? WHERE id = ?", [course_id, teacher_id, quota, req.params.id]);
        res.json({ success: true, message: 'Group updated successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

app.delete('/api/groups/:id', async (req, res) => {
    try {
        await pool.execute("DELETE FROM student_groups WHERE id = ?", [req.params.id]);
        res.json({ success: true, message: 'Group deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// --- SCHEDULES ---
app.get('/api/schedule/all', async (req, res) => {
    try {
        const term = await queryDB("SELECT id FROM academic_terms WHERE is_active = true LIMIT 1");
        if (term.length === 0) return res.json({ success: true, data: [] });

        const query = `
            SELECT s.*, c.name as course_name, t.name as teacher_name, r.name as room_name 
            FROM schedules s 
            JOIN student_groups sg ON s.group_id = sg.id 
            JOIN courses c ON sg.course_id = c.id 
            JOIN teachers t ON sg.teacher_id = t.id 
            JOIN rooms r ON s.room_id = r.id
            WHERE s.term_id = ?
            ORDER BY FIELD(s.day_of_week, 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'), s.start_time
        `;
        const data = await queryDB(query, [term[0].id]);
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

const GeneratorService = require('./GeneratorService');
app.post('/api/schedule/generate', async (req, res) => {
    try {
        const generator = new GeneratorService(pool);
        const result = await generator.generate();
        res.json(result);
    } catch (err) {
        console.error("Error en algoritmo Node:", err);
        res.status(500).json({ success: false, message: 'Error crítico en el motor', details: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Node API running on http://localhost:${PORT}`);
});
