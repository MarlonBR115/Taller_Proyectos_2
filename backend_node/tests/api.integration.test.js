const assert = require('node:assert/strict');
const test = require('node:test');
const request = require('supertest');

const createApp = require('../src/app');

function createPoolMock(responses = []) {
  const calls = [];

  return {
    calls,
    async execute(sql, params = []) {
      calls.push({ sql, params });
      const response = responses.shift();

      if (response instanceof Error) {
        throw response;
      }

      if (typeof response === 'function') {
        return response(sql, params);
      }

      return response ?? [[]];
    }
  };
}

test('GET /api/terms responde 200, JSON y lista periodos', async () => {
  const pool = createPoolMock([
    [[
      { id: 1, name: 'Semestre 2026-I', is_active: 1 },
      { id: 2, name: 'Semestre 2026-II', is_active: 0 }
    ]]
  ]);

  const response = await request(createApp(pool))
    .get('/api/terms')
    .expect(200)
    .expect('Content-Type', /json/);

  assert.equal(response.body.success, true);
  assert.equal(Array.isArray(response.body.data), true);
  assert.equal(response.body.data[0].is_active, true);
  assert.equal(response.body.data[1].is_active, false);
});

test('GET /api/terms/active devuelve periodo activo cuando existe', async () => {
  const pool = createPoolMock([
    [[{ id: 1, name: 'Semestre 2026-I', is_active: 1 }]]
  ]);

  const response = await request(createApp(pool))
    .get('/api/terms/active')
    .expect(200)
    .expect('Content-Type', /json/);

  assert.equal(response.body.success, true);
  assert.equal(response.body.data.id, 1);
});

test('GET /api/terms/active devuelve null cuando no hay periodo activo', async () => {
  const pool = createPoolMock([[[]]]);

  const response = await request(createApp(pool))
    .get('/api/terms/active')
    .expect(200)
    .expect('Content-Type', /json/);

  assert.equal(response.body.success, true);
  assert.equal(response.body.data, null);
});

test('GET /api/rooms responde arreglo de aulas', async () => {
  const pool = createPoolMock([
    [[
      { id: 10, name: 'Aula 101', capacity: 40, room_type: 'theory' },
      { id: 11, name: 'Lab A', capacity: 30, room_type: 'lab' }
    ]]
  ]);

  const response = await request(createApp(pool))
    .get('/api/rooms')
    .expect(200)
    .expect('Content-Type', /json/);

  assert.equal(response.body.success, true);
  assert.equal(Array.isArray(response.body.data), true);
  assert.equal(response.body.data.length, 2);
});

test('POST /api/rooms crea aula con payload valido', async () => {
  const pool = createPoolMock([
    [{ insertId: 25 }]
  ]);

  const response = await request(createApp(pool))
    .post('/api/rooms')
    .send({ name: 'Aula Test', capacity: 45, room_type: 'theory' })
    .expect(200)
    .expect('Content-Type', /json/);

  assert.equal(response.body.success, true);
  assert.equal(response.body.id, 25);
  assert.match(response.body.message, /Room created/);
  assert.equal(pool.calls.length, 1);
});

test('POST /api/rooms maneja error simulado de MySQL', async () => {
  const pool = createPoolMock([
    new Error('Fallo simulado de MySQL')
  ]);

  const response = await request(createApp(pool))
    .post('/api/rooms')
    .send({ name: 'Aula Test', capacity: 45, room_type: 'theory' })
    .expect(500)
    .expect('Content-Type', /json/);

  assert.equal(response.body.success, false);
  assert.equal(response.body.message, 'Fallo simulado de MySQL');
});

test('GET /api/groups devuelve grupos cuando hay periodo activo', async () => {
  const pool = createPoolMock([
    [[{ id: 1 }]],
    [[
      { id: 100, course_name: 'Algoritmos', teacher_name: 'Prof. Test', quota: 30 }
    ]]
  ]);

  const response = await request(createApp(pool))
    .get('/api/groups')
    .expect(200)
    .expect('Content-Type', /json/);

  assert.equal(response.body.success, true);
  assert.equal(response.body.data.length, 1);
  assert.equal(response.body.data[0].course_name, 'Algoritmos');
});

test('GET /api/groups devuelve arreglo vacio cuando no hay periodo activo', async () => {
  const pool = createPoolMock([[[]]]);

  const response = await request(createApp(pool))
    .get('/api/groups')
    .expect(200)
    .expect('Content-Type', /json/);

  assert.equal(response.body.success, true);
  assert.deepEqual(response.body.data, []);
  assert.equal(pool.calls.length, 1);
});

test('GET /api/schedule/all devuelve horarios cuando hay periodo activo', async () => {
  const pool = createPoolMock([
    [[{ id: 1 }]],
    [[
      {
        id: 200,
        day_of_week: 'Lunes',
        start_time: '08:00:00',
        end_time: '10:00:00',
        course_name: 'Algoritmos',
        teacher_name: 'Prof. Test',
        room_name: 'Aula 101'
      }
    ]]
  ]);

  const response = await request(createApp(pool))
    .get('/api/schedule/all')
    .expect(200)
    .expect('Content-Type', /json/);

  assert.equal(response.body.success, true);
  assert.equal(response.body.data.length, 1);
  assert.equal(response.body.data[0].course_name, 'Algoritmos');
});

test('GET /api/schedule/all devuelve arreglo vacio cuando no hay periodo activo', async () => {
  const pool = createPoolMock([[[]]]);

  const response = await request(createApp(pool))
    .get('/api/schedule/all')
    .expect(200)
    .expect('Content-Type', /json/);

  assert.equal(response.body.success, true);
  assert.deepEqual(response.body.data, []);
});

test('POST /api/schedule/generate responde JSON sin base real cuando no hay periodo activo', async () => {
  const pool = createPoolMock([[[]]]);

  const response = await request(createApp(pool))
    .post('/api/schedule/generate')
    .expect(200)
    .expect('Content-Type', /json/);

  assert.equal(response.body.success, false);
  assert.match(response.body.message, /periodo/i);
  assert.match(response.body.message, /activo/i);
  assert.deepEqual(response.body.errors, []);
});

test('POST /api/schedule/generate maneja error de generacion de forma controlada', async () => {
  const pool = createPoolMock([
    new Error('Error simulado durante generacion')
  ]);
  const originalConsoleError = console.error;
  console.error = () => {};

  try {
    const response = await request(createApp(pool))
      .post('/api/schedule/generate')
      .expect(500)
      .expect('Content-Type', /json/);

    assert.equal(response.body.success, false);
    assert.equal(response.body.message, 'Error critico en el motor');
    assert.equal(response.body.details, 'Error simulado durante generacion');
  } finally {
    console.error = originalConsoleError;
  }
});

test('GET /api/terms maneja error MySQL simulado con estructura JSON', async () => {
  const pool = createPoolMock([
    new Error('Conexion MySQL no disponible')
  ]);

  const response = await request(createApp(pool))
    .get('/api/terms')
    .expect(500)
    .expect('Content-Type', /json/);

  assert.equal(response.body.success, false);
  assert.equal(response.body.message, 'Conexion MySQL no disponible');
});
