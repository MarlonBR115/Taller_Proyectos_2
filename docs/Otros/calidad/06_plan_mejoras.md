# Plan de Mejoras de Calidad

## Objetivo
Priorizar acciones posteriores a la preparacion AT002 para mejorar seguridad, mantenibilidad, accesibilidad, cobertura y evidencia tecnica del proyecto.

## Plan priorizado

| Codigo | Hallazgo | Area | Prioridad | Accion propuesta | Riesgo | Esfuerzo | Estado |
|---|---|---|---|---|---|---|---|
| PM-01 | SonarQube configurado pero no ejecutado | Calidad | Alta | Ejecutar SonarQube local o SonarCloud y capturar dashboard inicial. | Bajo | Medio | Pendiente |
| PM-02 | Pruebas MySQL deben ejecutarse en entorno preparado | Testing | Alta | Mantener `test:mysql` separado y documentar credenciales/seed requeridos para MySQL local. | Medio | Medio | Implementado parcialmente |
| PM-03 | Coverage frontend no se genero | Testing frontend | Alta | Instalar dependencias frontend y ejecutar `npm.cmd run test:coverage`. | Bajo | Bajo | Pendiente |
| PM-04 | Vulnerabilidades npm moderadas | Seguridad | Alta | Revisar actualizaciones de `express`, `supertest` y dependencias transitivas; no usar `audit fix` sin revision. | Medio | Medio | Detectado |
| PM-05 | Ausencia de Helmet | Seguridad backend | Alta | Agregar `helmet` y validar que no rompa frontend ni CORS. | Bajo | Bajo | Pendiente |
| PM-06 | CORS sin restriccion de origen | Seguridad backend | Alta | Configurar `origin` por variable de entorno. | Medio | Bajo | Pendiente |
| PM-07 | Mensajes tecnicos expuestos | Seguridad backend | Alta | Devolver mensajes genericos y registrar detalle en servidor. | Bajo | Medio | Pendiente |
| PM-08 | Validacion limitada de payloads | API backend | Alta | Agregar validadores para docentes, cursos, aulas, periodos, grupos y generacion. | Medio | Alto | Pendiente |
| PM-09 | Falta base de datos de prueba | Testing/integracion | Alta | Crear estrategia `generador_horarios_test` con seed y limpieza controlada. | Medio | Medio | Pendiente |
| PM-10 | Elementos interactivos no semanticos | WCAG frontend | Media | Reemplazar `li/div onClick` por botones o agregar roles y manejo de teclado. | Medio | Medio | Pendiente |
| PM-11 | Botones de icono sin nombre accesible | WCAG frontend | Media | Agregar `aria-label` en editar, eliminar, cerrar y bloques clicables. | Bajo | Bajo | Pendiente |
| PM-12 | Modales sin atributos ARIA completos | WCAG frontend | Media | Agregar `role="dialog"`, `aria-modal`, labels y manejo de foco. | Medio | Medio | Pendiente |
| PM-13 | SUS sin participantes reales | Usabilidad | Media | Ejecutar evaluacion SUS con minimo 5 participantes y calcular puntaje real. | Bajo | Medio | Pendiente |
| PM-14 | Code smells pendientes de baseline | Mantenibilidad | Media | Corregir smells simples despues de ejecutar SonarQube y respaldar con pruebas. | Medio | Medio | Pendiente |
| PM-15 | E2E no ejecutado en esta fase | Testing E2E | Media | Ejecutar Playwright con backend/frontend/BD preparados y guardar reportes. | Medio | Medio | Pendiente |

## Criterios de priorizacion
- Alta prioridad: bloquea evidencia de calidad, seguridad basica o cobertura.
- Media prioridad: mejora usabilidad, accesibilidad o mantenibilidad sin bloquear la entrega.
- Bajo riesgo: cambios configurables o documentales.
- Riesgo medio: cambios que pueden afectar rutas, frontend o entorno local.

## Recomendacion
Primero estabilizar pruebas y coverage, luego ejecutar SonarQube para obtener baseline real. Las correcciones de codigo deben priorizarse con base en issues medidos y siempre reejecutando pruebas.
