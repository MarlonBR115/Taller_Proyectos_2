# AGENT.md - Reglas y Estándares de Codificación

Este documento define las normas de desarrollo, calidad y revisión de código para el **Sistema de Generación Óptima de Horarios Académicos**. Es de cumplimiento obligatorio para asegurar la mantenibilidad y el éxito del motor de optimización.

---

## 1. Estructura y Organización del Código

Se debe respetar la organización de carpetas existente para mantener la trazabilidad del proyecto:

- **/backend/**: Lógica de negocio y motor CSP.
  - `/src/services`: Debe contener exclusivamente la lógica matemática y de optimización (aislada de Express).
  - `/src/models`: Definición de esquemas MySQL (Sequelize/Prisma).
- **/frontend/**: Interfaz de usuario en React.
  - `/src/hooks`: Lógica de estado y llamadas a la API.
  - `/src/components`: UI modular y reutilizable.
- **/docs/**: Documentación técnica (Gestionada por el Responsable de Calidad).

---

## 2. Reglas de Codificación (Coding Rules)

### 2.1 Estándares Generales
- **Nomenclatura:** - `camelCase` para variables, funciones y archivos de lógica.
  - `PascalCase` para componentes React y Modelos de base de datos.
  - `UPPER_CASE` para constantes y variables de entorno.
- **Principios:** Aplicar estrictamente **SOLID** y **Clean Code**. Cada función debe realizar una sola tarea (Single Responsibility).
- **Comentarios:** Documentar únicamente el "porqué" de lógicas complejas, especialmente en el algoritmo CSP. Evitar código comentado en el repositorio.

### 2.2 Backend y Base de Datos (MySQL)
- **Seguridad:** Prohibido el uso de consultas de texto plano. Usar **consultas parametrizadas** o los métodos del ORM para prevenir Inyección SQL (OWASP).
- **Eficiencia (Green Software):** Evitar el problema de consultas N+1. Realizar *Eager Loading* de datos de docentes, aulas y cursos antes de iniciar el motor de optimización para reducir el consumo energético y de red.
- **Motor CSP:** La lógica de satisfacción de restricciones debe ser determinista y testeable de forma independiente a la base de datos.

### 2.3 Frontend (React)
- **Componentes:** Usar componentes funcionales y Hooks. Prohibidos los componentes de clase.
- **Estado:** No saturar el estado local con datos del horario. Usar una gestión de estado global eficiente para manejar la visualización interactiva sin degradar el rendimiento (RNF01).

---

## 3. Proceso de Revisión y Calidad (Code Review)

Para cumplir con el rol de **Responsable de Calidad**, se establecen las siguientes revisiones antes de cada integración:

### 3.1 Checklist de Revisión de Pull Requests (PR)
1. **Funcionalidad:** ¿El código cumple con el requerimiento funcional (RF) asignado?
2. **Restricciones CSP:** Si afecta al motor, ¿se han validado las restricciones duras (20-22 créditos, no cruces)?
3. **Seguridad:** ¿Se maneja correctamente el JWT y la validación de inputs?
4. **Rendimiento:** ¿La respuesta del endpoint de generación sigue siendo inferior a 10 segundos (RNF01)?

### 3.2 Pruebas Obligatorias
- **Unitarias:** Todo servicio en el backend debe tener pruebas que validen casos de éxito y error.
- **Integración:** Validar la comunicación entre la SPA y la API REST antes de marcar un hito como completado.

---

## 4. Estándares de Git y Trazabilidad

Siguiendo las normas acordadas por el equipo:
- **Ramas:** Prohibido realizar commits directos a `main`. Se deben usar ramas de tarea (ej: `feat/motor-csp` o `fix/validacion-creditos`).
- **Commits:** Usar **Conventional Commits**:
  - `feat:` para nuevas funcionalidades.
  - `fix:` para corrección de errores.
  - `perf:` para mejoras en el algoritmo de optimización.
  - `docs:` para cambios en la documentación.

---

## 5. Atributos de Valor (ISO/IEC 25010)

El código será evaluado bajo estos pilares:
- **Adecuación Funcional:** El horario generado es válido y sin conflictos.
- **Eficiencia de Desempeño:** Generación rápida y bajo consumo de recursos.
- **Mantenibilidad:** Código fácil de leer y modularizado para futuros desarrolladores.