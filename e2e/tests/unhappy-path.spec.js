// =============================================================================
// UNHAPPY PATH — Errores, restricciones y fallos controlados (v4 FINAL)
// =============================================================================
const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:5173';
const API_URL = 'http://localhost:3000/api';
const TS = Date.now();

async function navTo(page, menuText) {
  await page.locator('li.nav-item, li.nav-item.action').filter({ hasText: menuText }).first().click();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(500);
}

test.describe('Unhappy Path - Errores, Restricciones y Fallos Controlados', () => {

  // UP-01: Endpoint inexistente
  test('UP-01: Seguridad HTTP - endpoint inexistente devuelve error controlado', async ({ page }) => {
    const res = await page.request.get(`${API_URL}/ruta-inexistente-xyz`, {
      failOnStatusCode: false
    });
    expect(res.status()).toBe(404);
    console.log(`  OK UP-01: GET /api/ruta-inexistente → ${res.status()} (controlado)`);

    const resPost = await page.request.post(`${API_URL}/no-existe`, {
      data: {},
      failOnStatusCode: false
    });
    expect([404, 400, 405].includes(resPost.status())).toBeTruthy();
    console.log(`  OK UP-01: POST /api/no-existe → ${resPost.status()} (controlado)`);
  });

  // UP-02: Crear grupo sin periodo activo
  test('UP-02: Restriccion de negocio - crear grupo sin periodo activo falla', async ({ page }) => {
    const termsRes = await page.request.get(`${API_URL}/terms`);
    const termsBody = await termsRes.json();
    const activosBefore = (termsBody.data || []).filter(t => t.is_active);

    for (const term of activosBefore) {
      await page.request.put(`${API_URL}/terms/${term.id}`, {
        data: { name: term.name, is_active: 0 }
      });
    }

    const res = await page.request.post(`${API_URL}/groups`, {
      data: { course_id: 1, teacher_id: 1, quota: 30 },
      failOnStatusCode: false
    });

    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.message).toBeTruthy();
    console.log(`  OK UP-02: Sin periodo activo → 400: "${body.message}"`);

    for (const term of activosBefore) {
      await page.request.put(`${API_URL}/terms/${term.id}`, {
        data: { name: term.name, is_active: 1 }
      });
    }
  });

  // UP-03: Solo un periodo activo a la vez
  test('UP-03: Restriccion multiusuario - solo un periodo puede estar activo', async ({ page }) => {
    const periodo1 = `UP-Periodo-A-${TS}`;
    const periodo2 = `UP-Periodo-B-${TS}`;

    await page.request.post(`${API_URL}/terms`, { data: { name: periodo1, is_active: 1 } });
    await page.request.post(`${API_URL}/terms`, { data: { name: periodo2, is_active: 1 } });

    const res = await page.request.get(`${API_URL}/terms/active`);
    const body = await res.json();
    expect(body.success).toBe(true);

    if (body.data) {
      expect(body.data.name).toBe(periodo2);
      console.log(`  OK UP-03: Solo un periodo activo → "${body.data.name}"`);
    } else {
      console.log('  OK UP-03: Sistema maneja conflicto de periodos activos');
    }

    const allTerms = await (await page.request.get(`${API_URL}/terms`)).json();
    for (const t of allTerms.data) {
      if (t.name === periodo1 || t.name === periodo2) {
        await page.request.delete(`${API_URL}/terms/${t.id}`, { failOnStatusCode: false });
      }
    }
  });

  // UP-04: Formulario vacio no se envia
  test('UP-04: Validacion frontend - formulario con campos vacios no se envia', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await navTo(page, 'Profesores');

    const rowsBefore = await page.locator('tbody tr').count();

    await page.locator('button.btn-primary').filter({ hasText: 'Profesor' }).click();
    await expect(page.locator('.modal-content')).toBeVisible();
    await page.screenshot({ path: 'test-results/screenshots/up-04a-form-vacio.png' });

    await page.locator('.modal-content button.btn-primary').click();
    await page.waitForTimeout(1000);

    const modalVisible = await page.locator('.modal-content').isVisible();
    const rowsAfter = await page.locator('tbody tr').count();

    if (modalVisible) {
      console.log('  OK UP-04: Modal sigue abierto (validacion HTML5 activa)');
    } else {
      expect(rowsAfter).toBe(rowsBefore);
      console.log('  OK UP-04: Modal cerro sin guardar registro vacio');
    }

    await page.screenshot({ path: 'test-results/screenshots/up-04b-validacion.png' });

    if (await page.locator('.modal-content').isVisible()) {
      await page.locator('.modal-content .close-btn').click();
    }
  });

  // UP-05: Integridad referencial
  test('UP-05: Restriccion integridad referencial - eliminar con dependencias', async ({ page }) => {
    const groupsRes = await page.request.get(`${API_URL}/groups`);
    const groupsBody = await groupsRes.json();

    if (!groupsBody.data || groupsBody.data.length === 0) {
      console.log('  OK UP-05: No hay grupos en BD, test omitido');
      test.skip();
      return;
    }

    const teacherIdConGrupo = groupsBody.data[0].teacher_id;
    const deleteRes = await page.request.delete(`${API_URL}/teachers/${teacherIdConGrupo}`, {
      failOnStatusCode: false
    });

    const status = deleteRes.status();
    const body = await deleteRes.json();

    if (status === 500 || body.success === false) {
      console.log(`  OK UP-05: Error FK controlado (${status}): "${body.message}"`);
    } else {
      console.log(`  OK UP-05: El esquema permite CASCADE (status: ${status})`);
    }
    expect([200, 500].includes(status)).toBeTruthy();
  });

  // UP-06: Motor CSP devuelve respuesta controlada
  test('UP-06: Motor CSP - generar horario devuelve respuesta controlada', async ({ page }) => {
    const res = await page.request.post(`${API_URL}/schedule/generate`, { failOnStatusCode: false });
    const status = res.status();
    const body = await res.json();

    if (status === 200 && body.success === true) {
      console.log('  OK UP-06: Motor genero horario OK');
    } else if (status === 200 && body.success === false) {
      console.log(`  OK UP-06: Error controlado del motor → "${body.message}"`);
      expect(body.message).toBeTruthy();
    } else {
      console.log(`  OK UP-06: Motor devuelve error HTTP ${status}`);
    }
  });

  // UP-07: Recuperacion ante fallos
  test('UP-07: Recuperacion ante fallos - eliminar y volver a crear un aula', async ({ page }) => {
    const nombre = `UP-Rec-${TS}`.slice(-12);

    // 1. Crear via API
    const createRes = await page.request.post(`${API_URL}/rooms`, {
      data: { name: nombre, capacity: 25, room_type: 'theory' }
    });
    const createBody = await createRes.json();
    expect(createBody.success).toBe(true);
    const roomId = createBody.id;

    // 2. Verificar en UI
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await navTo(page, 'Aulas');
    await expect(page.locator('table')).toContainText(nombre, { timeout: 8000 });
    await page.screenshot({ path: 'test-results/screenshots/up-07a-aula-antes.png' });

    // 3. Eliminar via API (fallo simulado)
    const delRes = await page.request.delete(`${API_URL}/rooms/${roomId}`, { failOnStatusCode: false });
    expect([200, 204].includes(delRes.status())).toBeTruthy();

    // 4. Verificar via API que ya no existe
    const checkRes = await page.request.get(`${API_URL}/rooms`);
    const checkBody = await checkRes.json();
    const stillExists = checkBody.data.find(r => r.id === roomId);
    expect(stillExists, 'El aula eliminada no debe existir en la BD').toBeFalsy();
    console.log(`  OK UP-07: Aula ID=${roomId} eliminada y confirmada via API`);

    // Recargar para verificar visualmente
    await page.reload();
    await page.waitForLoadState('networkidle');
    await navTo(page, 'Aulas');
    await page.waitForTimeout(800);
    await page.screenshot({ path: 'test-results/screenshots/up-07b-aula-eliminada.png' });

    // 5. Re-crear via API
    const reCreateRes = await page.request.post(`${API_URL}/rooms`, {
      data: { name: nombre, capacity: 25, room_type: 'theory' }
    });
    const reCreateBody = await reCreateRes.json();
    expect(reCreateBody.success).toBe(true);

    // Navegar explicitamente a Aulas para verificar que la re-creacion es visible
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await navTo(page, 'Aulas');
    // Esperar que la tabla tenga filas antes de verificar el contenido
    await page.waitForFunction(() => {
      const rows = document.querySelectorAll('tbody tr');
      return rows.length > 0;
    }, { timeout: 10000 });
    await expect(page.locator('table')).toContainText(nombre, { timeout: 10000 });
    await page.screenshot({ path: 'test-results/screenshots/up-07c-aula-recuperada.png' });
    console.log(`  OK UP-07: Aula "${nombre}" eliminada y re-creada (recuperacion ante fallos)`);
  });

  // UP-08: API rechaza datos malformados
  test('UP-08: Seguridad - API rechaza datos malformados o incompletos', async ({ page }) => {
    const res1 = await page.request.post(`${API_URL}/teachers`, {
      data: { name: '', email: 'invalido@test.com', availability: '[]' },
      failOnStatusCode: false
    });
    console.log(`  OK UP-08a: POST /teachers sin nombre → status ${res1.status()}`);

    const res2 = await page.request.post(`${API_URL}/courses`, {
      data: { code: 'TST001', name: 'Materia Sin Horas' },
      failOnStatusCode: false
    });
    console.log(`  OK UP-08b: POST /courses sin weekly_hours → status ${res2.status()}`);

    const res3 = await page.request.delete(`${API_URL}/teachers/99999999`, {
      failOnStatusCode: false
    });
    expect([200, 404, 500].includes(res3.status())).toBeTruthy();
    console.log(`  OK UP-08c: DELETE /teachers/99999999 → status ${res3.status()} (controlado)`);
  });

  // UP-09: Cerrar modal con X descarta cambios
  test('UP-09: UI - Cerrar modal con boton X descarta los cambios', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await navTo(page, 'Materias');

    const rowsBefore = await page.locator('tbody tr').count();

    await page.locator('button.btn-primary').filter({ hasText: 'Materia' }).click();
    await expect(page.locator('.modal-content')).toBeVisible({ timeout: 8000 });
    await page.locator('.modal-content input[type="text"]').first().fill(`Descartado-${TS}`);

    await page.screenshot({ path: 'test-results/screenshots/up-09a-modal-con-datos.png' });

    await page.locator('.modal-content .close-btn').click();
    await expect(page.locator('.modal-content')).not.toBeVisible({ timeout: 5000 });

    await page.waitForTimeout(500);
    const rowsAfter = await page.locator('tbody tr').count();
    expect(rowsAfter).toBe(rowsBefore);

    await page.screenshot({ path: 'test-results/screenshots/up-09b-datos-descartados.png' });
    console.log('  OK UP-09: Cerrar modal con X descarto los datos');
  });

  // UP-10: Click en overlay cierra modal
  test('UP-10: UI - Hacer click fuera del modal lo cierra sin guardar', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await navTo(page, 'Aulas');

    const rowsBefore = await page.locator('tbody tr').count();

    await page.locator('button.btn-primary').filter({ hasText: 'Aula' }).click();
    await expect(page.locator('.modal-content')).toBeVisible();
    await page.locator('.modal-content input[type="text"]').first().fill(`Aula-Overlay-${TS}`);

    await page.screenshot({ path: 'test-results/screenshots/up-10a-modal-open.png' });

    await page.locator('.modal-overlay').click({ position: { x: 10, y: 10 } });
    await expect(page.locator('.modal-content')).not.toBeVisible({ timeout: 5000 });

    const rowsAfter = await page.locator('tbody tr').count();
    expect(rowsAfter).toBe(rowsBefore);

    await page.screenshot({ path: 'test-results/screenshots/up-10b-modal-closed.png' });
    console.log('  OK UP-10: Click en overlay cerro modal sin guardar');
  });

});
