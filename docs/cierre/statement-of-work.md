# Declaración de Trabajo — Statement of Work (SOW)

**Versión:** 1.0
**Fecha:** 24/06/2026
**Tipo:** Documento de Cierre de Contrato / Prototipo Académico
**Clasificación:** Documentación Técnica — Verificación de Entregables

---

## 1. Información General

- **Nombre del Proyecto:** Sistema de Generación Óptima de Horarios Académicos en Entornos de Currículo Flexible
- **Cliente / Institución:** Universidad — Taller de Proyectos 2, Ingeniería de Sistemas e Informática
- **Equipo de Desarrollo:** Marlon Bonifacio Rojas (PO), Alejandro Espiritu Campos (SM), Fabian Enrique Guzman Choque (Frontend), Luis Enrique Quispe Campos (Backend), Rafael Fernandez Duran (Documentación y Calidad)
- **Período de Ejecución:** 26 de marzo de 2026 — 24 de junio de 2026
- **Duración Total:** 13 semanas
- **Presupuesto Estimado:** S/ 12,876 (Doce mil ochocientos setenta y seis soles peruanos)

---

## 2. Alcance del Trabajo

El presente Statement of Work (SOW) describe los entregables, criterios de aceptación y estado de finalización del prototipo académico. Su propósito es verificar que el trabajo contratado ha sido completado conforme a los requisitos definidos.

### 2.1 Entregables y Estado de Finalización

| Entregable | Módulo / Ubicación | Estado | Criterio de Verificación |
|---|---|---|---|
| API REST Backend | `backend_node/server.js` | COMPLETADO | Endpoints CRUD funcionales para teachers, courses, rooms, groups, terms |
| Base de Datos MySQL | `database/schema.sql`, `database/alter.sql` | COMPLETADO | 6 tablas relacionales con claves foráneas, consultas parametrizadas |
| Motor CSP — Backtracking | `backend_node/src/services/CSPMotor.js` | COMPLETADO | Generación de asignaciones con MRV y LCV, restricciones duras y blandas |
| Validador Anti-Cruces (HU03) | `backend_node/src/services/motorAntiCruces.js` | COMPLETADO | Detección de cruces de docente, aula y grupo; advertencias de transición |
| Pruebas Unitarias HU03 | `backend_node/tests/motorAntiCruces.test.js` | COMPLETADO | 23 pruebas, 100% aprobadas (23 pass, 0 fail) |
| Pruebas de Integración API | `backend_node/tests/api.test.js` | COMPLETADO | 36 pruebas, 100% aprobadas (36 pass, 0 fail) |
| Pruebas E2E (Playwright) | `e2e/` | COMPLETADO | Flujos happy-path, golden-path, unhappy-path, simulación |
| Frontend React/Vite | `frontend/src/` | COMPLETADO | CrudView genérico, ScheduleGrid, Sidebar con navegación |
| Documentación SDD | `docs/sdd/` | COMPLETADO | Arquitectura, BD, API, componentes, constitution, agents, specs, diseño SI |
| Registro de Riesgos | `docs/seguimiento_control/` | COMPLETADO | 5 riesgos técnicos, 3 operativos, 5 oportunidades documentadas |
| KPIs y Métricas | `docs/seguimiento_control/02_KPI_y_Metricas.md` | COMPLETADO | 14 KPIs definidos, implementados en memoria |
| Trazabilidad Jira-GitHub | `docs/seguimiento_control/03_Trazabilidad_Jira_GitHub.md` | COMPLETADO | Vinculación de tareas, archivos, evidencias y estado |
| Informe de Lecciones Aprendidas | `docs/cierre/lecciones-aprendidas.md` | COMPLETADO | Documento de cierre con retrospectiva completa |

---

## 3. Verificación de Requisitos Funcionales

La siguiente tabla verifica el cumplimiento de cada requisito funcional (RF) definido en la documentación del proyecto:

| Código | Requisito | Módulo | Estado | Evidencia |
|---|---|---|---|---|
| RF-01 | Gestionar cursos con datos base y horas semanales | `server.js` + courses CRUD | COMPLETADO | Frontend CrudView(endpoint="courses") |
| RF-02 | Registrar docentes con disponibilidad simplificada | `server.js` + teachers CRUD | COMPLETADO | Frontend CrudView(endpoint="teachers") |
| RF-03 | Registrar aulas con capacidad y tipo | rooms CRUD | COMPLETADO | Frontend CrudView(endpoint="rooms") |
| RF-04 | Gestionar periodos y grupos/secciones | academic_terms + student_groups CRUD | COMPLETADO | Frontend CrudView(endpoint="groups", "terms") |
| RF-05 | Generar asignaciones de horario mediante motor CSP | CSPMotor.js + GeneratorService.js | COMPLETADO | POST /api/schedule/generate |
| RF-06 | Detectar conflictos de docente, aula y grupo | motorAntiCruces.js (HU03) | COMPLETADO | 23 tests unitarios, validación post-generación |
| RF-07 | Reportar advertencias no bloqueantes | motorAntiCruces.js (TRANSICION_INSUFICIENTE) | COMPLETADO | Advertencias de transición implementadas |
| RF-08 | Calcular métricas básicas de generación y validación | HU03 metrics + CSPMotor.metrics | COMPLETADO | Métricas en memoria por ejecución |
| RF-09 | Documentar riesgos, evidencia y trazabilidad SDD | docs/sdd/, docs/seguimiento_control/ | COMPLETADO | Documentación completa del proyecto |
| RF-10 | Priorización de restricciones (pesos configurados) | CSPMotor — LCV scoring | **PENDIENTE** | Mejora futura: pesos fijos actualmente |

