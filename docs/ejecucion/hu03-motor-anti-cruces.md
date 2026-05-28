# HU03 - Motor Anti-Cruces

## Proposito de HU03
HU03 valida una propuesta de horario academico y detecta conflictos de recursos criticos antes de aceptar o publicar una programacion. El modulo no genera horarios ni corrige automaticamente las asignaciones; actua como validador posterior, medible y reutilizable dentro de la plataforma academica semiautomatica.

## Relacion con el modelo CSP
En el modelo CSP del proyecto, una sesion se interpreta como una asignacion:

```text
X = (curso, docente, aula, grupo/seccion, dia, horaInicio, horaFin)
```

HU03 valida la factibilidad de esa asignacion respecto de restricciones duras y advertencias operativas. La separacion de responsabilidades queda asi:

| Componente | Responsabilidad |
|---|---|
| `CSPMotor` | Busca/genera asignaciones considerando restricciones de disponibilidad, capacidad y no ocupacion durante la construccion. |
| `GeneratorService` | Orquesta la generacion, consulta MySQL, guarda horarios y adapta datos para validacion. |
| `motorAntiCruces` | Valida la calidad del horario generado, detecta cruces, datos invalidos, sobrecupos, incompatibilidades y advertencias. |

## Entrada esperada
La funcion publica `validateSchedule(schedule, opciones)` y su alias `validarCrucesHorario(schedule, opciones)` reciben un arreglo de sesiones. El motor normaliza internamente el siguiente contrato:

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

Tambien acepta alias comunes usados por otras capas:

| Campo interno | Alias soportados |
|---|---|
| `docenteId` | `teacherId`, `teacher_id`, `docente_id` |
| `aulaId` | `roomId`, `room_id`, `aula_id` |
| `grupoId` | `groupId`, `group_id`, `grupo_id`, `seccionId`, `sectionId` |
| `horaInicio` | `startTime`, `start_time`, `inicio` |
| `horaFin` | `endTime`, `end_time`, `fin` |
| `dia` | `day`, `weekday`, `day_of_week` |
| `cursoId` | `courseId`, `course_id` |
| `carreraId` | `careerId`, `career_id`, `carrera_id` |
| `ciclo` | `semester`, `cycle` |

Las horas aceptan formato `HH:MM` y `HH:MM:SS`. El motor no muta el arreglo original recibido.

## Restricciones duras validadas
| Codigo | Regla | Severidad |
|---|---|---|
| `CRUCE_DOCENTE` | Un docente no puede dictar dos sesiones solapadas el mismo dia. | `ALTA` |
| `CRUCE_AULA` | Un aula no puede asignarse a dos sesiones simultaneas. | `ALTA` |
| `CRUCE_GRUPO` | Un grupo o seccion no puede tener dos sesiones al mismo tiempo. | `ALTA` |
| `DATOS_INVALIDOS` | La sesion debe tener docente, aula, grupo, dia, horaInicio y horaFin validos. | `ALTA` |
| `DATOS_INVALIDOS` | `horaInicio` debe ser menor que `horaFin`. | `ALTA` |
| `SOBRECUPOS_AULA` | Si existen capacidad y estudiantes estimados, la demanda no debe superar la capacidad. | `ALTA` |
| `TIPO_AULA_INCOMPATIBLE` | Si existen tipo de aula y tipo de sesion, deben ser compatibles. | `ALTA` |

`BLOQUE_INVALIDO` se conserva como alias de compatibilidad hacia `DATOS_INVALIDOS`.

## Advertencias operativas
| Codigo | Regla | Severidad |
|---|---|---|
| `TRANSICION_INSUFICIENTE` | Un mismo docente o grupo cambia de aula con margen menor a `tiempoMinimoTransicionMinutos`. | `MEDIA` |
| `DATOS_OPCIONALES_INCOMPLETOS` | Faltan datos no criticos para analisis avanzado. Se activa con `reportarDatosOpcionalesIncompletos: true`. | `BAJA` |

Las clases consecutivas no se consideran cruce. Por ejemplo, `08:00-10:00` y `10:00-12:00` son validas. La transicion insuficiente se reporta solo como advertencia cuando hay cambio fisico relevante y margen menor al configurado.

## Salida generada
La salida mantiene compatibilidad con `valido`, `totalConflictos` y `conflictos`, y agrega conteos y metricas:

