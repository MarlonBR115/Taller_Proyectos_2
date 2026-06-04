# Análisis de Green Software: Huella de Carbono del Motor de Horarios

Este documento estima el impacto ambiental del proceso de generación de horarios (Algoritmo CSP / Backtracking) del sistema OptiClass, utilizando los lineamientos de la **Green Software Foundation (GSF)**.

## 1. Diferenciación de Métricas

La huella de carbono de nuestra aplicación se divide en dos factores principales:
1. **Huella por Transferencia de Datos (Red):** Mide el impacto de los payloads JSON que viajan entre el backend (Node.js) y el frontend (React). Actualmente medido en tiempo real mediante `CO2.js`.
2. **Huella por Cómputo (CPU):** Mide la energía eléctrica consumida por el procesador al ejecutar el algoritmo `CSPMotor`. Esta es la métrica más crítica de nuestro sistema.

## 2. Metodología de Estimación (SCI)

Para estimar la huella de cómputo, aplicamos una versión simplificada de la fórmula **SCI (Software Carbon Intensity)**:

> **Emisiones (gCO₂)** = Energía del CPU (kW) × Tiempo (h) × Intensidad de Carbono (gCO₂/kWh)

**Supuestos Base (Servidor Estándar en la Nube):**
- **Consumo de CPU al 100%:** ~100 Watts (0.1 kW).
- **Intensidad de la red eléctrica (Promedio):** ~400 gCO₂ / kWh.

---

## 3. Escenarios de Carga Computacional

### Escenario A: Volumen Pequeño (Pruebas Iniciales)
- **Datos:** ~50 grupos de estudiantes.
- **Tiempo de ejecución (CSPMotor):** ~2 segundos (0.0005 horas).
- **Cálculo:** `0.1 kW × 0.0005 h × 400 gCO₂`
- **Resultado:** **0.02 gramos de CO₂** por horario generado.
- **Conclusión:** Altamente ecológico y sostenible.

### Escenario B: Volumen Masivo (Carga Real / 1300 grupos)
- **Datos:** 1300 grupos, 300 profesores, 100 aulas.
- **Tiempo de ejecución (CSPMotor):** Debido a la explosión combinatoria del algoritmo de Backtracking actual $O(6500^{1300})$, el CPU se bloquea al 100% de su capacidad. Supongamos un escenario donde logra finalizar en 5 horas (muy optimista para fuerza bruta).
- **Cálculo:** `0.1 kW × 5.0 h × 400 gCO₂`
- **Resultado:** **200 gramos de CO₂** por intento de generación de horario.
- **Impacto Ambiental:** Producir 200 gramos de CO₂ equivale ambientalmente a conducir un vehículo estándar a gasolina por casi un kilómetro. Este consumo es por **cada intento**, lo cual representa un costo energético severo e insostenible a largo plazo.

---

## 4. Conclusión y Roadmap "GreenOps"

El análisis revela que el cuello de botella ambiental del proyecto no reside en la red, sino en la **ineficiencia algorítmica** para grandes volúmenes de datos. La estrategia más "verde" (y económicamente viable en costos de nube) será reestructurar el motor de generación.

**Propuestas a futuro:**
1. **Sustituir Backtracking puro:** Implementar algoritmos metaheurísticos (Ej. Algoritmos Genéticos, Simulated Annealing) que no busquen el 100% de perfección combinatoria, sino que encuentren soluciones óptimas en tiempos finitos (minutos en lugar de horas).
2. **Procesamiento Asíncrono:** Mover el motor a un *Worker Thread* o a una cola de tareas (Redis/BullMQ) para que el consumo de CPU prolongado no bloquee el *Event Loop* principal del servidor Node.js, permitiendo a los usuarios seguir interactuando con la interfaz de forma fluida.
