# Selección del Enfoque del Proyecto

---

## 1. Naturaleza del Problema
El proyecto aborda la planificación de horarios en entornos de currículo flexible, identificado como un problema complejo de ingeniería. Se caracteriza por:
* **Requisitos cambiantes** y múltiples restricciones interdependientes.
* **Ausencia de una solución única trivial**, lo que exige modelado abstracto y toma de decisiones fundamentadas.

---

## 2. Modelo de Gestión: Enfoque Híbrido
Se ha seleccionado un enfoque híbrido para equilibrar la predictibilidad con la flexibilidad técnica:

* **Componente Predictivo:** Utilizado para la definición de hitos, entregables obligatorios y el cumplimiento del cronograma académico.
* **Componente Ágil (Incremental):** Aplicado en el desarrollo de software, permitiendo iteraciones rápidas para el algoritmo de optimización y validación de la interfaz de usuario.

---

## 3. Justificación Técnica y Metodológica

### Modelado del Problema
El sistema se formulará como un **Problema de Satisfacción de Restricciones (CSP)** y un problema de **Optimización Combinatoria**. Esto permite procesar variables bajo:
* **Restricciones duras:** Como el no solapamiento de horarios.
* **Restricciones blandas:** Como las preferencias de docentes y alumnos.

### Arquitectura y Estándares
* **Arquitectura:** Se empleará un modelo **SPA + API REST**, asegurando el desacoplamiento entre el motor de cálculo y la presentación.
* **Calidad (ISO/IEC 25010):** Para garantizar el rendimiento y la mantenibilidad del sistema.
* **Seguridad (OWASP Top 10):** Implementación de estándares críticos de seguridad.
* **Eficiencia (Green Software):** Desarrollo alineado con la eficiencia energética.