# Sistema de Generación Óptima de Horarios Académicos en Entornos de Currículo Flexible

![Estado: Sprint 0](https://img.shields.io/badge/Estado-Sprint%200%3A%20Inicio-blue)
![Curso: Taller de Proyectos 2](https://img.shields.io/badge/Curso-Taller%20de%20Proyectos%202-brightgreen)

## 📖 Índice

1. [Descripción General](#1-descripción-general)
2. [Problemática Abordada](#2-problemática-abordada)
3. [Objetivo del Proyecto](#3-objetivo-del-proyecto)
4. [Equipo de Trabajo y Roles](#4-equipo-de-trabajo-y-roles)
5. [Estado Actual (Sprint 0)](#5-estado-actual-sprint-0)
6. [Estructura del Repositorio](#6-estructura-del-repositorio)
7. [📚 Documentación del Proyecto](#7--documentación-del-proyecto)
8. [🚀 Guía Rápida de Inicio](#8--guía-rápida-de-inicio)

---

## 1. Descripción General
Este repositorio corresponde al proyecto universitario desarrollado en el curso **Taller de Proyectos 2**. En el **Sprint 0: Inicio del proyecto**, el propósito principal es organizar adecuadamente el repositorio, consolidar la documentación inicial y establecer una base formal para el trabajo colaborativo del equipo. 

El contenido actual está orientado a la definición del problema, la visión inicial del proyecto, la organización documental y la identificación preliminar de requerimientos.

---

## 2. Problemática Abordada
Las universidades que operan con esquemas de currículo flexible enfrentan dificultades en la planificación académica debido a la variabilidad en la matrícula, la disponibilidad limitada de recursos y la coexistencia de múltiples restricciones que deben satisfacerse simultáneamente.

Esta situación puede generar:
* Cruces de horarios.
* Uso ineficiente de aulas.
* Dificultades en la organización docente.
* Limitaciones para que los estudiantes estructuren adecuadamente su carga académica.

---

## 3. Objetivo del Proyecto
Desarrollar una propuesta orientada a la generación óptima de horarios académicos en entornos de currículo flexible, considerando las restricciones académicas y operativas identificadas en la etapa inicial del proyecto.

En el contexto específico del **Sprint 0**, el objetivo inmediato no es implementar el sistema completo, sino consolidar la documentación base, la organización del equipo y la estructura del repositorio para facilitar el desarrollo posterior del proyecto.

---

## 4. Equipo de Trabajo y Roles

| Integrante | Rol |
| :--- | :--- |
| **Marlon Bonifacio Rojas** | Product Owner |
| **Alejandro Espíritu Campos** | Scrum Master |
| **Fabian Enrique Guzman Choque** | Responsable de Frontend |
| **Luis Enrique Quispe Campos** | Responsable de Backend |
| **Rafael Fernández Durán** | Responsable de Documentación y Calidad |

*(Información extraída de la [Declaración del equipo del proyecto](docs/declaracion-equipo.md))*

---

## 5. Estado Actual (Sprint 0)
Actualmente, el proyecto se encuentra en una fase de inicio y organización. En esta etapa se prioriza:

- La definición y presentación formal del problema.
- La declaración de visión del proyecto.
- La identificación preliminar de requerimientos.
- La formalización de roles, normas y compromisos del equipo.
- La organización documental del repositorio para revisión académica.

---

## 6. Estructura del Repositorio

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
|   |-- inicio/              # Documentos base del Sprint 0
|   |-- Otros/               # Documentos complementarios
|   `-- seguimiento_control/ # Seguimiento y control del proyecto
`-- frontend/                # Componente de interfaz de usuario
    |-- README.md
    `-- tests/
        `-- README.md
```
## 7. 📚 Documentación del Proyecto

El repositorio ha migrado su documentación al formato `Markdown`. Para facilitar la navegación, los documentos se han clasificado en las siguientes categorías:

### 📌 Documentos de Gestión e Inicio
* 👥 [Declaración del equipo del proyecto](docs/declaracion-equipo.md)
* 📜 [Project Charter](docs/Kickoff%20Project%20Charter.docx)
* 🔭 [Declaración de visión del proyecto (Detallado)](docs/Declaración%20de%20la%20visión%20del%20proyecto.md)
* 🔭 [Declaración de visión del proyecto (Resumen)](docs/inicio/VISIÓN.md)
* 🚧 [Documento inicial del problema (Detallado)](docs/Documento%20inicial%20del%20problema.md)
* 🚧 [Documento inicial del problema (Resumen)](docs/inicio/PROBLEMA.md)

### ⚙️ Enfoque y Requerimientos
* 🎯 [Selección del enfoque del proyecto (Detallado)](docs/Selección%20del%20enfoque%20del%20proyecto.md)
* 🎯 [Selección del enfoque del proyecto (Resumen)](docs/inicio/ENFOQUE.md)
* 📋 [Lista preliminar de requerimientos (Completo)](docs/Lista%20preliminar%20de%20requerimientos%20funcionales%20y%20no%20funcionales.md)
* 📋 [Requerimientos preliminares (Resumen)](docs/ejecucion/REQUERIMENTOS.md)
* ⚠️ [Supuestos y restricciones](docs/Supuestos%20y%20restricciones.md)
* [HU03 - Motor Anti-Cruces](docs/ejecucion/hu03-motor-anti-cruces.md)
* [Evidencia TDD HU03](docs/ejecucion/evidencia-tdd-hu03.md)
* [Metricas HU03](docs/ejecucion/metricas-hu03.md)
* [SDD - Constitution](docs/sdd/constitution.md)
* [SDD - Agents](docs/sdd/agents.md)
* [SDD - Specs](docs/sdd/specs.md)

### 🧠 Diseño y Algoritmos
* ⚙️ [Definición de Heurísticas y Reglas de Negocio (CSPMotor)](docs/ejecucion/a003-02-heuristicas-reglas.md)

### 📁 Índices por Fase
* 🚀 [Índice de ejecución](docs/ejecucion/README.md)
* 📊 [Índice de seguimiento y control](docs/seguimiento_control/README.md)
* 🏁 [Índice de cierre](docs/cierre/README.md)
* 📄 [Otros documentos](docs/Otros/README.md)

---

## 8. 🚀 Guía Rápida de Inicio

El proyecto está dividido en un Backend (Node.js/Express) y un Frontend (React/Vite). Para probar la aplicación, necesitas ejecutar ambos entornos.

### Requisitos previos
- Node.js y npm instalados.
- Base de datos MySQL en funcionamiento (puerto 3306, usuario `root`, sin contraseña por defecto).

### 1. Iniciar el Backend
Desde la raíz del proyecto, abre una terminal y ejecuta los siguientes comandos para configurar la base de datos e iniciar el servidor:

```bash
cd backend_node
npm install
node init_db.js      # Crea la estructura de la base de datos
node seed_db.js      # Opcional: inserta datos de prueba
node server.js       # Opcional: o usa el archivo start_node.bat en la raíz
```
*(El backend correrá en `http://localhost:3000`)*

### 2. Iniciar el Frontend
Abre una **nueva terminal** desde la raíz del proyecto y ejecuta:

```bash
cd frontend
npm install
npm run dev
```
*(El frontend correrá en `http://localhost:5173/`, donde podrás interactuar con la interfaz)*
