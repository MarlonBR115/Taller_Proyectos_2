require('dotenv').config();
const mysql = require('mysql2/promise');
const createApp = require('./src/app');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.getConnection()
    .then(conn => {
        console.log('Conectado exitosamente a la base de datos MySQL.');
        conn.release();
    })
    .catch(err => {
        console.log('\nERROR CRITICO DE BASE DE DATOS');
        console.log('No se pudo conectar a MySQL. Detalles del error:');
        console.log(err.message);
        console.log('\nPor favor, verifica lo siguiente:');
        console.log('1. XAMPP/MySQL esta encendido y corriendo en el puerto 3306.');
        console.log('2. Has ejecutado "node init_db.js" para crear las tablas.');
        console.log('--------------------------------------------------\n');
    });

const app = createApp(pool);
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Node API running on http://localhost:${PORT}`);
});
