# Requerimientos Funcionales y No Funcionales

Este documento define los requerimientos del prototipo como plataforma academica semiautomatica para planificacion, generacion, validacion y medicion de horarios. Se diferencia entre capacidades actuales, propuestas y fuera del alcance inmediato.

## A. Requerimientos implementados o parcialmente implementados

| Modulo | Codigo | Requerimiento | Estado | Evidencia |
|---|---|---|---|---|
| Gestion de catalogo academico | RF-01 | Gestionar cursos con datos base y horas semanales. | Parcial | `backend_node/server.js`; `database/schema.sql` |
| Gestion de docentes | RF-02 | Registrar docentes y disponibilidad simplificada. | Parcial | `backend_node/server.js`; `teachers.availability` |
| Gestion de aulas | RF-03 | Registrar aulas con capacidad y tipo. | Parcial | `rooms` en MySQL; CRUD backend |
| Planificacion de oferta | RF-04 | Gestionar periodos y grupos/secciones asociados a cursos y docentes. | Parcial | `academic_terms`; `student_groups` |
| Generacion de horarios | RF-05 | Generar asignaciones de horario con motor CSP. | Parcial | `CSPMotor.js`; `GeneratorService.js` |
| Validacion anti-cruces | RF-06 | Detectar cruces de docente, aula y grupo. | Implementado en HU03 | `motorAntiCruces.js`; pruebas HU03 |
| Restricciones blandas | RF-07 | Reportar advertencias o preferencias no bloqueantes. | Parcial | `TRANSICION_INSUFICIENTE`; scoring CSP |
| Metricas y KPI | RF-08 | Calcular metricas basicas de validacion y generacion. | Parcial | `metricas-hu03.md`; `CSPMotor.metrics` |
| Seguimiento y trazabilidad | RF-09 | Documentar riesgos, evidencias y relacion con SDD. | Parcial | `docs/sdd`; `docs/seguimiento_control` |

## B. Requerimientos propuestos

| Modulo | Codigo | Requerimiento | Justificacion |
|---|---|---|---|
| Planificacion curricular | RP-01 | Registrar carreras, planes, ciclos, asignaturas y prerequisitos. | Permite alinear oferta con estructura academica. |
| Demanda academica | RP-02 | Estimar demanda esperada por curso y periodo. | Ayuda a abrir/cerrar secciones con evidencia. |
| Planificacion de oferta | RP-03 | Definir vacantes, modalidad y tipo de sesion por seccion. | Mejora control academico previo a horarios. |
| Asignacion docente | RP-04 | Considerar especialidad, carga maxima y preferencias docentes. | Aumenta calidad de asignacion. |
| KPI | RP-05 | Persistir metricas por corrida de generacion y validacion. | Permite comparacion historica. |
| Trazabilidad | RP-06 | Relacionar Jira, ramas, PR, pruebas, metricas y riesgos. | Fortalece auditoria academica. |
| Revision humana | RP-07 | Registrar aprobaciones, excepciones y cambios controlados. | Mantiene decision academica supervisada. |
| Student sectioning | RP-08 | Asignar estudiantes a secciones segun cupo, conflicto y prioridad. | Complementa el proceso integral, pero no es nucleo actual. |

## C. Requerimientos fuera del alcance actual

Estos elementos pueden ser valiosos en una version institucional, pero no deben presentarse como implementados:

- matricula completa de estudiantes;
- autenticacion JWT y roles institucionales;
- contrasenas cifradas y gestion de usuarios;
- exportacion PDF formal;
- integracion con sistemas academicos externos;
- coverage formal con porcentaje certificado;
- soporte probado de alta concurrencia;
- uptime institucional;
- optimizacion a escala universidad completa sin dataset validado.

## Requerimientos no funcionales

| Categoria | Requerimiento | Estado |
|---|---|---|
| Mantenibilidad | Separar motores, API, frontend y documentacion con responsabilidades claras. | Parcial |
| Rendimiento | Medir tiempos de generacion y validacion. | Parcial |
| Seguridad | Evitar exponer datos sensibles y considerar autenticacion futura. | Propuesto |
| Trazabilidad | Relacionar cambios con tareas, evidencias, riesgos y metricas. | Parcial |
| Calidad de datos | Validar completitud y consistencia de entradas academicas. | Parcial |
| Escalabilidad | Preparar el motor para datasets mayores con limites y pruebas. | Propuesto |
| Usabilidad | Permitir gestion y revision clara por usuarios academicos. | Parcial |
| Disponibilidad | Reducir dependencia de configuracion local en futuras versiones. | Propuesto |
| Auditabilidad | Registrar corridas, cambios y aprobaciones. | Propuesto |

## Relacion con documentos

- [Vision general](01_vision_general.md)
- [Mapa del proceso academico](02_mapa_proceso_academico.md)
- [Supuestos y restricciones](04_supuestos_y_restricciones.md)
- [Specs SDD](sdd/specs.md)
- [KPI y Metricas](seguimiento_control/02_KPI_y_Metricas.md)
