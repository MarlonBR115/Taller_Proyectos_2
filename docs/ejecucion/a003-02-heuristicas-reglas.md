# A003-02: Definición de Heurísticas y Reglas de Negocio (Duras y Blandas)

Este documento detalla la implementación de heurísticas de búsqueda y la categorización de restricciones en el `CSPMotor` (Generador de Horarios).

## 1. Categorización de Restricciones

El motor divide las reglas en dos grandes categorías:

### Restricciones Duras (Hard Constraints)
Son de cumplimiento obligatorio. Si no se cumplen, la asignación es rechazada inmediatamente.
- **No solapamiento:** Un docente o un aula no pueden estar en dos clases al mismo tiempo.
- **Capacidad de Aulas:** El aula asignada debe tener una capacidad `capacity` igual o mayor a la cuota del grupo `quota`.
- **Tipo de Aula:** El aula asignada debe coincidir con el `room_type_required` del grupo.
- **Integridad de Sesiones:** Si un grupo requiere `n` horas semanales (`weekly_hours`), estas se asignan como un bloque contiguo e inseparable en el mismo día, garantizando que no existan cortes a mitad de una sesión académica.

### Restricciones Blandas (Soft Constraints)
Son preferencias o criterios de optimización (Satisfacción del estudiante). No invalidan un horario, pero ayudan a elegir la "mejor" opción posible (Least Constraining Value).
- **Preferencias Horarias:** Se priorizan horarios céntricos (cercanos al mediodía) y se penalizan horarios extremos (muy temprano en la mañana o muy tarde en la noche).
- **Huecos Académicos:** Se evalúa la agenda del día para la misma cohorte (o en su defecto, para el mismo docente). Se premia la adyacencia de clases (para evitar desplazamientos innecesarios) y se penalizan fuertemente los "huecos" (horas muertas entre clases).

## 2. Implementación de Heurísticas de Búsqueda

### MRV (Minimum Remaining Values)
Para mejorar la eficiencia del algoritmo de *Backtracking*, los grupos no se asignan en un orden aleatorio. Antes de iniciar la búsqueda, se aplica la heurística MRV:
1. **Ordenamiento por carga horaria:** Los grupos con mayor `weekly_hours` se procesan primero, ya que es más difícil encontrar bloques contiguos largos conforme el horario se llena.
2. **Ordenamiento por escasez de recursos:** A igualdad de horas, se priorizan los grupos que exigen tipos de aulas menos comunes en la institución (ej. laboratorios especializados).

### LCV (Least Constraining Value)
Durante la asignación de cada grupo:
1. En lugar de tomar el primer espacio (`first-fit`) válido, el motor recopila **todas** las combinaciones posibles de `(aula, día, hora)`.
2. Calcula un `StudentSatisfactionScore` para cada combinación evaluando las *Restricciones Blandas* mencionadas anteriormente.
3. Ordena las opciones de mayor a menor puntuación y el *Backtracking* las intenta en ese orden estricto. Esto garantiza que la primera solución completa encontrada sea también una solución de alta calidad.
