# A003: Diseño de Sistema de Información — Generación Óptima de Horarios Académicos

## 1. Contexto del Sistema

### 1.1 Diagrama de Contexto

```
[Administrador Academico] ──gestiona──> [Sistema de Horarios] ──consulta──> [Docente]
                                  │                                          │
                                  │                                          │
                                  └──────genera──────> [Horario Academico]
```

### 1.2 Actores del Sistema

| Actor | Rol | Interacción |
|-------|-----|-------------|
| Administrador Académico | Gestiona entidades (docentes, cursos, aulas, grupos, periodos) y ejecuta la generación de horarios | CRUD via UI + generación CSP |
| Docente | Consulta el horario generado para conocer asignaciones | Visualización vía UI (futuro) |
| Sistema | Actúa como orquestador interno: backend + base de datos + motor CSP | Automático sin intervención humana |

---

## 2. Arquitectura General del Sistema de Información

### 2.1 Vista de Capas (Layered Architecture)

```
┌─────────────────────────────────────────────────┐
│              Capa de Presentación                │
│           (React SPA + Vite)                     │
│                                                   │
│  Sidebar ──> App ──> CrudView / ScheduleGrid     │
└────────────────────┬────────────────────────────┘
                     │ HTTP (fetch)
                     │ JSON
┌────────────────────▼────────────────────────────┐
│           Capa de Lógica de Negocio              │
│         (Node.js + Express)                      │
│                                                   │
│  API Router ──> Controller ──> GeneratorService   │
│                               │                   │
│                    ┌──────────┴──────────┐        │
│                    ▼                     ▼        │
│             CSPMotor.js        motorAntiCruces.js │
└────────────────────┬────────────────────────────┘
                     │ SQL (mysql2/promise)
                     │ Consultas parametrizadas
┌────────────────────▼────────────────────────────┐
│           Capa de Datos                          │
│         (MySQL 8)                                │
│                                                   │
│  Tablas: teachers, courses, rooms,               │
│          student_groups, schedules, academic_terms│
└─────────────────────────────────────────────────┘
```

### 2.2 Flujo de Datos por Escenario

#### Escenario 1: Gestión de Entidades (CRUD)

```
Usuario → Sidebar (selecciona vista)
       → App.jsx (renderiza CrudView con endpoint dinámico)
       → fetch(api/:entity)
       → Express Router → mysql2 query
       → MySQL
       → JSON response → CrudView (renderiza tabla)
```

#### Escenario 2: Generación de Horario

```
Usuario → ScheduleGrid (clic "Generar")
       → fetch(POST /api/schedule/generate)
       → GeneratorService.generate()
          1. DELETE schedules WHERE term_id = ?
          2. SELECT grupos, aulas, docentes
          3. CSPMotor.solve(groups, rooms, teachers)
             → Backtracking con MRV + LCV
             → Retorna asignaciones { group_id, room_id, day, start, end }
          4. INSERT schedules (resultados)
          5. SELECT schedules generados
          6. motorAntiCruces.validateSchedule(schedules)
             → Reporte de validación
       → JSON { success, metrics, validacion }
       → ScheduleGrid (renderiza grilla + métricas)
```

#### Escenario 3: Validación Anti-Cruces (Verificación)

```
GeneratorService → motorAntiCruces.validateSchedule(bloques)
                → Normalización de datos
                → Indexación por (día + recurso)
                → Detección de conflictos:
                    - CRUCE_DOCENTE
                    - CRUCE_AULA
                    - CRUCE_GRUPO
                    - DATOS_INVALIDOS
                    - SOBRECUPOS_AULA
                    - TIPO_AULA_INCOMPATIBLE
                → Advertencias:
                    - TRANSICION_INSUFICIENTE
                → Retorno { valido, conflictos, advertencias, metricas }
```

---

## 3. Diseño de Componentes

### 3.1 Componentes del Frontend

```
[Sidebar.jsx]          Estado: currentView (string)
    │
[App.jsx]              Estado: currentView, views list
    │
    ├── [CrudView.jsx] Props: config { endpoint, title, fields }
    │       Estado interno: data, loading, error, editingId, formData
    │       Ciclo: fetch data on mount, CRUD operations
    │
    └── [ScheduleGrid.jsx] Props: (ninguna, fija en /api/schedule)
            Estado interno: schedule, metrics, validation, loading
            Ciclo: fetch schedule on mount, generate on click
```

### 3.2 Componentes del Backend

```
[Express Router]        Endpoints REST
    │
[Controller Layer]      Manejo de request/response
    │
[GeneratorService]      Orquestación de generación
    │
    ├── [CSPMotor]       Resolución combinatoria (backtracking)
    │       solve(groups, rooms, teachers) → asignaciones
    │
    └── [motorAntiCruces] Validación post-generación
            validateSchedule(bloques) → reporte
```

