# Software Design Document (SDD) — Sistema de Generación Óptima de Horarios Académicos

## 1. Resumen de Arquitectura

El sistema sigue una arquitectura cliente-servidor de dos capas con stack MERN adaptado:

| Capa | Tecnología | Ubicación |
|------|-----------|-----------|
| Frontend (SPA) | React + Vite | `frontend/` |
| Backend (API REST) | Node.js + Express | `backend_node/` |
| Base de datos | MySQL (relacional) | `database/` |
| Motor CSP | JavaScript puro (Node.js) | `backend_node/src/services/CSPMotor.js` |
| Validador de restricciones | JavaScript puro (Node.js) | `backend_node/src/services/motorAntiCruces.js` |

### Diagrama de comunicación

```
[React SPA] --fetch /api/*--> [Express Router] --mysql2--> [MySQL]
                                    |
                            [GeneratorService]
                            /                \
                    [CSPMotor.js]    [motorAntiCruces.js]
```

- El frontend React se comunica exclusivamente mediante fetch HTTP a `http://localhost:3000/api/*`.
- No existe capa de autenticación JWT implementada en el código actual (prevista como RNF04).
- El backend utiliza `mysql2/promise` con conexión pool y consultas parametrizadas (sin ORM).

---

## 2. Estructura de Base de Datos

Basada en `database/schema.sql` y `database/alter.sql`. Implementa 6 tablas relacionales:

### 2.1 Tablas

#### `teachers`
| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | INT AUTO_INCREMENT PK | Identificador único |
| name | VARCHAR(255) | Nombre del docente |
| availability | JSON | Matriz de turnos disponibles (["Mañana", "Tarde", "Noche"]) |
| created_at | TIMESTAMP | Fecha de creación |

#### `courses`
| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | INT AUTO_INCREMENT PK | Identificador único |
| name | VARCHAR(255) | Nombre del curso/materia |
| credits | INT DEFAULT 3 | Créditos |
| weekly_hours | INT | Horas semanales requeridas |
| created_at | TIMESTAMP | Fecha de creación |

#### `rooms`
| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | INT AUTO_INCREMENT PK | Identificador único |
| name | VARCHAR(50) | Nombre o código del aula |
| capacity | INT | Capacidad máxima de estudiantes |
| room_type | ENUM('theory','lab') | Tipo de aula |
| created_at | TIMESTAMP | Fecha de creación |

#### `academic_terms`
| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | INT AUTO_INCREMENT PK | Identificador único |
| name | VARCHAR(255) | Nombre del periodo (ej. "2026-1") |
| is_active | BOOLEAN DEFAULT false | Indica si es el periodo activo |
| created_at | TIMESTAMP | Fecha de creación |

#### `student_groups`
| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | INT AUTO_INCREMENT PK | Identificador único |
| term_id | INT NULL FK → academic_terms(id) | Periodo académico al que pertenece |
| course_id | INT FK → courses(id) | Curso asignado |
| teacher_id | INT FK → teachers(id) | Docente asignado |
| quota | INT DEFAULT 30 | Cupo máximo de alumnos |
| created_at | TIMESTAMP | Fecha de creación |

#### `schedules`
| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | INT AUTO_INCREMENT PK | Identificador único |
| term_id | INT NULL FK → academic_terms(id) ON DELETE CASCADE | Periodo académico |
| group_id | INT FK → student_groups(id) | Grupo asignado |
| room_id | INT FK → rooms(id) | Aula asignada |
| day_of_week | ENUM('Lunes','Martes','Miercoles','Jueves','Viernes','Sabado') | Día de la semana |
| start_time | TIME | Hora de inicio |
| end_time | TIME | Hora de fin |
| created_at | TIMESTAMP | Fecha de creación |

### 2.2 Relaciones

- `student_groups.term_id` → `academic_terms(id)` (ON DELETE SET NULL)
- `student_groups.course_id` → `courses(id)`
- `student_groups.teacher_id` → `teachers(id)`
- `schedules.term_id` → `academic_terms(id)` (ON DELETE CASCADE)
- `schedules.group_id` → `student_groups(id)`
- `schedules.room_id` → `rooms(id)`

### 2.3 Flujo de limpieza de schedules

