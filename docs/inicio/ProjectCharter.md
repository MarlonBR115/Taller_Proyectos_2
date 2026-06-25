# Project Charter

## Sistema de Generación Óptima de Horarios Académicos en Entornos de Currículo Flexible

---

# 1. Información General del Proyecto

| Campo                | Descripción                                                                              |
| -------------------- | ----------------------------------------------------------------------------------------- |
| Nombre del Proyecto  | Sistema de Generación Óptima de Horarios Académicos en Entornos de Currículo Flexible |
| Tipo de Proyecto     | Aplicación Web Inteligente                                                               |
| Metodología         | Scrum                                                                                     |
| Arquitectura         | SPA + API REST                                                                            |
| Dominio              | Optimización Académica                                                                  |
| Área de Aplicación | Gestión Académica Universitaria                                                         |

---

# 2. Necesidad del Negocio

Las universidades con currículo flexible enfrentan dificultades significativas en la planificación de horarios académicos debido a:

* Alta variabilidad en la matrícula estudiantil.
* Múltiples restricciones académicas y operativas.
* Conflictos de disponibilidad entre estudiantes, docentes y aulas.
* Limitaciones de infraestructura.
* Necesidad de optimización eficiente.

Actualmente, la generación de horarios suele realizarse de forma manual o mediante reglas simples, lo que ocasiona:

* Conflictos de horarios.
* Uso ineficiente de recursos académicos.
* Insatisfacción de estudiantes y docentes.
* Incremento del tiempo dedicado a la planificación académica.

---

# 3. Objetivo del Proyecto

Desarrollar una aplicación web inteligente capaz de generar horarios académicos óptimos considerando múltiples restricciones académicas, operativas y contextuales, mediante técnicas de modelado basadas en:

* CSP (Constraint Satisfaction Problem).
* Optimización combinatoria.
* Restricciones duras y blandas.
* Heurísticas de búsqueda y asignación.

El sistema deberá minimizar conflictos y optimizar la utilización de recursos institucionales.

---

# 4. Requerimientos del Proyecto

## 4.1 Requerimientos Funcionales

### Gestión Académica

* Registro de estudiantes.
* Registro de docentes.
* Registro de cursos.
* Registro de aulas.

### Matrícula

* Validación de créditos académicos.
* Validación de prerrequisitos.

### Generación de Horarios

* Generación automática de horarios académicos.
* Aplicación de restricciones académicas.
* Aplicación de restricciones operativas.

### Visualización

* Visualización de horarios generados.
* Consulta de horarios académicos.

---

## 4.2 Requerimientos No Funcionales

Basados en la norma ISO/IEC 25010.

### Rendimiento

* Generación eficiente de horarios.
* Tiempo de respuesta aceptable.

### Escalabilidad

* Capacidad de crecimiento del sistema.

### Usabilidad

* Interfaz intuitiva.
* Facilidad de aprendizaje para el usuario.

### Seguridad

* Protección de la información académica.
* Control de acceso a funcionalidades.

### Mantenibilidad

* Código modular.
* Facilidad de evolución y mantenimiento.

---

# 5. Descripción del Producto

El sistema permitirá:

* Generar horarios académicos automáticamente.
* Evitar conflictos de solapamiento.
* Considerar restricciones de estudiantes, docentes y aulas.
* Optimizar la asignación de recursos.
* Visualizar horarios de forma clara e interactiva.

---

# 6. Entregables del Proyecto

## Documentación

* Documento de análisis del problema.
* Modelo formal del problema (CSP / Optimización).
* Diseño de arquitectura del sistema.

## Desarrollo

* Código fuente funcional.
* Implementación de la arquitectura SPA + API REST.

## Calidad

* Pruebas unitarias.
* Pruebas de integración.

## Presentación

* Video demostrativo.
* Informe técnico de decisiones.

---

# 7. Exclusiones del Proyecto

El proyecto no incluye:

* Implementación en entornos productivos reales.
* Integración con sistemas universitarios existentes.
* Infraestructura física adicional.
* Capacitación institucional formal.

---

# 8. Recursos Preasignados

## Recursos Humanos

* Equipo de estudiantes de Ingeniería de Sistemas.

## Recursos Tecnológicos

* Equipos personales de desarrollo.
* Herramientas de control de versiones (Git).
* Frameworks de desarrollo web.
* Herramientas de documentación y pruebas.

## Datos

* Información académica simulada o de prueba.

---

