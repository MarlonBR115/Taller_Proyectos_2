# Requerimientos (Resumen SMART)

## Funcionales
- **RF01-RF04:** Gestión validada y estructurada de entidades principales (Estudiantes, Docentes, Cursos, Aulas).
- **RF05:** Validación estricta de matrículas verificando prerrequisitos y límite de créditos.
- **RF06-RF07:** Generación automática de horarios mediante CSP garantizando cero (0) cruces de recursos.
- **RF08:** Visualización interactiva semanal y exportación nativa a PDF.
- **RF09:** Módulos CRUD exclusivos y asegurados para el rol Administrador.
- **RF10:** Configuración de pesos (Alto, Medio, Bajo) para flexibilizar las heurísticas del algoritmo.

## No Funcionales
- **RNF01 (Rendimiento):** Generación de horarios en ≤ 15 segundos (para 500 alumnos/50 cursos).
- **RNF02 (Usabilidad):** Operación principal de generación accesible en < 5 clics.
- **RNF03 (Escalabilidad):** Soporte de 200 peticiones concurrentes con latencia < 2s.
- **RNF04 (Seguridad):** Autenticación JWT y expiración automática de sesión a los 30 minutos.
- **RNF05 (Mantenibilidad):** Cobertura de pruebas unitarias (Test Coverage) ≥ 70% en el motor CSP.
- **RNF06 (Disponibilidad):** Uptime comprobable del 99.5% durante periodos críticos de matrícula.
- **RNF07 (Compatibilidad):** Renderizado sin errores en las 2 últimas versiones de Chrome, Firefox y Edge.