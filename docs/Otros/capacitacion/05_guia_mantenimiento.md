# Guia de Mantenimiento

## Trabajo con Git

- Crear una rama por tarea, usando el codigo Jira en el nombre.
- Evitar modificar `main` directamente.
- Realizar commits pequenos, descriptivos y coherentes con el alcance.
- Crear Pull Request con resumen, archivos, pruebas, evidencias y riesgos.
- No inventar numeros de PR ni estados que no existan.

## Documentacion

- Actualizar el documento fuente del tema y enlazarlo desde indices.
- No duplicar explicaciones extensas en varios archivos.
- Marcar claramente lo implementado, parcial, pendiente o propuesto.
- Conservar documentos historicos cuando sean evidencia de sprint.

## Impedimentos y riesgos

- Registrar impedimentos activos en [04_Registro_de_Impedimentos.md](../seguimiento_control/04_Registro_de_Impedimentos.md).
- Mantener riesgos en [01_Registro_de_Riesgos_y_Oportunidades.md](../seguimiento_control/01_Registro_de_Riesgos_y_Oportunidades.md).
- Un impedimento se cierra solo con evidencia de desbloqueo.
- Un riesgo puede permanecer abierto aunque todavia no bloquee el trabajo.

## Pruebas y calidad

- Agregar o actualizar pruebas cuando cambia comportamiento.
- Ejecutar los comandos definidos realmente en cada `package.json`.
- Documentar fallos de entorno sin presentarlos como pruebas aprobadas.
- No reportar coverage, SonarQube, WCAG o SUS sin evidencia generada.

## Acciones que deben evitarse

- modificar `main` directamente;
- subir `coverage/` o `node_modules/`;
- ejecutar `npm audit fix` sin revisar impacto;
- modificar `database/schema.sql` sin una tarea clara y coordinada;
- mezclar grandes cambios tecnicos con reorganizaciones documentales;
- eliminar evidencia historica sin preservar su contenido util.

## Checklist antes de cerrar una tarea

- [ ] Alcance Jira verificado.
- [ ] Archivos modificados revisados.
- [ ] Pruebas aplicables ejecutadas.
- [ ] Resultados y limitaciones documentados.
- [ ] Documentacion e indices actualizados.
- [ ] Impedimentos y riesgos revisados.
- [ ] Pull Request creado o marcado como pendiente.
- [ ] Jira actualizado con evidencia.
- [ ] No se incluyeron secretos, `node_modules/`, coverage ni artefactos temporales.

## Referencias

- [Constitution SDD](../sdd/constitution.md)
- [Trazabilidad Jira/GitHub](../seguimiento_control/03_Trazabilidad_Jira_GitHub.md)
- [Documentacion de ejecucion](../ejecucion/README.md)