# 9. Stakeholders del Proyecto

| Nombre                     | Rol                      | Responsabilidad                     |
| -------------------------- | ------------------------ | ----------------------------------- |
| Bonifacio Rojas Marlon     | Product Owner            | Definir visión y requerimientos    |
| Espíritu Campos Alejandro | Scrum Master             | Gestión ágil del proyecto         |
| Guzmán Choque Fabián     | Frontend Developer       | Desarrollo de interfaz de usuario   |
| Quispe Campos Luis Enrique | Backend Developer        | Lógica y servicios del sistema     |
| Fernández Durán Rafael   | Calidad y Documentación | Documentación y control de calidad |

---

# 10. Cronograma de Hitos

## Hito 1: Inicio y Análisis del Problema

**Fecha:** 26 de marzo de 2026

Actividades:

* Análisis del problema.
* Identificación de variables.
* Identificación de restricciones.
* Identificación de actores.
* Definición del alcance.

---

## Hito 2: Modelado del Sistema (CSP / Optimización)

**Fecha:** 16 de abril de 2026

Actividades:

* Definición formal del problema.
* Modelado de variables.
* Modelado de dominios.
* Definición de restricciones.
* Definición de supuestos.

---

## Hito 3: Diseño de Arquitectura y Solución

**Fecha:** 07 de mayo de 2026

Actividades:

* Diseño de arquitectura SPA + API REST.
* Diseño de base de datos.
* Diseño estructural del sistema.

---

## Hito 4: Desarrollo del Sistema Funcional

**Fecha:** 28 de mayo de 2026

Actividades:

* Desarrollo de funcionalidades principales.
* Registro de entidades académicas.
* Validación académica.
* Generación automática de horarios.

---

## Hito 5: Pruebas y Validación

**Fecha:** 11 de junio de 2026

Actividades:

* Pruebas unitarias.
* Pruebas de integración.
* Verificación de rendimiento.
* Validación funcional.

---

## Hito 6: Entrega Final

**Fecha:** 25 de junio de 2026

Actividades:

* Entrega del sistema completo.
* Entrega de documentación.
* Entrega de video demostrativo.
* Presentación final.

---

# 11. Riesgos de Alto Nivel

## Riesgos Técnicos

* Complejidad del modelado CSP.
* Complejidad de las restricciones académicas.
* Limitaciones computacionales.

## Riesgos del Equipo

* Falta de experiencia en optimización.
* Tiempo limitado de desarrollo.

## Riesgos del Dominio

* Conflictos entre múltiples restricciones.
* Incremento de complejidad del problema.

---

# 12. Criterios de Aceptación

El proyecto será considerado exitoso si:

* El sistema genera horarios sin conflictos.
* Se cumplen las restricciones académicas definidas.
* La interfaz es usable e intuitiva.
* El sistema responde en tiempos aceptables.
* Se entregan todos los entregables establecidos.
* El modelo representa adecuadamente el problema real.

---

# 13. Suposiciones

Se asume que:

* Se contará con datos académicos simulados o simplificados.
* El equipo tendrá disponibilidad para el desarrollo.
* Las herramientas tecnológicas serán suficientes.
* Las restricciones del problema estarán correctamente definidas.

---

# 14. Restricciones del Proyecto

## Académicas

* Disponibilidad de docentes.
* Disponibilidad de estudiantes.
* Disponibilidad de infraestructura.
* Límite de créditos académicos (20–22 créditos).
* No solapamiento de horarios.

## Temporales

* Tiempo máximo de desarrollo hasta junio de 2026.

## Técnicas

* Recursos computacionales limitados.
* Uso de equipos personales.

## Organizacionales

* Desarrollo realizado únicamente por estudiantes.
* Alcance limitado a un prototipo funcional.

---

# 15. Resumen Ejecutivo

El proyecto busca desarrollar un sistema web inteligente para la generación automática de horarios académicos en universidades con currículo flexible. La solución utilizará técnicas de optimización basadas en CSP (Constraint Satisfaction Problem) y optimización combinatoria para minimizar conflictos académicos y mejorar la utilización de recursos institucionales.

El sistema permitirá gestionar estudiantes, docentes, cursos y aulas, aplicar restricciones académicas complejas y generar horarios optimizados que mejoren la experiencia de estudiantes y docentes, manteniendo una arquitectura moderna basada en SPA + API REST y siguiendo prácticas de calidad de software mediante pruebas y documentación técnica.
