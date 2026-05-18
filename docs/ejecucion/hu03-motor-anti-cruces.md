# HU03 - Motor Anti-Cruces

## Proposito de HU03
HU03 valida una propuesta de horario academico y detecta incumplimientos de la regla de no cruce para recursos criticos: docente, aula y grupo. Dentro del prototipo, el motor no genera horarios ni corrige conflictos; actua como componente verificable para aceptar, rechazar o advertir sobre una asignacion propuesta.

## Relacion con el modelo CSP
En el modelo CSP del proyecto, cada bloque horario representa una asignacion de decision:

```text
X = (curso, docente, aula, grupo, dia, horaInicio, horaFin)
```

HU03 valida restricciones sobre esas variables:

- Dominio temporal: `dia`, `horaInicio` y `horaFin`.
- Dominio de recursos: `docenteId`, `aulaId` y `grupoId`.
- Restricciones duras de no solapamiento para recursos compartidos.
- Restriccion blanda operativa de transicion entre bloques consecutivos.

El resultado de HU03 puede ser usado por un generador CSP para descartar soluciones con restricciones duras incumplidas y por una futura funcion objetivo como penalizacion explicable mediante `totalConflictos`, `totalAdvertencias` y `metricas`.

## Restricciones duras validadas
| Codigo | Regla | Resultado |
|---|---|---|
| `CRUCE_DOCENTE` | Un docente no puede dictar dos clases en horarios solapados el mismo dia. | Conflicto de severidad `ALTA`. |
| `CRUCE_AULA` | Un aula no puede asignarse a dos clases simultaneas el mismo dia. | Conflicto de severidad `ALTA`. |
| `CRUCE_GRUPO` | Un grupo no puede tener dos clases al mismo tiempo el mismo dia. | Conflicto de severidad `ALTA`. |
| `BLOQUE_INVALIDO` | Un bloque debe tener `dia`, `docenteId`, `aulaId`, `grupoId`, `horaInicio` y `horaFin` validos. | Conflicto de severidad `ALTA`. |
| `BLOQUE_INVALIDO` | `horaInicio` debe ser menor que `horaFin`. | Conflicto de severidad `ALTA`. |

## Restriccion blanda u operativa
El motor tambien reporta `TRANSICION_INSUFICIENTE` como advertencia de severidad `MEDIA`.

Esta validacion aplica cuando:

- dos bloques del mismo docente o grupo estan en el mismo dia;
- no existe solapamiento;
- el margen entre `horaFin` del primer bloque y `horaInicio` del siguiente es menor que `tiempoMinimoTransicionMinutos`;
- existe cambio de aula o edificio.

No todas las clases consecutivas se consideran problema. Si el margen configurado es suficiente, o si no existe cambio fisico relevante, el horario sigue siendo valido y no se genera advertencia.

Configuracion por defecto:

```js
validateSchedule(schedule, {
  tiempoMinimoTransicionMinutos: 10
});
```

## Entrada esperada
`validateSchedule(schedule, opciones)` y `validarCrucesHorario(bloques, opciones)` reciben un arreglo de bloques:

```json
[
  {
    "id": "H001",
    "cursoId": "CUR001",
    "cursoNombre": "Algoritmos",
    "docenteId": "DOC001",
    "aulaId": "AULA101",
    "grupoId": "G1",
    "dia": "LUNES",
    "horaInicio": "08:00",
    "horaFin": "10:00"
  }
]
```

Las horas deben usar formato `HH:MM` de 24 horas.

## Salida generada
La salida mantiene compatibilidad con los campos principales `valido`, `totalConflictos` y `conflictos`. Se agregan advertencias y metricas para evidencia de calidad:

```json
{
  "valido": false,
  "totalConflictos": 1,
  "conflictos": [
    {
      "tipo": "CRUCE_DOCENTE",
      "severidad": "ALTA",
      "mensaje": "El docente DOC001 tiene clases solapadas el dia LUNES: 08:00-10:00 y 09:00-11:00.",
      "bloquesInvolucrados": ["H001", "H002"]
    }
  ],
  "totalAdvertencias": 0,
  "advertencias": [],
  "metricas": {
    "totalBloques": 2,
    "bloquesValidos": 2,
    "porcentajeBloquesValidos": 100,
    "bloquesInvalidos": 0,
    "totalConflictos": 1,
    "tasaConflictos": 0.5,
    "conflictosPorTipo": {
      "CRUCE_DOCENTE": 1
    },
    "totalAdvertencias": 0,
    "advertenciasTransicionInsuficiente": 0,
    "tiempoValidacionMs": 0.31
  }
}
```

## Algoritmo implementado
La version actual evita comparar todos los bloques entre si. Primero normaliza y valida los bloques; luego agrupa los bloques validos por:

- `dia + docenteId`;
- `dia + aulaId`;
- `dia + grupoId`.

