# Evidencia - Tests de Integracion API Backend

## Tarea
TP2UCP-41: Test de integracion en API (Backend).

## Herramientas usadas
| Herramienta | Uso |
|---|---|
| `node:test` | Runner de pruebas existente del backend. |
| `assert` | Aserciones nativas. |
| `supertest` | Ejecucion de solicitudes HTTP contra Express sin levantar puerto real. |
| Pool falso | Simulacion de `mysql2/promise` sin tocar MySQL real. |

## Archivo de pruebas

```text
backend_node/tests/api.integration.test.js
```

## Comando ejecutado

```bash
cd backend_node
npm.cmd test
```

## Resultado observado

```text
tests 36
suites 0
pass 36
fail 0
cancelled 0
skipped 0
todo 0
duration_ms 274.1108
```

## Pruebas de integracion agregadas
| Caso | Endpoint | Resultado esperado |
|---|---|---|
| Lista de periodos | `GET /api/terms` | `200`, JSON, `success: true`, `data` arreglo. |
| Periodo activo existente | `GET /api/terms/active` | `200`, JSON, objeto en `data`. |
| Sin periodo activo | `GET /api/terms/active` | `200`, JSON, `data: null`. |
| Lista de aulas | `GET /api/rooms` | `200`, JSON, arreglo de aulas. |
| Crear aula | `POST /api/rooms` | `200`, `success: true`, `id`. |
| Error al crear aula | `POST /api/rooms` | `500`, `success: false`, mensaje de error. |
| Grupos con periodo activo | `GET /api/groups` | `200`, arreglo de grupos. |
| Grupos sin periodo activo | `GET /api/groups` | `200`, arreglo vacio. |
| Horarios con periodo activo | `GET /api/schedule/all` | `200`, arreglo de horarios. |
| Horarios sin periodo activo | `GET /api/schedule/all` | `200`, arreglo vacio. |
| Generacion sin periodo activo | `POST /api/schedule/generate` | `200`, JSON controlado con `success: false`. |
| Error de generacion | `POST /api/schedule/generate` | `500`, JSON de error controlado. |
| Error MySQL simulado | `GET /api/terms` | `500`, JSON con `success: false`. |

## Evidencia de no uso de base real
Las pruebas inyectan `createApp(pool)` con un pool falso. No se crea conexion a MySQL, no se ejecuta `app.listen` y no se alteran tablas reales.

## Limitaciones documentadas
- La persistencia real queda pendiente para una base de datos de prueba separada.
- No se implementa coverage formal en esta tarea.
- No se prueba autenticacion/autorizacion porque no existe en el backend actual.
- Algunas rutas no validan payload antes de llamar a MySQL; esa limitacion se conserva y se documenta.
