# Constitution SDD

## Proposito
Este documento define las reglas minimas de gobernanza tecnica para aplicar Spec-Driven Development (SDD) en el prototipo del Sistema de Generacion Optima de Horarios Academicos en Entornos de Curriculo Flexible.

El SDD se usa para mantener trazabilidad entre requisitos, especificaciones, pruebas, evidencias y estado real de implementacion. Su objetivo no es ampliar artificialmente el alcance del sistema, sino documentar de forma verificable lo que el prototipo implementa.

## Reglas de calidad del codigo
- Los servicios de negocio deben ser modulares, deterministas y testeables de forma independiente.
- La logica CSP o de validacion de restricciones debe mantenerse separada de Express, base de datos y frontend cuando sea posible.
- Las funciones publicas deben conservar compatibilidad salvo que exista una decision explicita del equipo.
- Los cambios deben ser acotados a la historia de usuario o tarea asignada.
- No se deben prometer funcionalidades no implementadas en codigo o pruebas.
- La documentacion tecnica debe reflejar el comportamiento real del prototipo.

## Definition of Done
Una historia de usuario o tarea tecnica se considera terminada cuando:

- El alcance esta descrito en una especificacion o documento asociado.
- La implementacion existe en el modulo correspondiente.
- Existen pruebas unitarias o evidencia verificable para los criterios principales.
- Los criterios de aceptacion estan redactados en formato Dado/Cuando/Entonces cuando aplica.
- La documentacion indica limitaciones actuales y mejoras futuras sin presentarlas como funcionalidades completas.
- Los comandos de validacion relevantes fueron ejecutados o se documenta por que no pudieron ejecutarse.

## Reglas minimas de TDD
- Cada servicio critico debe tener pruebas unitarias para casos exitosos y casos de error.
- Las restricciones duras deben tener al menos una prueba que demuestre su deteccion.
- Las restricciones blandas o advertencias deben probarse sin convertirlas en errores duros si ese no es su comportamiento esperado.
- Las pruebas deben poder ejecutarse desde el repositorio con comandos reproducibles.
- Si no existe medicion formal de coverage, se debe indicar como mejora pendiente y no reportar porcentajes no medidos.

## Reglas de documentacion
- Cada HU tecnica debe documentar proposito, entradas, salidas, reglas validadas, criterios de aceptacion, pruebas y limitaciones.
- La documentacion debe enlazar archivos reales de implementacion, pruebas y evidencia.
- Los documentos SDD deben complementar, no reemplazar, la documentacion de ejecucion.
- Las metricas deben ser observables o calculadas por el prototipo; no deben inventarse indicadores sin evidencia.

## Criterios para considerar una HU terminada
- La HU esta asociada a un requisito funcional o no funcional.
- Existe un modulo, servicio o documento que materializa la HU.
- Los criterios de aceptacion son verificables.
- Las pruebas asociadas pasan o se registra el bloqueo tecnico.
- La salida del modulo es trazable y entendible para revision academica.
- La HU no invade responsabilidades de otros modulos sin acuerdo del equipo.

## Restricciones generales del proyecto
- El proyecto es un prototipo academico, no un sistema institucional completo.
- La base de datos, frontend, backend y documentacion deben evolucionar de forma coordinada.
- No se debe modificar frontend desde tareas documentales o de backend salvo que el alcance lo solicite explicitamente.
- No se deben introducir dependencias nuevas sin justificacion tecnica.
- Las integraciones futuras deben marcarse como futuras cuando aun no esten implementadas.

## Enfoque realista
La arquitectura documental debe reconocer el estado actual del repositorio. HU03 cuenta con servicio, pruebas unitarias, metricas de validacion y documentacion de ejecucion. Otras capacidades del sistema pueden estar en desarrollo o parcialmente implementadas; por tanto, el SDD debe distinguir entre evidencia existente, decision de diseno y mejora pendiente.
