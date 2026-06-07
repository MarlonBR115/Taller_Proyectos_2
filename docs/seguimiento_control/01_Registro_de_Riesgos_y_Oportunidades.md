# Registro de Riesgos y Oportunidades

## Datos generales

| Campo | Detalle |
|---|---|
| Proyecto | Sistema de Generacion Optima de Horarios Academicos en Entornos de Curriculo Flexible |
| Curso | Taller de Proyectos 2 |
| Sprint | Sprint 2 |
| Tarea Jira | A004-03: Gestion de Riesgos |
| Responsable | Responsable de Documentacion y Calidad, con apoyo de Backend y Scrum Master |
| Fecha de actualizacion | 17/05/2026 |
| Estado | Actualizado para revision academica |

## Objetivo del documento

Identificar, categorizar y documentar los riesgos que pueden afectar la viabilidad tecnica, operativa y organizacional del proyecto de programacion optima de horarios academicos. El registro tambien incluye oportunidades de mejora relacionadas con el motor CSP, el Motor Anti-Cruces HU03, la base de datos MySQL, la trazabilidad SDD, las pruebas automatizadas y las metricas de calidad del horario.

Este documento se centra en el alcance real del prototipo: generacion y validacion de horarios academicos considerando cursos, docentes, aulas, periodos, grupos o secciones, disponibilidad, restricciones duras, restricciones blandas, cruces y metricas. No presenta el sistema como una solucion completa de matricula de estudiantes.

## Criterios de evaluacion de riesgos

- **Probabilidad:** posibilidad de ocurrencia del riesgo durante el desarrollo, pruebas o presentacion del prototipo.
- **Impacto:** efecto esperado sobre la calidad, cronograma, demostracion, alcance o confiabilidad del sistema.
- **Severidad:** combinacion cualitativa entre probabilidad e impacto.
- **Estado del riesgo:** situacion actual del riesgo dentro del proyecto.

## Escala de probabilidad

| Nivel | Descripcion |
|---|---|
| Baja | Es poco probable que ocurra si se mantienen los controles actuales. |
| Media | Puede ocurrir si no se realiza seguimiento o validacion adicional. |
| Alta | Es probable que ocurra o ya existen indicios en el repositorio. |

## Escala de impacto

| Nivel | Descripcion |
|---|---|
| Bajo | Afecta parcialmente una actividad, sin comprometer el prototipo. |
| Medio | Afecta una funcionalidad o evidencia importante del proyecto. |
| Alto | Puede comprometer la generacion de horarios, la demostracion o la evaluacion academica. |

## Matriz de severidad

| Probabilidad / Impacto | Bajo | Medio | Alto |
|---|---|---|---|
| Baja | Baja | Media | Media |
| Media | Media | Alta | Alta |
| Alta | Media | Alta | Critica |

## Registro de riesgos tecnicos

| Codigo | Categoria | Riesgo | Descripcion | Probabilidad | Impacto | Severidad | Mitigacion | Contingencia | Responsable sugerido | Evidencia relacionada | Estado |
|---|---|---|---|---|---|---|---|---|---|---|---|
| RT-01 | Tecnico / Integracion | Integracion debil o incorrecta entre `GeneratorService` y `motorAntiCruces`. | El servicio `GeneratorService` puede no adaptar correctamente los datos generados al contrato esperado por `motorAntiCruces`. El motor HU03 espera campos como `docenteId`, `aulaId`, `grupoId`, `dia`, `horaInicio` y `horaFin`, mientras que la generacion puede trabajar con nombres diferentes o formatos provenientes de MySQL. | Alta | Alto | Critica | Estandarizar el contrato de datos entre `GeneratorService` y `motorAntiCruces`, agregando un mapeo claro de campos antes de validar. | Mantener la validacion HU03 como modulo independiente probado y documentar temporalmente la limitacion de integracion hasta que se ajuste el flujo completo. | Responsable de Backend | `backend_node/GeneratorService.js`; `backend_node/src/services/motorAntiCruces.js`; `backend_node/tests/motorAntiCruces.test.js` | Activo |
| RT-02 | Tecnico / Datos | Inconsistencias entre `schema.sql`, backend y frontend. | Existen campos usados por backend o frontend que no estan completamente alineados con el esquema SQL, como `email` en `teachers`, `code` en `courses`, `room_type/type` y fechas de periodos. | Alta | Alto | Critica | Realizar una revision controlada del contrato de datos entre base de datos, API y frontend antes de ampliar funcionalidades. | Documentar temporalmente las diferencias detectadas y limitar las pruebas a datos seed conocidos hasta corregir el modelo. | Responsable de Backend y Responsable de Frontend | `database/schema.sql`; `backend_node/server.js`; `frontend/src/App.jsx` | Activo |
| RT-03 | Tecnico / Calidad | `CSPMotor` sin pruebas unitarias directas ni pruebas de carga suficientes. | El motor CSP ya contiene logica de backtracking, heuristicas MRV/LCV y restricciones duras, pero no se evidencia una cobertura especifica y completa para validar escenarios complejos. | Media | Alto | Alta | Crear pruebas unitarias para restricciones, disponibilidad, capacidad, tipo de aula, MRV, LCV y casos de generacion con diferentes volumenes. | Reducir el tamano del dataset en demostraciones y documentar el limite del prototipo hasta contar con pruebas de carga. | Responsable de Backend | `backend_node/src/services/CSPMotor.js`; `docs/ejecucion/a003-02-heuristicas-reglas.md` | Activo |
| RT-04 | Tecnico / Metricas | KPI y metricas no persistidas. | El sistema ya calcula algunas metricas en memoria, como tiempo de validacion, total de conflictos, bloques validos y metricas del CSP, pero no existe una persistencia historica de corridas. | Media | Medio | Alta | Disenar posteriormente tablas como `schedule_generation_runs`, `schedule_conflicts` o `kpi_snapshots`. | Registrar resultados en documentacion tecnica mientras no exista persistencia en base de datos. | Responsable de Backend y Responsable de Documentacion y Calidad | `docs/ejecucion/metricas-hu03.md`; `backend_node/src/services/motorAntiCruces.js`; `backend_node/src/services/CSPMotor.js` | Activo |
| RT-05 | Tecnico / API | API con validaciones limitadas. | Las rutas actuales usan `try/catch`, pero no existe una capa formal de validacion de campos, tipos, rangos, enums o claves foraneas antes de procesar datos. | Media | Alto | Alta | Agregar validadores en rutas criticas relacionadas con cursos, docentes, aulas, grupos y generacion de horarios. | Trabajar con datos controlados en seed y documentar restricciones manuales mientras se implementan validaciones. | Responsable de Backend | `backend_node/server.js` | Activo |

