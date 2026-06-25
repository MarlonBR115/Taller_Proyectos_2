# Registro de Defectos

## Objetivo

Consolidar defectos tecnicos o documentales verificables que requieren correccion o seguimiento.

| Codigo | Defecto | Tipo | Severidad | Estado | Correccion aplicada | Validacion | Evidencia |
|---|---|---|---|---|---|---|---|
| DEF-01 | Referencias absolutas sobre inexistencia de `docs/calidad/` | Documental | Media | Corregido | Se uso redaccion condicional respecto de la integracion AT002 | Revision de textos A005 | `docs/capacitacion/README.md` |
| DEF-02 | Sprint incorrecto en registro A005 | Documental | Media | Corregido | Se actualizo a `SCRUM Sprint 4` | Revision contra Jira indicada por el equipo | `04_Registro_de_Impedimentos.md` |
| DEF-03 | Comandos `test:coverage` y `test:mysql` descritos sin considerar ramas | Documental/configuracion | Media | Corregido | Se documento su dependencia de la integracion AT002 | Revision de capacitacion | `docs/capacitacion/03_guia_pruebas_calidad.md` |
| DEF-04 | Prueba MySQL mezclada potencialmente con suite reproducible | Testing | Alta | Pendiente de consolidacion | Separacion preparada en AT002, sujeta a integracion en main | Ejecutar scripts tras fusion | IMP-01 e INC-02 |
| DEF-05 | Coverage global inferior al objetivo de la consigna | Calidad | Media | Pendiente | Ampliar pruebas de `CSPMotor`, `GeneratorService` y rutas | Reporte real AT002 cuando este integrado | IMP-03 |
| DEF-06 | Validacion automatica WCAG pendiente | Accesibilidad | Media | Pendiente | Ejecutar Lighthouse/axe y corregir componentes priorizados | Informe WCAG futuro | IMP-05 |
| DEF-07 | Ausencia de autenticacion/autorizacion | Limitacion tecnica | Alta | Pendiente / fuera del alcance actual | Definir seguridad institucional en fase futura | Pruebas de seguridad cuando se implemente | `docs/03_requerimientos.md`; IMP-09 |

## Criterio de cierre

Un defecto se marca como corregido cuando existe cambio identificado y validacion reproducible. Las limitaciones fuera del alcance se mantienen visibles y no se presentan como resueltas.