```js
{
  valido: false,
  totalSesiones: 2,
  totalConflictos: 1,
  conflictos: [
    {
      tipo: 'CRUCE_DOCENTE',
      severidad: 'ALTA',
      mensaje: '...',
      sesionA: 'H001',
      sesionB: 'H002',
      dia: 'LUNES',
      horaInicio: '09:00',
      horaFin: '10:00',
      recursoId: 'DOC001',
      recomendacion: '...',
      bloquesInvolucrados: ['H001', 'H002']
    }
  ],
  totalAdvertencias: 0,
  advertencias: [],
  metricas: {
    tiempoValidacionMs: 0.5,
    conflictosPorTipo: { CRUCE_DOCENTE: 1 },
    advertenciasPorTipo: {},
    sesionesValidas: 2,
    sesionesInvalidas: 0,
    docentesAnalizados: 1,
    aulasAnalizadas: 2,
    gruposAnalizados: 2,
    porcentajeSesionesValidas: 100
  }
}
```

## Algoritmo implementado
El motor evita comparar todas las sesiones entre si. Primero normaliza y valida datos minimos; luego agrupa sesiones validas por:

- `dia + docenteId`;
- `dia + aulaId`;
- `dia + grupoId`.

En cada grupo ordena por hora de inicio y aplica la formula de solapamiento:

```text
inicioA < finB && inicioB < finA
```

Cuando la siguiente sesion inicia despues o justo al cierre de la actual, se corta la busqueda para ese recurso porque las sesiones posteriores tampoco pueden solaparse con la actual.

## Criterios de aceptacion
| Criterio | Dado | Cuando | Entonces |
|---|---|---|---|
| Horario sin cruces | Sesiones con recursos distintos o intervalos no solapados. | Se ejecuta `validateSchedule`. | `valido = true` y `totalConflictos = 0`. |
| Cruce docente | Dos sesiones del mismo docente se solapan el mismo dia. | Se valida el horario. | Se reporta `CRUCE_DOCENTE`. |
| Cruce aula | Dos sesiones usan la misma aula en un intervalo solapado. | Se valida el horario. | Se reporta `CRUCE_AULA`. |
| Cruce grupo | Dos sesiones del mismo grupo se solapan. | Se valida el horario. | Se reporta `CRUCE_GRUPO`. |
| Datos invalidos | Falta un campo obligatorio o la hora es invalida. | Se valida el horario. | Se reporta `DATOS_INVALIDOS`. |
| Sobrecupo | La demanda estimada supera la capacidad disponible. | Se valida el horario. | Se reporta `SOBRECUPOS_AULA`. |
| Tipo incompatible | Una sesion de laboratorio se asigna a un aula teorica. | Se valida el horario. | Se reporta `TIPO_AULA_INCOMPATIBLE`. |
| Transicion insuficiente | El docente cambia de aula con margen menor al minimo. | Se valida el horario. | Se reporta advertencia `TRANSICION_INSUFICIENTE`. |

## Evidencia TDD
Las pruebas unitarias estan en:

```text
backend_node/tests/motorAntiCruces.test.js
```

Comando:

```bash
cd backend_node
npm.cmd test
```

Resultado de la ejecucion actual:

```text
tests 23
pass 23
fail 0
duration_ms 89.5146
```

## Metricas de validacion
HU03 entrega metricas utiles para KPI:

- total de sesiones;
- sesiones validas e invalidas;
- porcentaje de sesiones validas;
- conflictos por tipo;
- advertencias por tipo;
- docentes, aulas y grupos analizados;
- tiempo de validacion en milisegundos;
- tasa de conflictos.

Documento complementario: [metricas-hu03.md](metricas-hu03.md).

## Limitaciones actuales
- No persiste historico de metricas o corridas de generacion.
- No calcula tiempos reales de traslado entre edificios; solo usa cambio de aula o edificio como indicio operativo.
- La compatibilidad de tipo de aula es una regla simple y debe alinearse con catalogos institucionales cuando existan.
- El frontend no fue modificado para consumir todos los nuevos detalles de validacion.
- La prueba de rendimiento es basica de prototipo, no una prueba de carga institucional.

## Mejoras futuras
- Persistir resultados de validacion en tablas de auditoria o KPI.
- Agregar pruebas de integracion HTTP para `/api/schedule/generate`.
- Parametrizar catalogos de tipos de aula y tipos de sesion.
- Incorporar pesos de advertencias blandas en una funcion objetivo formal.
