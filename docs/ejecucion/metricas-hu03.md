# Metricas HU03 - Motor Anti-Cruces

## Proposito
Las metricas de HU03 permiten explicar empiricamente la calidad de una propuesta de horario y respaldar criterios de rendimiento, escalabilidad y mantenibilidad del prototipo.

## Metricas entregadas por el motor
| Metrica | Campo | Interpretacion |
|---|---|---|
| Total de bloques | `metricas.totalBloques` | Cantidad de bloques recibidos para validacion. |
| Bloques validos | `metricas.bloquesValidos` | Bloques con dia, recursos y rango horario valido. |
| Porcentaje de bloques validos | `metricas.porcentajeBloquesValidos` | Indicador de calidad de entrada. |
| Bloques invalidos | `metricas.bloquesInvalidos` | Cantidad de conflictos `BLOQUE_INVALIDO`. |
| Total de conflictos | `metricas.totalConflictos` | Cantidad de restricciones duras incumplidas. |
| Tasa de conflictos | `metricas.tasaConflictos` | Conflictos duros divididos entre total de bloques. |
| Conflictos por tipo | `metricas.conflictosPorTipo` | Distribucion por `CRUCE_DOCENTE`, `CRUCE_AULA`, `CRUCE_GRUPO` y `BLOQUE_INVALIDO`. |
| Tiempo de validacion | `metricas.tiempoValidacionMs` | Duracion de la validacion en milisegundos. |
| Total de advertencias | `metricas.totalAdvertencias` | Cantidad de restricciones blandas u operativas detectadas. |
| Advertencias de transicion | `metricas.advertenciasTransicionInsuficiente` | Casos con margen menor al minimo configurado. |

## Criterios medibles para HU03
- Correctitud: una solucion candidata solo se considera valida si `totalConflictos = 0`.
- Trazabilidad: cada conflicto debe incluir `tipo`, `severidad`, `mensaje` y `bloquesInvolucrados`.
- Rendimiento de prototipo: validar 300 bloques sin conflictos en menos de 100 ms en prueba unitaria local.
- Mantenibilidad: servicio puro sin dependencia de Express, base de datos ni frontend.
- Escalabilidad basica: deteccion agrupada por `dia + recurso` para reducir comparaciones frente a una revision global de todos los pares.

## Uso dentro de una funcion objetivo futura
HU03 no implementa aun un optimizador completo. Sin embargo, sus metricas pueden alimentar una funcion objetivo futura de forma realista:

```text
penalizacion = (totalConflictos * pesoDuro) + (totalAdvertencias * pesoBlando)
```

Donde `pesoDuro` debe ser suficientemente alto para descartar soluciones con cruces, y `pesoBlando` puede priorizar horarios con mejores transiciones operativas.

## Limitacion de las metricas
Las metricas actuales miden la validacion en memoria del servicio HU03. No incluyen latencia HTTP, acceso a base de datos ni carga concurrente de usuarios.
