# SonarQube - Configuracion AT002

## Objetivo
Preparar el repositorio para un analisis estatico de calidad con SonarQube, cubriendo backend Node.js/Express y frontend React/Vite.

## Herramienta
- SonarQube local o SonarCloud.
- `sonar-scanner` para ejecutar el analisis.
- Reportes LCOV de backend y frontend cuando existan.

## Archivo de configuracion
Se creo el archivo:

```text
sonar-project.properties
```

## Carpetas analizadas
| Ruta | Proposito |
|---|---|
| `backend_node/src` | App Express, middlewares y servicios backend. |
| `backend_node/GeneratorService.js` | Orquestador de generacion de horarios. |
| `backend_node/server.js` | Arranque del servidor real. |
| `frontend/src` | Componentes React, estilos y pruebas frontend. |

## Tests configurados para Sonar
| Ruta | Tipo |
|---|---|
| `backend_node/tests` | Pruebas unitarias, aceptacion e integracion API. |
| `frontend/src/tests` | Pruebas frontend. |
| `frontend/src/__tests__` | Pruebas frontend. |
| `frontend/src/components/__tests__` | Pruebas de componentes. |
| `e2e/tests` | Pruebas E2E Playwright. |

## Exclusiones justificadas
| Patron | Justificacion |
|---|---|
| `**/node_modules/**` | Dependencias externas. |
| `**/coverage/**` | Reportes generados. |
| `**/dist/**`, `**/build/**` | Artefactos de build. |
| `**/playwright-report/**`, `**/test-results/**` | Evidencias generadas por Playwright. |
| `docs/**` | Documentacion, no codigo productivo. |
| `database/**` | Scripts SQL fuera del analisis JS. |
| `**/package-lock.json` | Archivo generado por npm. |
| `backend_node/seed*.js`, `backend_node/init_db.js`, `backend_node/test_db.js`, `backend_node/clean_schedules.js` | Scripts operativos/manuales. |

## Coverage esperado
Sonar queda configurado para leer:

```text
backend_node/coverage/lcov.info
frontend/coverage/lcov.info
```

En esta fase se genero `backend_node/coverage/lcov.info` con el script reproducible `npm.cmd run test:coverage`, que excluye pruebas dependientes de MySQL real. No se genero `frontend/coverage/lcov.info` porque el comando frontend fallo por falta de `jest` disponible en `node_modules`.

## Comandos SonarQube local con Docker
No se ejecuto Docker en esta fase. Comandos sugeridos para una ejecucion posterior:

```bash
docker run -d --name sonarqube -p 9000:9000 sonarqube:lts-community
```

Luego, cuando SonarQube este disponible:

```bash
sonar-scanner
```

## Metricas esperadas
Cuando se ejecute SonarQube deben registrarse:

- bugs;
- vulnerabilities;
- code smells;
- duplicacion;
- maintainability rating;
- reliability rating;
- security rating;
- technical debt;
- cobertura.

## Resultados reales
| Metrica | Resultado |
|---|---|
| Estado SonarQube | Configurado, pendiente de ejecucion real. |
| Dashboard | Pendiente. |
| Bugs | Pendiente. |
| Vulnerabilities | Pendiente. |
| Code smells | Pendiente. |
| Duplicacion | Pendiente. |
| Technical debt | Pendiente. |
| Coverage importado | Pendiente de ejecucion SonarQube. |

## Evidencias requeridas
- Captura del dashboard SonarQube.
- Metricas iniciales.
- Issues priorizados.
- Captura posterior si se corrigen hallazgos.
- Evidencia de reduccion de deuda tecnica cuando exista.
