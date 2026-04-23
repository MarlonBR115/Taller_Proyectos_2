# PROMPT.md

## Prompt 1: Estructura Base, Motor CSP y Prototipo UI (Sprint 1)
Lee los archivos `agent.md` y `specs.md`. Configura la estructura base del proyecto (`frontend/` con React y `backend/` con Node/Express + MySQL). Desarrolla inmediatamente el núcleo del motor de generación de horarios basado en CSP (Constraint Satisfaction Problem). Conecta este motor con una interfaz de usuario interactiva en el frontend para visualizar los horarios generados. Utiliza datos de prueba (seeders) en la base de datos para validar rápidamente que el prototipo funcional respeta las restricciones duras (20-22 créditos, sin solapamientos, disponibilidad) y cumple con el tiempo de respuesta esperado (< 10s).

## Prompt 2: CRUD y Catálogos Reales (Sprint 2)
Desarrolla los módulos de gestión (RF01 a RF04) para reemplazar los datos de prueba: Registro de estudiantes, docentes, cursos (con prerrequisitos) y aulas. Asegúrate de que la base de datos MySQL mantenga una estricta integridad referencial. Implementa los endpoints RESTful aplicando las validaciones de entrada correspondientes (OWASP) y conecta estas vistas con el frontend.

## Prompt 3: Integración Avanzada y Edición de Horarios (Sprint 3 y 4)
Integra completamente los catálogos reales con el motor CSP. Desarrolla el panel avanzado para la edición y priorización de restricciones (RF09, RF10). Permite que el coordinador académico modifique manualmente la grilla de horarios generada, asegurando que el sistema alerte en tiempo real si el ajuste manual viola alguna restricción de infraestructura o cruce de horarios.