### 3.3 Patrones de Diseño Aplicados

| Patrón | Ubicación | Propósito |
|--------|-----------|-----------|
| MVC (variante) | Frontend completo | Separación de vista (JSX), estado (hooks), lógica (fetch/API) |
| Singleton | mysql2 connection pool | Una única instancia de pool de conexiones a BD |
| Strategy | CSPMotor (MRV/LCV) | Ordenamiento de variables y valores intercambiable |
| Template Method | GeneratorService.generate() | Pipeline fijo: limpiar → resolver → insertar → validar |
| Adapter | motorAntiCruces (normalización) | Adapta formatos de backend/BD al formato interno del validador |
| Repository | Consultas SQL en API | Cada endpoint encapsula consultas SQL sin ORM |

---

## 4. Diseño de Datos

### 4.1 Modelo Entidad-Relación (Simplificado)

```
┌──────────────┐     ┌──────────────────┐     ┌──────────────┐
│  teachers    │     │  student_groups  │     │  courses     │
├──────────────┤     ├──────────────────┤     ├──────────────┤
│ id (PK)      │◄────│ teacher_id (FK)  │────►│ id (PK)      │
│ name         │     │ course_id (FK)   │     │ name         │
│ availability │     │ term_id (FK)     │     │ credits      │
│ created_at   │     │ quota            │     │ weekly_hours │
└──────────────┘     │ created_at       │     │ created_at   │
                     └────────┬─────────┘     └──────────────┘
                              │ group_id (FK)
                     ┌────────▼─────────┐     ┌──────────────┐
                     │    schedules     │     │    rooms     │
                     ├──────────────────┤     ├──────────────┤
                     │ id (PK)          │     │ id (PK)      │
                     │ room_id (FK)     │◄────│ name         │
                     │ term_id (FK)     │     │ capacity     │
                     │ day_of_week      │     │ room_type    │
                     │ start_time       │     │ created_at   │
                     │ end_time         │     └──────────────┘
                     │ created_at       │
                     └──────────────────┘

┌──────────────────┐
│  academic_terms  │
├──────────────────┤
│ id (PK)          │◄──── term_id (FK) en student_groups y schedules
│ name             │
│ is_active        │
│ created_at       │
└──────────────────┘
```

### 4.2 Diccionario de Datos

Ver documento `sdd.md` sección 2 para detalle completo de columnas, tipos y relaciones.

### 4.3 Flujo de Datos entre Tablas

```
Generación de Horario:
  1. academic_terms  →  is_active = true  →  obtener term_id activo
  2. student_groups  →  WHERE term_id = ? →  grupos del periodo
  3. courses         →  JOIN con student_groups  →  weekly_hours, créditos
  4. teachers        →  JOIN con student_groups  →  disponibilidad
  5. rooms           →  todas las aulas  →  capacidad y tipo
  6. CSPMotor        →  asigna (group_id, room_id, day, start, end)
  7. schedules       →  INSERT resultados
```

---

## 5. Diseño de Interfaz de Usuario

### 5.1 Mapa de Navegación

```
[App.jsx]
  │
  ├── Sidebar
  │     ├── Profesores ──> CrudView(endpoint="teachers")
  │     ├── Materias   ──> CrudView(endpoint="courses")
  │     ├── Aulas      ──> CrudView(endpoint="rooms")
  │     ├── Grupos     ──> CrudView(endpoint="groups")
  │     ├── Periodos   ──> CrudView(endpoint="terms")
  │     └── Horarios   ──> ScheduleGrid
  │
  └── Contenido Principal
        ├── CrudView (tabla + formulario modal inline)
        └── ScheduleGrid (grilla semanal + botón generar + métricas)
```

### 5.2 Diseño de Interacción

| Acción | Comportamiento |
|--------|---------------|
| Navegar a vista | Sidebar actualiza `currentView` en App; App renderiza componente correspondiente |
| Crear entidad | CrudView muestra formulario; POST a endpoint; refresca tabla en éxito |
| Editar entidad | CrudView precarga datos en formulario; PUT a endpoint/:id; refresca tabla |
| Eliminar entidad | CrudView confirma diálogo; DELETE a endpoint/:id; refresca tabla |
| Generar horario | ScheduleGrid deshabilita botón; POST a /api/schedule/generate; muestra spinner; renderiza resultados + métricas |

---

## 6. Diseño de Seguridad

### 6.1 Estado Actual (Prototipo)

