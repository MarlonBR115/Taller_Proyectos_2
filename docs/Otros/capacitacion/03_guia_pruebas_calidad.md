# Guia de Pruebas y Calidad

## Objetivo

Explicar como se verifican los componentes del proyecto y como distinguir una falla de codigo de una dependencia del entorno.

## Tipos de pruebas

| Tipo | Ejemplo | Dependencia |
|---|---|---|
| Unitarias | `motorAntiCruces.test.js` | No requiere servidor ni MySQL. |
| Integracion API | `api.integration.test.js` con Supertest | Usa `createApp(pool)` y pool falso. |
| Aceptacion con MySQL | `RF06_07_motor_csp.test.js` | Requiere MySQL, credenciales y datos. |
| Frontend | Jest/Testing Library | Requiere dependencias de `frontend/`. |
| E2E | Playwright en `e2e/` | Requiere frontend, backend y entorno preparado. |

## Comandos principales

Backend:

```bash
cd backend_node
npm.cmd test
```

`npm.cmd test` es el comando principal para las pruebas reproducibles. Con la configuracion AT002 integrada, este comando excluye las pruebas que requieren MySQL real.

Frontend:

```bash
cd frontend
npm.cmd test
npm.cmd run test:coverage
```

E2E:

```bash
cd e2e
npm.cmd test
```

## Comandos de calidad AT002

La configuracion de calidad preparada en AT002 contempla:

```bash
npm.cmd run test:coverage
npm.cmd run test:mysql
```

- `test:coverage`: genera coverage backend con `c8` usando pruebas reproducibles.
- `test:mysql`: ejecuta de forma separada las pruebas que requieren MySQL local o una BD de pruebas.

Si estos scripts aun no aparecen en la rama consultada, su configuracion esta pendiente de consolidacion en `main`. No deben afirmarse resultados de coverage sin contar con el reporte generado en esa rama.

## Trabajo ya documentado

- HU03 cuenta con pruebas unitarias mediante `node:test`.
- La API cuenta con pruebas Supertest y pool falso.
- La separacion de pruebas reproducibles y pruebas MySQL forma parte de AT002; su disponibilidad depende de la integracion de esa configuracion al flujo principal.
- SonarQube, WCAG y SUS requieren evidencia real antes de reportar resultados.

## Interpretacion de resultados

| Termino | Significado |
|---|---|
| `pass` | Caso ejecutado y validado correctamente. |
| `fail` | Caso no cumplido; revisar si es codigo, datos o entorno. |
| Coverage | Porcentaje de codigo ejecutado por pruebas; no equivale por si solo a calidad. |
| `lcov.info` | Archivo que herramientas como SonarQube pueden importar. |
| Error de entorno | Fallo por MySQL, credenciales, puerto o dependencia, que debe documentarse sin ocultarlo. |

## Referencias

- [Evidencia TDD HU03](../ejecucion/evidencia-tdd-hu03.md)
- [Evidencia de integracion API](../ejecucion/evidencia-tests-integracion-api.md)
- [Registro de impedimentos](../seguimiento_control/04_Registro_de_Impedimentos.md)
- Consultar `docs/calidad/` cuando la rama de calidad AT002 este integrada al flujo principal.
