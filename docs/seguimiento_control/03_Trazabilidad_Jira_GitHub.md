# Trazabilidad Jira, GitHub, Documentacion y Evidencias

Este documento define una trazabilidad minima entre tareas, ramas, Pull Requests, archivos modificados, pruebas, metricas y riesgos. Cuando no existe un dato real de GitHub o Jira en el repositorio, se marca como `pendiente`.

## Criterio de trazabilidad

Cada tarea relevante deberia relacionar:

- codigo Jira o identificador de tarea;
- nombre funcional o tecnico;
- rama Git utilizada;
- Pull Request, si existe;
- archivos relacionados;
- evidencia de pruebas, metricas o documentacion;
- estado real.

## Tabla de trazabilidad

| Codigo Jira | Nombre | Rama | PR | Archivos relacionados | Evidencia | Estado |
|---|---|---|---|---|---|---|
| A003-04 | HU03 / Motor Anti-Cruces y documentacion SDD | pendiente | pendiente | `backend_node/src/services/motorAntiCruces.js`; `backend_node/tests/motorAntiCruces.test.js`; `docs/ejecucion/hu03-motor-anti-cruces.md`; `docs/sdd/specs.md` | `docs/ejecucion/evidencia-tdd-hu03.md`; `docs/ejecucion/metricas-hu03.md` | Implementado parcialmente y documentado. |
| A004-03 | Gestion de Riesgos | pendiente | pendiente | `docs/seguimiento_control/01_Registro_de_Riesgos_y_Oportunidades.md` | Riesgos tecnicos, operativos, oportunidades y plan de seguimiento. | Documentado. |
| DOC-INT | Reorganizacion documental academica integral | pendiente | pendiente | `README.md`; `docs/README.md`; `docs/01_vision_general.md`; `docs/02_mapa_proceso_academico.md`; `docs/03_requerimientos.md`; `docs/04_supuestos_y_restricciones.md` | Indices, requerimientos, KPI y trazabilidad documental. | En revision. |

## Relacion con pruebas

La evidencia de pruebas automatizadas disponible actualmente corresponde principalmente a HU03:

```bash
cd backend_node
npm.cmd test
```

No se declara coverage formal porque no existe configuracion de cobertura en el proyecto.

## Relacion con metricas

Las metricas actuales se documentan en:

- [Metricas HU03](../ejecucion/metricas-hu03.md)
- [KPI y Metricas](02_KPI_y_Metricas.md)

## Relacion con riesgos

Los riesgos asociados a integracion, datos, pruebas y metricas se documentan en:

- [Registro de Riesgos y Oportunidades](01_Registro_de_Riesgos_y_Oportunidades.md)

## Recomendacion operativa

En futuras tareas, cada rama o PR deberia incluir en su descripcion:

- codigo Jira;
- archivos modificados;
- pruebas ejecutadas;
- metricas afectadas;
- riesgos mitigados o generados;
- enlaces a documentos actualizados.
