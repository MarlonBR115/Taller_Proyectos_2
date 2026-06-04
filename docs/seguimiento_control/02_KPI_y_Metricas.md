# KPI y Metricas del Proyecto

Este documento define KPI propuestos para evaluar la calidad del proceso de planificacion academica y programacion de horarios. No se inventan resultados numericos; se indica si el prototipo puede calcular cada indicador actualmente.

## Criterios de estado

| Estado | Significado |
|---|---|
| Implementado | El sistema calcula el dato actualmente. |
| Parcial | Existe logica relacionada, pero falta integracion, persistencia o cobertura completa. |
| Propuesto | Requiere implementacion futura. |

## Tabla de KPI

| Codigo | KPI | Que mide | Formula | Fuente de datos | Estado actual | Uso esperado |
|---|---|---|---|---|---|---|
| KPI-01 | Porcentaje de sesiones programadas | Cobertura de grupos/secciones asignados a horario. | `sesiones_programadas / sesiones_requeridas * 100` | `CSPMotor.metrics`, `schedules`, `student_groups` | Parcial | Medir completitud de la generacion. |
| KPI-02 | Conflictos de docente | Cruces donde un docente tiene clases simultaneas. | Conteo de `CRUCE_DOCENTE` | HU03 `conflictosPorTipo` | Implementado en memoria | Validar restricciones duras. |
| KPI-03 | Conflictos de aula | Cruces donde un aula se usa simultaneamente. | Conteo de `CRUCE_AULA` | HU03 `conflictosPorTipo` | Implementado en memoria | Medir factibilidad de uso de espacios. |
| KPI-04 | Conflictos por grupo/carrera/ciclo | Cruces de un mismo grupo o unidad academica. | Conteo de `CRUCE_GRUPO` | HU03 `conflictosPorTipo` | Implementado para grupo | Evitar incompatibilidades de seccion. |
| KPI-05 | Cumplimiento de disponibilidad docente | Porcentaje de clases dentro de disponibilidad declarada. | `asignaciones_validas_docente / asignaciones_totales * 100` | `teachers.availability`, `CSPMotor` | Parcial | Evaluar respeto de restricciones docentes. |
| KPI-06 | Uso de aulas | Ocupacion de aulas respecto a slots disponibles. | `horas_aula_usadas / horas_aula_disponibles * 100` | `schedules`, `rooms` | Propuesto | Medir eficiencia de infraestructura. |
| KPI-07 | Sobrecapacidad | Sesiones asignadas a aulas con capacidad insuficiente. | Conteo de `quota > capacity` | `student_groups`, `rooms`, `CSPMotor` | Parcial | Detectar riesgo operativo de aforo. |
| KPI-08 | Tiempo de generacion o validacion | Duracion de solver o validacion anti-cruces. | Milisegundos por corrida | `CSPMotor.metrics`, HU03 `tiempoValidacionMs` | Parcial | Medir rendimiento. |
| KPI-09 | Restricciones duras incumplidas | Total de errores que invalidan un horario. | `totalConflictos` | HU03 | Implementado en memoria | Aceptar o rechazar horarios. |
| KPI-10 | Restricciones blandas incumplidas | Advertencias o penalizaciones no bloqueantes. | `totalAdvertencias` o score negativo | HU03, `CSPMotor` | Parcial | Comparar calidad entre alternativas. |
| KPI-11 | Indice de cambios posteriores | Cambios aplicados despues de publicar o validar horario. | `cambios_posteriores / horarios_publicados` | Requiere auditoria/versionado | Propuesto | Medir estabilidad del horario. |
| KPI-12 | Porcentaje de demanda atendida | Demanda cubierta por secciones/oferta. | `demanda_atendida / demanda_estimadas * 100` | Requiere demanda academica | Propuesto | Medir suficiencia de oferta. |
| KPI-13 | Tasa de intervencion manual | Casos que requieren correccion humana. | `ajustes_manuales / corridas_totales` | Requiere registro de decisiones | Propuesto | Medir automatizacion realista. |
| KPI-14 | Calidad de datos de entrada | Registros completos y validos antes de generar. | `registros_validos / registros_totales * 100` | CRUD, HU03 `bloquesValidos` | Parcial | Anticipar fallos por datos incompletos. |

## Relacion con HU03

HU03 ya aporta una base concreta para KPI de conflictos, bloques validos, advertencias y tiempo de validacion. La limitacion principal es que estos valores no se persisten historicamente.

## Relacion con riesgos

La falta de persistencia de KPI esta registrada como riesgo tecnico en [Registro de Riesgos y Oportunidades](01_Registro_de_Riesgos_y_Oportunidades.md). La mitigacion recomendada es crear una estructura futura para corridas, conflictos y snapshots de KPI.