| Aspecto | Implementación | Observación |
|---------|---------------|-------------|
| Autenticación | No implementada | RNF04 pendiente |
| Autorización | No implementada | Sin control de acceso por rol |
| Validación de entrada | Consultas parametrizadas (mysql2) | Protección contra SQL Injection |
| Sanitización frontend | No implementada | Validación básica en formularios |
| HTTPS | No implementado | Servidor HTTP plano en localhost |

### 6.2 Medidas Existentes

- **Consultas parametrizadas**: Todas las consultas SQL usan `mysql2/promise` con placeholders `?`, eliminando riesgo de inyección SQL en el backend.
- **Aislamiento de servicios**: CSPMotor y motorAntiCruces son módulos puros sin acceso a BD ni Express, reduciendo superficie de ataque.

---

## 7. Diseño de Despliegue

### 7.1 Arquitectura de Despliegue Actual

```
┌─────────────────────────────────────────────┐
│               Máquina Local                  │
│                                               │
│  ┌──────────┐     ┌────────────────────┐     │
│  │ Frontend │────▶│ Backend (Express)  │     │
│  │ :5173    │HTTP │ :3000              │     │
│  └──────────┘     └─────────┬──────────┘     │
│                             │                 │
│                    ┌────────▼──────────┐     │
│                    │ MySQL 8           │     │
│                    │ localhost:3306    │     │
│                    └───────────────────┘     │
└─────────────────────────────────────────────┘
```

### 7.2 Requisitos de Entorno

| Componente | Versión | Puerto | Dependencia |
|-----------|---------|--------|-------------|
| Node.js | 18+ | — | Entorno de ejecución |
| MySQL | 8+ | 3306 | Base de datos |
| Frontend | Vite dev server | 5173 | Node.js |
| Backend | Express | 3000 | Node.js + MySQL |

---

## 8. Pila Tecnológica

### 8.1 Stack Completo

| Capa | Tecnología | Versión | Justificación |
|------|-----------|---------|---------------|
| Frontend framework | React | 18 | SPA ligera, curva de aprendizaje baja, ecosistema maduro |
| Build tool | Vite | 5 | Dev server rápido, HMR nativo, bundling optimizado |
| Backend runtime | Node.js | 18+ | Mismo lenguaje en frontend y backend, async nativo |
| HTTP framework | Express | 4 | Minimalista, ampliamente documentado, middleware simple |
| Base de datos | MySQL | 8 | Relacional, soporte JSON, amplio uso académico |
| Driver BD | mysql2 | 3 | Promesas nativas, pool de conexiones, parametrización |
| Motor CSP | JavaScript puro | — | Sin dependencias externas, determinista, testeable |
| Validador | JavaScript puro | — | Misma base que CSPMotor, sin dependencias de infraestructura |

### 8.2 Decisiones de Stack

1. **JavaScript full-stack**: Se eligió JavaScript (Node.js + React) para mantener un solo lenguaje en todo el sistema, reduciendo la complejidad cognitiva del equipo.
2. **MySQL sobre MongoDB**: Los datos académicos son inherentemente relacionales (docente-curso-aula-grupo-horario). MySQL garantiza integridad referencial mediante claves foráneas.
3. **Sin ORM**: Se usó `mysql2` directamente para mantener control total sobre las consultas SQL y evitar la abstracción que un ORM introduce, priorizando transparencia en un contexto académico.
4. **CSPMotor en JS puro**: El motor de restricciones se implementó sin librerías de IA/optimización para mantener la solución autónoma y demostrar el algoritmo de backtracking como parte del aprendizaje académico.

---

## 9. Matriz de Trazabilidad del Diseño

| Componente | Requisito | Artefacto |
|-----------|-----------|-----------|
| CrudView | RF01-RF04 | Frontend/UI |
| ScheduleGrid | RF06, RF08 | Frontend/UI |
| CSPMotor | RF06, RNF05 | Backend/CSP |
| motorAntiCruces | RF07, RNF01, RNF05 | Backend/Validación |
| GeneratorService | RF06, RF07 | Backend/Orquestador |
| Base de datos MySQL | RF01-RF09 | Datos |
| API REST | RF01-RF09 | Backend/API |

---

## 10. Referencias Cruzadas

- [SDD Principal](sdd.md) — Arquitectura, BD, API, motor CSP y validador
- [Especificaciones SDD](specs.md) — Especificaciones verificables del prototipo
- [Heurísticas y Reglas CSP](../ejecucion/a003-02-heuristicas-reglas.md) — Detalle de MRV/LCV
- [Requerimientos](../03_requerimientos.md) — Lista completa de RF y RNF
- [Supuestos y Restricciones](../04_supuestos_y_restricciones.md) — Limitaciones del diseño
