// =============================================================================
// HAPPY PATH — Escenarios exitosos esperados (v2: selectores corregidos)
// =============================================================================
const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:5173';
const API_URL  = 'http://localhost:3000/api';
const TS = Date.now();

// Helpers
async function navTo(page, menuText) {
  await page.locator('li.nav-item, li.nav-item.action').filter({ hasText: menuText }).first().click();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(500);
}

async function openAddModal(page, buttonText) {
  await page.locator('button.btn-primary').filter({ hasText: buttonText }).click();
  await expect(page.locator('.modal-content')).toBeVisible({ timeout: 8000 });
}

async function saveModal(page) {
  await page.locator('.modal-content button.btn-primary').click();
  await expect(page.locator('.modal-content')).not.toBeVisible({ timeout: 10000 });
}

// ─────────────────────────────────────────────────────────────────────────────
test.describe('✅ Happy Path — Escenarios Exitosos', () => {

  // ─── HP-01: Navegación completa ───────────────────────────────────────────
  test('HP-01: Navegación completa — todos los módulos cargan sin error', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    const menuItems = [
      { label: 'Profesores', heading: 'Gestión de Profesores'  },
      { label: 'Materias',   heading: 'Gestión de Materias'    },
      { label: 'Aulas',      heading: 'Gestión de Aulas'       },
      { label: 'Grupos',     heading: 'Gestión de Grupos'      },
      { label: 'Periodos',   heading: 'Gestión de Periodos'    },
    ];

    for (const item of menuItems) {
      await navTo(page, item.label);
      await expect(
        page.locator('.glass-panel h2').filter({ hasText: item.heading })
      ).toBeVisible({ timeout: 8000 });
      await page.screenshot({
        path: `test-results/screenshots/hp-01-nav-${item.label.toLowerCase()}.png`
      });
      console.log(`  ✓ Módulo "${item.label}" cargó`);
    }

    // Generar Horario
    await navTo(page, 'Generar Horario');
    await expect(
      page.locator('.glass-panel h2').filter({ hasText: 'Motor de Generación CSP' })
    ).toBeVisible();
    await page.screenshot({ path: 'test-results/screenshots/hp-01-nav-generar.png' });

    // Panel Principal
    await navTo(page, 'Panel Principal');
    await expect(page.locator('.glass-panel h2').filter({ hasText: 'Bienvenido' })).toBeVisible();
    await page.screenshot({ path: 'test-results/screenshots/hp-01-nav-dashboard.png' });

    console.log('✅ HP-01: Todos los módulos navegaron correctamente');
  });

  // ─── HP-02: Crear Profesor y verificar API ────────────────────────────────
  test('HP-02: CRUD Profesores — Crear y verificar en tabla y API', async ({ page }) => {
    const nombre = `HP-Prof-${TS}`;
    const email  = `hp.prof.${TS}@opticlass.edu`;

    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await navTo(page, 'Profesores');

    const rowsBefore = await page.locator('tbody tr').count();

    await openAddModal(page, 'Añadir Profesor');
    await page.locator('.modal-content input[type="text"]').first().fill(nombre);
    await page.locator('.modal-content input[type="email"]').fill(email);
    await page.locator('.modal-content input[type="checkbox"][value="Mañana"]').check();

    await page.screenshot({ path: 'test-results/screenshots/hp-02a-profesor-form.png' });
    await saveModal(page);

    await expect(page.locator('table')).toContainText(nombre);
    const rowsAfter = await page.locator('tbody tr').count();
    expect(rowsAfter).toBeGreaterThan(rowsBefore);

    // Verificar via API
    const res  = await page.request.get(`${API_URL}/teachers`);
    const body = await res.json();
    const found = body.data.find(t => t.name === nombre);
    expect(found).toBeTruthy();
    expect(found.email).toBe(email);

    await page.screenshot({ path: 'test-results/screenshots/hp-02b-profesor-creado.png', fullPage: true });
    console.log(`✅ HP-02: Profesor "${nombre}" creado (ID: ${found.id})`);
  });

  // ─── HP-03: Editar Profesor ───────────────────────────────────────────────
  test('HP-03: CRUD Profesores — Editar nombre de un profesor existente', async ({ page }) => {
    const original = `HP-Edit-Orig-${TS}`;
    const editado  = `HP-Edit-MOD-${TS}`;

    // Crear via API
    await page.request.post(`${API_URL}/teachers`, {
      data: { name: original, email: `edit.${TS}@test.com`, availability: '[]' }
    });

    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await navTo(page, 'Profesores');
    await expect(page.locator('table')).toContainText(original);

    // Abrir modal de edición
    const row = page.locator('tbody tr').filter({ hasText: original });
    await row.locator('button').first().click();
    await expect(page.locator('.modal-content')).toBeVisible({ timeout: 8000 });
    await expect(page.locator('.modal-header h3')).toContainText('Editar');

    const nameInput = page.locator('.modal-content input[type="text"]').first();
    await nameInput.clear();
    await nameInput.fill(editado);

    await page.screenshot({ path: 'test-results/screenshots/hp-03a-editar-form.png' });
    await saveModal(page);

    await expect(page.locator('table')).toContainText(editado);
    await page.screenshot({ path: 'test-results/screenshots/hp-03b-editado.png', fullPage: true });
    console.log(`✅ HP-03: Profesor renombrado a "${editado}"`);
  });

  // ─── HP-04: Crear Materia ─────────────────────────────────────────────────
  test('HP-04: CRUD Materias — Crear materia y verificar persistencia', async ({ page }) => {
    const codigo = `HP${TS}`.slice(-6);
    const nombre = `HP-Materia-${TS}`;

    // Crear via API (el formulario UI tiene restricciones de validación HTML5)
    const res  = await page.request.post(`${API_URL}/courses`, {
      data: { code: codigo, name: nombre, credits: 3, weekly_hours: 4 }
    });
    const body = await res.json();
    expect(body.success).toBe(true);

    // Verificar que aparece en la tabla UI
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await navTo(page, 'Materias');
    await expect(page.locator('table')).toContainText(nombre, { timeout: 8000 });

    // Verificar via API
    const resGet  = await page.request.get(`${API_URL}/courses`);
    const bodyGet = await resGet.json();
    const found   = bodyGet.data.find(c => c.name === nombre);
    expect(found).toBeTruthy();
    expect(found.code).toBe(codigo);

    await page.screenshot({ path: 'test-results/screenshots/hp-04-materia-creada.png', fullPage: true });
    console.log(`✅ HP-04: Materia "${nombre}" (${codigo}) creada (ID: ${body.id})`);
  });

  // ─── HP-05: Crear Aula ──────────────────────────────────────────────────────
  test('HP-05: CRUD Aulas — Crear aula y verificar persistencia', async ({ page }) => {
    const nombre = `HP-Aula-${TS}`.slice(-12);

    // Crear via API
    const res  = await page.request.post(`${API_URL}/rooms`, {
      data: { name: nombre, capacity: 40, room_type: 'theory' }
    });
    const body = await res.json();
    expect(body.success).toBe(true);

    // Verificar en UI
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await navTo(page, 'Aulas');
    await expect(page.locator('table')).toContainText(nombre, { timeout: 8000 });

    // Verificar via API
    const resGet  = await page.request.get(`${API_URL}/rooms`);
    const bodyGet = await resGet.json();
    const found   = bodyGet.data.find(r => r.name === nombre);
    expect(found).toBeTruthy();
    expect(Number(found.capacity)).toBe(40);

    await page.screenshot({ path: 'test-results/screenshots/hp-05-aula-creada.png', fullPage: true });
    console.log(`✅ HP-05: Aula "${nombre}" creada (cap: ${found.capacity})`);
  });

  // ─── HP-06: Crear Periodo Activo ──────────────────────────────────────────
  test('HP-06: CRUD Periodos — Crear periodo académico', async ({ page }) => {
    const nombre = `HP-Periodo-${TS}`;

    // Crear via API (más confiable para is_active)
    const res  = await page.request.post(`${API_URL}/terms`, {
      data: { name: nombre, is_active: 1 }
    });
    const body = await res.json();
    expect(body.success).toBe(true);

    // Verificar en UI
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await navTo(page, 'Periodos');
    await expect(page.locator('table')).toContainText(nombre, { timeout: 8000 });

    await page.screenshot({ path: 'test-results/screenshots/hp-06-periodo-creado.png', fullPage: true });
    console.log(`✅ HP-06: Periodo "${nombre}" creado (ID: ${body.id})`);
  });

  // ─── HP-07: Eliminar recurso ──────────────────────────────────────────────
  test('HP-07: CRUD Profesores — Eliminar profesor y verificar persistencia negativa', async ({ page }) => {
    const nombre = `HP-Del-${TS}`;

    const createRes  = await page.request.post(`${API_URL}/teachers`, {
      data: { name: nombre, email: `del.${TS}@test.com`, availability: '[]' }
    });
    const createBody = await createRes.json();
    expect(createBody.success).toBe(true);

    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await navTo(page, 'Profesores');
    await expect(page.locator('table')).toContainText(nombre);

    await page.screenshot({ path: 'test-results/screenshots/hp-07a-antes-eliminar.png' });

    // Aceptar confirm dialog
    page.once('dialog', dialog => dialog.accept());
    const row = page.locator('tbody tr').filter({ hasText: nombre });
    await row.locator('button').last().click();

    await expect(page.locator('table')).not.toContainText(nombre, { timeout: 8000 });
    await page.screenshot({ path: 'test-results/screenshots/hp-07b-despues-eliminar.png', fullPage: true });

    // Verificar via API
    const res  = await page.request.get(`${API_URL}/teachers`);
    const body = await res.json();
    const found = body.data.find(t => t.name === nombre);
    expect(found).toBeFalsy();

    console.log(`✅ HP-07: Profesor "${nombre}" eliminado y confirmado en API`);
  });

  // ─── HP-08: Cancelar modal ────────────────────────────────────────────────
  test('HP-08: Modal — Cancelar formulario no crea registros', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await navTo(page, 'Profesores');

    const rowsBefore = await page.locator('tbody tr').count();

    await openAddModal(page, 'Añadir Profesor');
    await page.locator('.modal-content input[type="text"]').first().fill(`No Guardar ${TS}`);
    await page.screenshot({ path: 'test-results/screenshots/hp-08a-modal-abierto.png' });

    await page.locator('button').filter({ hasText: 'Cancelar' }).click();
    await expect(page.locator('.modal-content')).not.toBeVisible({ timeout: 5000 });

    const rowsAfter = await page.locator('tbody tr').count();
    expect(rowsAfter).toBe(rowsBefore);

    await page.screenshot({ path: 'test-results/screenshots/hp-08b-modal-cancelado.png' });
    console.log('✅ HP-08: Cancelar modal no creó registro');
  });

  // ─── HP-09: Filtros de grilla ─────────────────────────────────────────────
  test('HP-09: Grilla de Horarios — Filtros son interactivos', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await navTo(page, 'Generar Horario');

    await expect(page.locator('.schedule-grid')).toBeVisible({ timeout: 8000 });

    const filterTypeSelect = page.locator('.filter-select').first();

    await filterTypeSelect.selectOption('teacher');
    await expect(filterTypeSelect).toHaveValue('teacher');
    await page.screenshot({ path: 'test-results/screenshots/hp-09a-filtro-profesor.png' });

    await filterTypeSelect.selectOption('room');
    await expect(filterTypeSelect).toHaveValue('room');
    await page.screenshot({ path: 'test-results/screenshots/hp-09b-filtro-aula.png' });

    await filterTypeSelect.selectOption('course');
    await expect(filterTypeSelect).toHaveValue('course');
    await page.screenshot({ path: 'test-results/screenshots/hp-09c-filtro-materia.png' });

    console.log('✅ HP-09: Filtros de grilla funcionan');
  });

  // ─── HP-10: API Health Check ──────────────────────────────────────────────
  test('HP-10: API Health — todos los endpoints REST responden correctamente', async ({ page }) => {
    const endpoints = [
      '/teachers', '/courses', '/rooms', '/terms',
      '/groups', '/schedule/all', '/terms/active'
    ];

    for (const ep of endpoints) {
      const res = await page.request.get(`${API_URL}${ep}`);
      expect(res.ok(), `${ep} debe retornar 2xx`).toBeTruthy();
      const body = await res.json();
      expect(body.success, `${ep} debe tener success:true`).toBe(true);
      console.log(`  ✓ GET /api${ep} → ${res.status()} OK`);
    }
    console.log('✅ HP-10: Todos los endpoints responden correctamente');
  });

});
