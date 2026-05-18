# Agents SDD

## Proposito
Este documento describe las responsabilidades tecnicas del equipo dentro de la arquitectura documental SDD. Los roles se basan en la declaracion del equipo y se conectan con los modulos reales del repositorio.

## Roles y responsabilidades
| Rol | Responsable | Responsabilidad tecnica | Relacion con modulos |
|---|---|---|---|
| Product Owner | Marlon Bonifacio Rojas | Priorizar necesidades, validar alcance academico y alinear la solucion con el problema planteado. | Revisa que las HU respondan a requisitos como generacion de horarios y prevencion de cruces. |
| Scrum Master | Alejandro Espiritu Campos | Facilitar organizacion, seguimiento y cumplimiento de acuerdos de trabajo. | Apoya que las tareas tengan evidencia, responsables y estado claro. |
| Responsable de Backend | Luis Enrique Quispe Campos | Implementar logica de negocio, servicios, APIs y procesamiento de restricciones. | Responsable de servicios como `backend_node/src/services/motorAntiCruces.js` y componentes de validacion CSP. |
| Responsable de Frontend | Fabian Enrique Guzman Choque | Implementar interfaz de usuario y experiencia de interaccion. | Responsable de `frontend/`; no interviene en HU03 salvo futura visualizacion de resultados. |
| Responsable de Documentacion y Calidad | Rafael Fernandez Duran | Consolidar documentacion, revisar coherencia, trazabilidad y evidencia de calidad. | Mantiene documentos en `docs/`, evidencia TDD, metricas y especificaciones SDD. |

## Relacion con HU03
HU03 - Motor Anti-Cruces corresponde al modulo de validacion de restricciones de horario. Esta vinculado principalmente al Responsable de Backend y al Responsable de Documentacion y Calidad.

Archivos relacionados:

- `backend_node/src/services/motorAntiCruces.js`
- `backend_node/tests/motorAntiCruces.test.js`
- `docs/ejecucion/hu03-motor-anti-cruces.md`
- `docs/ejecucion/evidencia-tdd-hu03.md`
- `docs/ejecucion/metricas-hu03.md`

## Responsabilidad CSP de HU03
HU03 actua como validador de restricciones del modelo CSP. Su responsabilidad es identificar:

- restricciones duras de no solapamiento para docente, aula y grupo;
- bloques invalidos por datos minimos incompletos o rango horario incorrecto;
- advertencias operativas por transicion insuficiente para docente o grupo.

HU03 no genera horarios, no resuelve conflictos automaticamente y no integra base de datos por si misma. Su salida puede ser usada por otros modulos para aceptar, rechazar o penalizar soluciones candidatas.

## Regla de coordinacion
Los cambios sobre HU03 deben conservar la compatibilidad de `validateSchedule(schedule)` y `validarCrucesHorario(bloques)`, mantener pruebas unitarias actualizadas y documentar cualquier nueva restriccion como dura o blanda.
