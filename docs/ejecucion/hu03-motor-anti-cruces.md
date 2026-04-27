# HU03 - Motor Anti-Cruces

## Proposito
El Motor Anti-Cruces valida una propuesta de programacion academica antes de que sea aceptada por el generador u optimizador de horarios. Su responsabilidad es detectar solapamientos reales entre docentes, aulas y grupos en un mismo dia y rango horario.

## Alcance
- Validar bloques horarios ya propuestos por el generador.
- Reportar conflictos verificables con tipo, severidad, mensaje y bloques involucrados.
- Mantener la logica como modulo reutilizable del backend.
- No resolver automaticamente los cruces ni optimizar la asignacion final.
- No implementar interfaz grafica.

## Entradas esperadas
Lista de bloques horarios con esta estructura base:

```json
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
```

## Salidas esperadas
El motor devuelve un resumen de validacion:

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
  ]
}
```

## Restricciones que valida
- `CRUCE_DOCENTE`: un docente no puede dictar dos clases solapadas en el mismo dia.
- `CRUCE_AULA`: un aula no puede ser usada por dos clases solapadas en el mismo dia.
- `CRUCE_GRUPO`: un grupo o seccion no puede recibir dos clases solapadas en el mismo dia.
- Solapamiento horario: dos bloques se cruzan cuando comparten dia y sus rangos se intersectan.
- `BLOQUE_INVALIDO`: un bloque es invalido si falta informacion minima o si `horaInicio >= horaFin`.

## Casos de uso verificables
- Como generador de horarios, quiero validar una propuesta completa para saber si puede pasar a evaluacion.
- Como optimizador, quiero recibir una lista de conflictos para penalizar o descartar soluciones inviables.
- Como responsable academico, quiero identificar el recurso exacto que causa un cruce.

## Criterios de aceptacion
- Un horario sin cruces devuelve `valido: true` y `totalConflictos: 0`.
- Dos clases del mismo docente que se solapan el mismo dia generan `CRUCE_DOCENTE`.
- Dos clases en la misma aula que se solapan el mismo dia generan `CRUCE_AULA`.
- Dos clases del mismo grupo que se solapan el mismo dia generan `CRUCE_GRUPO`.
- El mismo recurso en dias distintos no genera conflicto.
- Bloques consecutivos como `08:00-10:00` y `10:00-12:00` no generan conflicto.
- Un bloque con `horaInicio` mayor o igual que `horaFin` genera `BLOQUE_INVALIDO`.

## Casos borde
- Horas con formato distinto de `HH:MM` se consideran invalidas.
- Recursos vacios no generan cruce de recurso, pero el bloque puede seguir participando en otros cruces si su horario es valido.
- Si dos bloques comparten docente, aula y grupo en el mismo solapamiento, el motor reporta los tres conflictos porque afectan restricciones distintas.

## Relacion con el generador y el optimizador
El generador puede invocar el motor despues de construir una propuesta de horario para filtrar soluciones que incumplen restricciones duras. El optimizador puede usar `totalConflictos` y la lista de conflictos como penalizacion objetiva, priorizando soluciones con cero cruces antes de aplicar criterios blandos como preferencias docentes o distribucion equilibrada.

## Evidencia de pruebas
Las pruebas unitarias se encuentran en `backend/tests/motorAntiCruces.test.js` y se ejecutan desde `backend` con:

```bash
npm test
```
