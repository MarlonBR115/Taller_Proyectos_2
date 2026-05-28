# Specs SDD

## Proposito

Este documento registra especificaciones verificables del prototipo bajo un enfoque Spec-Driven Development (SDD). La referencia principal actual se concentra en la programacion optima de horarios academicos, con trazabilidad especial hacia HU03 - Motor Anti-Cruces, el motor CSP y las evidencias de pruebas/metricas existentes.

Documentos base relacionados:

- [Vision general](../01_vision_general.md)
- [Mapa del proceso academico](../02_mapa_proceso_academico.md)
- [Requerimientos](../03_requerimientos.md)
- [Supuestos y restricciones](../04_supuestos_y_restricciones.md)

## Alcance del sistema

El prototipo busca generar y validar horarios academicos considerando:

- planificacion academica semiautomatica;
- oferta de cursos y secciones;
- cursos;
- docentes;
- aulas;
- grupos o secciones;
- periodos academicos;
- disponibilidad;
- restricciones duras;
- restricciones blandas;
- cruces de horario;
- metricas de calidad.

No se documenta como sistema completo de matricula estudiantil. Cualquier referencia a matricula o estudiantes se considera contexto academico o mejora futura, salvo que exista implementacion directa en el repositorio.

El sistema debe apoyar decisiones humanas: genera, valida, mide y recomienda, pero no aprueba automaticamente excepciones academicas ni reemplaza al coordinador responsable.

## Componentes principales

| Componente | Archivo | Responsabilidad | Estado |
|---|---|---|---|
| API Express | `backend_node/server.js` | Expone rutas CRUD y endpoint de generacion. | Implementacion base. |
| Orquestador | `backend_node/GeneratorService.js` | Obtiene datos de MySQL, ejecuta CSPMotor y guarda horarios. | Implementacion base; contrato con HU03 requiere cuidado. |
| Motor CSP | `backend_node/src/services/CSPMotor.js` | Busca asignaciones validas con backtracking, restricciones y heuristicas. | Implementacion base documentada. |
| Motor Anti-Cruces HU03 | `backend_node/src/services/motorAntiCruces.js` | Valida cruces, bloques invalidos, advertencias y metricas. | Implementado y probado. |
| Pruebas HU03 | `backend_node/tests/motorAntiCruces.test.js` | Verifica reglas duras, advertencias, metricas y rendimiento basico. | Implementado. |
| Frontend | `frontend/src/` | Gestion y visualizacion basica de horarios. | Implementacion base. |

## Relacion entre generacion y validacion

Flujo esperado del prototipo:

```text
Datos MySQL -> GeneratorService -> CSPMotor -> schedules -> validacion HU03 -> metricas/evidencia
```

- `GeneratorService` orquesta la generacion y persistencia de horarios.
- `CSPMotor` produce asignaciones candidatas aplicando restricciones duras y heuristicas.
- `motorAntiCruces` valida horarios como componente independiente y testeable.
- La integracion completa entre salida de generacion y contrato HU03 debe mantenerse bajo seguimiento porque los nombres de campos y formatos horarios deben coincidir.

## Restricciones duras del modelo

| Restriccion | Descripcion | Evidencia |
|---|---|---|
| No cruce de docente | Un docente no puede dictar dos clases solapadas. | HU03 y CSPMotor. |
| No cruce de aula | Un aula no puede usarse simultaneamente por dos clases. | HU03 y CSPMotor. |
| No cruce de grupo | Un grupo no puede tener dos clases al mismo tiempo. | HU03. |
| Bloque horario valido | Dia, hora de inicio, hora de fin y recursos deben ser validos. | HU03. |
| Capacidad de aula | El aula debe soportar el cupo del grupo. | CSPMotor. |
| Tipo de aula | El tipo de aula debe ser compatible con el requerimiento del grupo. | CSPMotor. |
| Disponibilidad docente | La asignacion debe respetar disponibilidad simplificada del docente. | CSPMotor. |

## Restricciones blandas y criterios de calidad

| Restriccion o criterio | Descripcion | Estado |
|---|---|---|
| Transicion insuficiente | Advertencia cuando docente o grupo cambia de aula con margen menor al minimo. | Implementado en HU03. |
| Preferencia horaria | Penaliza horarios extremos y prioriza horarios cercanos al centro del dia. | Parcial en CSPMotor. |
| Huecos academicos | Penaliza espacios entre asignaciones relacionadas. | Parcial en CSPMotor. |
| Continuidad | Premia clases contiguas cuando mejora la calidad del horario. | Parcial en CSPMotor. |

## HU03 - Motor Anti-Cruces

### Proposito

Validar una propuesta de horario academico y detectar incumplimientos de la regla de no cruce para docente, aula y grupo. HU03 funciona como componente verificable del modelo CSP y como evidencia tecnica para RF07.

### Modulo de implementacion

