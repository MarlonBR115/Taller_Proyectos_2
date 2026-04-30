const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function init() {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            multipleStatements: true
        });

        const schema = fs.readFileSync(path.join(__dirname, '../database/schema.sql'), 'utf8');
        await connection.query(schema);
        console.log('✅ Base de datos y tablas creadas exitosamente.');
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}
init();
