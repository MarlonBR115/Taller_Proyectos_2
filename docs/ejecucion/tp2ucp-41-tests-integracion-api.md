# TP2UCP-41 - Test de integracion en API Backend

## Objetivo
Implementar pruebas de integracion para endpoints REST reales del backend Node.js/Express, verificando codigos HTTP, formato JSON, casos felices, casos infelices y manejo controlado de errores sin depender de una base de datos MySQL real.

## Alcance
La tarea cubre pruebas API con:

- `node:test` como runner existente.
- `assert` nativo de Node.js.
- `supertest` para ejecutar solicitudes HTTP contra la app Express.
- `createApp(pool)` para inyectar un pool falso de MySQL.

No se modifica frontend ni `database/schema.sql`.

## Refactor tecnico minimo
Se creo `backend_node/src/app.js` con una funcion `createApp(pool)`. Esta funcion registra middlewares y rutas Express usando el pool recibido por parametro.

`backend_node/server.js` queda como archivo de arranque real:

- carga variables de entorno;
- crea el pool MySQL real;
- verifica conexion;
- crea la app mediante `createApp(pool)`;
- ejecuta `app.listen`.

Este cambio permite ejecutar pruebas de API sin abrir un puerto real y sin conectarse obligatoriamente a MySQL.

## Endpoints probados
| Endpoint | Metodo | Escenarios cubiertos |
|---|---|---|
| `/api/terms` | GET | Lista periodos, convierte `is_active` a boolean, error MySQL simulado. |
| `/api/terms/active` | GET | Periodo activo existente y ausencia de periodo activo. |
| `/api/rooms` | GET | Lista aulas en formato JSON. |
| `/api/rooms` | POST | Creacion exitosa y error MySQL simulado. |
| `/api/groups` | GET | Consulta con periodo activo y respuesta vacia sin periodo activo. |
| `/api/schedule/all` | GET | Consulta con periodo activo y respuesta vacia sin periodo activo. |
| `/api/schedule/generate` | POST | Respuesta controlada sin periodo activo y error de generacion simulado. |

## Estrategia de pool falso
Las pruebas usan un pool falso con metodo `execute(sql, params)`. Cada prueba define una secuencia de respuestas o errores, lo que permite simular:

- consultas exitosas;
- inserciones con `insertId`;
- ausencia de datos;
- fallos de MySQL;
- fallo durante la generacion de horarios.

Esta estrategia evita modificar datos reales de demostracion y permite validar la estructura API con Supertest.

## Casos felices
- `GET /api/terms` responde `200`, JSON y arreglo de periodos.
- `GET /api/terms/active` responde un objeto cuando existe periodo activo.
- `GET /api/rooms` responde arreglo de aulas.
- `POST /api/rooms` responde `success: true` e `id`.
- `GET /api/groups` responde grupos cuando existe periodo activo.
- `GET /api/schedule/all` responde horarios cuando existe periodo activo.
- `POST /api/schedule/generate` responde JSON controlado cuando no existe periodo activo.

## Casos infelices
- Error MySQL simulado en `GET /api/terms`.
- Error MySQL simulado en `POST /api/rooms`.
- Ausencia de periodo activo en `/api/terms/active`, `/api/groups` y `/api/schedule/all`.
- Error simulado de generacion en `/api/schedule/generate`.

No se inventan validaciones de payload. Algunas rutas actuales delegan errores a MySQL porque no existe una capa formal de validacion previa.

## Comando de ejecucion

```bash
cd backend_node
npm.cmd test
```

## Relacion con la consigna
| Requisito de la consigna | Estado |
|---|---|
| Verificar endpoints REST | Cubierto con Supertest. |
| Validar operaciones CRUD | Cubierto parcialmente con `POST /api/rooms` y endpoints de consulta. CRUD completo con persistencia real queda pendiente para BD test separada. |
| Probar autenticacion/autorizacion | No aplica; el backend actual no implementa autenticacion. |
| Verificar codigos HTTP | Cubierto en casos `200` y `500`. |
| Validar respuestas JSON | Cubierto con `Content-Type` y estructura de cuerpo. |
| Comprobar persistencia en BD | Pendiente; se evita tocar MySQL real. Requiere base `generador_horarios_test`. |
| Validar errores y excepciones | Cubierto con errores simulados de MySQL y generacion. |
| Usar Supertest | Implementado. |

## Limitaciones
- No se usa base de datos real para no alterar datos de demo.
- No se declara coverage formal porque `c8` u otra herramienta de cobertura no fue implementada en esta tarea.
- No se prueba autenticacion/autorizacion porque no existe en el backend actual.
- La persistencia real debe validarse posteriormente con una base de datos de prueba separada y limpieza controlada.
