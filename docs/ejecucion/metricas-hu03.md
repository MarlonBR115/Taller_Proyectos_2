# Metricas HU03 - Motor Anti-Cruces

## Proposito
Las metricas de HU03 permiten evaluar la calidad de una propuesta de horario en memoria. Sirven como evidencia tecnica para KPI de conflictos, calidad de datos y rendimiento de validacion, sin afirmar persistencia historica de resultados.

## Metricas entregadas por el motor
| Metrica | Campo | Interpretacion |
|---|---|---|
| Tiempo de validacion | `metricas.tiempoValidacionMs` | Duracion de la validacion en milisegundos. |
| Total de sesiones | `metricas.totalSesiones` / `metricas.totalBloques` | Cantidad de sesiones recibidas. |
| Sesiones validas | `metricas.sesionesValidas` / `metricas.bloquesValidos` | Sesiones con datos minimos y rango horario valido. |
| Sesiones invalidas | `metricas.sesionesInvalidas` / `metricas.bloquesInvalidos` | Sesiones con `DATOS_INVALIDOS`. |
| Porcentaje de sesiones validas | `metricas.porcentajeSesionesValidas` | Calidad minima de datos de entrada. |
| Total de conflictos | `metricas.totalConflictos` | Restricciones duras incumplidas. |
| Tasa de conflictos | `metricas.tasaConflictos` | Conflictos divididos entre total de sesiones. |
| Conflictos por tipo | `metricas.conflictosPorTipo` | Distribucion por docente, aula, grupo, datos invalidos, sobrecupo o tipo incompatible. |
| Advertencias por tipo | `metricas.advertenciasPorTipo` | Distribucion de advertencias blandas u operativas. |
| Total de advertencias | `metricas.totalAdvertencias` | Cantidad de advertencias detectadas. |
| Docentes analizados | `metricas.docentesAnalizados` | Cantidad de combinaciones dia-docente evaluadas. |
| Aulas analizadas | `metricas.aulasAnalizadas` | Cantidad de combinaciones dia-aula evaluadas. |
| Grupos analizados | `metricas.gruposAnalizados` | Cantidad de combinaciones dia-grupo evaluadas. |

## Indicadores relacionados con KPI
| KPI posible | Fuente HU03 | Estado actual |
|---|---|---|
| Cantidad de cruces de docente | `conflictosPorTipo.CRUCE_DOCENTE` | Implementado en memoria. |
| Cantidad de cruces de aula | `conflictosPorTipo.CRUCE_AULA` | Implementado en memoria. |
| Cantidad de cruces de grupo | `conflictosPorTipo.CRUCE_GRUPO` | Implementado en memoria. |
| Cantidad de sesiones invalidas | `sesionesInvalidas` | Implementado en memoria. |
| Porcentaje de sesiones validas | `porcentajeSesionesValidas` | Implementado en memoria. |
| Tiempo de validacion | `tiempoValidacionMs` | Implementado en memoria. |
| Advertencias de transicion | `advertenciasPorTipo.TRANSICION_INSUFICIENTE` | Implementado en memoria. |
| Sobrecupo de aula | `conflictosPorTipo.SOBRECUPOS_AULA` | Implementado si los datos de capacidad y demanda existen. |
| Tipo de aula incompatible | `conflictosPorTipo.TIPO_AULA_INCOMPATIBLE` | Implementado si existen tipo de aula y tipo de sesion. |
| Historico comparativo de corridas | No aplica | Pendiente; requiere persistencia. |

## Criterios medibles para HU03
- Correctitud: una solucion candidata solo se considera valida si `totalConflictos = 0`.
- Trazabilidad: cada conflicto incluye `tipo`, `severidad`, `mensaje`, `sesionA`, `sesionB`, `dia`, `recursoId` y `recomendacion`.
- Rendimiento de prototipo: validar 300 sesiones sin conflictos en menos de 100 ms en prueba unitaria local.
- Mantenibilidad: servicio puro sin dependencia directa de Express, MySQL ni frontend.
- Compatibilidad: acepta alias provenientes de backend y base de datos sin mutar la entrada original.

## Uso dentro de una funcion objetivo futura
HU03 no implementa un optimizador completo. Sus metricas pueden alimentar una funcion objetivo futura:

```text
penalizacion = (conflictosDuros * pesoDuro) + (advertenciasBlandas * pesoBlando)
```

Los conflictos duros deberian descartar o penalizar fuertemente una solucion. Las advertencias blandas pueden priorizar horarios operativamente mejores.

## Limitaciones
- Las metricas actuales se calculan por ejecucion y en memoria.
- No existe almacenamiento historico de KPI.
- No se miden latencia HTTP, acceso a base de datos ni concurrencia.
- La compatibilidad de tipos de aula es una regla tecnica simple, no un catalogo institucional completo.
