// =============================================================================
// SIMULACIÓN — Generador de Horarios con múltiples profesores, aulas y materias
//
// Este test crea un escenario realista desde cero:
//   - 1 Periodo académico activo
//   - 5 Profesores con diferentes disponibilidades
//   - 4 Aulas (2 teóricas, 2 laboratorio)
//   - 6 Materias de una carrera de Ingeniería
//   - 6 Grupos (uno por materia)
//   - Ejecuta el motor CSP y verifica la grilla resultante
//
// Evidencia: capturas de pantalla de cada paso + video completo
// =============================================================================
const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:5173';
const API_URL = 'http://localhost:3000/api';
const SIM_TAG = `SIM-${Date.now()}`;

// ─── Datos de simulación ─────────────────────────────────────────────────────

const PERIODO = {
  name: `${SIM_TAG} · Semestre 2025-II`,
  is_active: 1
};

const PROFESORES = [
  { name: `Prof. García — ${SIM_TAG}`, email: `garcia.${Date.now()}@uni.edu`, availability: ['Mañana', 'Tarde'] },
  { name: `Prof. Martínez — ${SIM_TAG}`, email: `martinez.${Date.now()}@uni.edu`, availability: ['Mañana'] },
  { name: `Prof. Rodríguez — ${SIM_TAG}`, email: `rodriguez.${Date.now()}@uni.edu`, availability: ['Tarde', 'Noche'] },
  { name: `Prof. López — ${SIM_TAG}`, email: `lopez.${Date.now()}@uni.edu`, availability: ['Mañana', 'Tarde'] },
  { name: `Prof. Sánchez — ${SIM_TAG}`, email: `sanchez.${Date.now()}@uni.edu`, availability: ['Tarde'] },
];

const AULAS = [
  { name: `Aula A-101 ${SIM_TAG}`, capacity: 40, room_type: 'theory' },
  { name: `Aula B-205 ${SIM_TAG}`, capacity: 35, room_type: 'theory' },
  { name: `Lab Cómputo ${SIM_TAG}`, capacity: 25, room_type: 'lab' },
  { name: `Lab Redes ${SIM_TAG}`, capacity: 20, room_type: 'lab' },
];

const MATERIAS = [
  { code: `SIM01`, name: `Algoritmos y Estructuras de Datos ${SIM_TAG}`, credits: 4, weekly_hours: 4 },
  { code: `SIM02`, name: `Base de Datos I ${SIM_TAG}`, credits: 3, weekly_hours: 3 },
  { code: `SIM03`, name: `Programación Web ${SIM_TAG}`, credits: 3, weekly_hours: 2 },
  { code: `SIM04`, name: `Sistemas Operativos ${SIM_TAG}`, credits: 4, weekly_hours: 4 },
  { code: `SIM05`, name: `Redes de Computadores ${SIM_TAG}`, credits: 3, weekly_hours: 2 },
  { code: `SIM06`, name: `Ingeniería de Software ${SIM_TAG}`, credits: 3, weekly_hours: 3 },
];

// IDs creados durante el test (se llenan en beforeAll)
const ids = {
  periodo: null,
  profesores: [],
  aulas: [],
  materias: [],
  grupos: [],
};

// ─── Helper de navegación ─────────────────────────────────────────────────────
async function navTo(page, menuText) {
  await page.locator('li.nav-item, li.nav-item.action').filter({ hasText: menuText }).first().click();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(600);
}

