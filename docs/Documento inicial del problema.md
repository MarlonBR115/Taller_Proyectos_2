# Documento Inicial del Problema

## 1. Descripción del problema
Las universidades con currículo flexible presentan dificultades al momento de generar horarios académicos, debido a la alta variabilidad en la matrícula, la disponibilidad limitada de recursos y la existencia de múltiples restricciones que deben cumplirse simultáneamente. Esto genera conflictos como cruces de horarios, uso ineficiente de aulas y dificultades para que los estudiantes lleven sus cursos correctamente.

## 2. Problema central
La dificultad para generar horarios académicos óptimos que satisfagan todas las restricciones académicas, operativas y de disponibilidad de recursos, sin generar conflictos.

## 3. Variables del problema
*   **Cursos:** créditos, horarios y prerrequisitos.
*   **Docentes:** disponibilidad y especialidad.
*   **Estudiantes:** matrícula y cursos elegidos.
*   **Aulas:** capacidad y tipo.
*   **Horarios:** bloques de tiempo disponibles.

## 4. Stakeholders (actores)
*   **Estudiantes:** Requieren horarios sin cruces y acorde a sus necesidades.
*   **Docentes:** Necesitan horarios compatibles con su disponibilidad.
*   **Coordinadores académicos:** Supervisan la planificación.
*   **Administradores:** Gestionan recursos e información.

## 5. Restricciones identificadas
*   Prerrequisitos entre cursos.
*   Límite de créditos por estudiante (20–22).
*   Disponibilidad de docentes.
*   Disponibilidad de estudiantes.
*   Disponibilidad de aulas.
*   No cruce de horarios.

## 6. Ambigüedades del problema
*   No se especifica cómo priorizar restricciones.
*   No está claro si todas las restricciones tienen el mismo peso.
*   No se define qué significa exactamente “horario óptimo”.
*   No se indica cómo manejar conflictos entre estudiantes y docentes.

## 7. Supuestos iniciales
*   Todos los datos (docentes, cursos, aulas) están disponibles.
*   Los estudiantes cumplen prerrequisitos antes de matricularse.
*   Las aulas tienen capacidad suficiente.
*   Las restricciones más importantes son las académicas.

## 8. Naturaleza del problema
Este es un problema complejo porque:
*   Tiene muchas variables relacionadas entre sí.
*   No hay una única solución correcta.
*   Requiere optimización.
*   Cambia constantemente.