Antes de generar un nuevo horario, `GeneratorService.generate()` ejecuta `DELETE FROM schedules WHERE term_id = ?` para el periodo activo, garantizando idempotencia.

---

## 3. Comunicación Frontend ↔ Backend

### 3.1 Convención general de API

- Base URL: `http://localhost:3000/api`
- Formato de respuesta: `{ success: boolean, data?: any, message?: string }`
- CRUD sigue el patrón REST: `GET /api/:entity`, `POST /api/:entity`, `PUT /api/:entity/:id`, `DELETE /api/:entity/:id`

### 3.2 Mapeo de componentes React a endpoints

#### `CrudView.jsx` — Componente genérico de CRUD

| Propósito | Endpoint | Método | Cuerpo |
|-----------|----------|--------|--------|
| Listar entidades | `/{endpoint}` | GET | — |
| Crear entidad | `/{endpoint}` | POST | Campos del formulario |
| Editar entidad | `/{endpoint}/{id}` | PUT | Campos actualizados |
| Eliminar entidad | `/{endpoint}/{id}` | DELETE | — |

`CrudView` recibe `config.endpoint` desde `App.jsx` como propiedad dinámica. Los endpoints mapeados son:

| Vista | `endpoint` | Ruta completa |
|-------|-----------|---------------|
| Profesores | `teachers` | `/api/teachers` |
| Materias | `courses` | `/api/courses` |
| Aulas | `rooms` | `/api/rooms` |
| Grupos | `groups` | `/api/groups` |
| Periodos | `terms` | `/api/terms` |

Cada llamado se realiza con `fetch()` plano, sin librería HTTP externa. Los datos se serializan con `Content-Type: application/json`.

#### `ScheduleGrid.jsx` — Generación y visualización de horarios

| Propósito | Endpoint | Método | Cuerpo |
|-----------|----------|--------|--------|
| Obtener horarios actuales | `/api/schedule/all` | GET | — |
| Generar nuevo horario | `/api/schedule/generate` | POST | — |

`ScheduleGrid` envía POST a `/api/schedule/generate`, el backend ejecuta `GeneratorService.generate()` que:
1. Limpia schedules previos del periodo activo.
2. Lee grupos, aulas y docentes de BD.
3. Instancia `CSPMotor.solve()`.
4. Inserta resultados en la tabla `schedules`.
5. Ejecuta validador anti-cruces sobre lo generado.
6. Retorna métricas de asignación.

#### `Sidebar.jsx` — Navegación

`Sidebar` no realiza llamadas API. Gestiona la vista activa mediante estado local `currentView` en `App.jsx`.

### 3.3 Formato de datos intercambiados

Los horarios se transfieren con horas en formato `HH:MM:SS` (TIME de MySQL). El frontend parsea la hora convirtiendo a entero (ej. `"08:00:00"` → `8`) para renderizado en grilla.

---

## 4. Motor de Restricciones (CSP) — Decisiones de Diseño

### 4.1 Arquitectura del motor

El motor CSP está dividido en dos servicios independientes:

| Componente | Archivo | Responsabilidad |
|-----------|---------|-----------------|
| **Generador** | `CSPMotor.js` | Encontrar asignación válida de horarios mediante backtracking con heurísticas MRV y LCV |
| **Validador** | `motorAntiCruces.js` | Verificar que una asignación no contenga cruces de recursos, reportando conflictos y advertencias |

Ambos son módulos Node.js puros (sin dependencias de Express, BD o frontend), cumpliendo RNF05 (mantenibilidad).

### 4.2 Decisiones de diseño del generador (CSPMotor)

1. **Backtracking con MRV**: Los grupos se ordenan de más restrictivo a menos restrictivo antes de la búsqueda, priorizando mayor carga horaria y menor disponibilidad de aulas compatibles. Esto reduce la probabilidad de bloqueos tempranos.

2. **Least Constraining Value (LCV)**: Las asignaciones candidatas se ordenan por un score de satisfacción académica que evalúa:
   - Penalización por horarios extremos (distancia al mediodía).
   - Bonificación por clases contiguas (+5).
   - Penalización por huecos académicos (-5).

3. **Integridad de sesiones (bloques contiguos)**: Las horas semanales requeridas se asignan en slots consecutivos dentro del mismo día, garantizando que la sesión no se fraccione.

