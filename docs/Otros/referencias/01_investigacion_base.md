# Investigacion Base

Este documento resume referencias conceptuales para justificar el proyecto y orientar mejoras futuras. No incluye citas formales ni resultados empiricos externos; las referencias deben validarse academicamente antes de usarse en un informe final.

## Sistemas y herramientas de referencia

| Referencia | Uso conceptual | Aplicacion al proyecto | Estado |
|---|---|---|---|
| UniTime | Sistema integral de timetabling academico, secciones, aulas, docentes y student scheduling. | Referencia para evolucion hacia planificacion academica integral. | Referencia conceptual pendiente de validacion formal. |
| OR-Tools CP-SAT | Solver de optimizacion con restricciones. | Referencia para modelos CSP/COP mas robustos. | Futuro, no implementado. |
| Timefold / OptaPlanner | Solver de planificacion para asignacion de recursos. | Referencia para heuristicas, restricciones duras/blandas y scoring. | Futuro, no implementado. |
| OpenAPI | Especificacion de contratos API. | Util para reducir inconsistencias entre backend y frontend. | Futuro. |
| Pact / contract testing | Pruebas de contrato entre servicios y consumidores. | Util para validar contratos entre API, frontend y motores. | Futuro. |

## Conceptos clave

| Concepto | Descripcion | Estado en el proyecto |
|---|---|---|
| Course timetabling | Programacion de cursos en dias, horas y aulas. | Parcialmente implementado. |
| Student scheduling | Construccion de horarios individuales de estudiantes. | Futuro. |
| Student sectioning | Asignacion de estudiantes a secciones segun cupos y conflictos. | Futuro. |
| Instructor scheduling | Asignacion de docentes considerando disponibilidad y carga. | Parcial. |
| Demand forecasting | Estimacion de demanda academica por curso. | Futuro. |
| Restricciones duras | Reglas que invalidan una solucion si se incumplen. | Implementadas parcialmente. |
| Restricciones blandas | Preferencias o penalizaciones que mejoran calidad. | Parcial. |
| Minimal perturbation | Reducir cambios frente a un horario ya publicado. | Futuro. |
| Calidad de datos | Completitud y consistencia de entradas academicas. | Riesgo documentado. |
| Trazabilidad | Relacion entre tareas, pruebas, metricas y decisiones. | Parcial. |
| Sistema semiautomatico | Genera recomendaciones, pero conserva decision humana. | Principio de diseno. |

## Aplicacion al proyecto

### Presente

- Generacion inicial de horarios con `CSPMotor`.
- Validacion anti-cruces con HU03.
- Metricas basicas de validacion.
- Documentacion SDD y riesgos.

### Futuro

- Modelado formal de demanda.
- Student sectioning.
- Persistencia historica de KPI.
- Pruebas de contrato.
- Versionado y aprobacion de horarios.
- Integracion con solvers especializados.

### Fuera del alcance actual

- Sistema institucional completo de matricula.
- Gestion financiera o administrativa.
- Autenticacion institucional completa.
- Optimizacion a escala de toda la universidad sin dataset validado.
