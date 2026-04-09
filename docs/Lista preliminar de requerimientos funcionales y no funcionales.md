# Lista Preliminar de Requerimientos

---

## 1. Requerimientos Funcionales (RF)

| Código | Requerimiento | Descripción |
| :--- | :--- | :--- |
| **RF01** | Registro de estudiantes | El sistema debe permitir registrar estudiantes con datos como código, nombre, carrera y créditos acumulados. |
| **RF02** | Registro de docentes | El sistema debe permitir registrar docentes incluyendo su disponibilidad horaria y cursos que pueden dictar. |
| **RF03** | Registro de cursos | El sistema debe permitir registrar cursos con información como nombre, créditos, prerrequisitos y número de horas. |
| **RF04** | Registro de aulas | El sistema debe permitir registrar aulas indicando capacidad, tipo (laboratorio, teórica) y horarios disponibles. |
| **RF05** | Validación de matrícula | El sistema debe validar que el estudiante cumpla con prerrequisitos y límite de créditos permitido. |
| **RF06** | Generación automática de horarios | El sistema debe generar horarios de forma automática considerando todas las restricciones definidas. |
| **RF07** | Evitar conflictos de horarios | El sistema debe asegurar que no existan cruces para estudiantes, docentes ni aulas en el mismo tiempo. |
| **RF08** | Visualización de horarios | El sistema debe mostrar los horarios generados de forma clara (por estudiante, docente o aula). |
| **RF09** | Edición de información | El sistema debe permitir actualizar o eliminar datos de estudiantes, docentes, cursos y aulas. |
| **RF10** | Priorización de restricciones | El sistema debe permitir definir o considerar prioridades entre restricciones (por ejemplo, priorizar disponibilidad docente sobre aula). |

---

## 2. Requerimientos No Funcionales (RNF)

*   **RNF01 – Rendimiento:** El sistema debe generar un horario en un tiempo máximo aceptable (por ejemplo, menos de 10 segundos para una carga promedio).
*   **RNF02 – Usabilidad:** El sistema debe ser fácil de usar, con interfaz clara e intuitiva para usuarios no técnicos.
*   **RNF03 – Escalabilidad:** El sistema debe soportar un aumento en la cantidad de estudiantes, cursos y docentes sin perder rendimiento.
*   **RNF04 – Seguridad:** El sistema debe proteger la información mediante autenticación de usuarios y control de acceso.
*   **RNF05 – Mantenibilidad:** El código del sistema debe estar organizado y documentado para facilitar futuras modificaciones.
*   **RNF06 – Disponibilidad:** El sistema debe estar disponible la mayor parte del día.
*   **RNF07 – Compatibilidad:** El sistema debe funcionar en navegadores web modernos.