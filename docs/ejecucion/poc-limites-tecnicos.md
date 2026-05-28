# Prueba de Concepto — Límites Técnicos del Solver

## Parámetros Configurables

Se definen dos límites técnicos para evitar que el solver CSP se ejecute
indefinidamente o consuma recursos excesivos:

| Parámetro        | Default  | Descripción                                            |
|------------------|----------|--------------------------------------------------------|
| `timeoutMs`      | 30000    | Tiempo máximo de ejecución en milisegundos (30 seg)    |
| `maxIterations`  | 100000   | Número máximo de nodos explorados en el backtracking   |

Ambos se configuran centralizadamente en `backend_node/config.js`:

```javascript
solver: {
    timeoutMs: 30000,
    maxIterations: 100000,
    useWorker: true
}
```

---

## Timeout del Solver (`timeoutMs`)

### Ubicación

- Definido en: `backend_node/config.js` → `solver.timeoutMs`
- Inyectado en: `CSPMotor` constructor vía `inputData.timeoutMs`

### Implementación

En `CSPMotor.solve()` se verifica al inicio de cada llamada recursiva:

```javascript
if (this.timeoutMs > 0 && (performance.now() - this.startTime) > this.timeoutMs) {
    this.timedOut = true;
    return null;  // aborta la búsqueda
}
```

### Comportamiento

- Si se alcanza el timeout, la búsqueda se aborta inmediatamente y se reporta
  un resultado parcial (o nulo)
- El flag `timedOut` se expone en la respuesta: `metrics.timed_out`
- Mensaje al usuario: *"La generación excedió el tiempo límite. Intenta con
  menos grupos o más recursos."*

### Timeout Externo (Worker)

Cuando se usa Worker Threads, el `GeneratorService` añade un segundo timeout
(5000ms adicionales) por si el worker deja de responder:

```javascript
const workerTimeout = this.timeoutMs > 0 ? this.timeoutMs + 5000 : 0;
```

Si se vence, llama a `worker.terminate()`.

---

## Profundidad de Búsqueda (`maxIterations`)

### Ubicación

- Definido en: `backend_node/config.js` → `solver.maxIterations`
- Inyectado en: `CSPMotor` constructor vía `inputData.maxIterations`

### Implementación

Se lleva un contador de iteraciones que se incrementa en cada llamada a
`solve()` (cada nodo del árbol de búsqueda). Si se supera el límite, se
aborta:

```javascript
this.iterationCount++;
if (this.maxIterations > 0 && this.iterationCount > this.maxIterations) {
    return null;  // aborta por límite de iteraciones
}
```

### Diferencia con Timeout

- **Timeout**: límite basado en tiempo real (reloj de pared). Útil cuando el
  servidor no puede dedicar más de X ms a la generación.
- **MaxIterations**: límite basado en trabajo realizado (nodos explorados).
  Útil para garantizar que el algoritmo no se atasque en ramas profundas del
  árbol de backtracking.

Se recomienda configurar ambos para tener una doble protección.

---

## Métricas Reportadas

La respuesta del endpoint `POST /api/schedule/generate` incluye:

```json
{
  "success": true,
  "total_assigned": 10,
  "metrics": {
    "execution_time_ms": 1234,
    "total_groups": 10,
    "assigned_groups": 10,
    "timed_out": false,
    "iterations": 4523,
    "max_iterations": 100000,
    "timeout_ms": 30000
  }
}
```

| Métrica           | Descripción                                    |
|-------------------|------------------------------------------------|
| `execution_time_ms` | Tiempo real de ejecución del solver           |
| `iterations`      | Nodos explorados durante el backtracking       |
| `timed_out`       | Indica si se abortó por timeout                |
| `max_iterations`  | Límite configurado (o "ilimitado" si es 0)     |
| `timeout_ms`      | Límite configurado (o "ilimitado" si es 0)     |

---

## Valores Recomendados para la PoC

| Escenario          | timeoutMs | maxIterations |
|--------------------|-----------|---------------|
| Dataset pequeño    | 10000     | 50000         |
| Dataset mediano    | 30000     | 100000        |
| Dataset grande     | 60000     | 500000        |
| Sin límite         | 0         | 0             |

Para la prueba de concepto con 10 grupos se recomienda:
- **timeoutMs: 10000** (10 segundos es más que suficiente)
- **maxIterations: 50000** (cubre holgadamente el espacio de búsqueda)

Valores por defecto en `config.js` (30s / 100k) son conservadores y deben
ajustarse según el tamaño real del problema en producción.
