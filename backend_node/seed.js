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

const cursosEjemplo = [
  { code: 'CB101', name: 'Matemática Superior', credits: 4, weekly_hours: 4 },
  { code: 'IS101', name: 'Introducción a la Ingeniería de Sistemas', credits: 3, weekly_hours: 3 },
  { code: 'FG101', name: 'Comunicación Efectiva', credits: 3, weekly_hours: 3 },
  { code: 'FG102', name: 'Gestión del Aprendizaje', credits: 3, weekly_hours: 3 },
  { code: 'CB201', name: 'Cálculo Diferencial', credits: 4, weekly_hours: 4 },
  { code: 'CB202', name: 'Física I', credits: 4, weekly_hours: 4 },
  { code: 'IS201', name: 'Algoritmos y Estructura de Datos', credits: 4, weekly_hours: 4 },
  { code: 'CB301', name: 'Cálculo Integral', credits: 4, weekly_hours: 4 },
  { code: 'IS301', name: 'Programación Orientada a Objetos', credits: 4, weekly_hours: 4 },
  { code: 'IS302', name: 'Arquitectura de Computadoras', credits: 3, weekly_hours: 3 }
];

const profesoresEjemplo = [
  { name: 'Dr. Alan Turing', email: 'alan@universidad.edu', availability: JSON.stringify(['Mañana', 'Tarde']) },
  { name: 'Dra. Ada Lovelace', email: 'ada@universidad.edu', availability: JSON.stringify(['Mañana']) },
  { name: 'Ing. Linus Torvalds', email: 'linus@universidad.edu', availability: JSON.stringify(['Noche']) },
  { name: 'Lic. Marie Curie', email: 'marie@universidad.edu', availability: JSON.stringify(['Mañana', 'Tarde', 'Noche']) }
];

async function seed() {
    try {
        console.log('Iniciando Seeding...');
        
        try {
            await pool.execute("ALTER TABLE courses ADD COLUMN code VARCHAR(50) AFTER id");
        } catch (e) { }

        try {
            await pool.execute("ALTER TABLE teachers ADD COLUMN email VARCHAR(255) AFTER name");
        } catch (e) { }
        
        for (const curso of cursosEjemplo) {
            await pool.execute(
                `INSERT IGNORE INTO courses (code, name, weekly_hours) VALUES (?, ?, ?)`,
                [curso.code, curso.name, curso.weekly_hours]
            );
        }
        console.log('✅ Cursos insertados exitosamente.');

        for (const profe of profesoresEjemplo) {
            await pool.execute(
                `INSERT IGNORE INTO teachers (name, email, availability) VALUES (?, ?, ?)`,
                [profe.name, profe.email, profe.availability]
            );
        }
        console.log('✅ Profesores insertados exitosamente.');

        console.log('¡Seeding completado! Ya puedes ver los datos en la interfaz.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error durante el seeding:', error);
        process.exit(1);
    }
}

seed();
