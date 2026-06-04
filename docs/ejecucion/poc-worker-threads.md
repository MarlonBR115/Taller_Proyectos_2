# Prueba de Concepto - Worker Threads para Procesamiento Pesado

> Nota de alcance: este documento describe una propuesta tecnica. No declara que exista actualmente un worker implementado en el repositorio.

## Problema

El algoritmo CSP con backtracking puede ser intensivo. Si se ejecuta de forma sincronica en el hilo principal de Node.js, podria bloquear temporalmente respuestas de Express durante la generacion.

## Solucion propuesta

Usar `worker_threads` de Node.js para ejecutar el solver en un hilo separado, manteniendo el servidor principal disponible para otras solicitudes.

```text
Hilo principal Express
  -> prepara inputData
  -> lanza worker propuesto
  -> espera resultado o timeout
  -> responde al cliente

Worker propuesto
  -> instancia CSPMotor
  -> ejecuta solve()
  -> devuelve asignaciones y metricas
```

## Beneficios esperados

- Reducir bloqueo del event loop.
- Aislar errores de generacion.
- Permitir timeout controlado.
- Preparar escalabilidad futura.

## Riesgos

- Mayor complejidad de depuracion.
- Necesidad de pruebas de integracion.
- Manejo cuidadoso de errores y serializacion de datos.

## Estado

Propuesto. Para declararlo implementado se deberian agregar archivos reales de worker, configuracion, pruebas y evidencia de ejecucion.
