# Informe Final de Lecciones Aprendidas

**Versión:** 1.0
**Fecha:** 24/06/2026
**Clasificación:** Documento de Cierre
**Curso:** Taller de Proyectos 2 - Ingeniería de Sistemas

---

## 1. Introducción

El presente informe consolida las lecciones aprendidas y retrospectivas realizadas a lo largo del proyecto _Sistema de Generación Óptima de Horarios Académicos en Entornos de Currículo Flexible_ durante el ciclo académico 2026. Su propósito es identificar qué prácticas resultaron efectivas para que otros equipos las adopten, y qué aspectos no funcionaron para evitarlos en el futuro.

La información aquí recopilada proviene de las minutas de reunión (Sprint 0 y Sprint 1), el registro de impedimentos, el registro de riesgos y oportunidades, y la experiencia documentada del equipo durante los Sprints 0, 1 y 2 del proyecto.

---

## 2. Equipo del Proyecto

| Rol | Responsable | Responsabilidad Principal |
|---|---|---|
| Product Owner | Marlon Bonifacio Rojas | Priorizar necesidades, validar alcance académico, alinear solución con el problema |
| Scrum Master | Alejandro Espiritu Campos | Facilitar organización, seguimiento y cumplimiento de acuerdos |
| Frontend Lead | Fabian Enrique Guzman Choque | Diseño y desarrollo de interfaz de usuario, estructura visual e interacción |
| Backend Lead | Luis Enrique Quispe Campos | Lógica de negocio, modelo de datos, APIs, procesamiento de restricciones |
| Documentación y Calidad | Rafael Fernandez Duran | Consolidar documentación, verificar coherencia, trazabilidad y evidencia de calidad |

---

## 3. Metodología de Trabajo

El equipo adoptó un enfoque híbrido (predictivo + ágil) con sprints de duración variable. Se realizaron reuniones de planificación, revisión y retrospectiva al cierre de cada sprint. Las herramientas utilizadas incluyeron:

- GitHub para control de versiones y gestión de código
- Jira para seguimiento de tareas y trazabilidad
- Reuniones virtuales para coordinación semanal
- Documentación en Markdown alojada en el repositorio

---

## 4. Resumen de Sprints

### 4.1 Sprint 0 — Iniciación (26/03/2026)

Sprint de arranque del proyecto. Se definió el equipo, los roles, el repositorio y la documentación inicial del problema.

- Declaración del equipo y asignación de roles
- Configuración del repositorio GitHub
- Definición inicial del problema y alcance

### 4.2 Sprint 1 — Base Técnica (hasta 06/05/2026)

| Área | Logro | Estado |
|---|---|---|
| Infraestructura | Repositorio inicializado, backend Node/Express, frontend React/Vite | Completado |
| Base de datos | Esquema MySQL con 6 tablas creado (schema.sql + alter.sql) | Completado |
| Motor CSP | Arquitectura inicial de CSPMotor con backtracking MRV/LCV | Completado |
| Validador HU03 | motorAntiCruces.js con pruebas unitarias iniciales | Completado |
| Pruebas | 23 tests unitarios HU03 (23 pass, 0 fail) | Completado |
| Documentación | Visión, requerimientos, SDD inicial, riesgos, KPIs | Completado |

Resultado: 100% de las historias planificadas completadas. Sin defectos críticos. Costo controlado dentro del presupuesto académico.

### 4.3 Sprint 2 — Integración y Pruebas (hasta 17/05/2026)

| Área | Logro | Estado |
|---|---|---|
| Pruebas de integración | 36 tests API con Supertest (36 pass, 0 fail) | Completado |
| HU03 Motor Anti-Cruces | Implementación completa con documentación SDD | Completado |
| Impedimentos | IMP-001 (CORS) cerrado, IMP-002 (BD) cerrado | Resuelto |
| Trazabilidad | Vinculación Jira-GitHub establecida | Completado |

Impedimento abierto: IMP-003 (ScheduleGrid sin datos reales, usa JSON estático).

---

## 5. ¿Qué Salió Bien? (What Went Well)

Las siguientes prácticas y decisiones resultaron efectivas y se recomienda mantenerlas en proyectos similares.

### 5.1 Separación Clara de Responsabilidades

La división frontend/backend con roles claramente definidos funcionó de manera excelente. Cada responsable tenía autonomía sobre su capa sin generar conflictos de código. Esto permitió avances paralelos sin bloqueos cruzados.

- **Lección:** Definir contratos de interfaz (API) al inicio del sprint.
- **Recomendación:** Mantener la separación en proyectos con equipos multidisciplinarios.

### 5.2 Cohesión y Confianza del Equipo

El equipo demostró gran cohesión y confianza técnica. La comunicación fluida y el compromiso individual permitieron resolver bloqueos rápidamente sin escalar a conflictos.