- Servicio: `backend_node/src/services/motorAntiCruces.js`
- Pruebas: `backend_node/tests/motorAntiCruces.test.js`
- Documentacion funcional: `docs/ejecucion/hu03-motor-anti-cruces.md`
- Evidencia TDD: `docs/ejecucion/evidencia-tdd-hu03.md`
- Metricas: `docs/ejecucion/metricas-hu03.md`

### Entradas esperadas

`validateSchedule(schedule, opciones)` recibe bloques horarios con, como minimo:

- `id`
- `docenteId`
- `aulaId`
- `grupoId`
- `dia`
- `horaInicio`
- `horaFin`

### Salidas esperadas

- `valido`
- `totalConflictos`
- `conflictos`
- `totalAdvertencias`
- `advertencias`
- `metricas`

Una solucion candidata se considera aceptable para restricciones duras cuando `valido = true` y `totalConflictos = 0`.

### Criterios de aceptacion

| Criterio | Dado | Cuando | Entonces |
|---|---|---|---|
| Horario sin cruces | Una lista de bloques sin solapamientos. | Se ejecuta `validateSchedule`. | `valido = true` y `totalConflictos = 0`. |
| Cruce de docente | Dos bloques del mismo docente se solapan. | Se valida el horario. | Se reporta `CRUCE_DOCENTE`. |
| Cruce de aula | Dos bloques usan la misma aula en el mismo intervalo. | Se valida el horario. | Se reporta `CRUCE_AULA`. |
| Cruce de grupo | Dos bloques del mismo grupo se solapan. | Se valida el horario. | Se reporta `CRUCE_GRUPO`. |
| Bloque invalido | Un bloque no tiene datos minimos o rango horario valido. | Se valida el horario. | Se reporta `BLOQUE_INVALIDO`. |
| Transicion insuficiente | Docente o grupo cambia de aula con margen menor al minimo. | Se valida el horario. | Se reporta `TRANSICION_INSUFICIENTE` como advertencia. |

## Pruebas y metricas

Las pruebas unitarias actuales de HU03 usan `node:test` y cubren reglas duras, advertencias, contrato de salida, metricas y rendimiento basico con 300 bloques.

Comando documentado:

```bash
cd backend_node
npm.cmd test
```

Resultado documentado en evidencia HU03:

```text
tests 16
pass 16
fail 0
```

No existe medicion formal de coverage configurada actualmente. La cobertura porcentual queda como mejora pendiente.

## Casos limite y supuestos

| Caso | Tratamiento actual |
|---|---|
| Bloque sin datos minimos | HU03 lo reporta como `BLOQUE_INVALIDO`. |
| Hora inicio mayor o igual que hora fin | HU03 lo reporta como `BLOQUE_INVALIDO`. |
| Clases consecutivas | No son cruce duro; pueden generar advertencia solo si no cumplen transicion minima y hay cambio relevante. |
| Datos MySQL con formato distinto | Requieren mapeo antes de usar HU03. |
| Falta de datos reales | Se usan datos simulados y se documentan supuestos. |
| KPI historicos | No disponibles hasta que exista persistencia por corrida. |

## Trazabilidad minima

| Historia | Requisito | Prueba asociada | Evidencia | Estado |
|---|---|---|---|---|
| HU03 - Motor Anti-Cruces | RF07 - Evitar conflictos de horarios para docentes, aulas y grupos. | `backend_node/tests/motorAntiCruces.test.js` | `docs/ejecucion/evidencia-tdd-hu03.md` | Implementada y probada con pruebas unitarias. |
| Motor CSP | RF06 - Generacion automatica de horarios. | Pendiente ampliar pruebas directas de CSPMotor. | `docs/ejecucion/a003-02-heuristicas-reglas.md` | Implementacion base. |
| Metricas de calidad | RF09/RNF01 - Medicion de validacion y generacion. | Pruebas HU03 y metricas en memoria. | `docs/ejecucion/metricas-hu03.md` | Parcial; persistencia pendiente. |
| Gestion de riesgos | A004-03 - Gestion de Riesgos. | Revision documental. | `docs/seguimiento_control/01_Registro_de_Riesgos_y_Oportunidades.md` | Documento de seguimiento. |

## Riesgos tecnicos relacionados

Los riesgos principales del prototipo se documentan en [Registro de Riesgos y Oportunidades](../seguimiento_control/01_Registro_de_Riesgos_y_Oportunidades.md). Para SDD, los riesgos mas relevantes son:

- integracion entre `GeneratorService` y HU03;
- consistencia entre base de datos, backend y frontend;
- ausencia de pruebas directas suficientes para `CSPMotor`;
- KPI y metricas aun no persistidas;
- validacion limitada en rutas API.

## Limitaciones actuales

- HU03 no genera horarios por si misma.
- CSPMotor no cuenta aun con una bateria amplia de pruebas unitarias propias.
- No existe coverage formal configurado.
- No existe persistencia historica de KPI.
- Algunas pruebas de concepto describen mejoras propuestas que requieren implementacion antes de declararse funcionales.
