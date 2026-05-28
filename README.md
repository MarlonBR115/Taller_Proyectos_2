# Sistema de Generacion Optima de Horarios Academicos en Entornos de Curriculo Flexible

Plataforma academica semiautomatica para apoyar la planificacion academica, oferta de cursos, asignacion docente, gestion de aulas, programacion de horarios, validacion de restricciones y medicion de KPI.

El sistema genera, valida, mide y recomienda. No reemplaza totalmente la intervencion humana: coordinadores, responsables de horarios, docentes y registro academico conservan la revision de excepciones, aprobacion final y control de cambios.

## Problema que aborda

La planificacion academica flexible combina demanda de cursos, docentes, aulas, cupos, disponibilidad, secciones y restricciones de horario. Sin apoyo tecnico, el proceso puede generar cruces, sobreuso de aulas, baja trazabilidad y dificultad para justificar decisiones academicas.

## Alcance actual

- Gestion base de docentes, cursos, aulas, periodos, grupos/secciones y horarios.
- Motor CSP inicial para generar horarios.
- HU03 - Motor Anti-Cruces para validar cruces de docente, aula y grupo.
- Metricas de validacion y generacion en memoria.
- Documentacion SDD, riesgos, KPI, pruebas y evidencias.
- Frontend React/Vite para gestion y visualizacion base.

## Alcance futuro

- Planificacion curricular completa por carrera, plan y ciclo.
- Estimacion formal de demanda academica.
- Student sectioning o asignacion de estudiantes a secciones.
- Persistencia historica de KPI.
- Flujo formal de aprobacion, publicacion y cambios controlados.
- Autenticacion, roles, auditoria y exportaciones institucionales.

## Tecnologias reales

| Capa | Tecnologia |
|---|---|
| Backend | Node.js, Express, CommonJS |
| Base de datos | MySQL, `mysql2/promise` |
| Frontend | React, Vite |
| Pruebas | `node:test` |
| Documentacion | Markdown |

## Estructura del repositorio

```text
.
|-- backend_node/              # API Express, servicios de generacion y pruebas
|-- database/                  # Esquema SQL y ajustes de base de datos
|-- frontend/                  # Interfaz React/Vite
|-- docs/                      # Documentacion academica y tecnica
|   |-- sdd/
|   |-- ejecucion/
|   |-- seguimiento_control/
|   |-- referencias/
|   |-- inicio/
|   |-- cierre/
|   `-- Otros/
`-- start_node.bat
```

## Modulos principales

| Modulo | Archivo principal | Estado |
|---|---|---|
| API backend | `backend_node/server.js` | CRUD y endpoint de generacion. |
| Orquestador | `backend_node/GeneratorService.js` | Conecta datos MySQL con el motor CSP. |
| Motor CSP | `backend_node/src/services/CSPMotor.js` | Backtracking con restricciones y heuristicas. |
| Motor Anti-Cruces HU03 | `backend_node/src/services/motorAntiCruces.js` | Validacion de cruces, advertencias y metricas. |
| Pruebas HU03 | `backend_node/tests/motorAntiCruces.test.js` | Pruebas unitarias con `node:test`. |
| Frontend | `frontend/src/` | Gestion y visualizacion base. |

## Documentacion principal

- [Indice documental](docs/README.md)
- [Vision general](docs/01_vision_general.md)
- [Mapa del proceso academico](docs/02_mapa_proceso_academico.md)
- [Requerimientos](docs/03_requerimientos.md)
- [Supuestos y restricciones](docs/04_supuestos_y_restricciones.md)
- [SDD](docs/sdd/README.md)
- [Ejecucion y evidencias](docs/ejecucion/README.md)
- [Seguimiento y control](docs/seguimiento_control/README.md)
- [Investigacion base](docs/referencias/01_investigacion_base.md)

## Estado del proyecto

El repositorio corresponde a un prototipo academico. Ya existen componentes funcionales de backend, frontend, base de datos, motor CSP y motor anti-cruces. Varias capacidades integrales se documentan como propuestas futuras y no deben presentarse como implementadas hasta contar con codigo, pruebas y evidencia.

## Ejecucion del backend

```bash
cd backend_node
npm install
node init_db.js
node seed_db.js
node server.js
```

Backend por defecto:

```text
http://localhost:3000
```

## Ejecucion del frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend por defecto:

```text
http://localhost:5173
```

## Pruebas disponibles

Pruebas unitarias actuales de HU03:

```bash
cd backend_node
npm.cmd test
```

No existe coverage formal configurado actualmente.
