# Informe Final de Lecciones Aprendidas

## Objetivo

Consolidar aprendizajes tecnicos, de gestion y documentacion para reducir retrabajo y mejorar la continuidad del proyecto.

## Fuentes

- desarrollo backend y frontend;
- pruebas unitarias, API y dependientes de MySQL;
- documentacion SDD y evidencias;
- coordinacion Scrum;
- uso controlado de IA/Codex;
- Git, GitHub y Jira.

## Registro de lecciones

| Codigo | Situacion | Que salio bien | Que no funciono | Causa | Accion correctiva | Recomendacion futura |
|---|---|---|---|---|---|---|
| LA-01 | Cambios documentales y tecnicos | El alcance explicito redujo modificaciones accidentales | Mezclar ambos tipos dificulta revision | Ramas con objetivos amplios | Separar tareas y PR | Una rama por objetivo verificable |
| LA-02 | Pruebas con MySQL real | Permiten validar persistencia y motor completo | Reducen reproducibilidad del test principal | Dependencia de servicio, credenciales y seed | Aislarlas en un script especifico | Mantener suite reproducible y suite de entorno separadas |
| LA-03 | Registro de limitaciones | Evito prometer coverage, Sonar o KPI inexistentes | Documentos antiguos contenian afirmaciones futuras ambiguas | Falta de criterio de estado | Usar implementado, parcial, pendiente o propuesto | Exigir evidencia antes de declarar cumplimiento |
| LA-04 | Uso de Codex/IA | Facilito auditorias y cambios documentales extensos | Prompts ambiguos pueden ampliar el alcance | Falta de restricciones precisas | Incluir archivos permitidos, prohibidos y entregable | Revisar `git diff` antes de aceptar cambios |
| LA-05 | GitHub Desktop y PR | Facilita revisar archivos antes de publicar | Datos de ramas/PR no siempre quedaron documentados | Trazabilidad posterior al cambio | Validar estado y diff antes del PR | Registrar Jira, rama, pruebas y evidencia en cada PR |
| LA-06 | Metricas | HU03 produce metricas verificables | No existe historico consolidado de KPI | Persistencia fuera de alcance | Documentar metricas por ejecucion | Diseñar persistencia en tarea independiente |
| LA-07 | Documentacion historica | Conserva decisiones y evidencia de sprint | Puede confundirse con documentacion vigente | Nombres y ubicaciones similares | Marcar fuentes vigentes e historicas | No eliminar evidencia; enlazarla desde indices |
| LA-08 | Jira/GitHub/SDD | Existe una base de trazabilidad | Algunas filas carecen de PR confirmado | Datos no consolidados | Usar `pendiente` en vez de inventar | Actualizar trazabilidad al cerrar cada tarea |
| LA-09 | Contratos de datos | La normalizacion HU03 acepta alias | Persisten diferencias entre schema, API y frontend | Evolucion no sincronizada | Documentar contrato y probar integracion | Aprobar cambios de datos entre responsables |
| LA-10 | Cierre PMBOK | Los registros permiten evaluar control | La informacion estaba distribuida | Cierre documental tardio | Consolidar informe, SOW y checklist | Mantener artefactos de cierre desde cada sprint |

## Recomendacion general

La mejora mas importante es convertir evidencia dispersa en un flujo repetible: tarea Jira, rama, cambios acotados, pruebas, metricas, documento actualizado, PR y cierre del impedimento o riesgo asociado.
