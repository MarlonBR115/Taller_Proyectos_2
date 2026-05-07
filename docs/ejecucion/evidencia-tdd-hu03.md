# Evidencia TDD - HU03 Motor Anti-Cruces

## Objetivo
Demostrar que HU03 se valida mediante pruebas unitarias automatizadas antes de considerarse estable para el prototipo academico. El foco de la evidencia es comprobar restricciones CSP duras, advertencias operativas y salida estructurada.

## Archivo de pruebas

```text
backend_node/tests/motorAntiCruces.test.js
```

## Comando de ejecucion

```bash
cd backend_node
npm test
```

En Windows PowerShell puede usarse `npm.cmd test` si la politica local bloquea `npm.ps1`.

## Casos TDD cubiertos
| Caso | Proposito | Resultado esperado |
|---|---|---|
| Horario valido sin cruces | Validar camino feliz. | `valido = true`, `totalConflictos = 0`. |
| Cruce docente | Probar restriccion dura de docente. | `CRUCE_DOCENTE`. |
| Cruce aula | Probar restriccion dura de aula. | `CRUCE_AULA`. |
| Cruce grupo | Probar restriccion dura de grupo. | `CRUCE_GRUPO`. |
| Dias diferentes | Evitar falsos positivos. | Sin conflictos. |
| Clases consecutivas | Confirmar que fin igual a inicio no es solapamiento. | Sin conflictos. |
| Bloque invalido por horas | Validar `horaInicio < horaFin`. | `BLOQUE_INVALIDO`. |
| Bloque invalido por datos minimos | Validar recursos obligatorios. | `BLOQUE_INVALIDO`. |
| Margen suficiente | Comprobar transicion operativa viable. | Sin advertencias. |
| Margen insuficiente | Detectar traslado inviable. | `TRANSICION_INSUFICIENTE`. |
| Multiples conflictos | Confirmar acumulacion de conflictos. | Tres conflictos esperados. |
| Salida publica | Proteger contrato de `validateSchedule`. | Campos estructurados. |
| Metricas | Verificar indicadores de validacion. | Totales y conteos por tipo. |
| Rendimiento basico | Ejecutar 300 bloques sin conflictos. | Tiempo menor a 100 ms en entorno local de prueba. |

## Resultado observado
Ultima ejecucion local:

```text
tests 16
pass 16
fail 0
duration_ms 88.0332
```

## Observaciones
- El proyecto usa `node:test`, por lo que no requiere Jest ni dependencias adicionales para las pruebas actuales.
- No existe script de coverage en `backend_node/package.json`.
- Si se requiere cobertura mas adelante, una opcion compatible seria agregar una herramienta como `c8` y un script `coverage`, sin cambiar el runner actual:

```json
{
  "scripts": {
    "test": "node --test",
    "coverage": "c8 node --test"
  }
}
```

No se agrego esta dependencia porque el alcance solicitado prioriza no introducir cambios innecesarios en la configuracion del proyecto.
