# Registro de Impedimentos

**Proyecto:** Sistema de Generación Óptima de Horarios Académicos en Entornos de Currículo Flexible
**Scrum Master:** Alejandro Espíritu Campos

| Impedimento # | Fecha de Registro | Descripción del Impedimento y el Impacto en el Proyecto | Prioridad | Reportado por | Fecha tope de Resolución | Estado | Fecha de Resolución | Resolución / Comentarios |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| IMP-001 | 28/04/2026 | **CORS bloqueando peticiones:** El frontend (Vite en puerto 5173) no podía comunicarse con el backend (Express en puerto 3000). Impacto: Retraso en pruebas de integración. | Alta | Fabian Guzman | 30/04/2026 | Cerrado | 29/04/2026 | Se instaló y configuró la librería `cors` en el `backend_node`. |
| IMP-002 | 02/05/2026 | **Estructura de la Base de Datos ambigua:** Dudas respecto a la relación de cardinalidad entre Aulas y Horarios. Impacto: Bloqueo parcial en la creación del esquema SQL. | Media | Luis Quispe | 04/05/2026 | Cerrado | 03/05/2026 | Se realizó una reunión rápida para validar el archivo `schema.sql` y `alter.sql`. |
| IMP-003 | 05/05/2026 | **Definición visual de cruces:** El componente `ScheduleGrid.jsx` es complejo de maquetar sin datos reales, dificultando visualizar los cruces de horario. Impacto: Lentitud en el desarrollo UI. | Media | Fabian Guzman | 08/05/2026 | Abierto | - | Se acordó usar un JSON estático inyectado temporalmente hasta que el endpoint esté listo. |