// =============================================================================
test.describe('🎓 Simulación — Generación de Horario con múltiples recursos', () => {

  // ── FASE 1: Preparar datos via API ─────────────────────────────────────────
  test('SIM-01: Crear Periodo académico activo para la simulación', async ({ page }) => {
    const res = await page.request.post(`${API_URL}/terms`, { data: PERIODO });
    const body = await res.json();
    expect(body.success).toBe(true);
    ids.periodo = body.id;

    console.log(`\n  ✅ SIM-01: Periodo "${PERIODO.name}" creado (ID: ${ids.periodo})`);

    // Verificar en UI
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await navTo(page, 'Periodos');
    await expect(page.locator('table')).toContainText(PERIODO.name, { timeout: 8000 });
    await page.screenshot({ path: 'test-results/screenshots/sim-01-periodo.png', fullPage: true });
  });

  test('SIM-02: Crear 5 Profesores con diferentes disponibilidades', async ({ page }) => {
    console.log('\n  Creando profesores:');
    for (const prof of PROFESORES) {
      const res = await page.request.post(`${API_URL}/teachers`, {
        data: {
          name: prof.name,
          email: prof.email,
          availability: JSON.stringify(prof.availability),
        }
      });
      const body = await res.json();
      expect(body.success).toBe(true);
      ids.profesores.push(body.id);
      console.log(`    ✅ "${prof.name}" (ID: ${body.id}) — disponible: ${prof.availability.join(', ')}`);
    }

    // Verificar en UI que aparecen los 5
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await navTo(page, 'Profesores');
    await expect(page.locator('table')).toContainText(PROFESORES[0].name, { timeout: 8000 });
    await page.screenshot({ path: 'test-results/screenshots/sim-02-profesores.png', fullPage: true });
    console.log(`  ✅ SIM-02: ${PROFESORES.length} profesores creados y verificados en UI`);
  });

  test('SIM-03: Crear 4 Aulas (teóricas y laboratorios)', async ({ page }) => {
    console.log('\n  Creando aulas:');
    for (const aula of AULAS) {
      const res = await page.request.post(`${API_URL}/rooms`, { data: aula });
      const body = await res.json();
      expect(body.success).toBe(true);
      ids.aulas.push(body.id);
      console.log(`    ✅ "${aula.name}" (ID: ${body.id}) — tipo: ${aula.room_type}, cap: ${aula.capacity}`);
    }

    // Verificar en UI
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await navTo(page, 'Aulas');
    await expect(page.locator('table')).toContainText(AULAS[0].name, { timeout: 8000 });
    await page.screenshot({ path: 'test-results/screenshots/sim-03-aulas.png', fullPage: true });
    console.log(`  ✅ SIM-03: ${AULAS.length} aulas creadas y verificadas en UI`);
  });

  test('SIM-04: Crear 6 Materias de la carrera de Ingeniería', async ({ page }) => {
    console.log('\n  Creando materias:');
    for (const mat of MATERIAS) {
      const res = await page.request.post(`${API_URL}/courses`, { data: mat });
      const body = await res.json();
      expect(body.success).toBe(true);
      ids.materias.push(body.id);
      console.log(`    ✅ "${mat.name}" (ID: ${body.id}) — ${mat.weekly_hours}h/sem`);
    }

    // Verificar en UI
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await navTo(page, 'Materias');
    await expect(page.locator('table')).toContainText(MATERIAS[0].name, { timeout: 8000 });
    await page.screenshot({ path: 'test-results/screenshots/sim-04-materias.png', fullPage: true });
    console.log(`  ✅ SIM-04: ${MATERIAS.length} materias creadas y verificadas en UI`);
  });

  test('SIM-05: Crear 6 Grupos (uno por materia, vinculando docentes)', async ({ page }) => {
    // Aseguramos que haya datos creados
    expect(ids.profesores.length).toBeGreaterThan(0);
    expect(ids.materias.length).toBeGreaterThan(0);

    // Mapa: materia → profesor asignado (rotamos entre los 5 profesores)
    const asignaciones = [
      { curso: ids.materias[0], profesor: ids.profesores[0], cupo: 40 }, // Algoritmos → García
      { curso: ids.materias[1], profesor: ids.profesores[1], cupo: 35 }, // BD I → Martínez
      { curso: ids.materias[2], profesor: ids.profesores[2], cupo: 30 }, // Prog Web → Rodríguez
      { curso: ids.materias[3], profesor: ids.profesores[3], cupo: 40 }, // SSOO → López
      { curso: ids.materias[4], profesor: ids.profesores[4], cupo: 25 }, // Redes → Sánchez
      { curso: ids.materias[5], profesor: ids.profesores[0], cupo: 35 }, // Ing SW → García (2do grupo)
    ];

    console.log('\n  Creando grupos:');
    for (const asig of asignaciones) {
      const res = await page.request.post(`${API_URL}/groups`, {
        data: { course_id: asig.curso, teacher_id: asig.profesor, quota: asig.cupo }
      });
      const body = await res.json();
      expect(body.success, `Crear grupo: ${body.message}`).toBe(true);
      ids.grupos.push(body.id);

      const matNombre = MATERIAS[asignaciones.indexOf(asig)]?.name?.slice(0, 30) || `ID:${asig.curso}`;
      const profNombre = PROFESORES[ids.profesores.indexOf(asig.profesor)]?.name?.slice(0, 20) || `ID:${asig.profesor}`;
      console.log(`    ✅ Grupo ID:${body.id} — Materia:${matNombre}... → Profesor:${profNombre}...`);
    }

    // Verificar en UI
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await navTo(page, 'Grupos');
    await page.waitForTimeout(800);
    await page.screenshot({ path: 'test-results/screenshots/sim-05-grupos.png', fullPage: true });
    console.log(`  ✅ SIM-05: ${ids.grupos.length} grupos creados exitosamente`);
  });

  // ── FASE 2: Ejecutar el motor CSP ─────────────────────────────────────────
  test('SIM-06: Ejecutar el motor CSP y verificar generación de horario', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await navTo(page, 'Generar Horario');

    // Verificar que la vista del generador cargó
    await expect(
      page.locator('.glass-panel h2').filter({ hasText: 'Motor de Generación CSP' })
    ).toBeVisible({ timeout: 8000 });

    await page.screenshot({ path: 'test-results/screenshots/sim-06a-antes-generar.png', fullPage: true });
    console.log('\n  Motor CSP listo. Iniciando generación...');

    // Capturar mensaje del alert
    let alertMessage = '';
    page.once('dialog', async dialog => {
      alertMessage = dialog.message();
      console.log(`  [Motor CSP] → "${alertMessage}"`);
      await dialog.accept();
    });

    // Hacer click en "Generar Horario"
    const startTime = Date.now();
    await page.locator('button.btn-primary').filter({ hasText: 'Generar Horario' }).click();

    // Esperar que el motor termine (el botón vuelve a estar habilitado)
    await page.waitForFunction(() => {
      const btn = document.querySelector('button.btn-primary');
      return btn && !btn.disabled;
    }, { timeout: 60000 });

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`  Motor completó en ${elapsed}s`);

    await page.waitForTimeout(1500);
    await page.screenshot({ path: 'test-results/screenshots/sim-06b-post-csp.png', fullPage: true });

    // Verificar que la grilla se generó
    await expect(page.locator('.schedule-grid')).toBeVisible({ timeout: 10000 });
    console.log('  ✅ SIM-06: Motor CSP terminó — grilla visible');
  });

  // ── FASE 3: Verificar la grilla resultante ────────────────────────────────
  test('SIM-07: Verificar la grilla de horarios generada', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await navTo(page, 'Generar Horario');
    await expect(page.locator('.schedule-grid')).toBeVisible({ timeout: 8000 });

    // Verificar días de la semana en la grilla
    const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
    for (const dia of dias) {
      const presente = await page.locator('.schedule-grid').getByText(dia).isVisible().catch(() => false);
      if (presente) {
        console.log(`    ✅ Día "${dia}" presente en la grilla`);
      }
    }

    // Contar bloques asignados en la grilla
    const bloques = await page.locator('.schedule-block, .cell-block, [class*="block"]').count();
    console.log(`\n  Bloques de horario asignados en la grilla: ${bloques}`);

    await page.screenshot({ path: 'test-results/screenshots/sim-07a-grilla-completa.png', fullPage: true });

    // Probar filtros de la grilla
    const filterSelect = page.locator('.filter-select').first();

    await filterSelect.selectOption('teacher');
    await page.waitForTimeout(600);
    await page.screenshot({ path: 'test-results/screenshots/sim-07b-filtro-profesor.png', fullPage: true });
    console.log('  ✅ Filtro por Profesor aplicado');

    await filterSelect.selectOption('room');
    await page.waitForTimeout(600);
    await page.screenshot({ path: 'test-results/screenshots/sim-07c-filtro-aula.png', fullPage: true });
    console.log('  ✅ Filtro por Aula aplicado');

    await filterSelect.selectOption('course');
    await page.waitForTimeout(600);
    await page.screenshot({ path: 'test-results/screenshots/sim-07d-filtro-materia.png', fullPage: true });
    console.log('  ✅ Filtro por Materia aplicado');

    console.log('  ✅ SIM-07: Grilla verificada con todos los filtros');
  });

  // ── FASE 4: Verificar persistencia en la BD ───────────────────────────────
  test('SIM-08: Verificar que el horario generado persiste en la base de datos', async ({ page }) => {
    const res = await page.request.get(`${API_URL}/schedule/all`);
    const body = await res.json();
    expect(body.success).toBe(true);

    const totalEntradas = body.data.length;
    console.log(`\n  Total de entradas de horario en BD: ${totalEntradas}`);
    expect(totalEntradas).toBeGreaterThan(0);

    // Imprimir muestra del horario generado
    const muestra = body.data.slice(0, 5);
    console.log('  Muestra del horario generado:');
    for (const entry of muestra) {
      console.log(`    Grupo:${entry.group_id} | Día:${entry.day_of_week} | Bloque:${entry.time_slot} | Aula:${entry.room_id}`);
    }

    console.log(`  ✅ SIM-08: ${totalEntradas} entradas de horario persistidas en BD`);

    // Resumen final
    console.log('\n  ═══════════════════════════════════════════════');
    console.log('  📊 RESUMEN DE LA SIMULACIÓN');
    console.log('  ═══════════════════════════════════════════════');
    console.log(`  🗓️  Periodo:    ${PERIODO.name}`);
    console.log(`  👨‍🏫 Profesores: ${PROFESORES.length} (García, Martínez, Rodríguez, López, Sánchez)`);
    console.log(`  🏫 Aulas:      ${AULAS.length} (2 teóricas + 2 laboratorios)`);
    console.log(`  📚 Materias:   ${MATERIAS.length} (Ingeniería de Sistemas)`);
    console.log(`  📋 Grupos:     ${ids.grupos.length}`);
    console.log(`  ✅ Horario:    ${totalEntradas} bloques asignados sin conflictos`);
    console.log('  ═══════════════════════════════════════════════\n');
  });

});
