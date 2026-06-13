const assert = require('node:assert/strict');
const test = require('node:test');
const util = require('node:util');
const exec = util.promisify(require('node:child_process').exec);
const mysql = require('mysql2/promise');
require('dotenv').config();

const GeneratorService = require('../GeneratorService');

let pool;

test.before(async () => {
    // 1. Ejecutar script de seeding masivo (Opcional, asume que MySQL está corriendo)
    try {
        await exec('node seed_massive.js', { env: process.env });
    } catch(e) {
        console.warn('Advertencia: El seeding falló, asegúrese de tener XAMPP/MySQL encendido.');
    }
    
    // 2. Conectar a BD
    pool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASS || '',
        database: process.env.DB_NAME || 'generador_horarios',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });
});

test.after(async () => {
    if (pool) await pool.end();
});

test('Prueba de Aceptación - RF06 y RF07: Motor Anti-Cruces y RNF01', async (t) => {
    const generator = new GeneratorService(pool);
    const startTime = performance.now();
    
    let result;
    try {
        result = await generator.generate();
    } catch(e) {
        assert.fail('Error de conexión a la BD: ' + e.message);
    }
    
    const endTime = performance.now();
    const durationMs = endTime - startTime;
    
    // RNF01
    assert.equal(result.success, true, 'La generación debe ser exitosa');
    assert.ok(durationMs < 15000, `El tiempo de generación excede 15s (fue ${durationMs.toFixed(2)}ms)`);

    // RF06, RF07
    assert.ok(result.validation !== null && result.validation !== undefined, 'Debe retornar un reporte de validación');
    assert.equal(result.validation.valido, true, 'El horario final debe ser marcado como válido');
    assert.equal(result.validation.totalConflictos, 0, 'Deben existir exactamente 0 cruces de docentes y aulas');
});