En cada grupo ordena por hora de inicio y solo compara bloques que comparten el mismo recurso. Si el siguiente bloque inicia despues o al cierre del bloque actual, la revision de ese subgrupo se corta porque los bloques posteriores tampoco pueden solaparse con ese bloque. Esta estrategia reduce comparaciones innecesarias y deja el motor preparado para escalar mejor que una comparacion global O(n²), especialmente cuando existen muchos docentes, aulas y grupos distintos.

## Criterios de aceptacion
| Criterio | Dado | Cuando | Entonces |
|---|---|---|---|
| Horario valido | Un conjunto de bloques sin solapamientos ni transiciones inviables. | Se ejecuta `validateSchedule`. | `valido` es `true`, `totalConflictos` es `0` y no hay advertencias. |
| Cruce docente | Dos bloques del mismo docente se solapan el mismo dia. | Se valida el horario. | Se reporta `CRUCE_DOCENTE` con severidad `ALTA`. |
| Cruce aula | Dos bloques usan la misma aula en horarios solapados. | Se valida el horario. | Se reporta `CRUCE_AULA` con severidad `ALTA`. |
| Cruce grupo | Dos bloques del mismo grupo se solapan el mismo dia. | Se valida el horario. | Se reporta `CRUCE_GRUPO` con severidad `ALTA`. |
| Bloque invalido | Un bloque no tiene datos minimos o tiene `horaInicio >= horaFin`. | Se valida el horario. | Se reporta `BLOQUE_INVALIDO`. |
| Transicion suficiente | Dos clases consecutivas tienen margen igual o superior al minimo configurado. | Se valida el horario. | No se genera conflicto ni advertencia. |
| Transicion insuficiente | El mismo docente o grupo cambia de aula con margen menor al minimo. | Se valida el horario. | Se reporta advertencia `TRANSICION_INSUFICIENTE`; el horario no se invalida por esa advertencia. |

## Evidencia TDD
Las pruebas unitarias estan en:

```text
backend_node/tests/motorAntiCruces.test.js
```

Casos cubiertos:

- horario valido sin cruces;
- cruce de docente;
- cruce de aula;
- cruce de grupo;
- bloque invalido;
- clases consecutivas validas con margen suficiente;
- transicion insuficiente configurable;
- multiples conflictos en una misma validacion;
- salida publica de `validateSchedule`;
- metricas verificables;
- prueba basica de rendimiento con 300 bloques.

Documento complementario: [evidencia-tdd-hu03.md](evidencia-tdd-hu03.md).

## Metricas de validacion
HU03 entrega metricas en cada ejecucion:

- total de bloques evaluados;
- total y porcentaje de bloques validos;
- total de conflictos;
- tasa de conflictos por bloque;
- conflictos por tipo;
- tiempo de validacion en milisegundos;
- total de advertencias;
- advertencias por transicion insuficiente.

Documento complementario: [metricas-hu03.md](metricas-hu03.md).

## Limitaciones actuales
- No valida capacidad de aula, tipo de aula, disponibilidad docente ni prerrequisitos; esas reglas pertenecen a otros componentes del modelo.
- No corrige automaticamente los cruces detectados.
- No integra persistencia ni base de datos; el servicio trabaja con datos en memoria.
- La advertencia de transicion usa aula o edificio cuando esos datos estan presentes; no calcula tiempos reales de traslado.
- La prueba de rendimiento es una referencia basica de prototipo, no una prueba de carga institucional.

## Mejoras futuras
- Integrar HU03 como filtro posterior a cada solucion candidata del motor CSP.
- Usar las metricas de HU03 como parte de una funcion objetivo ponderada.
- Medir rendimiento con datasets academicos mayores y repetibles.
- Incorporar capacidad de aula, disponibilidad real y tipo de ambiente en otros servicios del CSP.
- Definir pesos para advertencias blandas dentro de RF10.

## Integracion SDD
No existe `docs/sdd/specs.md` en la estructura actual. La especificacion relacionada vive de forma general en `docs/Otros/specs.md`. Para una adopcion SDD mas formal, HU03 deberia trazarse en un futuro `docs/sdd/specs.md` con:

- requisito: RF07, prevencion de conflictos de horario;
- reglas CSP: `CRUCE_DOCENTE`, `CRUCE_AULA`, `CRUCE_GRUPO`, `BLOQUE_INVALIDO`;
- pruebas asociadas: `backend_node/tests/motorAntiCruces.test.js`;
- resultado esperado: cero conflictos duros para aceptar una solucion candidata.

## Comando para ejecutar pruebas
Desde la raiz del repositorio:

```bash
cd backend_node
npm test
```

En Windows PowerShell, si `npm.ps1` esta bloqueado por la politica de ejecucion local, usar:

```bash
npm.cmd test
```
