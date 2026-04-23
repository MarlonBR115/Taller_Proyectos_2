# SPECS.md

# Resumen del Proyecto
**Nombre:** Sistema de Generación Óptima de Horarios Académicos en Entornos de Currículo Flexible.
**Objetivo:** Desarrollar una aplicación web inteligente (SPA + API REST) capaz de generar horarios académicos óptimos utilizando técnicas de modelado CSP (Constraint Satisfaction Problem) y optimización combinatoria.

**Stack Tecnológico:**
- Base de datos: MySQL (Esquema relacional estricto).
- Backend: Node.js, Express.js.
- Frontend: React.js (Single Page Application).

---

# Restricciones y Variables del Modelo CSP
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