## Registro de riesgos operativos u organizacionales

| Codigo | Categoria | Riesgo | Descripcion | Probabilidad | Impacto | Severidad | Mitigacion | Contingencia | Responsable sugerido | Evidencia relacionada | Estado |
|---|---|---|---|---|---|---|---|---|---|---|---|
| RO-01 | Operativo / Datos | Disponibilidad incompleta de datos reales de docentes y aulas. | El equipo puede no contar a tiempo con informacion real de disponibilidad docente, aulas, capacidad, restricciones institucionales o carga academica. | Alta | Alto | Critica | Usar datos simulados realistas y documentar claramente los supuestos. | Presentar el prototipo como una solucion validada con datos de prueba y dejar la incorporacion de datos reales como mejora futura. | Product Owner y Responsable de Backend | `database/schema.sql`; `docs/Supuestos y restricciones.md` | Activo |
| RO-02 | Organizacional / Documentacion | Documentacion desactualizada o desalineada con el estado real. | Algunos documentos mencionan Sprint 0, matricula, JWT, PDF, coverage u otros elementos que no estan implementados actualmente. | Alta | Medio | Alta | Actualizar progresivamente la documentacion principal para que refleje el estado real del sistema. | Indicar en los informes de sprint que elementos corresponden a alcance futuro y cuales estan implementados. | Responsable de Documentacion y Calidad | `README.md`; `docs/ejecucion/REQUERIMENTOS.md`; `docs/sdd/specs.md` | Activo |
| RO-03 | Operativo / Entorno | Dependencia del entorno local MySQL/XAMPP. | El sistema depende de una configuracion local de base de datos. Si el entorno no esta preparado, puede fallar la demostracion o ejecucion del proyecto. | Media | Alto | Alta | Documentar pasos de instalacion, variables de entorno y carga inicial de base de datos. | Mantener evidencias de ejecucion, capturas y pruebas previas en caso de fallo del entorno local. | Scrum Master y Responsable de Backend | `backend_node/init_db.js`; `backend_node/seed_db.js`; `database/schema.sql` | Activo |

## Registro de oportunidades de mejora

