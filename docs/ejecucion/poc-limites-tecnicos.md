# Prueba de Concepto - Limites Tecnicos del Solver

> Nota de alcance: este documento propone limites tecnicos para el solver. No declara que exista actualmente un archivo de configuracion o metrica persistida con estos nombres.

## Objetivo

Evitar que el proceso de generacion de horarios consuma tiempo o recursos excesivos cuando el espacio de busqueda crece.

## Parametros propuestos

| Parametro | Valor sugerido | Descripcion |
|---|---:|---|
| `timeoutMs` | 30000 | Tiempo maximo de ejecucion en milisegundos. |
| `maxIterations` | 100000 | Numero maximo de nodos explorados en backtracking. |

## Comportamiento esperado

Si se alcanza un limite, el solver deberia abortar la busqueda de forma controlada, reportar que no se obtuvo una solucion completa y entregar metricas de diagnostico.

## Metricas propuestas

| Metrica | Descripcion | Estado actual |
|---|---|---|
| `execution_time_ms` | Tiempo real de generacion. | Parcial en `CSPMotor`. |
| `iterations` | Nodos explorados. | Propuesto. |
| `timed_out` | Indica si se alcanzo timeout. | Propuesto. |
| `max_iterations` | Limite usado en la corrida. | Propuesto. |
| `timeout_ms` | Timeout configurado. | Propuesto. |

## Valores sugeridos por escenario

| Escenario | timeoutMs | maxIterations |
|---|---:|---:|
| Dataset pequeno | 10000 | 50000 |
| Dataset mediano | 30000 | 100000 |
| Dataset grande | 60000 | 500000 |

## Estado

Propuesto. Para declararlo implementado se requiere agregar configuracion real, pruebas y evidencia de ejecucion.
