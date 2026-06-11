import { http, HttpResponse } from 'msw';

const API_BASE = 'http://localhost:3000/api';

export const fixtures = {
  teachers: [
    { id: 1, name: 'Dr. Pérez', email: 'perez@test.com', availability: '["Mañana","Tarde"]', created_at: '2026-01-01T00:00:00.000Z' },
    { id: 2, name: 'Ing. López', email: 'lopez@test.com', availability: '["Noche"]', created_at: '2026-01-02T00:00:00.000Z' },
  ],
  courses: [
    { id: 1, code: 'MAT101', name: 'Matemáticas I', credits: 4, weekly_hours: 4, created_at: '2026-01-01T00:00:00.000Z' },
    { id: 2, code: 'FIS101', name: 'Física I', credits: 4, weekly_hours: 4, created_at: '2026-01-02T00:00:00.000Z' },
  ],
  rooms: [
    { id: 1, name: 'A101', capacity: 30, room_type: 'theory', created_at: '2026-01-01T00:00:00.000Z' },
    { id: 2, name: 'Lab01', capacity: 20, room_type: 'lab', created_at: '2026-01-02T00:00:00.000Z' },
  ],
  groups: [
    { id: 1, course_id: 1, course_name: 'Matemáticas I', teacher_id: 1, teacher_name: 'Dr. Pérez', quota: 30, term_id: 1, created_at: '2026-01-01T00:00:00.000Z' },
  ],
  terms: [
    { id: 1, name: '2026-1', is_active: 1, created_at: '2026-01-01T00:00:00.000Z' },
    { id: 2, name: '2025-2', is_active: 0, created_at: '2025-06-01T00:00:00.000Z' },
  ],
  schedules: [
    {
      id: 1, group_id: 1, room_id: 1, day_of_week: 'Lunes', start_time: '08:00:00', end_time: '10:00:00',
      course_name: 'Matemáticas I', teacher_name: 'Dr. Pérez', room_name: 'A101', term_id: 1,
      created_at: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 2, group_id: 2, room_id: 2, day_of_week: 'Martes', start_time: '10:00:00', end_time: '12:00:00',
      course_name: 'Física I', teacher_name: 'Ing. López', room_name: 'Lab01', term_id: 1,
      created_at: '2026-01-02T00:00:00.000Z',
    },
  ],
};

export const handlers = [
  http.get(`${API_BASE}/teachers`, () => HttpResponse.json({ success: true, data: fixtures.teachers })),
  http.post(`${API_BASE}/teachers`, async ({ request }) => {
    const body = await request.json();
    const created = { id: Date.now(), ...body, created_at: new Date().toISOString() };
    return HttpResponse.json({ success: true, message: 'Teacher created successfully', id: created.id });
  }),
  http.put(`${API_BASE}/teachers/:id`, () => HttpResponse.json({ success: true, message: 'Teacher updated successfully' })),
  http.delete(`${API_BASE}/teachers/:id`, () => HttpResponse.json({ success: true, message: 'Teacher deleted successfully' })),

  http.get(`${API_BASE}/courses`, () => HttpResponse.json({ success: true, data: fixtures.courses })),
  http.post(`${API_BASE}/courses`, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ success: true, message: 'Course created successfully', id: Date.now() });
  }),
  http.put(`${API_BASE}/courses/:id`, () => HttpResponse.json({ success: true, message: 'Course updated successfully' })),
  http.delete(`${API_BASE}/courses/:id`, () => HttpResponse.json({ success: true, message: 'Course deleted successfully' })),

  http.get(`${API_BASE}/rooms`, () => HttpResponse.json({ success: true, data: fixtures.rooms })),
  http.post(`${API_BASE}/rooms`, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ success: true, message: 'Room created successfully', id: Date.now() });
  }),
  http.put(`${API_BASE}/rooms/:id`, () => HttpResponse.json({ success: true, message: 'Room updated successfully' })),
  http.delete(`${API_BASE}/rooms/:id`, () => HttpResponse.json({ success: true, message: 'Room deleted successfully' })),

  http.get(`${API_BASE}/terms`, () => HttpResponse.json({ success: true, data: fixtures.terms })),
  http.get(`${API_BASE}/terms/active`, () => HttpResponse.json({ success: true, data: fixtures.terms[0] })),
  http.post(`${API_BASE}/terms`, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ success: true, message: 'Term created successfully', id: Date.now() });
  }),
  http.put(`${API_BASE}/terms/:id`, () => HttpResponse.json({ success: true, message: 'Term updated successfully' })),
  http.delete(`${API_BASE}/terms/:id`, () => HttpResponse.json({ success: true, message: 'Term deleted successfully' })),

  http.get(`${API_BASE}/groups`, () => HttpResponse.json({ success: true, data: fixtures.groups })),
  http.post(`${API_BASE}/groups`, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ success: true, message: 'Group created successfully', id: Date.now() });
  }),
  http.put(`${API_BASE}/groups/:id`, () => HttpResponse.json({ success: true, message: 'Group updated successfully' })),
  http.delete(`${API_BASE}/groups/:id`, () => HttpResponse.json({ success: true, message: 'Group deleted successfully' })),

  http.get(`${API_BASE}/schedule/all`, () => HttpResponse.json({ success: true, data: fixtures.schedules })),
  http.post(`${API_BASE}/schedule/generate`, () => HttpResponse.json({
    success: true,
    message: 'Horario generado exitosamente.',
  })),
];
