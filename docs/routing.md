# Rutas y navegacion

## Libreria

La navegacion se implementa con React Router.

## Estructura actual

- `/`: pagina de inicio con resumen general.
- `/nutricion`: gestion de alimentos y dietas.
- `/entrenamientos`: gestion de ejercicios y rutinas.
- `/usuario`: acceso demo y resumen del usuario.
- `*`: pagina 404.

## Rutas protegidas

Las rutas de nutricion y entrenamientos estan protegidas por una sesion demo. Si no existe `sessionUser`, el usuario es redirigido a `/usuario`.

## Navegacion

La barra superior permite moverse entre secciones y muestra el estado de sesion. Esto facilita probar rapidamente la aplicacion y entender la estructura global del producto.

## Pagina 404

Se ha añadido una pagina 404 para manejar rutas inexistentes. Eso evita una experiencia rota y deja clara la estructura navegable del proyecto.