# Documentacion de Ejecucion

Esta carpeta contiene evidencias tecnicas de implementacion, pruebas, metricas y pruebas de concepto del prototipo de generacion optima de horarios academicos.

## Referencias principales

| Documento | Proposito | Estado |
|---|---|---|
| [HU03 - Motor Anti-Cruces](hu03-motor-anti-cruces.md) | Describe la validacion de cruces de docente, aula y grupo. | Implementado y documentado. |
| [Evidencia TDD HU03](evidencia-tdd-hu03.md) | Registra pruebas unitarias de HU03 con `node:test`. | Vigente; coverage formal pendiente. |
| [Metricas HU03](metricas-hu03.md) | Explica metricas calculadas por el motor anti-cruces. | Vigente; persistencia historica pendiente. |
| [A003-02 - Heuristicas y reglas](a003-02-heuristicas-reglas.md) | Documenta restricciones duras/blandas y heuristicas MRV/LCV del `CSPMotor`. | Vigente como evidencia tecnica del motor. |
| [TP2UCP-41 - Tests de integracion API](tp2ucp-41-tests-integracion-api.md) | Describe alcance, estrategia y endpoints probados con Supertest. | Implementado con pool falso; persistencia real pendiente. |
| [Evidencia tests de integracion API](evidencia-tests-integracion-api.md) | Registra resultado de pruebas API backend. | Vigente; coverage formal pendiente. |
| [Requerimientos de ejecucion](REQUERIMENTOS.md) | Resume el alcance tecnico de ejecucion y redirige a los requerimientos principales. | Documento de apoyo. |

## Pruebas de concepto

| Documento | Proposito | Nota de alcance |
|---|---|---|
| [PoC - Datasets de prueba](poc-datasets-prueba.md) | Propone datasets controlados para validar el solver. | Debe verificarse contra scripts reales antes de presentarlo como implementado. |
| [PoC - Limites tecnicos del solver](poc-limites-tecnicos.md) | Propone timeout, iteraciones y metricas para el solver. | Contiene elementos propuestos que no deben presentarse como implementados si el archivo/configuracion no existe. |
| [PoC - Worker Threads](poc-worker-threads.md) | Describe una posible ejecucion del solver en worker thread. | Propuesta tecnica; requiere implementacion real antes de declararse funcional. |

## Criterio de lectura

- Los documentos HU03 son la referencia principal para validacion anti-cruces, TDD y metricas.
- Los KPI generales se consolidan en [KPI y Metricas](../seguimiento_control/02_KPI_y_Metricas.md).
- Los documentos PoC deben leerse como propuestas o evidencias exploratorias, no como funcionalidades finalizadas salvo que exista codigo asociado en el repositorio.
- Las metricas documentadas no deben confundirse con coverage formal ni con persistencia historica de KPI.
