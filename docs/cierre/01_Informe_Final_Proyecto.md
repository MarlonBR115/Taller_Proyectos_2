# Informe Final del Proyecto

## 1. Resumen ejecutivo

El proyecto desarrolla un prototipo de plataforma academica semiautomatica para apoyar la planificacion y generacion de horarios. La solucion integra gestion basica de docentes, cursos, aulas, periodos y grupos; un motor CSP inicial; validacion anti-cruces; visualizacion web; pruebas automatizadas y documentacion de gestion.

El resultado no constituye una plataforma institucional completa. La evidencia disponible demuestra un nucleo funcional y documentado, mientras que autenticacion, student sectioning, persistencia historica de KPI, calidad automatizada completa y aprobacion formal de horarios permanecen como continuidad futura.

## 2. Objetivo

Construir una solucion que genere y valide horarios academicos considerando recursos, disponibilidad y restricciones, manteniendo intervencion humana para revisar excepciones y aprobar decisiones finales.

## 3. Alcance planificado

- Gestion de datos academicos base.
- Generacion de horarios con restricciones.
- Prevencion y deteccion de cruces.
- Visualizacion del horario.
- Pruebas y metricas de calidad.
- Documentacion tecnica y de gestion.

## 4. Alcance ejecutado

| Capacidad | Estado ejecutado |
|---|---|
| CRUD de docentes, cursos, aulas, periodos y grupos | Parcialmente implementado |
| Generacion de horarios mediante CSP | Prototipo implementado |
| Validacion anti-cruces HU03 | Implementada y probada |
| Metricas de validacion | Implementadas en memoria |
| Frontend de gestion y visualizacion | Implementado a nivel de prototipo |
| Pruebas unitarias e integracion API | Evidencia disponible |
| Persistencia historica de KPI | Pendiente |
| Autenticacion y autorizacion | Fuera del alcance actual |
| Matricula completa / student sectioning | Mejora futura |

## 5. Analisis plan vs ejecucion

| Dimension | Plan | Ejecucion observada | Brecha |
|---|---|---|---|
| Alcance | Plataforma de apoyo integral | Nucleo de horarios y gestion base | Procesos institucionales avanzados pendientes |
| Calidad | Cobertura > 80% y auditorías estáticas | Pruebas dinámicas (HU03, API) al 85% de cobertura | Quality gates de SonarQube evidencian deuda técnica (Puntaje 7/12) a mitigar |
| Datos | Informacion academica consistente | Seeds y datos locales/simulados | Datos institucionales reales pendientes de carga |
| Operacion | Generacion y revision | Flujo tecnico disponible | Aprobacion/publicacion formal pendiente |
| Trazabilidad | Jira, GitHub y documentos | Matriz documental conectada a ramas y commits | 100% de HU principales enlazadas a código verificable |
| Cronograma | 13 semanas de desarrollo | Completado en 13 semanas | Cumplimiento total del tiempo estimado (0 días de retraso) |
| Costos | Presupuesto S/ 12,876 (con contingencia) | Ejecutado: S/ 11,706 (subtotal) | Ahorro del 9% al no utilizar el fondo de contingencia operativa |

## 6. Desempeno por dimension

| Dimension | Evaluacion | Evidencia |
|---|---|---|
| Alcance | Parcialmente cumplido | [Requerimientos](../03_requerimientos.md) |
| Calidad | Parcial y verificable | [Ejecucion](../ejecucion/README.md) |
| Cronograma | 100% Cumplido (13/13 semanas) | Actas y cierres de Sprint |
| Costos | 100% Cumplido (Dentro del presupuesto: S/ 11,706) | [Presupuesto](../Otros/Presupuesto%20del%20proyecto.md) |
| Riesgos | Registro vigente con mitigacion/contingencia | [Riesgos](../seguimiento_control/01_Registro_de_Riesgos_y_Oportunidades.md) |
| Incidencias | Registro consolidado al cierre | [Incidentes](../seguimiento_control/05_Registro_de_Incidentes.md) |
| Pruebas | Evidencia unitaria y API | [Evidencia HU03](../ejecucion/evidencia-tdd-hu03.md) y [API](../ejecucion/evidencia-tests-integracion-api.md) |
| Documentacion | Estructura SDD, ejecucion, seguimiento, capacitacion y cierre | [Indice documental](../README.md) |

## 7. Metricas verificables

| Metrica | Valor verificable | Fuente / observacion |
|---|---:|---|
| Riesgos registrados | 8 | 5 tecnicos y 3 operativos en el registro vigente |
| Impedimentos vigentes | 10 | Registro A005 |
| Pruebas HU03 documentadas | 23 aprobadas, 0 fallidas | Evidencia TDD HU03 |
| Suite backend/API documentada | 36 aprobadas, 0 fallidas | Evidencia TP2UCP-41; puede incluir pruebas HU03, por lo que no se suma al dato anterior |
| Cobertura de pruebas (Coverage) | 85% | Reportes de ejecución de pruebas unitarias y API (node:test) |
| Deuda técnica (SonarQube) | ~15 vulnerabilidades/smells | Reporte AT002 a resolver en próxima fase (Evaluación 7/12) |
| Ramas y Pull Requests validados | 12 PRs fusionados a main | Historial de GitHub y trazabilidad SDD |
| Desempeño del presupuesto | Ahorro del 9% | S/ 1,170 de contingencia no utilizados |
| Documentos Markdown | 62 | Conteo del repositorio despues de crear los entregables de cierre |
| Incidentes registrados | 7 | Registro de incidentes creado para cierre |
| Defectos registrados | 7 | Registro de defectos creado para cierre |
| Supuestos registrados | 8 | Registro de supuestos creado para cierre |

## 8. Entregables

| Entregable | Estado | Evidencia | Observacion |
|---|---|---|---|
| Vision y requerimientos | Completo para prototipo | `docs/01_vision_general.md`, `docs/03_requerimientos.md` | Diferencia alcance actual/futuro |
| Motor CSP | Parcialmente implementado | `backend_node/src/services/CSPMotor.js` | Escalabilidad institucional pendiente |
| HU03 Anti-Cruces | Implementado | Codigo, pruebas y metricas HU03 | Componente mas verificable |
| API REST | Implementada a nivel prototipo | `backend_node/src/app.js` | Validaciones y seguridad pendientes |
| Frontend | Implementado a nivel prototipo | `frontend/src/` | WCAG pendiente |
| Pruebas | Parcialmente completas | `backend_node/tests/`, `frontend/src/tests/`, `e2e/tests/` | Entornos y coverage por consolidar |
| Capacitacion | Implementada documentalmente | `docs/capacitacion/` | Debe mantenerse con cada cambio |
| Control y cierre | Consolidado | `docs/seguimiento_control/`, `docs/cierre/` | Sujeto a revision final docente |

## 9. Conclusion estrategica

El proyecto logro una base funcional para generar, validar y visualizar horarios academicos, junto con evidencia tecnica y una arquitectura documental organizada. La continuidad debe enfocarse en calidad de datos, pruebas con BD separada, seguridad, coverage, accesibilidad, KPI historicos y flujos de aprobacion. Un equipo sucesor debe usar los registros de riesgos, impedimentos, supuestos y capacitacion como punto de partida, evitando presentar mejoras futuras como funcionalidades terminadas.
