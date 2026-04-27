# HU03 - Motor Anti-Cruces

## Proposito del modulo
El Motor Anti-Cruces valida una propuesta de horario academico y detecta conflictos de solapamiento entre recursos criticos: docentes, aulas y grupos/secciones. Su objetivo es apoyar la regla de no cruce definida para el prototipo de generacion optima de horarios.

## Alcance de HU03
- Validar listas de bloques horarios generadas o propuestas por otros modulos.
- Reportar conflictos con tipo, severidad, mensaje y bloques involucrados.
- Mantener una implementacion reutilizable en backend.
- No resolver automaticamente los conflictos detectados.
- No implementar UI ni optimizacion del modelo.

## Restricciones academicas que valida
- `CRUCE_DOCENTE`: un docente no puede dictar dos clases solapadas en el mismo dia.
- `CRUCE_AULA`: un aula no puede estar asignada a dos clases solapadas en el mismo dia.
- `CRUCE_GRUPO`: un grupo o seccion no puede tener dos clases solapadas en el mismo dia.
- `BLOQUE_INVALIDO`: un bloque no es valido si no tiene dia u horas validas, o si `horaInicio >= horaFin`.

## Estructura esperada de entrada
La funcion principal `validateSchedule(schedule)` recibe un arreglo de bloques horarios:

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

## Estructura esperada de salida
El motor devuelve un objeto verificable:

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

## Explicacion simple del algoritmo
1. Verifica que la entrada sea una lista de bloques.
2. Normaliza cada bloque: dia en mayusculas y horas convertidas a minutos.
3. Separa los bloques invalidos y los reporta como conflictos.
4. Compara cada par de bloques validos.
5. Dos bloques se consideran solapados si tienen el mismo dia y sus rangos horarios se intersectan.
6. Cuando existe solapamiento, compara docente, aula y grupo para generar los conflictos correspondientes.

## Casos que detecta
- Docente asignado a dos clases en el mismo intervalo.
- Aula asignada a dos clases simultaneas.
- Grupo o seccion con dos clases al mismo tiempo.
- Bloques con horas iguales, invertidas o formato horario invalido.
- Multiples conflictos en una misma validacion.

## Casos que no considera como cruce
- Clases del mismo recurso en dias diferentes.
- Clases consecutivas, por ejemplo `08:00-10:00` y `10:00-12:00`.
- Preferencias de docentes o estudiantes, porque corresponden a restricciones blandas.
- Capacidad, tipo de aula o prerrequisitos, porque pertenecen a otros modulos del modelo.

## Ejemplo de entrada con conflicto
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
  },
  {
    "id": "H002",
    "cursoId": "CUR002",
    "cursoNombre": "Base de Datos",
    "docenteId": "DOC001",
    "aulaId": "AULA102",
    "grupoId": "G2",
    "dia": "LUNES",
    "horaInicio": "09:00",
    "horaFin": "11:00"
  }
]
```

## Ejemplo de salida con conflictos
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

## Pruebas automatizadas
Las pruebas unitarias estan en `backend/tests/motorAntiCruces.test.js`.

Comando:

```bash
cd backend
npm test
```

Resultado esperado:

```text
tests 11
pass 11
fail 0
```

## Requisitos no funcionales asociados
- Rendimiento esperado: el modulo esta disenado para validar listas pequenas o medianas de bloques horarios propias de un prototipo academico. Su rendimiento debera medirse con conjuntos de datos mas amplios en etapas posteriores.
- Mantenibilidad: la logica esta separada en un servicio puro, sin dependencia de Express, base de datos ni UI.
- Escalabilidad basica: el algoritmo actual compara pares de bloques, suficiente para el Sprint 1; si el volumen crece, puede optimizarse agrupando por dia y recurso.
- Trazabilidad de conflictos: cada conflicto incluye tipo, severidad, mensaje y `bloquesInvolucrados` para facilitar depuracion y evidencia academica.

## Limitaciones actuales
- No valida capacidad de aulas, tipo de aula, disponibilidad declarada de docentes ni prerrequisitos.
- No corrige automaticamente los cruces.
- No prioriza restricciones blandas.
- No expone aun una ruta HTTP porque el backend Express todavia no esta implementado en el repositorio.

## Posible integracion futura
El generador de horarios puede llamar `validateSchedule(schedule)` para descartar propuestas con restricciones duras incumplidas. El optimizador puede usar `totalConflictos` como penalizacion objetiva y la lista `conflictos` para explicar por que una solucion no es aceptable.
