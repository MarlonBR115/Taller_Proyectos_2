# Registro de Impedimentos del Proyecto

## Datos generales

| Campo | Detalle |
|---|---|
| Proyecto | Sistema de Generacion Optima de Horarios Academicos en Entornos de Curriculo Flexible |
| Curso | Taller de Proyectos 2 |
| Sprint | SCRUM Sprint 4 |
| Tarea Jira | A005 - Documentacion: Registro de Impedimentos y Documentacion de Capacitacion |
| Responsable | Scrum Master y Responsable de Documentacion y Calidad |
| Fecha de actualizacion | 24/06/2026 |
| Estado | Vigente para seguimiento |

## Objetivo

Registrar obstaculos que pueden frenar o condicionar el avance del equipo, asignar responsables sugeridos y definir acciones concretas de desbloqueo. Este registro complementa el [Registro de Riesgos y Oportunidades](01_Registro_de_Riesgos_y_Oportunidades.md), pero no lo reemplaza.

## Definicion de impedimento

Un impedimento es cualquier obstaculo tecnico, organizacional, de datos, herramientas, entorno o coordinacion que dificulta o detiene una actividad necesaria del proyecto. Su registro permite hacerlo visible, asignar seguimiento y evitar que permanezca sin responsable.

## Criterios de clasificacion

| Criterio | Valores sugeridos |
|---|---|
| Tipo | Tecnico, entorno, datos, calidad, organizacional, herramientas o documentacion |
| Prioridad | Alta, media o baja |
| Impacto | Alto, medio o bajo |
| Estado | Abierto, en seguimiento, bloqueado, mitigado o cerrado |
| Responsable sugerido | Rol que coordina el desbloqueo, no necesariamente quien ejecuta todo el trabajo |
| Accion de desbloqueo | Actividad verificable necesaria para reducir o cerrar el impedimento |

## Registro vigente