- **Lección:** La confianza interpersonal acelera la resolución de problemas.
- **Recomendación:** Invertir tiempo en dinámicas de equipo al inicio del proyecto.

### 5.3 Enfoque en Pruebas desde el Inicio

El motor anti-cruces (HU03) se desarrolló con TDD desde la primera iteración, logrando 23 pruebas unitarias y 36 de integración con 100% de aprobación.

- **Lección:** TDD temprano reduce la deuda técnica y facilita la refactorización.
- **Recomendación:** Incluir pruebas desde el Sprint 0 en servicios críticos.

### 5.4 Stack Tecnológico Uniforme (JavaScript Full-Stack)

El uso de JavaScript tanto en frontend (React) como en backend (Node.js) eliminó la necesidad de cambio de contexto entre lenguajes, acelerando el desarrollo.

- **Lección:** La homogeneidad tecnológica reduce la fricción cognitiva.
- **Recomendación:** Evaluar full-stack JavaScript para equipos pequeños.

### 5.5 Documentación Continua

La documentación se mantuvo actualizada en paralelo al desarrollo, siguiendo el enfoque SDD (Spec-Driven Development) con trazabilidad entre requisitos, especificaciones, pruebas y evidencia.

- **Lección:** Documentar durante la implementación evita la acumulación de deuda documental.
- **Recomendación:** Usar un enfoque SDD o similar desde el inicio.

---

## 6. ¿Qué No Funcionó? (What Went Wrong)

Los siguientes aspectos presentaron dificultades y deben considerarse para mitigación en proyectos futuros.

### 6.1 Integración Tardía del CSPMotor con la Base de Datos

El CSPMotor se desarrolló inicialmente con arreglos temporales en lugar de conectarse directamente a la base de datos. Acordado el 06/05 para completarse el 12/05, su integración real con MySQL quedó pendiente, limitando las pruebas de generación real.

- **Causa:** Priorización del desarrollo del algoritmo antes que la capa de persistencia.
- **Impacto:** Imposibilidad de probar generación con datos reales del seed.
- **Recomendación:** Conectar los servicios a la BD desde la primera iteración del backend.

### 6.2 Visualización ScheduleGrid con Datos Simulados

IMP-003 (ScheduleGrid visualization) permaneció abierto durante todo el proyecto. La grilla de horarios se renderizó con JSON estático inyectado manualmente, impidiendo la validación visual de los resultados del CSPMotor.

- **Causa:** Dependencia no resuelta entre frontend y backend para el contrato de datos.
- **Impacto:** La validación visual del CSPMotor no pudo realizarse de forma integrada.
- **Recomendación:** Definir contratos JSON al inicio del sprint y crear endpoints mock.

### 6.3 Persistencia de Métricas (In-Memory Only)

Las métricas de generación y validación solo existen en memoria durante la ejecución. No se implementó persistencia histórica, lo que impide la comparación entre ejecuciones y el análisis de tendencias.

- **Causa:** No se priorizó dentro del alcance del prototipo.
- **Impacto:** KPIs como KPI-08 (tiempo de generación/validación) no tienen trazabilidad histórica.
- **Recomendación:** Implementar tabla de métricas en MySQL como mejora post-MVP.

### 6.4 Validación de Entradas del API

No se implementó una capa formal de validación de tipos y campos en las solicitudes a la API REST. RT-05 se mantuvo activo como riesgo alto durante todo el proyecto.

- **Causa:** Enfoque en funcionalidad principal sobre robustez.
- **Impacto:** Riesgo de datos mal formados propagándose a la base de datos.
- **Recomendación:** Incorporar validación con express-validator o Joi en endpoints CRUD.

### 6.5 Cobertura de Pruebas sin Medición Formal

Aunque existen 23 pruebas unitarias y 36 de integración, no se configuró una herramienta de cobertura (c8, Istanbul). No es posible reportar un porcentaje de cobertura formal.

- **Causa:** No se configuró desde el inicio; quedó como mejora pendiente.
- **Impacto:** Imposibilidad de medir la calidad cuantitativa de las pruebas.
- **Recomendación:** Configurar c8 o Istanbul en el Sprint 0 de cualquier proyecto Node.js.

---

## 7. Análisis de Riesgos y Oportunidades

### 7.1 Riesgos Materializados

| Código | Riesgo | Severidad | Estado |
|---|---|---|---|
| RT-01 | Integración débil entre GeneratorService y motorAntiCruces | Crítica | Activo |
| RT-02 | Inconsistencias entre schema.sql, backend y frontend | Crítica | Activo |
| RT-03 | CSPMotor sin pruebas unitarias directas ni pruebas de carga | Alta | Activo |
| RT-04 | KPIs y métricas no persistentes (solo en memoria) | Alta | Activo |
| RT-05 | API con validación de entrada limitada | Alta | Activo |
| RO-01 | Datos reales de disponibilidad incompletos | Crítica | Activo |
| RO-02 | Documentación desactualizada o desalineada | Alta | Activo |
| RO-03 | Dependencia de entorno local MySQL/XAMPP | Alta | Activo |

