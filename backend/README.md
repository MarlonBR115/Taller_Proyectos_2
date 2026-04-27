# Backend

Backend del prototipo de generacion optima de horarios academicos.

## HU03 - Motor Anti-Cruces

El modulo `src/services/motorAntiCruces.js` valida bloques horarios mediante la funcion de alto nivel `validateSchedule(schedule)` y detecta:

- Cruces de docente.
- Cruces de aula.
- Cruces de grupo o seccion.
- Solapamientos por dia y rango horario.
- Bloques invalidos cuando `horaInicio >= horaFin` o el formato horario no es valido.

Documentacion tecnica: `../docs/ejecucion/hu03-motor-anti-cruces.md`.

## Pruebas

Desde esta carpeta:

```bash
npm test
```
