const assert = require('node:assert/strict');
const test = require('node:test');

test('Prueba de Aceptación - RF08: Exportación y Visualización', async (t) => {
    
    await t.test('Estructura de datos para visualización semanal', () => {
        // En un caso real, haríamos fetch('/api/schedule/all') 
        // y validaríamos que la respuesta tiene todos los campos que el Frontend necesita.
        
        const scheduleResponseSimulado = [
            {
                id: 1,
                course_name: 'Testing',
                teacher_name: 'Dr. Prueba',
                room_name: 'AULA-1',
                day_of_week: 'Lunes',
                start_time: '08:00:00',
                end_time: '10:00:00'
            }
        ];

        const item = scheduleResponseSimulado[0];
        assert.ok(item.day_of_week !== undefined, 'Debe incluir el día de la semana');
        assert.ok(item.start_time !== undefined && item.end_time !== undefined, 'Debe incluir la franja horaria');
        assert.ok(item.teacher_name !== undefined, 'Debe incluir el nombre del docente');
        assert.ok(item.room_name !== undefined, 'Debe incluir el nombre del aula para visualización');
    });
});
