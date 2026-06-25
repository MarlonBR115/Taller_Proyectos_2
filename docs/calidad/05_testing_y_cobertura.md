# Testing y Cobertura - AT002

## Objetivo
Documentar el estado real de pruebas automatizadas y cobertura del proyecto para alimentar la revision de calidad y SonarQube.

## Pruebas backend existentes
| Archivo | Tipo | Observacion |
|---|---|---|
| `backend_node/tests/motorAntiCruces.test.js` | Unitarias HU03 | Servicio puro, no requiere MySQL. |
| `backend_node/tests/api.integration.test.js` | Integracion API con Supertest | Usa pool falso, no toca MySQL real. |
| `backend_node/tests/RF01_04_gestion_entidades.test.js` | Aceptacion logica | Validaciones estructurales sin API real. |
| `backend_node/tests/RF06_07_motor_csp.test.js` | Aceptacion con MySQL real | Requiere MySQL local y seed masivo. |
| `backend_node/tests/RF08_exportacion_visualizacion.test.js` | Aceptacion logica | Valida estructura de visualizacion. |

## Pruebas frontend existentes
| Area | Evidencia |
|---|---|
| Jest / Testing Library | `frontend/src/tests`, `frontend/src/__tests__`, `frontend/src/components/__tests__`. |
| Coverage frontend | Script `npm.cmd run test:coverage` en `frontend/package.json`. |
| Vitest | Disponible como script alternativo, pero no es el runner principal documentado. |

## Pruebas E2E
| Herramienta | Evidencia |
|---|---|
| Playwright | `e2e/package.json`, `e2e/playwright.config.js`, `e2e/tests/*.spec.js`. |

## Comandos reales

Backend:

```bash
cd backend_node
npm.cmd test
npm.cmd run test:coverage
npm.cmd run test:mysql
npm.cmd run test:all
```

Frontend:

```bash
cd frontend
npm.cmd run test:coverage
```

E2E:

```bash
cd e2e
npm.cmd run test
```

## Resultados reales de esta fase

### Separacion de scripts backend

| Script | Proposito | Incluye MySQL real |
|---|---|---|
| `npm.cmd test` | Ejecuta pruebas reproducibles en cualquier equipo: aceptacion logica, API con pool falso y unitarias HU03. | No |
| `npm.cmd run test:coverage` | Genera cobertura con `c8` usando solo pruebas reproducibles sin MySQL real. | No |
| `npm.cmd run test:mysql` | Ejecuta la prueba de aceptacion que requiere MySQL local y seed masivo. | Si |
| `npm.cmd run test:all` | Ejecuta todas las pruebas, incluyendo la dependiente de MySQL. | Si |

La prueba `backend_node/tests/RF06_07_motor_csp.test.js` no se elimina ni se oculta; queda aislada en `test:mysql` porque valida integracion con MySQL real y depende de credenciales/servicio local.

### Backend `npm.cmd test`

```text
tests 43
suites 0
pass 43
fail 0
duration_ms 308.8947
```

Interpretacion: el comando principal queda reproducible porque no ejecuta pruebas que requieren MySQL real.

### Backend `npm.cmd run test:coverage`

El primer intento fallo con `spawn EPERM` dentro del sandbox. Se reintento con permisos elevados porque `c8` necesita ejecutar un proceso hijo. El comando finalizo correctamente usando solo pruebas reproducibles sin MySQL real.

```text
tests 43
suites 0
pass 43
fail 0
duration_ms 383.2654
```

Resumen de cobertura generado por `c8`:

| Archivo / grupo | Statements | Branch | Functions | Lines |
|---|---:|---:|---:|---:|
| All files | 63.44% | 77.83% | 78% | 63.44% |
| `GeneratorService.js` | 19.62% | 55.55% | 100% | 19.62% |
| `src/app.js` | 55.9% | 81.81% | 100% | 55.9% |
| `src/middlewares/greenMiddleware.js` | 90.9% | 60% | 100% | 90.9% |
| `src/services/CSPMotor.js` | 11.57% | 100% | 0% | 11.57% |
| `src/services/motorAntiCruces.js` | 98.35% | 79.05% | 96.96% | 98.35% |

Archivo generado:

```text
backend_node/coverage/lcov.info
```

### Backend `npm.cmd run test:mysql`

```text
tests 1
suites 0
pass 0
fail 1
duration_ms 358.0072
```

Fallo real del entorno actual:

```text
tests/RF06_07_motor_csp.test.js
Error de conexion a la BD: Access denied for user 'root'@'localhost' (using password: NO)
```

Interpretacion: la prueba queda disponible y separada, pero requiere MySQL local configurado con credenciales validas y datos seed.

### Frontend `npm.cmd run test:coverage`

```text
"jest" no se reconoce como un comando interno o externo,
programa o archivo por lotes ejecutable.
```

Interpretacion: el script existe, pero las dependencias frontend no estan instaladas o `node_modules/.bin/jest` no esta disponible en el entorno actual. No se genero:

```text
frontend/coverage/lcov.info
```

## Limitaciones
- La cobertura backend reproducible se genero correctamente sin MySQL real.
- `test:mysql` falla en el entorno actual por credenciales MySQL locales, no por el flujo reproducible principal.
- La cobertura frontend no se genero por falta de `jest` disponible.
- No se ejecuto E2E Playwright en esta fase.
- No se declara cumplimiento de 70% global ni 85% critico porque los resultados reales no lo sustentan.

## Recomendaciones
1. Mantener `npm.cmd test` para pruebas reproducibles sin MySQL real.
2. Ejecutar `npm.cmd run test:mysql` solo en equipos con MySQL local configurado.
3. Agregar configuracion de `c8` para excluir scripts operativos si el equipo lo aprueba.
4. Instalar dependencias frontend antes de ejecutar coverage frontend.
5. Ejecutar E2E solo con backend, frontend y base de datos preparados.
