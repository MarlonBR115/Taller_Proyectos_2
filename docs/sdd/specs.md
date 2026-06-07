# Specs SDD

## Proposito
Este documento registra especificaciones verificables del prototipo bajo un enfoque SDD. La especificacion activa se concentra en HU03 - Motor Anti-Cruces porque cuenta con implementacion, pruebas unitarias, metricas y documentacion tecnica en el repositorio.

## HU03 - Motor Anti-Cruces

### Proposito
Validar una propuesta de horario academico y detectar incumplimientos de restricciones duras y advertencias operativas. HU03 funciona como componente verificable del modelo CSP y como evidencia para RF07: evitar conflictos de horarios.

### Modulos relacionados
| Modulo | Archivo | Rol |
|---|---|---|
| Validador HU03 | `backend_node/src/services/motorAntiCruces.js` | Normaliza sesiones, valida cruces, datos invalidos, sobrecupos, tipos de aula y metricas. |
| Orquestador | `backend_node/GeneratorService.js` | Genera horarios con `CSPMotor`, guarda resultados y adapta datos para HU03. |
| Generador CSP | `backend_node/src/services/CSPMotor.js` | Busca asignaciones viables durante la generacion. |
| Pruebas | `backend_node/tests/motorAntiCruces.test.js` | Verifica contrato, reglas y casos limite. |

### Entradas esperadas
`validateSchedule(schedule, opciones)` recibe un arreglo de sesiones. El contrato interno normalizado es:

```js
{
  id,
  docenteId,
  aulaId,
  grupoId,
  carreraId,
  ciclo,
  cursoId,
  seccionId,
  dia,
  horaInicio,
  horaFin,
  capacidadAula,
  estudiantesEstimados,
  tipoAula,
  tipoSesion
}
```

El motor acepta alias provenientes de backend y MySQL, como `teacher_id`, `room_id`, `group_id`, `course_id`, `day_of_week`, `start_time`, `end_time`, `capacity`, `quota`, `room_type` y `room_type_required`. Las horas pueden recibirse como `HH:MM` o `HH:MM:SS`.

### Salidas esperadas
La salida publica mantiene los campos principales:

- `valido`
- `totalConflictos`
- `conflictos`

Tambien expone:

- `totalSesiones`
- `totalAdvertencias`
- `advertencias`
- `metricas`

Cada conflicto incluye `tipo`, `severidad`, `mensaje`, `sesionA`, `sesionB`, `dia`, `horaInicio`, `horaFin`, `recursoId`, `recomendacion` y `bloquesInvolucrados` para compatibilidad documental previa.

### Restricciones duras validadas
| Tipo | Regla | Severidad |
|---|---|---|
| `CRUCE_DOCENTE` | Un docente no puede dictar dos sesiones solapadas el mismo dia. | `ALTA` |
| `CRUCE_AULA` | Un aula no puede asignarse a dos sesiones simultaneas. | `ALTA` |
| `CRUCE_GRUPO` | Un grupo/seccion no puede tener dos sesiones simultaneas. | `ALTA` |
| `DATOS_INVALIDOS` | La sesion debe tener docente, aula, grupo, dia, inicio y fin validos. | `ALTA` |
| `DATOS_INVALIDOS` | `horaInicio` debe ser menor que `horaFin`. | `ALTA` |
| `SOBRECUPOS_AULA` | La demanda estimada no debe superar la capacidad del aula cuando ambos datos existen. | `ALTA` |
| `TIPO_AULA_INCOMPATIBLE` | El tipo de aula debe ser compatible con el tipo de sesion cuando ambos datos existen. | `ALTA` |

`BLOQUE_INVALIDO` se conserva como alias de compatibilidad hacia `DATOS_INVALIDOS`.

### Restricciones blandas y advertencias
| Tipo | Regla | Severidad |
|---|---|---|
| `TRANSICION_INSUFICIENTE` | Docente o grupo con margen de traslado menor al minimo configurado y cambio de aula o edificio. | `MEDIA` |
| `DATOS_OPCIONALES_INCOMPLETOS` | Datos no criticos faltantes para analisis avanzado. | `BAJA` |

### Criterios de aceptacion

