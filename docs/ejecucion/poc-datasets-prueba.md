# Prueba de Concepto — Datasets de Prueba

## Alcance

La prueba de concepto se delimita a una **facultad específica** para mantener el
problema en un tamaño controlable y verificable. Esto permite validar el
algoritmo CSP sin la complejidad de un dataset institucional completo.

---

## Facultad Seleccionada

**Facultad de Ingeniería de Sistemas y Computación**

Justificación: es la facultad con mayor variedad de tipos de aula (laboratorios
y teóricas) y disponibilidad de docentes en distintos turnos, lo que permite
ejercitar todas las restricciones del solver.

---

## Datasets

### 1. Aulas

| Aula           | Capacidad | Tipo     |
|----------------|-----------|----------|
| Lab Cómputo A  | 25        | lab      |
| Lab Cómputo B  | 25        | lab      |
| Aula 301       | 40        | theory   |
| Aula 302       | 40        | theory   |
| Aula 303       | 50        | theory   |

- **5 aulas totales** (2 laboratorios, 3 teóricas)
- Capacidades entre 25 y 50 estudiantes

### 2. Docentes

| Docente              | Disponibilidad        |
|----------------------|-----------------------|
| Dr. Carlos Mendoza   | Mañana, Tarde         |
| Mg. Laura Castillo   | Mañana, Noche         |
| Dr. Ricardo Vega     | Tarde, Noche          |
| Mg. Sofia Rivas      | Mañana, Tarde         |
| Ing. Pedro Guzmán    | Mañana, Tarde, Noche  |

- **5 docentes** con perfiles variados
- Cada docente tiene disponibilidad en 2-3 turnos

### 3. Disponibilidad (Turnos)

| Turno    | Horario       |
|----------|---------------|
| Mañana   | 08:00 - 13:00 |
| Tarde    | 13:00 - 18:00 |
| Noche    | 18:00 - 21:00 |

La disponibilidad se modela como un array JSON en la columna `availability`
de la tabla `teachers`.

### 4. Cursos

| Curso                   | Créditos | Horas Semanales |
|-------------------------|----------|-----------------|
| Programación I          | 4        | 4               |
| Estructura de Datos     | 4        | 4               |
| Base de Datos           | 3        | 3               |
| Ingeniería de Software  | 3        | 3               |
| Redes y Comunicaciones  | 3        | 3               |

### 5. Grupos de Estudiantes

Se crean **10 grupos** distribuyendo los 5 cursos entre los 5 docentes:

| Curso                   | Docente              | Cupo |
|-------------------------|----------------------|------|
| Programación I          | Dr. Carlos Mendoza   | 25   |
| Programación I          | Mg. Laura Castillo   | 20   |
| Estructura de Datos     | Dr. Carlos Mendoza   | 30   |
| Estructura de Datos     | Dr. Ricardo Vega     | 25   |
| Base de Datos           | Mg. Laura Castillo   | 35   |
| Base de Datos           | Mg. Sofia Rivas      | 30   |
| Ingeniería de Software  | Mg. Sofia Rivas      | 40   |
| Ingeniería de Software  | Ing. Pedro Guzmán    | 35   |
| Redes y Comunicaciones  | Dr. Ricardo Vega     | 30   |
| Redes y Comunicaciones  | Ing. Pedro Guzmán    | 25   |

---

## Ventana Horaria

- Días: Lunes a Viernes
- Horario: 08:00 - 21:00 (bloques de 1 hora)
- Total de slots semanales: 5 días × 13 slots = **65 slots disponibles**

---

## Archivo de Seed

`backend_node/seed_prueba_concepto.js`

Ejecución:
```bash
node seed_prueba_concepto.js
```

Este script limpia la base de datos y carga únicamente los datos descritos
arriba, garantizando un entorno reproducible para la prueba de concepto.
