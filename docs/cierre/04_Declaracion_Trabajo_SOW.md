# Declaracion de Trabajo Revisada (SOW)

## 1. Proposito

Validar el trabajo realizado y delimitar claramente entregables, exclusiones, limitaciones y criterios de aceptacion del prototipo.

## 2. Alcance del trabajo

- analisis del problema de horarios academicos;
- modelado de restricciones;
- gestion basica de recursos academicos;
- motor CSP inicial;
- validacion anti-cruces;
- interfaz de gestion y visualizacion;
- pruebas y documentacion;
- control, seguimiento y transferencia.

## 3. Entregables comprometidos y desarrollados

| Entregable | Cumplimiento | Evidencia | Observacion |
|---|---|---|---|
| Vision, problema y alcance | Cumplido | `docs/01_vision_general.md` | Alcance actual/futuro diferenciado |
| Requerimientos y restricciones | Cumplido documentalmente | `docs/03_requerimientos.md`, `docs/04_supuestos_y_restricciones.md` | Requiere revision continua |
| Backend/API | Parcial | `backend_node/src/app.js`, `server.js` | Seguridad y validaciones pendientes |
| Motor CSP | Parcial | `CSPMotor.js` | No demostrado a escala institucional |
| HU03 | Cumplido para su alcance | Codigo, pruebas y documentacion HU03 | Incluye metricas en memoria |
| Frontend | Parcial | `frontend/src/` | Accesibilidad pendiente |
| Pruebas | Parcial | Backend, frontend y E2E presentes | Entornos y coverage por consolidar |
| Seguimiento | Cumplido documentalmente | Riesgos, KPI, trazabilidad, impedimentos | Requiere actualizacion por sprint |
| Capacitacion | Cumplido | `docs/capacitacion/` | Transferencia inicial |
| Cierre | Cumplido documentalmente | `docs/cierre/` | Sujeto a aprobacion academica |

## 4. Exclusiones

- matricula institucional completa;
- student sectioning completo;
- autenticacion y roles institucionales;
- integraciones con sistemas externos;
- persistencia historica completa de KPI;
- garantia de optimizacion a escala universitaria;
- operacion productiva con alta disponibilidad.

## 5. Limitaciones

- datos principalmente locales o simulados;
- dependencia de MySQL para persistencia real;
- diferencias de configuracion entre ramas;
- evaluaciones SonarQube, WCAG y SUS sujetas a evidencia real;
- revision humana obligatoria.

## 6. Criterios de aceptacion

1. El prototipo administra datos base necesarios para horarios.
2. El motor produce una respuesta controlada con datos validos.
3. HU03 detecta conflictos y devuelve metricas estructuradas.
4. Las pruebas y limitaciones se documentan sin ocultar fallos de entorno.
5. Los entregables se encuentran mediante indices Markdown.
6. La continuidad se apoya en riesgos, impedimentos, supuestos y capacitacion.

## 7. Verificacion

La aceptacion final corresponde al equipo y evaluador academico. Este SOW registra cumplimiento documental y tecnico observado, pero no sustituye una validacion institucional ni una prueba de produccion.
