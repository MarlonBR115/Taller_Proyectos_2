# Registro de Riesgos y Oportunidades

## Datos generales

| Campo | Detalle |
|---|---|
| Proyecto | Sistema de Generacion Optima de Horarios Academicos en Entornos de Curriculo Flexible |
| Curso | Taller de Proyectos 2 |
| Sprint | Sprint 2 |
| Tarea Jira | A004-03: Gestion de Riesgos |
| Responsable | Responsable de Documentacion y Calidad, con apoyo de Backend y Scrum Master |
| Fecha de actualizacion | 28/05/2026 |
| Estado | Actualizado para revision academica |

## Objetivo del documento

Identificar, categorizar y documentar riesgos que pueden afectar la viabilidad tecnica, operativa y organizacional del prototipo de programacion optima de horarios academicos. El registro tambien incluye oportunidades de mejora relacionadas con el motor CSP, HU03, MySQL, SDD, pruebas y metricas.

## Criterios de evaluacion

| Criterio | Descripcion |
|---|---|
| Probabilidad | Posibilidad de ocurrencia: Baja, Media o Alta. |
| Impacto | Efecto sobre calidad, cronograma, demostracion o alcance: Bajo, Medio o Alto. |
| Severidad | Combinacion cualitativa de probabilidad e impacto: Baja, Media, Alta o Critica. |
| Estado | Situacion actual del riesgo: Activo, En seguimiento, Mitigado o Cerrado. |

## Matriz de severidad

| Probabilidad / Impacto | Bajo | Medio | Alto |
|---|---|---|---|
| Baja | Baja | Media | Media |
| Media | Media | Alta | Alta |
| Alta | Media | Alta | Critica |

## Registro de riesgos tecnicos

| Codigo | Categoria | Riesgo | Descripcion | Probabilidad | Impacto | Severidad | Mitigacion | Contingencia | Responsable sugerido | Evidencia relacionada | Estado |
|---|---|---|---|---|---|---|---|---|---|---|---|
| RT-01 | Tecnico / Integracion | Integracion debil entre `GeneratorService` y HU03. | `GeneratorService` puede no adaptar correctamente datos generados al contrato esperado por `motorAntiCruces` (`docenteId`, `aulaId`, `grupoId`, `dia`, `horaInicio`, `horaFin`). | Alta | Alto | Critica | Estandarizar el contrato de datos y agregar mapeo explicito antes de validar. | Mantener HU03 como modulo independiente probado y documentar temporalmente la limitacion de integracion. | Backend | `backend_node/GeneratorService.js`; `backend_node/src/services/motorAntiCruces.js`; `backend_node/tests/motorAntiCruces.test.js` | Activo |
| RT-02 | Tecnico / Datos | Inconsistencias entre `schema.sql`, backend y frontend. | Campos como `email`, `code`, `room_type/type` y fechas de periodos no estan completamente alineados. | Alta | Alto | Critica | Revisar contrato de datos entre base de datos, API y frontend antes de ampliar funcionalidades. | Limitar pruebas a datos seed conocidos y documentar diferencias hasta corregir modelo. | Backend y Frontend | `database/schema.sql`; `backend_node/server.js`; `frontend/src/App.jsx` | Activo |
| RT-03 | Tecnico / Calidad | `CSPMotor` sin pruebas unitarias directas suficientes. | El motor tiene backtracking, MRV/LCV y restricciones, pero falta bateria de pruebas especifica para escenarios complejos. | Media | Alto | Alta | Crear pruebas para restricciones, disponibilidad, capacidad, tipo de aula, MRV, LCV y volumenes variados. | Reducir datasets de demostracion y documentar limites del prototipo. | Backend | `backend_node/src/services/CSPMotor.js`; `docs/ejecucion/a003-02-heuristicas-reglas.md` | Activo |
| RT-04 | Tecnico / Metricas | KPI y metricas no persistidas. | Se calculan metricas en memoria, pero no existe historico de corridas. | Media | Medio | Alta | Disenar tablas futuras como `schedule_generation_runs`, `schedule_conflicts` o `kpi_snapshots`. | Registrar resultados en documentacion tecnica mientras no exista persistencia. | Backend y Calidad | `docs/ejecucion/metricas-hu03.md`; `backend_node/src/services/motorAntiCruces.js`; `backend_node/src/services/CSPMotor.js` | Activo |
| RT-05 | Tecnico / API | Validaciones limitadas en rutas. | Las rutas usan `try/catch`, pero no existe una capa formal de validacion de campos, tipos, rangos, enums o claves foraneas. | Media | Alto | Alta | Agregar validadores en rutas criticas de cursos, docentes, aulas, grupos y generacion. | Trabajar con datos controlados en seed y documentar restricciones manuales. | Backend | `backend_node/server.js` | Activo |

## Registro de riesgos operativos u organizacionales