| Codigo | Oportunidad | Descripcion | Beneficio esperado | Accion sugerida | Responsable sugerido | Evidencia relacionada | Prioridad |
|---|---|---|---|---|---|---|---|
| OP-01 | Usar metricas HU03 como base para KPI de calidad del horario. | El Motor Anti-Cruces ya entrega metricas como total de conflictos, conflictos por tipo, bloques invalidos, advertencias y tiempo de validacion. | Permite evaluar la calidad de un horario generado con indicadores verificables. | Incorporar estas metricas en reportes de validacion y documentacion de seguimiento. | Responsable de Backend y Responsable de Documentacion y Calidad | `docs/ejecucion/metricas-hu03.md`; `backend_node/src/services/motorAntiCruces.js` | Alta |
| OP-02 | Persistir metricas de generacion y validacion para comparar corridas. | Actualmente las metricas existen en memoria o como salida de servicios, pero no se almacenan historicamente. | Facilita comparar generaciones, evidenciar mejoras y sustentar decisiones tecnicas. | Disenar una estructura futura de persistencia para corridas, conflictos y KPI. | Responsable de Backend | `backend_node/src/services/CSPMotor.js`; `docs/ejecucion/metricas-hu03.md` | Alta |
| OP-03 | Crear pruebas de integracion para `/api/schedule/generate`. | La generacion de horarios combina base de datos, `GeneratorService`, `CSPMotor` y validacion anti-cruces. | Reduce el riesgo de fallos entre componentes que individualmente parecen correctos. | Agregar pruebas de integracion controladas con datos seed y verificar respuesta, horarios insertados y metricas. | Responsable de Backend | `backend_node/server.js`; `backend_node/GeneratorService.js` | Media |
| OP-04 | Normalizar contratos de datos entre base de datos, backend y frontend. | La alineacion de nombres y tipos de campos evitaria errores en CRUD, generacion y visualizacion. | Mejora mantenibilidad, reduce errores de integracion y facilita pruebas. | Definir un contrato documentado para docentes, cursos, aulas, grupos, periodos y horarios. | Responsable de Backend y Responsable de Frontend | `database/schema.sql`; `backend_node/server.js`; `frontend/src/App.jsx` | Alta |
| OP-05 | Mejorar la trazabilidad entre Jira, GitHub, SDD, pruebas y metricas. | El repositorio ya cuenta con documentacion SDD, evidencias HU03 y registros de seguimiento. | Facilita revision academica, auditoria tecnica y continuidad del equipo. | Enlazar historias, riesgos, pruebas, metricas y documentos SDD en entregables futuros. | Responsable de Documentacion y Calidad | `docs/sdd/specs.md`; `docs/ejecucion/evidencia-tdd-hu03.md`; `docs/seguimiento_control/README.md` | Media |

## Relacion de riesgos con SDD, pruebas y metricas

| Elemento | Relacion con la gestion de riesgos | Evidencia |
|---|---|---|
| SDD | Define reglas de gobernanza, criterios de aceptacion y trazabilidad tecnica para evitar prometer funcionalidades no implementadas. | `docs/sdd/constitution.md`; `docs/sdd/specs.md`; `docs/sdd/agents.md` |
| Pruebas HU03 | Reducen el riesgo de regresion en el Motor Anti-Cruces y demuestran validacion de restricciones duras y advertencias operativas. | `backend_node/tests/motorAntiCruces.test.js`; `docs/ejecucion/evidencia-tdd-hu03.md` |
| Metricas HU03 | Permiten medir calidad de validacion: conflictos, bloques invalidos, advertencias y tiempo de validacion. | `docs/ejecucion/metricas-hu03.md`; `backend_node/src/services/motorAntiCruces.js` |
| CSPMotor | Es el componente central de generacion de horarios; sus riesgos se relacionan con rendimiento, correctitud y ausencia de pruebas directas suficientes. | `backend_node/src/services/CSPMotor.js`; `docs/ejecucion/a003-02-heuristicas-reglas.md` |
| Base de datos MySQL | Sostiene cursos, docentes, aulas, grupos, periodos y horarios; cualquier desalineacion afecta el flujo completo. | `database/schema.sql`; `backend_node/server.js` |

No existe actualmente una medicion formal de coverage configurada en el proyecto. Por ello, este registro considera como evidencia disponible las pruebas unitarias existentes y las metricas calculadas por los servicios, sin declarar porcentajes de cobertura no medidos.

## Plan de seguimiento

| Actividad | Frecuencia sugerida | Responsable | Resultado esperado |
|---|---|---|---|
| Revisar estado de riesgos activos | Al cierre de cada sprint | Scrum Master | Riesgos actualizados con estado vigente. |
| Validar riesgos tecnicos contra el repositorio | Antes de cada entrega academica | Responsable de Backend | Riesgos tecnicos confirmados, mitigados o replanificados. |
| Revisar coherencia documental | Antes de cada revision docente | Responsable de Documentacion y Calidad | Documentacion alineada con funcionalidades reales. |
| Registrar evidencia de pruebas y metricas | Cuando se modifique el motor de horarios o HU03 | Responsable de Backend y Calidad | Evidencias reproducibles para TDD y KPI. |
| Evaluar oportunidades de mejora | En planificacion de sprint | Product Owner y equipo tecnico | Mejoras priorizadas segun valor academico y riesgo reducido. |

## Conclusion

El proyecto cuenta con una base funcional para programar horarios academicos mediante Node.js, Express, MySQL, React y servicios especializados como `CSPMotor` y el Motor Anti-Cruces HU03. Sin embargo, la viabilidad del prototipo depende de controlar riesgos tecnicos relacionados con integracion, contratos de datos, pruebas del motor CSP, validacion de API y persistencia de metricas.

Desde el punto de vista operativo, los principales riesgos se concentran en la disponibilidad de datos reales, la dependencia del entorno local y la necesidad de mantener la documentacion alineada con el estado real del sistema. Las oportunidades identificadas permiten fortalecer la trazabilidad academica, mejorar la evidencia empirica y preparar el proyecto para mediciones de calidad de horarios mas completas en siguientes iteraciones.
