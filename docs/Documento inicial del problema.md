# DOCUMENTACIÓN INICIAL DEL PROBLEMA (REESTRUCTURADA)

## 1. Contexto y descripción del problema
Las universidades que operan con un currículo flexible enfrentan dificultades significativas en la generación de horarios académicos. Esto se debe a la alta variabilidad en la matrícula estudiantil, la disponibilidad limitada de recursos (docentes, aulas, horarios) y la coexistencia de múltiples restricciones que deben cumplirse simultáneamente.

Como consecuencia, se generan problemas como:
- Cruces de horarios entre cursos.
- Subutilización o sobrecarga de aulas.
- Dificultad para que los estudiantes cursen todas las asignaturas necesarias.
- Ineficiencia en la asignación de docentes.

---

## 2. Problema central
Generar horarios académicos eficientes que satisfagan simultáneamente las restricciones académicas, operativas y de recursos, minimizando conflictos y optimizando el uso de los recursos disponibles.

---

## 3. Variables del problema
Las principales variables involucradas son:

- **Cursos**: créditos, número de secciones, prerrequisitos.
- **Docentes**: disponibilidad horaria, especialidad, carga máxima.
- **Estudiantes**: demanda de cursos, disponibilidad, avance académico.
- **Aulas**: capacidad, tipo (laboratorio, teórica), disponibilidad.
- **Horarios**: bloques de tiempo definidos institucionalmente.

---

## 4. Stakeholders (partes interesadas) y relaciones

### Actores principales
- **Estudiantes**
- **Docentes**
- **Coordinadores académicos**
- **Administradores / área de registro académico**
- **Autoridades universitarias**

### Relaciones entre actores
- **Estudiantes ↔ Sistema académico**: solicitan cursos y reciben horarios.
- **Docentes ↔ Coordinadores**: acuerdan disponibilidad y asignación de cursos.
- **Coordinadores ↔ Administradores**: validan horarios y asignación de recursos.
- **Administradores ↔ Infraestructura (aulas)**: gestionan disponibilidad física.
- **Autoridades ↔ Coordinadores**: definen políticas académicas (créditos, horarios, reglas).

---

## 5. Restricciones del sistema (reales y operativas)
Se identifican las siguientes restricciones clave:

1. **Prerrequisitos obligatorios** entre cursos.
2. **Límite de créditos por estudiante** (ej. 20–22 créditos).
3. **Disponibilidad horaria de docentes**.
4. **Capacidad máxima de aulas**.
5. **No cruce de horarios** para estudiantes y docentes.
6. **Tipos de aula requeridos** (laboratorios vs aulas teóricas).
7. **Bloques horarios institucionales fijos**.
8. **Carga máxima docente por periodo académico**.

---

## 6. Ambigüedades identificadas
El problema presenta varias ambigüedades que deben resolverse:

1. **Definición de “horario óptimo”**  
   No se especifica si significa minimizar conflictos, maximizar uso de recursos o mejorar satisfacción.

2. **Priorización de restricciones**  
   No está claro cuáles restricciones son duras (obligatorias) y cuáles son blandas (flexibles).

3. **Nivel de flexibilidad del sistema**  
   No se define si los estudiantes pueden adaptar sus horarios o si el sistema es rígido.

4. **Gestión de conflictos**  
   No se establece cómo resolver conflictos entre disponibilidad docente y demanda estudiantil.

5. **Criterios de asignación de aulas**  
   No se especifica si se prioriza capacidad, ubicación o tipo de aula.

6. **Variabilidad en la matrícula**  
   No se define cómo se manejan cambios de última hora (retiros, nuevos inscritos).

---

## 7. Supuestos del problema
Para el análisis inicial se consideran los siguientes supuestos:

- La información de cursos, docentes y aulas es confiable y está actualizada.
- Los estudiantes cumplen los prerrequisitos antes de matricularse.
- Los bloques horarios son fijos y definidos previamente.
- Existe suficiente infraestructura para cubrir la demanda (aunque no óptimamente).
- Los docentes tienen disponibilidad previamente declarada.

---

## 8. Naturaleza del problema
El problema corresponde a un **problema de optimización combinatoria**, caracterizado por:

- Alta cantidad de variables interdependientes.
- Múltiples restricciones simultáneas.
- Ausencia de una única solución óptima.
- Necesidad de equilibrio entre eficiencia y satisfacción.
- Dinamismo (cambios constantes en matrícula y disponibilidad).

---

## 9. Mejoras propuestas en la definición del problema

### 9.1 Clasificación de restricciones
- **Duras (obligatorias)**: no cruce de horarios, prerrequisitos, capacidad de aulas.
- **Blandas (optimizables)**: preferencias de docentes, distribución equilibrada de horarios.

### 9.2 Definición formal de “óptimo”
Un horario óptimo debe:
- Minimizar conflictos.
- Maximizar uso de aulas.
- Satisfacer la mayor cantidad de estudiantes.
- Respetar la carga docente.

### 9.3 Incorporación de criterios de priorización
Asignar pesos a cada restricción para facilitar la optimización.

### 9.4 Implementación de mecanismos de ajuste
- Reprogramación automática ante cambios.
- Simulación de escenarios.

### 9.5 Uso de herramientas tecnológicas
- Algoritmos de optimización (heurísticos o metaheurísticos).
- Sistemas de apoyo a decisiones.

---

## 10. Conclusión
El problema de generación de horarios en universidades con currículo flexible es altamente complejo debido a la interacción de múltiples variables y restricciones. Una adecuada estructuración del problema, junto con la eliminación de ambigüedades y la definición clara de criterios de optimización, permite sentar las bases para el desarrollo de soluciones eficientes y escalables.
