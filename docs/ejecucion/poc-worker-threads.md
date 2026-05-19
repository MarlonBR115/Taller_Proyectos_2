# Prueba de Concepto — Worker Threads para Procesamiento Pesado

## Problema

El algoritmo CSP (backtracking con MRV/LCV) es computacionalmente intensivo.
Cuando se ejecuta de forma síncrona en el hilo principal de Node.js, bloquea
el event loop, haciendo que el servidor Express no responda a otras peticiones
durante la generación del horario.

## Solución: Worker Threads

Se utiliza el módulo nativo `worker_threads` de Node.js para delegar la
ejecución del solver a un hilo separado.

```
 ┌─────────────────────────────────────────────┐
 │               Hilo Principal                 │
 │                                               │
 │  GeneratorService                             │
 │    → _runInWorker(inputData)                  │
 │    → new Worker('solverWorker.js')            │
 │    → espera mensaje / timeout                 │
 │    → procesa resultado                        │
 └───────────────────┬───────────────────────────┘
                     │ workerData (inputData)
                     ▼
 ┌─────────────────────────────────────────────┐
 │              Worker Thread                   │
 │                                               │
 │  solverWorker.js                              │
 │    → new CSPOptimizer(workerData)             │
 │    → optimizer.solve()                        │
 │    → parentPort.postMessage(result)           │
 └───────────────────────────────────────────────┘
```

## Archivos Involucrados

### `backend_node/src/services/solverWorker.js`

Punto de entrada del worker. Recibe los datos vía `workerData`, instancia el
`CSPOptimizer`, ejecuta `solve()` y envía el resultado de vuelta al hilo
principal mediante `parentPort.postMessage()`.

Estructura del mensaje de respuesta:

```json
{
  "success": true,
  "assignments": [ ... ],
  "timedOut": false,
  "iterations": 4523,
  "executionTimeMs": 1234,
  "message": "Horario generado con 10 asignaciones."
}
```

### `backend_node/GeneratorService.js` — Método `_runInWorker()`

Maneja el ciclo de vida del worker:

1. Crea el `Worker` con la ruta al archivo y los datos de entrada
2. Establece un **timeout de seguridad** (`timeoutMs + 5000ms`) por si el
   worker no responde
3. Escucha los eventos `message`, `error` y `exit`
4. Si el timeout se dispara, llama a `worker.terminate()` y resuelve con
   error controlado
5. Retorna una Promise para integrarse con el flujo async de `generate()`

### `backend_node/config.js` — Configuración

```javascript
solver: {
    useWorker: true,    // true = Worker Thread, false = síncrono
    timeoutMs: 30000,
    maxIterations: 100000
}
```

- `useWorker: true` activa el worker por defecto
- Se puede desactivar pasando `{ useWorker: false }` al constructor de
  `GeneratorService` (útil para debugging)

## Manejo de Errores

| Escenario                    | Comportamiento                                      |
|------------------------------|-----------------------------------------------------|
| Worker completa              | Resuelve Promise con assignments                    |
| Worker lanza error           | Resuelve con `{ success: false, message }`          |
| Worker excede timeout        | `worker.terminate()`, respuesta de timeout          |
| Worker termina con código    | Resuelve como error si `code !== 0`                 |

## Beneficios

- El servidor Express sigue respondiendo durante la generación del horario
- Aislamiento de errores: una falla en el solver no afecta el hilo principal
- Timeout controlado: se puede matar el worker si excede el límite
- Escalabilidad futura: se pueden lanzar múltiples workers para diferentes
  facultades en paralelo
