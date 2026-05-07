# Specs SDD

## Proposito
Este documento registra especificaciones verificables del prototipo bajo un enfoque SDD. La especificacion activa se concentra en HU03 - Motor Anti-Cruces porque cuenta con implementacion, pruebas unitarias, metricas y documentacion de ejecucion en el repositorio.

## HU03 - Motor Anti-Cruces

### Proposito
Validar una propuesta de horario academico y detectar incumplimientos de la regla de no cruce para docente, aula y grupo. HU03 funciona como componente verificable del modelo CSP y como evidencia tecnica para RF07: evitar conflictos de horarios.

### Modulo de implementacion
- Servicio: `backend_node/src/services/motorAntiCruces.js`
- Pruebas: `backend_node/tests/motorAntiCruces.test.js`
- Documentacion funcional: `docs/ejecucion/hu03-motor-anti-cruces.md`
- Evidencia TDD: `docs/ejecucion/evidencia-tdd-hu03.md`
- Metricas: `docs/ejecucion/metricas-hu03.md`

### Entradas esperadas
`validateSchedule(schedule, opciones)` recibe un arreglo de bloques horarios. Cada bloque debe contener, como minimo:

- `id`
- `docenteId`
- `aulaId`
- `grupoId`
- `dia`
- `horaInicio`
- `horaFin`

Las horas deben estar en formato `HH:MM` de 24 horas y `horaInicio` debe ser menor que `horaFin`.

### Salidas esperadas
La salida publica conserva los campos principales:

- `valido`
- `totalConflictos`
- `conflictos`

Tambien incluye informacion complementaria:

- `totalAdvertencias`
- `advertencias`
- `metricas`

Una solucion candidata se considera aceptable para restricciones duras cuando `valido = true` y `totalConflictos = 0`.

### Restricciones duras validadas
| Tipo | Regla | Severidad |
|---|---|---|
| `CRUCE_DOCENTE` | Un docente no puede dictar dos clases solapadas el mismo dia. | `ALTA` |
| `CRUCE_AULA` | Un aula no puede asignarse a dos clases simultaneas el mismo dia. | `ALTA` |
| `CRUCE_GRUPO` | Un grupo no puede tener dos clases al mismo tiempo el mismo dia. | `ALTA` |
| `BLOQUE_INVALIDO` | Un bloque debe tener datos minimos validos. | `ALTA` |
| `BLOQUE_INVALIDO` | `horaInicio` debe ser menor que `horaFin`. | `ALTA` |

### Restriccion blanda de transicion insuficiente
HU03 reporta `TRANSICION_INSUFICIENTE` como advertencia de severidad `MEDIA` cuando un docente o grupo tiene una transicion menor que `tiempoMinimoTransicionMinutos` y existe cambio de aula o edificio.

Esta advertencia no invalida por si sola la solucion candidata. Su proposito es aportar una penalizacion futura o una alerta operativa realista.

### Criterios de aceptacion
| Criterio | Dado | Cuando | Entonces |
|---|---|---|---|
| Horario sin cruces | Una lista de bloques con recursos distintos o sin solapamientos. | Se ejecuta `validateSchedule`. | `valido = true` y `totalConflictos = 0`. |
| Cruce de docente | Dos bloques del mismo docente se solapan el mismo dia. | Se valida el horario. | Se reporta `CRUCE_DOCENTE`. |
| Cruce de aula | Dos bloques usan la misma aula en el mismo intervalo. | Se valida el horario. | Se reporta `CRUCE_AULA`. |
| Cruce de grupo | Dos bloques del mismo grupo se solapan el mismo dia. | Se valida el horario. | Se reporta `CRUCE_GRUPO`. |
| Bloque invalido | Un bloque no tiene datos minimos o tiene rango horario invalido. | Se valida el horario. | Se reporta `BLOQUE_INVALIDO`. |
| Transicion suficiente | Dos bloques consecutivos tienen margen igual o superior al minimo configurado. | Se valida el horario. | No se genera advertencia por transicion. |
| Transicion insuficiente | Un docente o grupo cambia de aula con margen menor al minimo configurado. | Se valida el horario. | Se reporta `TRANSICION_INSUFICIENTE` como advertencia. |

### Pruebas asociadas
Las pruebas unitarias estan implementadas con `node:test` en `backend_node/tests/motorAntiCruces.test.js`.

Casos verificados:

- horario valido sin cruces;
- cruce de docente;
- cruce de aula;
- cruce de grupo;
- mismo recurso en dias diferentes;
- clases consecutivas sin cruce;
- bloque invalido;
- margen suficiente de transicion;
- transicion insuficiente;
- multiples conflictos;
- contrato publico de `validateSchedule`;
- metricas verificables;
- rendimiento basico con 300 bloques.

### Metricas verificables
HU03 entrega metricas en cada validacion:

- total de bloques;
- bloques validos;
- porcentaje de bloques validos;
- bloques invalidos;
- total de conflictos;
- tasa de conflictos;
- conflictos por tipo;
- total de advertencias;
- advertencias por transicion insuficiente;
- tiempo de validacion en milisegundos.

### Resultado esperado de pruebas
Comando sugerido:

```bash
cd backend_node
npm.cmd test
```

Resultado observado en la evidencia actual:

```text
tests 16
pass 16
fail 0
```

### Relacion con TDD
HU03 cuenta con pruebas unitarias automatizadas que cubren reglas duras, advertencias operativas, contrato de salida y una prueba basica de rendimiento. Actualmente no existe medicion formal de coverage en `backend_node/package.json`; por tanto, la evidencia disponible corresponde a ejecucion de pruebas unitarias, y la cobertura formal queda como mejora pendiente.

## Trazabilidad minima
| Historia | Requisito | Prueba asociada | Evidencia | Estado |
|---|---|---|---|---|
| HU03 - Motor Anti-Cruces | RF07 - Evitar conflictos de horarios para docentes, aulas y grupos. | `backend_node/tests/motorAntiCruces.test.js` | `docs/ejecucion/evidencia-tdd-hu03.md` | Implementada y probada con 16 pruebas unitarias. |
| HU03 - Motor Anti-Cruces | RNF01 - Rendimiento medible del prototipo. | Prueba basica de rendimiento con 300 bloques. | `docs/ejecucion/metricas-hu03.md` | Evidencia basica disponible; prueba de carga formal pendiente. |
| HU03 - Motor Anti-Cruces | RNF05 - Mantenibilidad mediante servicio desacoplado. | Pruebas unitarias sobre servicio puro. | `backend_node/src/services/motorAntiCruces.js` | Implementada en backend sin dependencia de frontend ni base de datos. |
| HU03 - Motor Anti-Cruces | RF10 - Priorizacion futura de restricciones. | Advertencia `TRANSICION_INSUFICIENTE`. | `docs/ejecucion/hu03-motor-anti-cruces.md` | Parcial: advertencia implementada; ponderacion en funcion objetivo queda pendiente. |

## Limitaciones documentadas
- HU03 no genera horarios por si misma.
- HU03 no corrige conflictos automaticamente.
- HU03 no valida capacidad de aulas, disponibilidad docente, prerrequisitos ni restricciones de matricula.
- No existe coverage formal configurado; no se reportan porcentajes de cobertura.
- La integracion completa con base de datos y UI no forma parte de esta especificacion.
