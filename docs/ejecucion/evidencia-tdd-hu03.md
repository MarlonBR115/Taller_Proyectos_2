# Evidencia TDD - HU03 Motor Anti-Cruces

## Objetivo
Demostrar que HU03 se valida con pruebas automatizadas antes de considerarse estable dentro del prototipo. La evidencia cubre restricciones duras, advertencias operativas, contrato de salida, metricas, normalizacion de datos y adaptacion basica desde `GeneratorService`.

## Archivo de pruebas

```text
backend_node/tests/motorAntiCruces.test.js
```

El proyecto usa `node:test`, por lo que no requiere Jest ni dependencias adicionales.

## Comando de ejecucion

```bash
cd backend_node
npm.cmd test
```

## Casos TDD cubiertos
| Caso | Proposito | Resultado esperado |
|---|---|---|
| Horario valido sin cruces | Validar camino feliz. | `valido = true`, `totalConflictos = 0`. |
| Cruce docente | Probar restriccion dura de docente. | `CRUCE_DOCENTE`. |
| Cruce aula | Probar restriccion dura de aula. | `CRUCE_AULA`. |
| Cruce grupo | Probar restriccion dura de grupo/seccion. | `CRUCE_GRUPO`. |
| Dias diferentes | Evitar falsos positivos. | Sin conflictos. |
| Clases consecutivas | Confirmar que fin igual a inicio no es solapamiento. | Sin conflictos. |
| Hora invalida | Validar formato horario. | `DATOS_INVALIDOS`. |
| `horaInicio >= horaFin` | Validar rango temporal. | `DATOS_INVALIDOS`. |
| Falta docente | Validar dato obligatorio. | `DATOS_INVALIDOS`. |
| Falta aula | Validar dato obligatorio. | `DATOS_INVALIDOS`. |
| Falta dia | Validar dato obligatorio. | `DATOS_INVALIDOS`. |
| Alias de campos | Aceptar datos desde backend/MySQL. | Horario valido. |
| Margen suficiente | Comprobar transicion viable. | Sin advertencias. |
| Margen insuficiente | Detectar traslado inviable. | `TRANSICION_INSUFICIENTE`. |
| Multiples conflictos | Confirmar acumulacion de conflictos. | Tres conflictos esperados. |
| Sobrecupo | Validar capacidad contra demanda estimada. | `SOBRECUPOS_AULA`. |
| Tipo de aula incompatible | Validar tipo de aula contra tipo de sesion. | `TIPO_AULA_INCOMPATIBLE`. |
| Datos opcionales incompletos | Reportar advertencia configurable. | `DATOS_OPCIONALES_INCOMPLETOS`. |
| Metricas | Verificar indicadores de validacion. | Totales y conteos por tipo. |
| No mutacion | Proteger arreglo de entrada. | Entrada original sin cambios. |
| Adaptacion GeneratorService | Validar adaptador sin BD real. | Campos normalizados. |
| Entrada no arreglo en adaptador | Robustez del adaptador. | Lista vacia. |
| Rendimiento basico | Ejecutar 300 sesiones sin conflictos. | Tiempo menor a 100 ms local. |

## Resultado observado
Ultima ejecucion local:

```text
tests 23
pass 23
fail 0
duration_ms 89.5146
```

## Cobertura
No existe script formal de coverage en `backend_node/package.json`. Por tanto, la evidencia actual corresponde a pruebas unitarias ejecutadas y verificables; la medicion porcentual de cobertura queda como mejora pendiente.

Una opcion futura seria agregar una herramienta como `c8` y un script `coverage`, sin reemplazar el runner actual:

```json
{
  "scripts": {
    "test": "node --test",
    "coverage": "c8 node --test"
  }
}
```