### 3.1 Requisitos Propuestos (No Implementados)

Los siguientes requisitos fueron identificados como propuestas para versiones futuras y no forman parte del alcance del prototipo actual:

- RP-01: Registrar carreras, planes, ciclos, asignaturas y prerrequisitos
- RP-02: Estimar demanda esperada por curso y periodo
- RP-03: Definir vacantes, modalidad, tipo de sesión por sección
- RP-04: Considerar especialidad, carga máxima y preferencias del docente
- RP-05: Persistir métricas por ejecución de generación/validación
- RP-06: Vincular Jira, ramas, PRs, pruebas, métricas y riesgos
- RP-07: Registrar aprobaciones, excepciones y cambios controlados
- RP-08: Asignación de estudiantes a secciones

---

## 4. Verificación de Pruebas y Calidad

### 4.1 Resultados de Pruebas

| Tipo de Prueba | Cantidad | Aprobadas | Fallidas | Herramienta |
|---|---|---|---|---|
| Pruebas unitarias HU03 | 23 | 23 (100%) | 0 | `node:test` |
| Pruebas de integración API | 36 | 36 (100%) | 0 | Supertest + `node:test` |
| Pruebas E2E (Playwright) | — | — | — | Playwright |

### 4.2 Cobertura de Pruebas

No se configuró una herramienta de cobertura formal (c8/Istanbul). La cobertura porcentual queda como mejora pendiente para futuras iteraciones. Se recomienda configurarla en el Sprint 0 de proyectos similares.

### 4.3 Definición de Done

Cada historia de usuario se consideró completada cuando cumplió los siguientes criterios (basados en la Constitution SDD):

- El alcance está descrito en una especificación o documento asociado.
- La implementación existe en el módulo correspondiente.
- Existen pruebas unitarias o evidencia verificable para los criterios principales.
- Los criterios de aceptación están redactados en formato Dado/Cuando/Entonces cuando aplica.
- La documentación indica limitaciones actuales y mejoras futuras.
- Los comandos de validación relevantes fueron ejecutados o se documenta por qué no pudieron ejecutarse.

---

## 5. Entregables de Documentación

| Documento | Ubicación | Propósito | Estado |
|---|---|---|---|
| Visión General | docs/01_vision_general.md | Visión vigente del proyecto | COMPLETADO |
| Mapa del Proceso Académico | docs/02_mapa_proceso_academico.md | Mapa integral del proceso | COMPLETADO |
| Requerimientos | docs/03_requerimientos.md | Requerimientos funcionales y no funcionales | COMPLETADO |
| Supuestos y Restricciones | docs/04_supuestos_y_restricciones.md | Supuestos académicos y técnicos | COMPLETADO |
| SDD — Software Design Document | docs/sdd/sdd.md | Arquitectura, BD, API, CSP, validador | COMPLETADO |
| SDD — Constitution | docs/sdd/constitution.md | Reglas de gobernanza y Definition of Done | COMPLETADO |
| SDD — Agents | docs/sdd/agents.md | Roles y responsabilidades técnicas | COMPLETADO |
| SDD — Specs | docs/sdd/specs.md | Especificaciones verificables | COMPLETADO |
| SDD — Diseño de SI | docs/sdd/diseno-sistema-informacion.md | Diseño ampliado del sistema de información | COMPLETADO |
| Registro de Riesgos | docs/seguimiento_control/01_Registro_de_Riesgos_y_Oportunidades.md | Riesgos técnicos y operativos | COMPLETADO |
| KPIs y Métricas | docs/seguimiento_control/02_KPI_y_Metricas.md | 14 KPIs del sistema | COMPLETADO |
| Trazabilidad Jira/GitHub | docs/seguimiento_control/03_Trazabilidad_Jira_GitHub.md | Vinculación tareas-archivos-evidencias | COMPLETADO |
| Informe Sprint 1 | docs/seguimiento_control/03_Informe_Estado_Sprint_1.md | Estado al cierre del Sprint 1 | COMPLETADO |
| Minuta Sprint 1 | docs/seguimiento_control/04_Minuta_Reunion_Sprint_1.md | Acuerdos y decisiones del Sprint 1 | COMPLETADO |
| HU03 — Motor Anti-Cruces | docs/ejecucion/hu03-motor-anti-cruces.md | Especificación técnica HU03 | COMPLETADO |
| Evidencia TDD HU03 | docs/ejecucion/evidencia-tdd-hu03.md | Pruebas unitarias HU03 | COMPLETADO |
| Métricas HU03 | docs/ejecucion/metricas-hu03.md | Métricas del validador | COMPLETADO |
| Heurísticas CSP | docs/ejecucion/a003-02-heuristicas-reglas.md | Reglas y heurísticas del motor | COMPLETADO |
| Pruebas de Integración API | docs/ejecucion/tp2ucp-41-tests-integracion-api.md | Especificación y resultados | COMPLETADO |
| Declaración del Equipo | docs/declaracion-equipo.md | Roles y miembros del equipo | COMPLETADO |
| Presupuesto | docs/Presupuesto del proyecto.md | Estimación de costos (S/ 12,876) | COMPLETADO |
| Informe Lecciones Aprendidas | docs/cierre/lecciones-aprendidas.md | Retrospectiva final del proyecto | COMPLETADO |
| Declaración de Trabajo (SOW) | docs/cierre/statement-of-work.md | Verificación de entregables | COMPLETADO |

