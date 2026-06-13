// @ts-check
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  
  /* Timeout global por test */
  timeout: 60000,
  
  /* Timeout para assertions */
  expect: {
    timeout: 10000,
  },

  /* Ejecutar tests en secuencia (no en paralelo) para evitar interferencias en la BD */
  fullyParallel: false,
  workers: 1,

  /* Reintentos en CI */
  retries: 0,

  /* Reporter: genera HTML interactivo + consola */
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
    ['json', { outputFile: 'playwright-report/results.json' }],
  ],

  use: {
    /* URL base del frontend */
    baseURL: 'http://localhost:5173',

    /* Captura de screenshots: siempre en cada paso importante */
    screenshot: 'on',

    /* Video de cada test */
    video: 'on',

    /* Trace completo para debugging */
    trace: 'on',

    /* Viewport estándar desktop */
    viewport: { width: 1280, height: 720 },

    /* Tiempo máximo de navegación */
    actionTimeout: 15000,
    navigationTimeout: 30000,
  },

  projects: [
    {
      name: 'Chromium - OptiClass E2E',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  /* Carpeta de artefactos (videos, screenshots) */
  outputDir: 'test-results',
});
