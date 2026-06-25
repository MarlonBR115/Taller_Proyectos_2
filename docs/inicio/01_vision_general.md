# Vision General del Proyecto

## Problema principal

Las instituciones academicas con curriculo flexible deben coordinar cursos, docentes, aulas, grupos, demanda estimada, restricciones horarias y cambios operativos. Cuando esta planificacion se realiza manualmente o con herramientas aisladas, aparecen cruces de horario, uso ineficiente de aulas, asignaciones docentes poco equilibradas y baja trazabilidad de decisiones.

## Justificacion

El proyecto propone una plataforma academica semiautomatica para apoyar la planificacion, generacion, validacion y medicion de horarios. El sistema no reemplaza completamente al coordinador academico ni al responsable de horarios; genera alternativas, detecta conflictos, calcula metricas y deja evidencia para que las personas revisen excepciones y aprueben decisiones finales.

## Alcance actual

El repositorio contiene un prototipo con:

- backend Node.js/Express conectado a MySQL;
- gestion base de docentes, cursos, aulas, periodos, grupos y horarios;
- motor CSP inicial para generacion de horarios;
- HU03 - Motor Anti-Cruces con pruebas unitarias, advertencias y metricas;
- frontend React/Vite para gestion y visualizacion base;
- documentacion SDD, riesgos, metricas y evidencias.

## Alcance futuro

Quedan como propuesta o mejora futura:

- estimacion formal de demanda academica;
- planificacion curricular completa por carrera, plan y ciclo;
- student sectioning o asignacion de estudiantes a secciones;
- flujos de aprobacion academica;
- persistencia historica de KPI por corrida;
- pruebas de integracion y carga;
- autenticacion, roles y auditoria institucional;
- exportacion o publicacion formal de horarios.

## Actores principales

| Actor | Rol en el proceso |
|---|---|
| Coordinador academico | Revisa oferta, restricciones, excepciones y aprueba horarios. |
| Responsable de horarios | Configura datos, ejecuta generacion y valida resultados. |
| Docente | Declara disponibilidad, restricciones y preferencias. |
| Area de registro academico | Publica horarios y gestiona cambios formales. |
| Estudiante | Consume la oferta y, en una fase futura, podria ser asignado a secciones. |
| Equipo tecnico | Mantiene backend, frontend, base de datos, pruebas y documentacion. |

## Beneficios esperados

- Reducir cruces de horario.
- Mejorar uso de aulas y recursos docentes.
- Medir calidad de horarios mediante KPI.
- Aumentar trazabilidad de decisiones academicas.
- Separar restricciones duras de preferencias o restricciones blandas.
- Permitir intervencion humana informada ante casos excepcionales.

## Limites del prototipo

- No es un sistema institucional completo.
- No implementa matricula completa de estudiantes.
- No persiste aun un historico formal de KPI.
- No cuenta con coverage formal automatizado.
- Algunas pruebas de concepto documentan ideas futuras que requieren implementacion.
- La calidad del resultado depende de la calidad de datos academicos de entrada.

## Diferencias de alcance

| Concepto | En este proyecto |
|---|---|
| Gestion academica integral | Vision amplia del proceso: oferta, docentes, aulas, horarios, validacion y KPI. |
| Programacion de horarios | Nucleo implementado parcialmente mediante `CSPMotor`, `GeneratorService` y HU03. |
| Matricula o student sectioning | Fase complementaria futura; no es el modulo principal actual. |
| Seguimiento de KPI | Parcial: existen metricas en memoria y documentacion; falta persistencia historica. |

## Principio de semiautomatizacion

El sistema debe apoyar decisiones academicas mediante generacion, validacion, alertas y metricas. La aprobacion final, la resolucion de excepciones, la correccion de datos y los cambios institucionales deben mantenerse bajo responsabilidad humana.
