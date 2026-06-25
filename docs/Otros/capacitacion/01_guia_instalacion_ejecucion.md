# Guia de Instalacion y Ejecucion

## Requisitos previos

- Git.
- Node.js y npm.
- MySQL para ejecutar el backend con persistencia real.
- Navegador moderno.
- SonarQube o SonarCloud solo para una futura revision de calidad.

## Estructura basica

| Ruta | Contenido |
|---|---|
| `backend_node/` | API Express, motores, scripts MySQL y pruebas backend. |
| `frontend/` | Interfaz React/Vite. |
| `database/` | Esquema SQL del prototipo. |
| `docs/` | Documentacion academica, tecnica y de seguimiento. |

## Backend

Desde la raiz:

```bash
cd backend_node
npm install
```

Inicializacion local documentada:

```bash
node init_db.js
node seed_db.js
node server.js
```

Estos scripts requieren MySQL local y pueden crear o modificar datos. Deben ejecutarse solo en un entorno controlado.

## Pruebas backend

Comando principal:

```bash
npm.cmd test
```

El comando principal usa `node:test`. Cuando la configuracion de calidad AT002 este integrada, debe ejecutar solamente pruebas reproducibles que no dependan de MySQL real.

Comandos preparados en AT002 o recomendados mientras esa configuracion este pendiente de consolidacion en `main`:

```bash
npm.cmd run test:coverage
npm.cmd run test:mysql
```

- `test:coverage` usa o debe usar `c8` para generar `coverage/lcov.info` con pruebas reproducibles.
- `test:mysql` aisla o debe aislar las pruebas que requieren MySQL local o una BD de pruebas.
- Si estos scripts no aparecen en la rama actual, deben considerarse disponibles cuando se integre la configuracion de calidad AT002.
- `coverage/` no debe subirse al repositorio.

## Frontend

Comandos reales definidos en `frontend/package.json`:

```bash
cd frontend
npm install
npm run dev
npm run build
npm run lint
npm run test
npm run test:coverage
```

El servidor Vite usa normalmente:

```text
http://localhost:5173
```

## Problemas comunes

| Problema | Causa probable | Accion |
|---|---|---|
| `package.json` no encontrado | Comando ejecutado desde carpeta incorrecta | Entrar a `backend_node/` o `frontend/`. |
| `Access denied for user` | Credenciales MySQL incorrectas o variables ausentes | Revisar `.env`, usuario, password y permisos. |
| Dependencia faltante | No se ejecuto `npm install` | Instalar dependencias en la carpeta correspondiente. |
| Puerto ocupado | Otro proceso usa 3000 o 5173 | Cerrar el proceso o configurar otro puerto. |
| `sonar-scanner` no reconocido | Sonar Scanner no instalado/configurado | Instalarlo o usar el procedimiento definido por el equipo. |

## Referencias

- [README principal](../../README.md)
- [Pruebas de integracion API](../ejecucion/tp2ucp-41-tests-integracion-api.md)
- [Registro de impedimentos](../seguimiento_control/04_Registro_de_Impedimentos.md)
