const mysql = require('mysql2/promise');
require('dotenv').config();

async function cleanSchedules() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASS || '',
            database: process.env.DB_NAME || 'generador_horarios',
        });

        console.log("Limpiando la tabla de horarios...");
        await connection.query('TRUNCATE TABLE schedules;');
        
        console.log('✅ Horarios limpiados exitosamente. Las demás tablas están intactas.');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error al limpiar los horarios:', err);
        process.exit(1);
    }
}

cleanSchedules();
