# Matriz OWASP - AT002

## Objetivo
Registrar riesgos de seguridad reales y potenciales observados en el repositorio para priorizar mitigaciones sin declarar controles que aun no estan implementados.

## Matriz inicial

| Codigo | Riesgo | Tipo | Evidencia | Impacto | Probabilidad | Severidad | Mitigacion propuesta | Estado |
|---|---|---|---|---|---|---|---|---|
| OWASP-01 | Falta de autenticacion | Real / alcance actual | No existen rutas de login, JWT, sesiones ni middleware de autenticacion. | Alto si el sistema se expone fuera del entorno local. | Media | Alta | Definir modulo de autenticacion o documentar despliegue restringido para prototipo. | Pendiente |
| OWASP-02 | Falta de autorizacion | Real / alcance actual | No existen roles ni permisos para CRUD o generacion de horarios. | Alto: cualquier usuario podria modificar datos academicos. | Media | Alta | Agregar control de roles cuando exista autenticacion. | Pendiente |
| OWASP-03 | Validacion insuficiente de entradas | Real | Rutas en `backend_node/src/app.js` envian payloads directamente a SQL parametrizado. | Medio/alto: errores 500, datos invalidos o inconsistencias. | Alta | Alta | Agregar validadores por entidad, tipos, rangos y enums. | Detectado |
| OWASP-04 | Mensajes tecnicos expuestos | Real | Varios `catch` responden `message: err.message`. | Medio: expone detalles internos de MySQL o servidor. | Media | Alta | Registrar error internamente y devolver mensaje generico al cliente. | Detectado |
| OWASP-05 | CORS permisivo | Real | `cors({ exposedHeaders: [...] })` no restringe `origin`. | Medio si se publica el backend. | Media | Media | Configurar origins permitidos por variable de entorno. | Mitigacion propuesta |
| OWASP-06 | Ausencia de Helmet | Real | No existe `helmet` en dependencias ni middleware. | Medio: faltan cabeceras de seguridad HTTP. | Media | Media | Agregar `helmet` y validar compatibilidad con frontend. | Pendiente |
| OWASP-07 | Ausencia de rate limiting | Potencial | No existe limitador para CRUD ni `/api/schedule/generate`. | Medio/alto ante abuso de generacion o spam de peticiones. | Media | Media | Agregar `express-rate-limit` en endpoints sensibles. | Pendiente |
| OWASP-08 | Dependencias con vulnerabilidades npm | Real | `npm audit --json` reporta 5 vulnerabilidades moderadas asociadas a `qs`, `express`, `body-parser`, `superagent` y `supertest`. | Medio: posible DoS en dependencia transitiva. | Media | Media | Revisar versiones disponibles; no ejecutar `npm audit fix` sin control. | Detectado |
| OWASP-09 | Dependencia de MySQL local | Operativo / seguridad | Pruebas y servidor dependen de `.env` o defaults locales. | Medio: errores por entorno y riesgo de configuraciones inseguras. | Alta | Media | Documentar `.env`, usar BD test y evitar credenciales reales en repo. | Mitigacion propuesta |
| OWASP-10 | Manejo de variables de entorno | Potencial | `server.js` usa `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME`; `.gitignore` excluye `.env`. | Medio si se suben secretos o faltan variables. | Baja | Media | Mantener `.env` fuera de Git y agregar `.env.example` sin secretos. | Riesgo bajo |
| OWASP-11 | SQL injection | Riesgo bajo | Las consultas usan parametros `?`; no se observaron concatenaciones directas de input en SQL critico. | Alto si se rompe la parametrizacion en nuevas rutas. | Baja | Media | Mantener consultas parametrizadas y revisar nuevas rutas. | Riesgo bajo |

## Notas
- No se declara autenticacion ni autorizacion como implementadas.
- No se ejecuto `npm audit fix`.
- La matriz se basa en revision estatica y comandos ejecutados en esta fase.
