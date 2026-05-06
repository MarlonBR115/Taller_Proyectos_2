# Registro de Riesgos y Oportunidades

**Nombre del Proyecto:** Sistema de Generación Óptima de Horarios Académicos en Entornos de Currículo Flexible

## 1. Registro de Riesgos (Amenazas)

| ID Riesgo | Descripción del Riesgo | Área de Impacto | Causa | Impacto (1-9) | Probabilidad (0.1-0.9) | Puntuación | Detectabilidad | Estado | Asignado a | Evento que lo Dispara | Estrategia de Respuesta |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| R-01 | El motor anti-cruces excede los 10 segundos de procesamiento requeridos (RNF01) al evaluar un gran volumen de datos. | Rendimiento | Algoritmo CSP no optimizado para alta carga. | 7 (Muy Serio) | 0.5 (Medio) | 3.5 | Baja | Activo | Luis Quispe | Pruebas de estrés fallidas. | Implementar poda de restricciones temprana y heurísticas de ordenamiento. |
| R-02 | Incompatibilidades en el entorno de desarrollo entre Vite (Frontend) y Express (Backend). | Cronograma | Diferencias en versiones de Node y configuración CORS. | 3 (Moderado) | 0.3 (Bajo) | 0.9 | Alta | Cerrado | Fabian Guzman | Errores en consola al conectar API. | Homologar versiones y configurar middleware CORS estándar en `server.js`. |
| R-03 | Falta de información real sobre la disponibilidad de los docentes y aulas de la universidad. | Alcance / Calidad | Datos dependientes de terceros (administración). | 5 (Serio) | 0.7 (Alto) | 3.5 | Media | Activo | Marlon Bonifacio | Generación de horarios irreales. | Utilizar el script `seed_db.js` con datos simulados altamente realistas para avanzar. |

## 2. Registro de Oportunidades

| ID Oport. | Descripción de la Oportunidad | Área de Impacto | Causa de la Oportunidad | Impacto (1-9) | Probabilidad | Puntuación | Detectabilidad | Estado | Asignado a | Evento que lo Dispara | Estrategia de Respuesta |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| O-01 | Utilizar el enfoque Constraint Satisfaction Problem (CSP) documentado en papers académicos recientes. | Cronograma / Calidad | Investigación previa sólida del equipo. | 7 (Alto) | 0.9 (Muy Alto) | 6.3 | Alta | Activo | Luis Quispe | Finalización del diseño del motor. | Adaptar la lógica matemática del CSP directamente al módulo `CSPMotor.js`. |