4. **restricciones duras validadas durante asignación**:
   - `isValidAssignment()`: Capacidad de aula suficiente, tipo de aula compatible, no solapamiento de aula (vía `scheduleMatrix`), no solapamiento de docente (vía `teacherSchedule`), disponibilidad del docente por turno.

5. **Disponibilidad docente por turnos**: Se interpreta el JSON `availability` del docente. Los turnos posibles son `Mañana` (8-13), `Tarde` (13-18), `Noche` (18-22). Si no hay availability definida, se asume disponible todo el día.

6. **Separación de responsabilidades**: `GeneratorService` orquesta la lectura de BD, invocación del CSP, escritura de resultados y validación posterior. `CSPMotor` solo resuelve el problema combinatorio. `motorAntiCruces` solo valida.

### 4.3 Decisiones de diseño del validador (motorAntiCruces)

1. **Validación por índice en lugar de O(n²) global**: Los bloques se agrupan por `(día + recurso)` usando Maps. Dentro de cada grupo se ordenan por hora de inicio y se corta la comparación cuando el siguiente bloque no se solapa. Esto evita comparar todos los pares posibles y escala mejor con muchos recursos.

2. **Separación de restricciones duras y blandas**: Las restricciones duras (`CRUCE_DOCENTE`, `CRUCE_AULA`, `CRUCE_GRUPO`, `BLOQUE_INVALIDO`) invalidan el horario (`valido = false`). Las advertencias (`TRANSICION_INSUFICIENTE`) son severidad MEDIA y no invalidan la solución.

3. **Configurabilidad del tiempo de transición**: Se acepta `tiempoMinimoTransicionMinutos` como opción (default 10 minutos). Esto permite ajustar la sensibilidad de la advertencia sin cambiar código.

4. **Detección de transición física**: La advertencia solo se emite cuando existe cambio de aula o edificio entre bloques consecutivos del mismo recurso. Bloques en la misma aula no generan advertencia aunque tengan margen menor al mínimo.

5. **Formato de entrada estandarizado**: `validateSchedule(schedule, opciones)` acepta bloques con `horaInicio` y `horaFin` en formato `HH:MM` de 24 horas. La normalización maneja mayúsculas/minúsculas y espacios.

6. **Métricas observables en cada validación**: tiempo de ejecución, total de bloques, porcentaje de bloques válidos, conflictos por tipo, tasa de conflictos. Esto permite instrumentar el motor sin depender de herramientas externas.

### 4.4 Relación generador ↔ validador

En el pipeline de generación (`GeneratorService.generate()`):

```
CSPMotor.solve() → INSERT schedules → SELECT schedules → motorAntiCruces.validateSchedule()
```

El validador se ejecuta **después** de la inserción como verificación complementaria. No influye en la búsqueda del CSP. En una versión futura (RF10), el validador podría integrarse como función de penalización dentro de la búsqueda misma.

### 4.5 Limitaciones conocidas del motor CSP

- No valida prerrequisitos de cursos (RF05).
- No considera matrícula de estudiantes ni límite de créditos (20-22).
- La disponibilidad docente usa turnos fijos definidos por horas (`8-13`, `13-18`, `18-22`), no horarios personalizados.
- No existe límite de carga horaria máxima por docente.
- El validador anti-cruces no se usa actualmente durante la búsqueda del CSP, solo como verificación posterior.

---

## 5. Mapeo Requisitos → Módulos

| Requisito | Módulo | Estado |
|-----------|--------|--------|
| RF01-04 CRUD entidades | `CrudView.jsx` + endpoints `/api/teachers`, `/api/courses`, `/api/rooms`, `/api/groups` | Implementado |
| RF06 Generación CSP | `CSPMotor.js` + `GeneratorService.js` + `POST /api/schedule/generate` | Implementado |
| RF07 Prevención de cruces | `motorAntiCruces.js` (HU03) | Implementado |
| RF08 Visualización horarios | `ScheduleGrid.jsx` + `GET /api/schedule/all` | Implementado |
| RF09 Edición manual | CRUD genérico (PUT/DELETE en cada entidad) | Implementado |
| RF10 Priorización de restricciones | No implementado (pesos fijos en LCV) | Pendiente |
| RNF05 Mantenibilidad | Servicios desacoplados sin dependencia Express/BD | Implementado |
