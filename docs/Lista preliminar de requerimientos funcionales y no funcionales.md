# Lista Preliminar de Requerimientos

---

## 1. Requerimientos Funcionales (RF)

| Código | Requerimiento | Descripción |
| :--- | :--- | :--- |
| **RF01** | Registro de estudiantes | El sistema debe permitir el registro de estudiantes, validando y almacenando obligatoriamente su código universitario (único), nombre completo, carrera y cantidad de créditos acumulados. |
| **RF02** | Registro de docentes | El sistema debe permitir asignar la disponibilidad horaria de cada docente en bloques mínimos de 1 hora y vincular al docente con un máximo definido de cursos que está capacitado para dictar. |
| **RF03** | Registro de cursos | El sistema debe permitir crear cursos especificando obligatoriamente su nombre, créditos académicos (1-5), códigos de cursos prerrequisito y el total de horas teóricas/prácticas semanales. |
| **RF04** | Registro de aulas | El sistema debe registrar las aulas indicando su capacidad máxima de aforo (numérica), tipo (teórica o laboratorio) y una matriz de disponibilidad por horas semanales. |
| **RF05** | Validación de matrícula | Al procesar una matrícula, el sistema debe rechazar el registro y mostrar un mensaje de error si el estudiante no tiene aprobados los prerrequisitos del curso o si excede el límite máximo de créditos de su plan. |
| **RF06** | Generación automática de horarios | El sistema debe ejecutar el algoritmo de generación (CSP) y producir un horario que asigne el 100% de los cursos obligatorios sin superar la capacidad de aforo de las aulas ni las horas contratadas de los docentes. |
| **RF07** | Evitar conflictos de horarios | El motor de horarios debe validar matemáticamente que existan cero (0) cruces de horario para un mismo docente, una misma aula, o una misma sección en el horario generado. |
| **RF08** | Visualización de horarios | El sistema debe mostrar el horario generado en una interfaz gráfica de calendario semanal interactivo y permitir su exportación a formato PDF. |
| **RF09** | Edición de información | El sistema debe proveer módulos CRUD (Crear, Leer, Actualizar, Eliminar) para estudiantes, docentes, cursos y aulas, accesibles exclusivamente por usuarios con el rol de Administrador. |
| **RF10** | Priorización de restricciones | El sistema debe permitir al administrador asignar niveles de peso (Alto, Medio, Bajo) a las heurísticas del algoritmo CSP antes de ejecutar la generación de horarios. |

---

## 2. Requerimientos No Funcionales (RNF)

*   **RNF01 – Rendimiento:** El sistema debe generar un horario completo para una carga de hasta 500 estudiantes y 50 cursos en un tiempo máximo de 15 segundos.
*   **RNF02 – Usabilidad:** Un usuario administrador debe poder iniciar la generación de un nuevo horario en menos de 5 clics desde la pantalla principal.
*   **RNF03 – Escalabilidad:** El backend debe soportar 200 peticiones concurrentes de visualización de horarios con un tiempo de respuesta promedio menor a 2 segundos.
*   **RNF04 – Seguridad:** El acceso al sistema debe estar protegido mediante tokens JWT, y las contraseñas deben almacenarse encriptadas con Bcrypt. La sesión debe expirar tras 30 minutos de inactividad.
*   **RNF05 – Mantenibilidad:** El código fuente crítico (motor CSP) debe mantener una cobertura de pruebas unitarias (Test Coverage) mínima del 70%.
*   **RNF06 – Disponibilidad:** El sistema web debe garantizar un Uptime (tiempo en línea) del 99.5% durante el mes crítico de matrículas.
*   **RNF07 – Compatibilidad:** La interfaz web debe renderizarse sin errores de consola en las dos últimas versiones estables de Google Chrome, Mozilla Firefox y Microsoft Edge en resoluciones desde 1024x768.