| Codigo | Categoria | Riesgo | Descripcion | Probabilidad | Impacto | Severidad | Mitigacion | Contingencia | Responsable sugerido | Evidencia relacionada | Estado |
|---|---|---|---|---|---|---|---|---|---|---|---|
| RO-01 | Operativo / Datos | Disponibilidad incompleta de datos reales. | El equipo puede no contar a tiempo con disponibilidad docente, aulas, capacidad, restricciones institucionales o carga academica reales. | Alta | Alto | Critica | Usar datos simulados realistas y documentar supuestos. | Presentar el prototipo como validado con datos de prueba y dejar datos reales como mejora futura. | Product Owner y Backend | `database/schema.sql`; `docs/04_supuestos_y_restricciones.md` | Activo |
| RO-02 | Organizacional / Documentacion | Documentacion desactualizada o desalineada. | Algunos documentos pueden mencionar Sprint 0, matricula, JWT, PDF, coverage u otros elementos no implementados. | Alta | Medio | Alta | Actualizar progresivamente documentacion principal para reflejar el estado real. | Indicar en informes de sprint que elementos son futuros y cuales estan implementados. | Documentacion y Calidad | `README.md`; `docs/ejecucion/REQUERIMENTOS.md`; `docs/sdd/specs.md` | En seguimiento |
| RO-03 | Operativo / Entorno | Dependencia del entorno local MySQL/XAMPP. | Si la base de datos local no esta preparada, puede fallar la demostracion o ejecucion. | Media | Alto | Alta | Documentar instalacion, variables de entorno y carga inicial de BD. | Mantener evidencias de ejecucion, capturas y pruebas previas. | Scrum Master y Backend | `backend_node/init_db.js`; `backend_node/seed_db.js`; `database/schema.sql` | Activo |

## Registro de oportunidades de mejora

| Codigo | Oportunidad | Descripcion | Beneficio esperado | Accion sugerida | Responsable sugerido | Evidencia relacionada | Prioridad |
|---|---|---|---|---|---|---|---|
| OP-01 | Usar metricas HU03 como KPI de calidad. | HU03 ya entrega conflictos, advertencias, bloques validos y tiempo de validacion. | Evaluar calidad del horario con indicadores verificables. | Incorporar metricas en reportes de seguimiento. | Backend y Calidad | `docs/ejecucion/metricas-hu03.md` | Alta |
| OP-02 | Persistir metricas de generacion y validacion. | Las metricas existen en memoria, pero no se almacenan historicamente. | Comparar corridas y demostrar evolucion del algoritmo. | Disenar persistencia futura para corridas, conflictos y KPI. | Backend | `backend_node/src/services/CSPMotor.js` | Alta |
| OP-03 | Crear pruebas de integracion para `/api/schedule/generate`. | La generacion combina BD, `GeneratorService`, `CSPMotor` y HU03. | Reducir fallos entre componentes. | Agregar pruebas con datos seed controlados. | Backend | `backend_node/server.js`; `backend_node/GeneratorService.js` | Media |
| OP-04 | Normalizar contratos de datos. | Alinear nombres y tipos entre BD, API y frontend. | Mejorar mantenibilidad y reducir errores de integracion. | Definir contrato documentado para entidades principales. | Backend y Frontend | `database/schema.sql`; `backend_node/server.js`; `frontend/src/App.jsx` | Alta |
| OP-05 | Mejorar trazabilidad Jira/GitHub/SDD/pruebas/metricas. | Ya existen SDD, evidencias HU03 y seguimiento. | Facilitar revision academica y auditoria tecnica. | Enlazar historias, riesgos, pruebas y metricas. | Documentacion y Calidad | `docs/sdd/specs.md`; `docs/ejecucion/evidencia-tdd-hu03.md` | Media |

## Relacion con SDD, pruebas y metricas

| Elemento | Relacion con riesgos | Evidencia |
|---|---|---|
| SDD | Define gobernanza, criterios de aceptacion y trazabilidad. | `docs/sdd/constitution.md`; `docs/sdd/specs.md`; `docs/sdd/agents.md` |
| Pruebas HU03 | Reducen riesgo de regresion en reglas anti-cruces. | `backend_node/tests/motorAntiCruces.test.js`; `docs/ejecucion/evidencia-tdd-hu03.md` |
| Metricas HU03 | Permiten medir conflictos, advertencias y tiempo de validacion. | `docs/ejecucion/metricas-hu03.md` |
| CSPMotor | Componente central de generacion; requiere seguimiento de rendimiento y pruebas. | `backend_node/src/services/CSPMotor.js`; `docs/ejecucion/a003-02-heuristicas-reglas.md` |

No existe coverage formal configurado. Las evidencias actuales corresponden a pruebas unitarias ejecutadas y metricas calculadas por servicios.

## Plan de seguimiento

| Actividad | Frecuencia sugerida | Responsable | Resultado esperado |
|---|---|---|---|
| Revisar riesgos activos | Cierre de cada sprint | Scrum Master | Riesgos actualizados. |
| Validar riesgos tecnicos contra repositorio | Antes de entrega academica | Backend | Riesgos confirmados, mitigados o replanificados. |
| Revisar coherencia documental | Antes de revision docente | Documentacion y Calidad | Documentacion alineada con estado real. |
| Registrar evidencia de pruebas y metricas | Cuando cambie motor o HU03 | Backend y Calidad | Evidencias reproducibles. |

## Conclusion

El proyecto cuenta con base funcional para programar horarios academicos, pero debe controlar riesgos de integracion, contratos de datos, pruebas del motor CSP, validacion de API y persistencia de metricas. La gestion continua de riesgos permite sostener una presentacion academica realista, verificable y coherente con el estado del repositorio.
