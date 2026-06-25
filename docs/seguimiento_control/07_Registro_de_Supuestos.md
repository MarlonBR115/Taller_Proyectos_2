# Registro de Supuestos

## Objetivo

Controlar condiciones aceptadas para planificar y operar el prototipo. La explicacion detallada se conserva en [Supuestos y Restricciones](../04_supuestos_y_restricciones.md).

| Codigo | Supuesto | Area | Impacto si no se cumple | Validacion realizada | Estado | Evidencia |
|---|---|---|---|---|---|---|
| SUP-01 | Existe MySQL local o un servicio equivalente para persistencia real | Entorno | Backend y pruebas con BD no pueden ejecutarse | Scripts y prueba MySQL existentes | Parcial | `backend_node/server.js`; IMP-01 |
| SUP-02 | Los datos academicos ingresados son completos y consistentes | Datos | Horarios invalidos o sin solucion | HU03 valida datos minimos | Parcial | `motorAntiCruces.js`; metricas HU03 |
| SUP-03 | El entorno dispone de Node.js y npm | Tecnico | No se ejecutan backend, frontend ni pruebas | Comandos documentados | Vigente | README y capacitacion |
| SUP-04 | El horario generado recibe revision humana | Operacion | Excepciones podrian aprobarse sin control | Definido como principio del proyecto | Vigente | Vision y mapa de proceso |
| SUP-05 | SonarQube se integrara para obtener baseline real | Calidad | No habra ratings ni deuda tecnica verificable | Solo documentado; ejecucion pendiente | Pendiente | IMP-02 |
| SUP-06 | GitHub y Jira se usan para trazabilidad | Gestion | Cambios y decisiones quedan sin relacion formal | Matriz documental creada | Parcial | `03_Trazabilidad_Jira_GitHub.md` |
| SUP-07 | Matricula completa/student sectioning no es nucleo actual | Alcance | Podria evaluarse el prototipo contra funciones no implementadas | Alcance aclarado documentalmente | Validado | Vision, requerimientos y mapa |
| SUP-08 | Coverage y quality gates se consolidaran despues de integrar AT002 | Calidad | Metricas pueden variar entre ramas | Redaccion condicional aplicada | Pendiente | IMP-03; capacitacion |
| SUP-09 | La aprobación del proyecto exige que todo el equipo asista a las presentaciones | Operativo | Si falta un miembro, no solo pierde él, sino que afecta la imagen y la calificación de todo el grupo | Confirmaciones de asistencia a hitos | Vigente | Reglas del Equipo |
| SUP-10 | El proyecto se evalúa tanto por su funcionamiento como por su nivel de seguridad | Calidad | Tener pruebas que funcionen perfecto no servirá de mucho si los reportes de seguridad y calidad de código son deficientes | Requerimientos del proyecto | Vigente | Criterios de aceptación |
## Revision

Los supuestos deben revisarse cuando cambie el entorno, alcance, fuente de datos o estrategia de calidad. Si un supuesto deja de cumplirse, debe convertirse en riesgo, impedimento o cambio de alcance.
