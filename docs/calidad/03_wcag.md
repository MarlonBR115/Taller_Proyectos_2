# Checklist WCAG - Evaluacion Inicial

## Objetivo
Preparar una revision inicial de accesibilidad del frontend React/Vite, sin declarar resultados de Lighthouse o axe porque esas herramientas no se ejecutaron en esta fase.

## Herramientas recomendadas
- Lighthouse en navegador.
- axe DevTools.
- Revision manual con teclado.
- Reglas `eslint-plugin-jsx-a11y` como mejora futura.

## Checklist inicial

| Criterio | Area o componente | Hallazgo | Como verificar | Mejora propuesta | Estado |
|---|---|---|---|---|---|
| Contraste | `frontend/src/index.css` | Colores como `--text-muted` sobre paneles translucidos deben validarse. | Lighthouse, axe o contrast checker. | Ajustar colores si no cumplen ratio WCAG AA. | Pendiente de validacion con Lighthouse/axe |
| Navegacion por teclado | `Sidebar.jsx` | Items de menu usan `<li onClick>`, no botones o enlaces. | Tab, Enter, Space y lector de pantalla. | Usar `<button>` o agregar roles/teclado si se mantiene estructura. | Detectado |
| Estructura semantica | `Sidebar.jsx`, `ScheduleGrid.jsx` | Hay elementos interactivos implementados como `div` o `li`. | axe y revision manual. | Usar elementos semanticos nativos. | Detectado |
| Labels | `CrudView.jsx` | Inputs principales tienen `label` e `htmlFor`; checkboxes usan labels envolventes sin id unico. | axe/manual. | Asociar cada checkbox con id unico si se requiere mayor robustez. | Parcial |
| Botones de icono | `CrudView.jsx`, `ScheduleGrid.jsx` | Botones de editar, eliminar y cerrar usan iconos; algunos no tienen texto accesible explicito. | axe/lector de pantalla. | Agregar `aria-label` descriptivo. | Detectado |
| Foco visible | CSS global | No se observa estilo global especifico para foco en botones/nav. | Navegacion con teclado. | Agregar estilos `:focus-visible`. | Pendiente |
| Formularios | `CrudView.jsx` | Hay `required`, pero no mensajes de validacion accesibles propios. | Prueba manual con campos vacios. | Mostrar errores persistentes con `aria-live`. | Pendiente |
| Mensajes de error | `CrudView.jsx`, `ScheduleGrid.jsx` | Errores se registran en consola o `alert`. | Revision manual. | Usar mensajes visibles y anunciables. | Detectado |
| Lectores de pantalla | Modales | Modales no declaran `role="dialog"` ni `aria-modal`. | axe/lector de pantalla. | Agregar roles, labels y manejo de foco. | Detectado |
| Estados de carga | `CrudView.jsx`, `ScheduleGrid.jsx` | Hay texto de carga/spinner, pero sin region viva. | Revision manual. | Agregar `aria-live="polite"` para estados importantes. | Pendiente |

## Estado
Pendiente de validacion con Lighthouse/axe. Esta tabla es un checklist inicial basado en revision estatica de componentes.