| Criterio | Dado | Cuando | Entonces |
|---|---|---|---|
| Horario sin cruces | Una lista de sesiones con recursos no solapados. | Se ejecuta `validateSchedule`. | `valido = true` y `totalConflictos = 0`. |
| Cruce de docente | Dos sesiones del mismo docente se solapan el mismo dia. | Se valida el horario. | Se reporta `CRUCE_DOCENTE`. |
| Cruce de aula | Dos sesiones comparten aula e intervalo. | Se valida el horario. | Se reporta `CRUCE_AULA`. |
| Cruce de grupo | Dos sesiones del mismo grupo se solapan. | Se valida el horario. | Se reporta `CRUCE_GRUPO`. |
| Datos invalidos | Falta campo obligatorio o rango horario valido. | Se valida el horario. | Se reporta `DATOS_INVALIDOS`. |
| Sesiones consecutivas | Una sesion termina exactamente cuando otra inicia. | Se valida el horario. | No se reporta cruce duro. |
| Transicion insuficiente | Hay cambio de aula con margen menor al minimo. | Se valida el horario. | Se reporta advertencia `TRANSICION_INSUFICIENTE`. |
| Sobrecupo | Estudiantes estimados superan capacidad. | Se valida el horario. | Se reporta `SOBRECUPOS_AULA`. |
| Tipo incompatible | Tipo de aula no satisface tipo de sesion. | Se valida el horario. | Se reporta `TIPO_AULA_INCOMPATIBLE`. |

### Pruebas asociadas
Las pruebas unitarias estan implementadas con `node:test` en `backend_node/tests/motorAntiCruces.test.js`.

Casos verificados:

- horario valido sin cruces;
- cruce de docente, aula y grupo;
- mismo recurso en dias diferentes;
- clases consecutivas sin cruce;
- formato de hora invalido;
- `horaInicio >= horaFin`;
- sesion sin docente, aula o dia;
- alias de campos provenientes de otras capas;
- transicion suficiente e insuficiente;
- multiples conflictos;
- sobrecupo de aula;
- tipo de aula incompatible;
- advertencias opcionales;
- metricas verificables;
- no mutacion del arreglo original;
- adaptacion basica de `GeneratorService` sin base de datos real;
- rendimiento basico con 300 sesiones.

### Metricas verificables
HU03 entrega metricas en cada validacion:

- tiempo de validacion en milisegundos;
- total de sesiones;
- sesiones validas e invalidas;
- porcentaje de sesiones validas;
- total y tasa de conflictos;
- conflictos por tipo;
- total y distribucion de advertencias;
- docentes, aulas y grupos analizados.

### Resultado esperado de pruebas
Comando:

```bash
cd backend_node
npm.cmd test
```

Resultado observado:

```text
tests 23
pass 23
fail 0
duration_ms 89.5146
```

### Relacion con TDD
HU03 cuenta con pruebas unitarias automatizadas para reglas duras, advertencias operativas, contrato de salida, metricas, adaptacion de datos y rendimiento basico. No existe medicion formal de coverage configurada; la cobertura porcentual queda como mejora pendiente.

## Trazabilidad minima

| Historia | Requisito | Prueba asociada | Evidencia | Estado |
|---|---|---|---|---|
| HU03 - Motor Anti-Cruces | RF07 - Evitar conflictos de horarios para docentes, aulas y grupos. | `backend_node/tests/motorAntiCruces.test.js` | `docs/ejecucion/evidencia-tdd-hu03.md` | Implementada y probada con 23 pruebas unitarias. |
| HU03 - Motor Anti-Cruces | RNF01 - Rendimiento medible del prototipo. | Prueba basica de rendimiento con 300 sesiones. | `docs/ejecucion/metricas-hu03.md` | Evidencia basica disponible; prueba de carga formal pendiente. |
| HU03 - Motor Anti-Cruces | RNF05 - Mantenibilidad mediante servicio desacoplado. | Pruebas unitarias sobre servicio puro. | `backend_node/src/services/motorAntiCruces.js` | Implementada sin dependencia directa de frontend ni base de datos. |
| HU03 - Motor Anti-Cruces | Integracion backend | Adaptacion basica desde `GeneratorService`. | `backend_node/GeneratorService.js` | Parcial: validacion posterior integrada; pruebas HTTP pendientes. |
| HU03 - Motor Anti-Cruces | RF10 - Priorizacion futura de restricciones. | Advertencia `TRANSICION_INSUFICIENTE`. | `docs/ejecucion/hu03-motor-anti-cruces.md` | Parcial: advertencia implementada; funcion objetivo ponderada pendiente. |

- HU03 no genera horarios por si misma.
- HU03 no corrige conflictos automaticamente.
- No existe persistencia historica de KPI.
- La compatibilidad de tipos de aula es una regla tecnica simple y debe alinearse con catalogos institucionales.
- El frontend no fue modificado para consumir todos los detalles de validacion.
