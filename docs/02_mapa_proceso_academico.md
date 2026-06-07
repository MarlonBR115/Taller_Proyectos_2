# Mapa del Proceso Academico Integral

Este documento describe el proceso academico completo que el proyecto busca apoyar de forma progresiva. El prototipo actual cubre parcialmente la programacion de horarios, validacion anti-cruces y metricas; otras etapas quedan como propuesta futura.

## 1. Planificacion curricular

Incluye carreras, planes de estudio, ciclos, asignaturas y prerequisitos. Define que cursos existen, como se relacionan y en que momento academico deberian ofrecerse.

**Estado actual:** documentado como contexto. No existe un modulo completo de planes curriculares o prerequisitos.

## 2. Estimacion de demanda academica

Considera cantidad esperada de estudiantes por curso, cursos criticos, alta o baja demanda y necesidad de abrir o cerrar secciones.

**Estado actual:** propuesto. El sistema trabaja con cupos/grupos, pero no calcula demanda historica ni predicciones.

## 3. Planificacion de oferta academica

Define cursos ofrecidos por periodo, numero de secciones, vacantes, modalidad y tipo de sesion.

**Estado actual:** parcial. Existen periodos, cursos y grupos/secciones base en el backend y la base de datos.

## 4. Asignacion docente

Relaciona disponibilidad docente, especialidad, carga horaria, limites de carga y preferencias.

**Estado actual:** parcial. El prototipo registra docentes y disponibilidad simplificada por turnos; la especialidad y limites avanzados quedan pendientes.

## 5. Programacion de horarios

Asigna bloques horarios, aulas, laboratorios, capacidad y recursos, evitando cruces de docente, aula y grupo/carrera/ciclo.

**Estado actual:** parcialmente implementado mediante `GeneratorService`, `CSPMotor`, tabla `schedules` y visualizacion base en frontend.

## 6. Validacion de restricciones

Separa restricciones duras, restricciones blandas, factibilidad, alertas y conflictos.

**Estado actual:** implementado parcialmente. HU03 valida cruces y bloques invalidos, y genera advertencias por transicion insuficiente. CSPMotor considera capacidad, tipo de aula, disponibilidad simplificada y no solapamiento docente/aula.

## 7. Matricula o asignacion de estudiantes a secciones

Incluye cupos, conflictos del estudiante, prioridades, cambios y asignacion a secciones.

**Estado actual:** mejora futura. El repositorio no implementa matricula completa ni student sectioning; solo maneja grupos/secciones como unidades para planificar horarios.

## 8. Revision humana

Participan coordinador academico, responsable de horarios, docentes y registro academico. Revisan excepciones, corrigen datos, ajustan prioridades y aprueban cambios.

**Estado actual:** enfoque conceptual. La plataforma debe apoyar esta revision con evidencia, no reemplazar la decision humana.

## 9. Publicacion del horario

Incluye horario preliminar, horario validado, horario publicado y cambios controlados.

**Estado actual:** parcial. Se pueden visualizar horarios generados, pero no existe flujo formal de publicacion, versionado o aprobacion.

## 10. Medicion de KPI

Evalua calidad del horario, uso de aulas, conflictos detectados, tiempo de generacion, satisfaccion de demanda y cambios posteriores.

**Estado actual:** parcial. HU03 y CSPMotor calculan algunas metricas en memoria; falta persistencia historica y tablero KPI.

## Cobertura actual del proceso

| Etapa | Estado en el prototipo |
|---|---|
| Planificacion curricular | Contexto documentado |
| Estimacion de demanda | Propuesto |
| Planificacion de oferta | Parcial |
| Asignacion docente | Parcial |
| Programacion de horarios | Parcialmente implementado |
| Validacion de restricciones | Parcialmente implementado |
| Matricula / student sectioning | Futuro |
| Revision humana | Conceptual |
| Publicacion | Parcial / futuro |
| KPI | Parcial |
