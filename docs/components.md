# Componentes

## Objetivo

Los componentes del proyecto estan pensados para separar piezas visuales reutilizables de la logica de pagina. Esto reduce repeticion y hace mas facil cambiar el diseño o la estructura interna sin tocar toda la aplicacion.

## Componentes reutilizables principales

- `MetricCard`: tarjeta pequena para mostrar un valor y una etiqueta.
- `FoodForm`: formulario controlado para crear alimentos. Tiene modo normal y modo compacto.
- `ExerciseForm`: formulario controlado para crear ejercicios. Igual que el anterior, se reutiliza dentro de listas y tarjetas.
- `DietCard`: encapsula el detalle de una dieta y el alta de alimentos asociados.
- `RoutineCard`: encapsula el detalle de una rutina y el alta de ejercicios asociados.
- `Navbar`: navegacion superior con estado de sesion.
- `Layout`: contenedor base del arbol de rutas.
- `StatusBanner`: capa de feedback para estados de red.

## Tipado de props

Todas las props se definen con TypeScript. Eso permite saber que datos necesita cada componente y evita errores frecuentes al integrar formularios, callbacks y entidades de dominio.

Ejemplos de decisiones de tipado:

- `MetricCard` recibe dos strings simples.
- `FoodForm` recibe una funcion `onAdd` con un contrato de datos bien definido.
- `DietCard` y `RoutineCard` reciben una entidad completa y callbacks para mutaciones.

## Composicion

La composicion se usa de forma clara:

- Una pagina contiene bloques funcionales grandes.
- Dentro de esos bloques viven formularios y tarjetas especializadas.
- Las tarjetas embeben formularios compactos para crear elementos anidados.

Ese enfoque evita que una pagina acumule demasiada logica visual y hace mas facil reaprovechar piezas en otros flujos.