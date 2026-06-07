const mysql = require('mysql2/promise');

async function checkAndFix() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'generador_horarios',
        multipleStatements: true
    });

    // Show tables
    const [tables] = await connection.query('SHOW TABLES');
    console.log('Tablas existentes:', tables.map(t => Object.values(t)[0]));

    // Describe teachers
    const [cols] = await connection.query('DESCRIBE teachers');
    console.log('\nColumnas de teachers:', cols.map(c => c.Field));

    // Add email column if missing
    const hasEmail = cols.some(c => c.Field === 'email');
    if (!hasEmail) {
        console.log('\nAgregando columna email a teachers...');
        await connection.query('ALTER TABLE teachers ADD COLUMN email VARCHAR(255) NULL AFTER name');
        console.log('Columna email agregada exitosamente.');
    } else {
        console.log('\nColumna email ya existe. OK.');
    }

    // Describe courses
    const [courseCols] = await connection.query('DESCRIBE courses');
    console.log('\nColumnas de courses:', courseCols.map(c => c.Field));

    // Add code column if missing
    const hasCode = courseCols.some(c => c.Field === 'code');
    if (!hasCode) {
        console.log('\nAgregando columna code a courses...');
        await connection.query('ALTER TABLE courses ADD COLUMN code VARCHAR(50) NULL AFTER id');
        console.log('Columna code agregada exitosamente.');
    } else {
        console.log('\nColumna code ya existe. OK.');
    }

    await connection.end();
    console.log('\n✅ Base de datos verificada y lista.');
}

checkAndFix().catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
});
