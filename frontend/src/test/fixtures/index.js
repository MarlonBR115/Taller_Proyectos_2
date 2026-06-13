export const sampleTeachers = [
  { id: 1, name: 'Dr. Pérez', email: 'perez@test.com', availability: '["Mañana","Tarde"]', created_at: '2026-01-01T00:00:00.000Z' },
  { id: 2, name: 'Ing. López', email: 'lopez@test.com', availability: '["Noche"]', created_at: '2026-01-02T00:00:00.000Z' },
];

export const sampleCourses = [
  { id: 1, code: 'MAT101', name: 'Matemáticas I', credits: 4, weekly_hours: 4, created_at: '2026-01-01T00:00:00.000Z' },
  { id: 2, code: 'FIS101', name: 'Física I', credits: 4, weekly_hours: 4, created_at: '2026-01-02T00:00:00.000Z' },
];

export const sampleRooms = [
  { id: 1, name: 'A101', capacity: 30, room_type: 'theory', created_at: '2026-01-01T00:00:00.000Z' },
  { id: 2, name: 'Lab01', capacity: 20, room_type: 'lab', created_at: '2026-01-02T00:00:00.000Z' },
];

export const sampleGroups = [
  { id: 1, course_id: 1, course_name: 'Matemáticas I', teacher_id: 1, teacher_name: 'Dr. Pérez', quota: 30, term_id: 1, created_at: '2026-01-01T00:00:00.000Z' },
];

export const sampleTerms = [
  { id: 1, name: '2026-1', is_active: 1, created_at: '2026-01-01T00:00:00.000Z' },
  { id: 2, name: '2025-2', is_active: 0, created_at: '2025-06-01T00:00:00.000Z' },
];

export const sampleSchedules = [
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
];
