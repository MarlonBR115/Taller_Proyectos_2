# Prueba de Concepto - Datasets de Prueba

> Nota de alcance: este documento propone datasets controlados para validar el solver. No declara que exista un script especifico cargado en el repositorio actual.

## Objetivo

Definir un dataset academico pequeno y reproducible para probar generacion de horarios sin depender de datos institucionales reales.

## Facultad de referencia

Facultad de Ingenieria de Sistemas y Computacion.

## Dataset propuesto

### Aulas

| Aula | Capacidad | Tipo |
|---|---:|---|
| Lab Computo A | 25 | lab |
| Lab Computo B | 25 | lab |
| Aula 301 | 40 | theory |
| Aula 302 | 40 | theory |
| Aula 303 | 50 | theory |

### Docentes

| Docente | Disponibilidad propuesta |
|---|---|
| Dr. Carlos Mendoza | Manana, Tarde |
| Mg. Laura Castillo | Manana, Noche |
| Dr. Ricardo Vega | Tarde, Noche |
| Mg. Sofia Rivas | Manana, Tarde |
| Ing. Pedro Guzman | Manana, Tarde, Noche |

### Cursos

| Curso | Creditos | Horas semanales |
|---|---:|---:|
| Programacion I | 4 | 4 |
| Estructura de Datos | 4 | 4 |
| Base de Datos | 3 | 3 |
| Ingenieria de Software | 3 | 3 |
| Redes y Comunicaciones | 3 | 3 |

### Grupos/secciones

| Curso | Docente | Cupo |
|---|---|---:|
| Programacion I | Dr. Carlos Mendoza | 25 |
| Programacion I | Mg. Laura Castillo | 20 |
| Estructura de Datos | Dr. Carlos Mendoza | 30 |
| Estructura de Datos | Dr. Ricardo Vega | 25 |
| Base de Datos | Mg. Laura Castillo | 35 |
| Base de Datos | Mg. Sofia Rivas | 30 |
| Ingenieria de Software | Mg. Sofia Rivas | 40 |
| Ingenieria de Software | Ing. Pedro Guzman | 35 |
| Redes y Comunicaciones | Dr. Ricardo Vega | 30 |
| Redes y Comunicaciones | Ing. Pedro Guzman | 25 |

## Ventana horaria propuesta

- Dias: lunes a viernes.
- Horario: 08:00 a 21:00.
- Bloques: 1 hora.

## Estado

Propuesto. Para convertirlo en evidencia implementada se debe crear o validar un script real en `backend_node/`, ejecutar la carga y documentar resultados.