---

## 6. Impedimentos y Riesgos

### 6.1 Impedimentos Registrados

| ID | Descripción | Prioridad | Fecha | Estado |
|---|---|---|---|---|
| IMP-001 | CORS bloqueando peticiones (Vite:5173 → Express:3000) | Alta | 28/04/2026 | RESUELTO — Librería cors instalada |
| IMP-002 | Ambigüedad en estructura BD (cardinalidad rooms-schedules) | Media | 02/05/2026 | RESUELTO — Reunión y validación de schema.sql |
| IMP-003 | Visualización ScheduleGrid sin datos reales | Media | 05/05/2026 | ABIERTO — JSON estático temporal |

### 6.2 Riesgos Activos al Cierre

| Código | Riesgo | Severidad | Mitigación |
|---|---|---|---|
| RT-01 | Integración débil GeneratorService ↔ motorAntiCruces | Crítica | Pipeline de validación post-generación implementado |
| RT-02 | Inconsistencias schema.sql, backend y frontend | Crítica | Contratos JSON definidos, revisión manual |
| RT-03 | CSPMotor sin pruebas unitarias directas | Alta | Pruebas de integración vía GeneratorService |
| RT-04 | KPIs solo en memoria, sin persistencia | Alta | Pendiente para mejora futura |
| RT-05 | API con validación de entrada limitada | Alta | Consultas parametrizadas (mysql2) como medida base |
| RO-01 | Datos reales de disponibilidad inaccesibles | Crítica | Validación con seed_db.js y datos simulados |
| RO-02 | Documentación desactualizada | Alta | SDD y documentación actualizada al cierre |
| RO-03 | Dependencia de entorno local MySQL/XAMPP | Alta | Documentación de instalación incluida |

---

## 7. Criterios de Aceptación

El prototipo se considera aceptado cuando se cumplen los siguientes criterios:

| Criterio | Cumplimiento | Verificación |
|---|---|---|
| El backend expone endpoints CRUD funcionales | SÍ | Pruebas de integración API (36/36 pass) |
| El motor CSP genera asignaciones sin cruces | SÍ | 23 pruebas unitarias HU03 pass |
| El validador anti-cruces detecta conflictos | SÍ | Tests específicos por tipo de conflicto |
| La base de datos almacena y relaciona todas las entidades | SÍ | schema.sql + alter.sql verificados |
| El frontend permite gestionar entidades y visualizar horarios | SÍ | CrudView funcional; ScheduleGrid con datos estáticos |
| La documentación cubre arquitectura, requisitos y decisiones | SÍ | 22 documentos en docs/ |
| Las pruebas unitarias y de integración pasan al 100% | SÍ | 23 unit + 36 integration = 59/59 pass |
| El registro de riesgos y oportunidades está documentado | SÍ | 8 riesgos + 5 oportunidades registrados |
| Las lecciones aprendidas están consolidadas | SÍ | Informe de Lecciones Aprendidas completado |

---

## 8. Declaración de Cierre

Por medio de la presente, se declara que el trabajo descrito en este Statement of Work ha sido completado conforme a los requisitos definidos en la documentación del proyecto. Los entregables han sido verificados y aceptados, cumpliendo con los criterios de calidad y alcance establecidos.

Quedan identificados como trabajo futuro o fuera del alcance del prototipo los requisitos propuestos (RP-01 a RP-08) y las mejoras documentadas en la sección 8.2 del Informe de Lecciones Aprendidas.

| Rol | Nombre | Firma |
|---|---|---|
| Product Owner | Marlon Bonifacio Rojas | ______________________ |
| Scrum Master | Alejandro Espiritu Campos | ______________________ |
| Frontend Lead | Fabian Enrique Guzman Choque | ______________________ |
| Backend Lead | Luis Enrique Quispe Campos | ______________________ |
| Documentación y Calidad | Rafael Fernandez Duran | ______________________ |

---

— _Fin de la Declaración de Trabajo_ —
