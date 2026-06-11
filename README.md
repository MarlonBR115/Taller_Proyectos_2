# Sistema de Generacion Optima de Horarios Academicos en Entornos de Curriculo Flexible

![Estado: En Desarrollo](https://img.shields.io/badge/Estado-En%20Desarrollo-blue)
![Curso: Taller de Proyectos 2](https://img.shields.io/badge/Curso-Taller%20de%20Proyectos%202-brightgreen)

El sistema genera, valida, mide y recomienda. No reemplaza totalmente la intervencion humana: coordinadores, responsables de horarios, docentes y registro academico conservan la revision de excepciones, aprobacion final y control de cambios.

1. [Descripción General](#1-descripción-general)
2. [Problemática Abordada](#2-problemática-abordada)
3. [Objetivo del Proyecto](#3-objetivo-del-proyecto)
4. [Equipo de Trabajo y Roles](#4-equipo-de-trabajo-y-roles)
5. [Estado Actual](#5-estado-actual)
6. [Estructura del Repositorio](#6-estructura-del-repositorio)
7. [📚 Documentación del Proyecto](#7--documentación-del-proyecto)
8. [🚀 Guía Rápida de Inicio](#8--guía-rápida-de-inicio)

(Evaluación de GreenSoftware en las ramas test-greensoftware y test-greensoftware-mejoras)

La planificacion academica flexible combina demanda de cursos, docentes, aulas, cupos, disponibilidad, secciones y restricciones de horario. Sin apoyo tecnico, el proceso puede generar cruces, sobreuso de aulas, baja trazabilidad y dificultad para justificar decisiones academicas.

## 1. Descripción General
Este repositorio corresponde al proyecto universitario desarrollado en el curso **Taller de Proyectos 2**. El propósito principal es desarrollar un sistema funcional con una organización adecuada del repositorio, consolidando la documentación y la base para el trabajo colaborativo del equipo.

El contenido está orientado a la definición del problema, la visión del proyecto, la organización documental y la implementación de requerimientos funcionales y no funcionales.

## Alcance futuro

- Planificacion curricular completa por carrera, plan y ciclo.
- Estimacion formal de demanda academica.
- Student sectioning o asignacion de estudiantes a secciones.
- Persistencia historica de KPI.
- Flujo formal de aprobacion, publicacion y cambios controlados.
- Autenticacion, roles, auditoria y exportaciones institucionales.

## Tecnologias reales

| Capa | Tecnologia |
|---|---|
| Backend | Node.js, Express, CommonJS |
| Base de datos | MySQL, `mysql2/promise` |
| Frontend | React, Vite |
| Pruebas | `node:test` |
| Documentacion | Markdown |

## 3. Objetivo del Proyecto
Desarrollar una propuesta orientada a la generación óptima de horarios académicos en entornos de currículo flexible, considerando las restricciones académicas y operativas identificadas.

El objetivo general es implementar un sistema completo y robusto para la resolución automatizada de horarios, mediante el uso de heurísticas y reglas de negocio adaptables, facilitando la gestión del entorno académico.

## Modulos principales

| Modulo | Archivo principal | Estado |
|---|---|---|
| API backend | `backend_node/server.js` | CRUD y endpoint de generacion. |
| Orquestador | `backend_node/GeneratorService.js` | Conecta datos MySQL con el motor CSP. |
| Motor CSP | `backend_node/src/services/CSPMotor.js` | Backtracking con restricciones y heuristicas. |
| Motor Anti-Cruces HU03 | `backend_node/src/services/motorAntiCruces.js` | Validacion de cruces, advertencias y metricas. |
| Pruebas HU03 | `backend_node/tests/motorAntiCruces.test.js` | Pruebas unitarias con `node:test`. |
| Frontend | `frontend/src/` | Gestion y visualizacion base. |

## Documentacion principal

- [Indice documental](docs/README.md)
- [Vision general](docs/01_vision_general.md)
- [Mapa del proceso academico](docs/02_mapa_proceso_academico.md)
- [Requerimientos](docs/03_requerimientos.md)
- [Supuestos y restricciones](docs/04_supuestos_y_restricciones.md)
- [SDD](docs/sdd/README.md)
- [Ejecucion y evidencias](docs/ejecucion/README.md)
- [Seguimiento y control](docs/seguimiento_control/README.md)
- [Investigacion base](docs/referencias/01_investigacion_base.md)

## Estado del proyecto

## 5. Estado Actual
Actualmente, el proyecto se encuentra en fase de desarrollo activo. En esta etapa se prioriza:

- La implementación del motor de generación de horarios (CSP).
- El desarrollo de las interfaces frontend en React y servicios del backend en Node.
- El cumplimiento de los requerimientos funcionales y métricas SMART (RNF).
- La iteración en funcionalidades de gestión académica.
- El aseguramiento de calidad (pruebas, cobertura de código y revisión).

```bash
cd backend_node
npm install
node init_db.js
node seed_db.js
node server.js
```

Backend por defecto:

```text
.
|-- README.md
|-- backend/                 # Componente de lógica y servicios
|   |-- README.md
|   `-- tests/
|       `-- README.md
|-- docs/                    # Documentación principal del proyecto
|   |-- declaracion-equipo.md
|   |-- Declaración de la visión del proyecto.md
|   |-- Documento inicial del problema.md
|   |-- Kickoff Project Charter.docx
|   |-- Lista preliminar de requerimientos funcionales y no funcionales.md
|   |-- Selección del enfoque del proyecto.md
|   |-- Supuestos y restricciones.md
|   |-- cierre/              # Documentación de cierre
|   |-- ejecucion/           # Requerimientos y materiales de ejecución
|   |-- inicio/              # Documentos base del proyecto
|   |-- Otros/               # Documentos complementarios
|   `-- seguimiento_control/ # Seguimiento y control del proyecto
`-- frontend/                # Componente de interfaz de usuario
    |-- README.md
    `-- tests/
        `-- README.md
```

## Ejecucion del frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend por defecto:

```text
http://localhost:5173
```

## Pruebas disponibles

Pruebas unitarias actuales de HU03:

```bash
cd backend_node
npm.cmd test
```

No existe coverage formal configurado actualmente.
