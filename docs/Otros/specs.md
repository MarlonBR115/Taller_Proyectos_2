# SPECS.md

# Resumen del Proyecto
**Nombre:** Sistema de Generación Óptima de Horarios Académicos en Entornos de Currículo Flexible.
**Objetivo:** Desarrollar una aplicación web inteligente (SPA + API REST) capaz de generar horarios académicos óptimos utilizando técnicas de modelado CSP (Constraint Satisfaction Problem) y optimización combinatoria.

**Stack Tecnológico:**
- Base de datos: MySQL (Esquema relacional estricto).
- Backend: Node.js, Express.js.
- Frontend: React.js (Single Page Application).

---

# Restricciones del sistema académico y Variables del Modelo CSP/COP
El sistema debe procesar las siguientes variables bajo restricciones duras y blandas:
- **Cursos:** Créditos, número de secciones, prerrequisitos obligatorios.
- **Docentes:** Disponibilidad horaria, carga máxima por periodo.
- **Estudiantes:** Límite de créditos permitidos (20–22 por estudiante), validación de prerrequisitos.
- **Aulas:** Capacidad máxima, tipo (teórica/laboratorio), disponibilidad.
- **Regla de Oro:** Cero solapamiento (cruces) de horarios para estudiantes, docentes y aulas.

---

# Requerimientos Funcionales (RF)

| Código | Requerimiento |
|---|---|
| **RF01-04** | CRUD completo para el registro de Estudiantes, Docentes, Cursos y Aulas. |
| **RF05** | Validación de matrícula (cumplimiento de prerrequisitos y límite de créditos). |
| **RF06** | Generación automática de horarios mediante el algoritmo CSP. |
| **RF07** | Prevención absoluta de conflictos/cruces de horarios. |
| **RF08** | Visualización interactiva de horarios por estudiante, docente o aula. |
| **RF09** | Edición manual y actualización de catálogos y horarios generados. |
| **RF10** | Configuración y priorización de restricciones (ej. priorizar disponibilidad de un docente especialista). |

---

# Requerimientos No Funcionales (RNF) - ISO/IEC 25010

- **RNF01 (Rendimiento):** El motor CSP debe generar un horario en menos de 10 segundos.
- **RNF02 (Usabilidad):** Interfaz SPA intuitiva y de rápida navegación.
- **RNF03 (Escalabilidad):** Capacidad para soportar variabilidad en la matrícula y aumento de entidades.
- **RNF04 (Seguridad):** Cumplimiento de OWASP Top 10, autenticación JWT, control de roles.
- **RNF05 (Mantenibilidad):** Código modular, documentado y desacoplado.
- **RNF08 (Sostenibilidad):** Prácticas de Green Software para la eficiencia energética del procesamiento en el servidor.

---

# Modelo de Base de Datos (MySQL)
Entidades principales:
- `Students` (id, code, name, accumulated_credits)
- `Professors` (id, name, max_hours)
- `Courses` (id, name, credits, required_hours, prerequisites)
- `Classrooms` (id, capacity, type)
- `Schedules` (id, course_id, professor_id, classroom_id, day, start_time, end_time)
- `Availabilities` (id, entity_type [prof/classroom], entity_id, day, start_time, end_time)

---

# Formalización del Modelo CSP/COP

## Definición del Problema

El sistema de generación de horarios académicos se modela como un problema de optimización de restricciones (Constraint Optimization Problem - COP), derivado de un Problema de Satisfacción de Restricciones (CSP).

El objetivo es encontrar una asignación válida de horarios para todos los grupos académicos cumpliendo restricciones duras (hard constraints) y optimizando restricciones blandas (soft constraints) relacionadas con la satisfacción académica.

---

# Variables de Decisión

Sea:

\[
G = \{g_1, g_2, ..., g_n\}
\]

el conjunto de grupos académicos.

Para cada grupo \(g_i\), se define la variable de decisión:

\[
X_i = (d_i, t_i, r_i)
\]

Donde:

- \(d_i\): día asignado
- \(t_i\): bloque horario inicial
- \(r_i\): aula asignada

Cada variable representa una asignación completa de horario para un grupo académico.

---

# Dominios de las Variables

El dominio de cada variable:

\[
D_i
\]

está compuesto por todas las combinaciones válidas de:

- días permitidos
- bloques horarios disponibles
- aulas compatibles

Formalmente:

\[
D_i =
\{
(d,t,r)
\mid
availability(teacher_i,d,t)=true
\land
capacity(r)\ge quota(g_i)
\land
type(r)=requiredType(g_i)
\}
\]

---

# Restricciones Duras (Hard Constraints)

Las restricciones duras representan condiciones obligatorias que deben cumplirse para garantizar la validez del horario.

