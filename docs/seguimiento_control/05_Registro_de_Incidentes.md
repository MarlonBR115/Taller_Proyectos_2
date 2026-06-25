# Registro de Incidentes

## Objetivo

Registrar problemas reales ocurridos durante la ejecucion. Un incidente describe un evento ocurrido; se diferencia de un riesgo, que representa una posibilidad futura, y de un impedimento, que puede continuar bloqueando trabajo.

| Codigo | Incidente | Fecha aproximada | Area | Impacto | Prioridad | Responsable sugerido | Accion correctiva | Estado | Evidencia |
|---|---|---|---|---|---|---|---|---|---|
| INC-01 | Ejecucion de npm desde una carpeta sin `package.json` | Durante configuracion/pruebas | Entorno | Comando no ejecutado | Baja | Equipo tecnico | Verificar carpeta antes de ejecutar npm y documentar rutas | Cerrado | `docs/capacitacion/01_guia_instalacion_ejecucion.md` |
| INC-02 | Acceso MySQL denegado para prueba de aceptacion | Durante pruebas backend | Testing / BD | Suite dependiente de entorno fallida | Alta | Responsable de Backend | Revisar `.env`, credenciales y aislar prueba MySQL | En seguimiento | `backend_node/tests/RF06_07_motor_csp.test.js`; registro IMP-01 |
| INC-03 | Cambios distribuidos en ramas con distinto alcance | Durante integraciones | Configuracion | Diferencias entre comandos y documentos visibles | Media | Scrum Master | Integrar por PR y revisar conflictos antes de fusionar | En seguimiento | Trazabilidad Jira/GitHub |
| INC-04 | Confusion entre trabajo documental y tecnico | Durante preparacion de entregables | Gestion | Riesgo de modificar archivos fuera de alcance | Media | Scrum Master | Definir archivos permitidos/prohibidos en cada tarea | Mitigado | Guias A005 |
| INC-05 | SonarQube no ejecutado en la rama principal | Durante AT002 | Calidad | Sin dashboard ni baseline verificable | Media | Responsable de Calidad | Integrar configuracion y ejecutar herramienta real | Abierto | IMP-02 |
| INC-06 | Coverage frontend no verificable en la evidencia vigente | Durante AT002 | Frontend / calidad | Sin reporte LCOV consolidado | Media | Responsable de Frontend | Preparar dependencias y ejecutar coverage en entorno controlado | Abierto | IMP-04; `frontend/package.json` |
| INC-07 | Comandos disponibles difieren segun rama | Durante consolidacion AT002/A005 | Configuracion | Documentacion puede contradecir `package.json` visible | Media | Responsable de Documentacion | Usar redaccion condicional hasta integrar la rama de calidad | Mitigado | `docs/capacitacion/03_guia_pruebas_calidad.md` |

## Seguimiento

Cada incidente debe vincularse con un impedimento, defecto o tarea cuando requiera trabajo posterior. El cierre exige evidencia de la accion correctiva, no solo una nota documental.
