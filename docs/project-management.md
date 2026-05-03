# Organizacion del trabajo

## Metodo elegido

Para este proyecto tiene sentido combinar Scrum y Kanban de forma ligera. Scrum aporta hitos cortos para revisar avance por fases. Kanban aporta visibilidad diaria del estado de cada tarea.

## Columnas del tablero

- Backlog: ideas, mejoras y tareas aun no comprometidas.
- Todo: trabajo listo para empezar.
- In Progress: tareas en ejecucion.
- Review: trabajo terminado pendiente de revision funcional o tecnica.
- Done: trabajo validado.

## Tarjetas principales del tablero

- Investigar Agile, Scrum y Kanban.
- Definir idea de la aplicacion.
- Preparar frontend con React, TypeScript y Tailwind.
- Diseñar arquitectura del frontend y la API.
- Implementar contexto global y hooks reutilizables.
- Crear formularios de alimentos, ejercicios, dietas y rutinas.
- Configurar rutas y pagina 404.
- Implementar backend Express y recursos REST.
- Crear cliente API tipado en el frontend.
- Probar la integracion completa.
- Preparar despliegue en Vercel.
- Escribir retrospectiva final.

## Subtareas tecnicas por tarjeta

### Preparar frontend con React, TypeScript y Tailwind

- Revisar dependencias instaladas.
- Confirmar plugin de Tailwind en Vite.
- Definir carpetas `components`, `pages`, `hooks`, `types`, `utils`, `context` y `api`.

### Diseñar arquitectura del frontend y la API

- Identificar estado compartido.
- Definir contratos entre frontend y backend.
- Separar datos de sesion y datos de negocio.

### Implementar backend Express y recursos REST

- Crear `server/src/config`.
- Crear `server/src/routes`.
- Crear `server/src/controllers`.
- Crear `server/src/services`.
- Definir validacion de entrada.
- Persistir datos en JSON.

### Probar la integracion completa

- Compilar frontend.
- Compilar backend.
- Levantar servidor y revisar endpoints clave.
- Comprobar interaccion desde la UI.

## Estado actual sugerido del tablero

- Done: investigacion metodologica, idea del proyecto, arquitectura inicial, contexto global, rutas, formularios y backend base.
- Review: documentacion de despliegue y retrospectiva.
- Todo: crear recursos externos reales, como repo GitHub publico y tablero Trello real.

## Nota sobre Trello

No se ha creado el tablero real desde este entorno porque hace falta acceso autenticado a Trello. La estructura anterior deja listo el contenido para replicarlo en pocos minutos dentro de una cuenta real.