### 7.2 Oportunidades Identificadas

| Código | Oportunidad | Prioridad | Estado |
|---|---|---|---|
| OP-01 | Usar métricas HU03 como base para KPI de calidad de horario | Alta | Identificada |
| OP-02 | Persistir métricas de generación/validación para comparar ejecuciones | Alta | Identificada |
| OP-03 | Crear pruebas de integración para /api/schedule/generate | Media | Identificada |
| OP-04 | Normalizar contratos de datos entre BD, backend y frontend | Alta | Identificada |
| OP-05 | Mejorar trazabilidad entre Jira, GitHub, SDD, pruebas y métricas | Media | Identificada |

---

## 8. Estado Final del Proyecto

### 8.1 Implementado

- API REST (Node.js/Express) con CRUD para docentes, cursos, aulas, grupos y periodos
- Base de datos MySQL con 6 tablas relacionales
- Motor CSP (CSPMotor.js): backtracking con heurísticas MRV y LCV
- Validador anti-cruces (motorAntiCruces.js / HU03): detección de cruces de docente, aula y grupo
- 23 pruebas unitarias HU03 (100% pass)
- 36 pruebas de integración API (100% pass)
- Pruebas E2E con Playwright
- Frontend React/Vite: CrudView genérico, ScheduleGrid, Sidebar
- Documentación completa: visión, requerimientos, SDD, riesgos, KPIs, trazabilidad
- Análisis Green Software y entrevistas simuladas a docentes

### 8.2 Pendiente / Mejora Futura

- Persistencia histórica de KPIs y métricas
- Medición formal de cobertura de pruebas (c8/Istanbul)
- Conexión del CSPMotor a la base de datos real
- ScheduleGrid con datos reales (actualmente usa JSON estático)
- Autenticación JWT y control de acceso por roles
- Asignación de estudiantes a secciones
- Exportación PDF de horarios
- Validación de prerrequisitos de cursos
- Límite de carga horaria máxima por docente
- Pruebas de carga y estrés
- Integración con sistemas académicos institucionales

---

## 9. Recomendaciones para Proyectos Futuros

Basado en las lecciones aprendidas, se formulan las siguientes recomendaciones:

### Definir contratos API al inicio del sprint

Evitar bloqueos entre frontend y backend estableciendo los formatos JSON antes de comenzar la implementación. Usar herramientas como Swagger/OpenAPI para documentar contratos.

### Conectar servicios a la BD desde la primera iteración

Evitar arreglos temporales o datos simulados en servicios críticos. La integración tardía genera deuda técnica y retrasa las pruebas de integración real.

### Configurar cobertura de pruebas en el Sprint 0

Herramientas como c8 (Node.js) deben configurarse al iniciar el proyecto, no al final. La cobertura debe medirse desde la primera prueba.

### Implementar persistencia de métricas desde el diseño

Las métricas de rendimiento y calidad deben almacenarse en la base de datos desde la primera versión para permitir análisis histórico y comparativo.

### Validar entradas de API con una capa formal

Express-validator, Joi o Zod deben integrarse desde el inicio en todos los endpoints CRUD para garantizar integridad de datos.

### Documentar durante la implementación, no después

El enfoque SDD (Spec-Driven Development) demostró ser efectivo. Mantener la documentación actualizada reduce la deuda documental al final del proyecto.

### Establecer entornos de prueba desde el Sprint 0

Contar con una base de datos de pruebas independiente y datos seed representativos permite validar el sistema de forma realista desde las primeras iteraciones.

---

## 10. Conclusiones

El proyecto _Sistema de Generación Óptima de Horarios Académicos en Entornos de Currículo Flexible_ logró establecer una base técnica sólida compuesta por un backend funcional con API REST, un motor CSP con backtracking y heurísticas MRV/LCV, un validador anti-cruces con 23 pruebas unitarias aprobadas, 36 pruebas de integración exitosas y un frontend base en React/Vite.

La separación clara de responsabilidades, la cohesión del equipo y el enfoque en pruebas desde el inicio fueron los factores que más contribuyeron al avance del proyecto. Las principales áreas de mejora identificadas son la integración temprana con la base de datos, la persistencia de métricas, la medición formal de cobertura y la validación robusta de entradas.

Se recomienda que los equipos futuros adopten las prácticas documentadas en la sección 9 de este informe, especialmente la definición temprana de contratos API y la configuración de herramientas de calidad desde el Sprint 0.