---

## R1 — No Solapamiento de Docentes

Un docente no puede impartir dos clases simultáneamente.

\[
teacher(g_i)=teacher(g_j)
\Rightarrow
time(X_i)\neq time(X_j)
\]

---

## R2 — No Solapamiento de Aulas

Un aula no puede ser utilizada por más de un grupo al mismo tiempo.

\[
room(X_i)=room(X_j)
\Rightarrow
time(X_i)\neq time(X_j)
\]

---

## R3 — Disponibilidad del Docente

El horario asignado debe pertenecer a los turnos disponibles del docente.

\[
time(X_i)\in availability(teacher_i)
\]

---

## R4 — Capacidad del Aula

La capacidad del aula debe ser suficiente para el grupo.

\[
capacity(room_i)\ge quota(group_i)
\]

---

## R5 — Compatibilidad del Aula

El tipo de aula debe coincidir con el requerido por el curso.

\[
type(room_i)=requiredType(group_i)
\]

---

## R6 — Integridad de Sesiones

Las horas requeridas de un curso deben asignarse en bloques contiguos.

Si un grupo requiere \(k\) horas:

\[
(t,t+1,...,t+k-1)
\]

deben pertenecer al mismo día y ser consecutivas.

---

# Restricciones Blandas (Soft Constraints)

Las restricciones blandas representan criterios de optimización orientados a mejorar la calidad del horario generado.

Estas restricciones no invalidan una solución, pero afectan su puntuación de calidad.

---

## S1 — Preferencia Horaria

Se priorizan horarios cercanos al mediodía y se penalizan horarios extremos.

La penalización se calcula como:

\[
P_{time}=|avgSlot-13|
\]

Donde:

- 13 representa la hora media preferida
- \(avgSlot\) es el promedio de horas del bloque asignado

---

## S2 — Minimización de Huecos Académicos

Se penalizan horarios que generan espacios vacíos entre clases consecutivas del mismo docente o curso.

---

## S3 — Continuidad Académica

Se bonifican asignaciones adyacentes para reducir desplazamientos y tiempos muertos.

---

# Función Objetivo (COP)

El problema se modela como un COP donde el objetivo es maximizar la satisfacción académica total.

Formalmente:

\[
\max F(X)
\]

donde:

\[
F(X)=
w_1C_{adjacency}
-
w_2C_{gaps}
-
w_3C_{timePenalty}
\]

Equivalentemente:

\[
\max
\sum_{i=1}^{n}
w_iC_i(X)
\]

Donde:

- \(C_{adjacency}\): beneficio por clases contiguas
- \(C_{gaps}\): penalización por huecos académicos
- \(C_{timePenalty}\): penalización por horarios extremos
- \(w_i\): peso asociado a cada criterio

---

# Pesos de Restricciones Blandas

| Restricción | Peso |
|---|---|
| Clases contiguas | +5 |
| Huecos académicos | -5 |
| Penalización horaria | Variable según distancia al mediodía |

+5: Premio por clases contiguas (evita desplazamientos innecesarios)
-5: Penalización por dejar un hueco académico

---

# Heurísticas de Optimización

## MRV (Minimum Remaining Values)

Antes del proceso de búsqueda, los grupos son ordenados desde el más restrictivo al menos restrictivo.

Criterios utilizados:
- mayor carga horaria semanal
- menor cantidad de aulas compatibles

Esto reduce la probabilidad de bloqueos durante el backtracking.

---

## LCV (Least Constraining Value)

Las asignaciones válidas son evaluadas mediante una función de satisfacción académica.

Las opciones con mejor puntuación son exploradas primero.

---

# Estrategia de Resolución

El motor utiliza Backtracking CSP:

1. Seleccionar variable según MRV
2. Generar asignaciones válidas
3. Ordenar asignaciones usando LCV
4. Asignar temporalmente
5. Continuar recursivamente
6. Si ocurre conflicto:
   - deshacer asignación
   - probar siguiente alternativa

---

# Complejidad Computacional

La generación de horarios académicos pertenece a la categoría de problemas NP-Hard debido al crecimiento combinatorio de las posibles asignaciones.

El uso de heurísticas MRV y LCV reduce significativamente el espacio de búsqueda y mejora el rendimiento práctico del sistema.

---

# Correspondencia con la Implementación

| Concepto CSP/COP | Implementación |
|---|---|
| Variables CSP | `assignment` |
| Restricciones duras | `isValidAssignment()` |
| Disponibilidad docente | `isTeacherAvailable()` |
| MRV | `sortGroupsByMRV()` |
| LCV | `calculateStudentSatisfactionScore()` |
| Backtracking | `solve()` |
| Función objetivo | `score` |