| Codigo | Tipo | Impedimento | Descripcion | Impacto | Prioridad | Responsable sugerido | Accion de desbloqueo | Estado | Evidencia relacionada |
|---|---|---|---|---|---|---|---|---|---|
| IMP-01 | Entorno / testing | Dependencia de MySQL local para algunas pruebas | Existe una prueba de aceptacion del motor que requiere MySQL, credenciales validas y datos preparados. Esto reduce la reproducibilidad fuera del entorno del desarrollador. | Alto | Alta | Responsable de Backend | Separar pruebas puras de pruebas con MySQL, documentar variables de entorno y preparar una BD de pruebas. | Abierto | `backend_node/tests/RF06_07_motor_csp.test.js`; `backend_node/package.json` |
| IMP-02 | Herramientas / calidad | SonarQube pendiente de configuracion y ejecucion real | No existe `sonar-project.properties` ni evidencia de un dashboard SonarQube en el estado actual del repositorio. | Medio | Alta | Responsable de Calidad | Configurar SonarQube o SonarCloud, ejecutar un baseline y registrar metricas reales. | Abierto | `docs/03_requerimientos.md`; `README.md` |
| IMP-03 | Calidad / testing | Coverage backend pendiente de consolidacion | La configuracion de coverage con `c8` forma parte del trabajo AT002. Su disponibilidad en el flujo principal depende de que la rama de calidad sea integrada y verificada en `main`. | Medio | Alta | Responsable de Backend y Calidad | Integrar la configuracion AT002, ejecutar el script reproducible y publicar solo resultados generados realmente. | En seguimiento | `backend_node/package.json`; `docs/ejecucion/evidencia-tdd-hu03.md` |
| IMP-04 | Calidad / frontend | Coverage frontend pendiente de verificacion | El frontend define scripts Jest de coverage, pero no existe evidencia versionada de una ejecucion vigente. | Medio | Media | Responsable de Frontend | Instalar dependencias, ejecutar `npm.cmd run test:coverage` y documentar el resultado real. | En seguimiento | `frontend/package.json`; `frontend/jest.config.js` |
| IMP-05 | Accesibilidad | Validacion WCAG pendiente | No existe evidencia de evaluacion automatica con Lighthouse o axe ni una revision manual completa de teclado, foco y lectores de pantalla. | Medio | Media | Responsable de Frontend y Calidad | Ejecutar checklist WCAG, Lighthouse/axe y registrar hallazgos priorizados. | Abierto | `frontend/src/`; `docs/01_vision_general.md` |
| IMP-06 | Usabilidad | Evaluacion SUS sin participantes reales | No se dispone de respuestas de usuarios reales para calcular un puntaje SUS verificable. | Medio | Media | Product Owner y Responsable de Calidad | Preparar instrumento, convocar participantes y conservar respuestas anonimizadas. | Abierto | `docs/01_vision_general.md`; `docs/02_mapa_proceso_academico.md` |
| IMP-07 | Datos / metricas | Persistencia historica de KPI pendiente | Las metricas del motor se calculan en memoria o se documentan, pero no existe historico persistido por corrida. | Medio | Media | Responsable de Backend | Definir una propuesta de persistencia en una tarea futura, sin modificar el schema fuera de alcance. | Abierto | `docs/seguimiento_control/02_KPI_y_Metricas.md`; `docs/ejecucion/metricas-hu03.md` |
| IMP-08 | Entorno / datos | Base de datos de pruebas separada pendiente | Las pruebas que usan MySQL pueden afectar o depender de datos locales de demostracion. | Alto | Alta | Responsable de Backend y Scrum Master | Crear estrategia de BD test, seed controlado y limpieza posterior. | Abierto | `database/schema.sql`; `backend_node/seed_db.js`; `backend_node/seed_massive.js` |
| IMP-09 | Seguridad | Mitigaciones OWASP pendientes de baseline | La documentacion menciona OWASP, pero no existe una matriz tecnica vigente ni evidencia de mitigaciones como autenticacion, autorizacion, validacion formal o cabeceras de seguridad. | Alto | Alta | Responsable de Backend y Calidad | Ejecutar revision OWASP, priorizar controles y aplicar cambios solo con pruebas. | Abierto | `docs/inicio/ENFOQUE.md`; `backend_node/src/app.js` |
| IMP-10 | Documentacion / transferencia | Capacitacion operativa y tecnica en consolidacion | La informacion estaba distribuida entre README, SDD y evidencias, sin una ruta de aprendizaje unica para nuevos responsables. | Medio | Alta | Responsable de Documentacion y Calidad | Mantener y validar las guias de `docs/capacitacion/` en cada cambio relevante. | Mitigado | `docs/capacitacion/README.md`; guias A005 |

## Relacion con el registro historico

El archivo [02_Registro_de_Impedimentos.md](02_Registro_de_Impedimentos.md) se conserva como evidencia historica de impedimentos anteriores. Este documento `04_Registro_de_Impedimentos.md` es la referencia vigente para A005.

## Plan de seguimiento

- Revisar el registro al menos una vez por sprint y antes de cada entrega academica.
- El Scrum Master coordina la revision; cada responsable tecnico actualiza evidencia y estado.
- Un impedimento se cierra cuando la accion de desbloqueo fue ejecutada, existe evidencia verificable y ya no bloquea el trabajo.
- Si el impedimento requiere desarrollo, debe vincularse con una tarea Jira, rama, commit y Pull Request.
- No cerrar impedimentos solo por haberlos documentado; la documentacion es una medida de control, no la solucion tecnica.

## Conclusion

Los impedimentos actuales son controlables si se mantienen visibles y con acciones verificables. Las prioridades inmediatas son mejorar la reproducibilidad de pruebas, preparar herramientas de calidad, disponer de una base de pruebas separada y mantener la transferencia de conocimiento mediante las guias de capacitacion.
