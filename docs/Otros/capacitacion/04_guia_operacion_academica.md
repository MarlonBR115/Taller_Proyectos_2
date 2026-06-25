# Guia de Operacion Academica

## Proceso apoyado

El sistema apoya parcialmente:

- planificacion academica;
- gestion de cursos;
- gestion de docentes y disponibilidad simplificada;
- gestion de aulas y capacidad;
- gestion de periodos y grupos;
- generacion de horarios;
- validacion anti-cruces;
- revision humana del resultado.

## Roles

| Rol | Responsabilidad |
|---|---|
| Responsable academico | Define oferta, restricciones y criterios de aceptacion. |
| Coordinador de horarios | Revisa datos, genera propuestas y gestiona excepciones. |
| Docente | Proporciona disponibilidad y valida asignaciones relacionadas. |
| Equipo tecnico | Mantiene API, frontend, motores, pruebas y documentacion. |
| Evaluador | Revisa evidencia, trazabilidad, metricas y limitaciones. |

## Flujo general

1. Registrar o verificar periodo academico.
2. Registrar cursos, docentes y aulas.
3. Crear grupos/secciones con curso, docente y cupo.
4. Verificar disponibilidad y calidad de datos.
5. Ejecutar la generacion de horario.
6. Revisar conflictos, advertencias y metricas disponibles.
7. Corregir datos o restricciones cuando corresponda.
8. Volver a generar y validar.
9. Someter el resultado a revision y aprobacion humana.

## Naturaleza semiautomatica

El sistema genera, valida y recomienda. No reemplaza totalmente la decision humana: las excepciones, cambios institucionales y aprobacion final corresponden a responsables academicos.

## Limitaciones actuales

- la disponibilidad de datos reales puede ser incompleta;
- la matricula completa y el student sectioning no forman parte del nucleo implementado;
- la persistencia historica de KPI esta pendiente;
- no existe flujo formal de aprobacion o auditoria de cambios;
- la calidad de una propuesta depende de la calidad de los datos ingresados.

## Referencias

- [Mapa del proceso academico](../02_mapa_proceso_academico.md)
- [Requerimientos](../03_requerimientos.md)
- [Supuestos y restricciones](../04_supuestos_y_restricciones.md)
- [Metricas y KPI](../seguimiento_control/02_KPI_y_Metricas.md)
