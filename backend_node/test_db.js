require('dotenv').config();
const mysql = require('mysql2/promise');

async function test() {
    console.log("Config:", {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        database: process.env.DB_NAME
    });

    try {
        const pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS || '',
            database: process.env.DB_NAME,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });

        const [rows] = await pool.execute("SELECT * FROM courses ORDER BY created_at DESC");
        console.log("Exito. Registros:", rows.length);
        process.exit(0);
    } catch (err) {
        console.log("ERROR COMPLETO:", err);
        process.exit(1);
    }
}
test();
