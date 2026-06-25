# Guia del Backend y API

## Proposito

El backend administra datos academicos, expone endpoints REST, orquesta la generacion de horarios y valida la calidad del resultado.

## Estructura principal

| Archivo o carpeta | Responsabilidad |
|---|---|
| `backend_node/server.js` | Crea el pool MySQL y arranca el servidor. |
| `backend_node/src/app.js` | Configura Express, middlewares y rutas mediante `createApp(pool)`. |
| `backend_node/GeneratorService.js` | Orquesta consultas, motor CSP, persistencia y validacion final. |
| `backend_node/src/services/` | Contiene `CSPMotor` y `motorAntiCruces`. |
| `backend_node/tests/` | Pruebas unitarias, API y aceptacion. |

## `createApp(pool)`

`createApp(pool)` permite crear la aplicacion Express con un pool inyectado:

- en ejecucion real recibe un pool de `mysql2/promise`;
- en pruebas API puede recibir un pool falso;
- evita levantar un servidor real durante pruebas con Supertest.

El pool falso verifica contratos HTTP y manejo de errores, pero no demuestra persistencia real.

## Endpoints principales

| Metodo | Endpoint | Proposito |
|---|---|---|
| GET/POST | `/api/teachers` | Listar y registrar docentes. |
| PUT/DELETE | `/api/teachers/:id` | Actualizar o eliminar docentes. |
| GET/POST | `/api/courses` | Listar y registrar cursos. |
| PUT/DELETE | `/api/courses/:id` | Actualizar o eliminar cursos. |
| GET/POST | `/api/rooms` | Listar y registrar aulas. |
| PUT/DELETE | `/api/rooms/:id` | Actualizar o eliminar aulas. |
| GET/POST | `/api/terms` | Listar y registrar periodos. |
| GET | `/api/terms/active` | Consultar el periodo activo. |
| PUT/DELETE | `/api/terms/:id` | Actualizar o eliminar periodos. |
| GET/POST | `/api/groups` | Listar y registrar grupos/secciones. |
| PUT/DELETE | `/api/groups/:id` | Actualizar o eliminar grupos. |
| GET | `/api/schedule/all` | Listar horarios del periodo activo. |
| POST | `/api/schedule/generate` | Ejecutar la generacion de horarios. |

## Relacion entre componentes

1. `GeneratorService` obtiene grupos, docentes y aulas desde MySQL.
2. `CSPMotor` busca asignaciones compatibles mediante restricciones y heuristicas.
3. `GeneratorService` guarda la solucion generada.
4. `motorAntiCruces` valida cruces, datos invalidos, capacidad, tipo de aula y advertencias.
5. La API devuelve resultado, metricas y validacion disponible.

## Limitaciones actuales

- no existe autenticacion ni autorizacion implementada;
- varias rutas no tienen una capa formal de validacion de payload;
- no existe persistencia historica de KPI;
- no existe una base de datos de pruebas separada documentada;
- las pruebas con pool falso no sustituyen una prueba de persistencia real.

## Referencias

- [HU03 - Motor Anti-Cruces](../ejecucion/hu03-motor-anti-cruces.md)
- [Heuristicas CSP](../ejecucion/a003-02-heuristicas-reglas.md)
- [Pruebas de integracion API](../ejecucion/tp2ucp-41-tests-integracion-api.md)
