# Supuestos y Restricciones

Este documento define supuestos y restricciones para el prototipo de plataforma academica semiautomatica. El alcance combina planificacion academica, oferta, horarios, validacion, KPI e intervencion humana.

## Supuestos academicos

| Supuesto | Descripcion |
|---|---|
| Estructura academica definida | Existen cursos, grupos/secciones, docentes, aulas y periodos academicos como base minima. |
| Oferta por periodo | La institucion define que cursos y secciones se ofrecen en cada periodo. |
| Demanda estimada | La demanda puede aproximarse mediante cupos o datos simulados mientras no exista prediccion formal. |
| Revision humana | Coordinadores y responsables de horarios revisan excepciones y aprueban decisiones finales. |

## Supuestos tecnicos

| Supuesto | Descripcion |
|---|---|
| Backend disponible | El prototipo usa Node.js/Express para exponer API y ejecutar generacion. |
| Base MySQL local | El entorno de prueba usa MySQL con scripts de inicializacion. |
| Frontend separado | La interfaz React/Vite consume la API backend. |
| Pruebas unitarias | HU03 cuenta con pruebas `node:test`; ampliar pruebas queda pendiente para otros modulos. |

## Supuestos de datos

| Supuesto | Descripcion |
|---|---|
| Datos simulados | Si no hay datos institucionales reales, se usan seeds o datasets controlados. |
| Disponibilidad simplificada | La disponibilidad docente puede expresarse por turnos mientras no exista modelo por dia/hora. |
| Calidad de entrada | El resultado del motor depende de datos completos y consistentes. |
| Identificadores consistentes | Backend, frontend y base de datos deben converger hacia contratos de datos comunes. |

## Supuestos de operacion

- El responsable de horarios puede ejecutar y revisar generaciones.
- El coordinador academico puede aceptar, rechazar o solicitar ajustes.
- Las excepciones deben documentarse si afectan restricciones duras o blandas.
- Los cambios posteriores a un horario validado deben controlarse en una fase futura.

## Restricciones duras

| Restriccion | Descripcion | Estado |
|---|---|---|
| No solapamiento docente | Un docente no puede dictar dos clases simultaneas. | HU03 / CSPMotor |
| No solapamiento aula | Un aula no puede asignarse a dos clases simultaneas. | HU03 / CSPMotor |
| No solapamiento grupo | Un grupo/seccion no debe tener dos clases al mismo tiempo. | HU03 |
| Hora valida | `horaInicio` debe ser menor que `horaFin`. | HU03 |
| Capacidad de aula | El aula debe soportar el cupo del grupo. | CSPMotor |
| Tipo de aula | El aula debe corresponder al tipo requerido. | CSPMotor |
| Disponibilidad docente | La clase debe ubicarse dentro de disponibilidad declarada. | Parcial |

## Restricciones blandas

| Restriccion | Descripcion | Estado |
|---|---|---|
| Transicion minima | Advertir si docente o grupo tiene poco tiempo para cambiar de aula. | HU03 |
| Horarios preferentes | Priorizar franjas menos extremas cuando sea posible. | Parcial en CSPMotor |
| Huecos academicos | Reducir espacios innecesarios entre sesiones relacionadas. | Parcial |
| Continuidad | Favorecer clases contiguas cuando mejore la calidad. | Parcial |

## Restricciones organizacionales

- El proyecto se desarrolla en un contexto universitario y con tiempo academico limitado.
- Cada integrante mantiene responsabilidad sobre modulos o documentacion.
- La automatizacion debe permitir revision humana y no imponer decisiones sin aprobacion.
- Los datos reales pueden depender de areas academicas externas al equipo.

## Restricciones de alcance

- No se implementa un sistema completo de matricula.
- No se implementa aun student sectioning completo.
- No se implementa autenticacion institucional.
- No se persisten historicos de KPI.
- No existe workflow formal de aprobacion/publicacion de horarios.

## Restricciones de calidad de datos

- Los datos incompletos pueden generar bloques invalidos o horarios no factibles.
- La disponibilidad docente simplificada limita la precision del modelo.
- Las inconsistencias entre schema, API y frontend deben tratarse como riesgo tecnico.
- Los datasets simulados deben identificarse como tales.

## Consideraciones legales y de proteccion de datos

En una version institucional, el sistema debera considerar:

- proteccion de datos personales de docentes y estudiantes;
- control de acceso por roles;
- auditoria de cambios;
- politicas de retencion de informacion academica;
- cumplimiento normativo aplicable a la institucion.

Estas consideraciones son futuras y no deben presentarse como implementadas en el prototipo actual.
