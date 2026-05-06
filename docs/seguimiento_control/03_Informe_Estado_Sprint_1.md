# Informe de Estado del Proyecto

**Nombre del Proyecto:** Sistema de Generación Óptima de Horarios Académicos
**Gerente del Proyecto (Scrum Master):** Alejandro Espíritu Campos
**Fecha:** 6 de Mayo de 2026
**Periodo del Informe:** Cierre del Sprint 1

## Estado del:
* **Alcance:** Se ha completado el 100% de las historias de usuario planificadas para el Sprint 1. Se estableció el entorno base (Node + React), la estructura de la base de datos MySQL y la arquitectura inicial del algoritmo CSP.
* **Cronograma:** Vamos acorde a lo planificado en tiempo. El avance del proyecto se sitúa en el hito esperado para el cierre del primer sprint funcional.
* **Costes:** Ejecución controlada. Al tratarse de un proyecto académico con esfuerzo interno, no se han reportado desviaciones sobre el presupuesto inicial (horas de desarrollo).
* **Calidad:** 0 defectos críticos en producción/entorno de prueba integrados. Se han implementado las primeras validaciones en `motorAntiCruces.test.js`.

## Riesgos Activos Principales
| Riesgo | Responsable | Mitigación |
| :--- | :--- | :--- |
| El motor anti-cruces excede los 10 segundos de procesamiento | Luis Quispe | Implementar poda temprana de variables en el CSPMotor y tests de carga tempranos. |
| Datos de disponibilidad reales inaccesibles por burocracia | Marlon Bonifacio | Validar el sistema íntegramente con la base de datos `seed_db.js`. |

## Próximos Avances (Sprint 2)
* Desarrollo funcional del componente `ScheduleGrid.jsx`.
* Implementación de los endpoints CRUD completos para Estudiantes, Docentes, Cursos y Aulas.
* Integración end-to-end del `motorAntiCruces.js` con la base de datos MySQL.

## Notas
El equipo ha demostrado gran cohesión y confianza técnica durante este primer sprint. El entorno de trabajo establecido permitirá iterar con mayor velocidad en el siguiente ciclo.
