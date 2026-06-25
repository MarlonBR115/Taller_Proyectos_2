# Acta de Constitucion Revisada al Cierre

## Proposito

Revisar el acta y compromisos iniciales desde la perspectiva de cierre. Este documento no reemplaza el acta historica ni constituye un documento legal.

## Objetivo inicial

Desarrollar una solucion para generar horarios academicos optimos o factibles en un contexto de curriculo flexible, aplicando restricciones, heuristicas, gestion colaborativa y evidencia academica.

## Interesados

- Product Owner y equipo Scrum;
- coordinadores y responsables academicos;
- docentes y registro academico;
- evaluadores del curso;
- futuros mantenedores.

## Alcance comprometido y logrado

| Elemento | Comprometido | Logrado |
|---|---|---|
| Gestion academica base | Si | Parcial |
| Generacion de horarios | Si | Prototipo funcional |
| Prevencion de cruces | Si | HU03 implementada y probada |
| Interfaz web | Si | Prototipo React/Vite |
| Metricas | Si | Parciales, en memoria |
| Seguridad institucional | No como nucleo inicial | Pendiente |
| Matricula completa | No | No implementada |

## Restricciones

- tiempo academico y trabajo distribuido;
- dependencia de MySQL local;
- datos institucionales reales limitados;
- calidad y cobertura variables entre ramas;
- ausencia de flujo formal de aprobacion.

## Riesgos principales

Se mantienen como referencia los riesgos de integracion, datos, pruebas, KPI, validacion API, datos reales, documentacion y entorno local registrados en [Riesgos y Oportunidades](../seguimiento_control/01_Registro_de_Riesgos_y_Oportunidades.md).

## Criterios de exito

| Criterio de exito | Evidencia | Estado | Comentario |
|---|---|---|---|
| Prototipo genera horarios | `CSPMotor`, `GeneratorService` | Parcialmente cumplido | Depende de datos y entorno |
| Detecta cruces | HU03 y 23 pruebas documentadas | Cumplido para alcance HU03 | No sustituye validacion institucional |
| Gestiona entidades base | API y frontend | Parcialmente cumplido | Contratos de datos requieren normalizacion |
| Presenta evidencia de pruebas | Documentos de ejecucion | Cumplido parcialmente | Suites de entorno deben separarse |
| Mantiene trazabilidad | SDD, riesgos, impedimentos y matriz Jira/GitHub | Parcialmente cumplido | PR reales pendientes de consolidacion |
| Permite transferencia | `docs/capacitacion/` | Cumplido documentalmente | Debe mantenerse actualizado |

## Evaluacion final

El proyecto cumple el objetivo de demostrar una arquitectura y un prototipo para generacion y validacion de horarios. El cumplimiento es parcial respecto de una solucion institucional completa. La continuidad tecnica y de gestion queda explicitada en los registros y guias de cierre.
