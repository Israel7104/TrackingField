# Formularios e interaccion

## Formularios controlados

Los formularios del proyecto son controlados. Eso significa que los inputs siempre leen y actualizan estado React. Esta estrategia hace mas facil validar, limpiar campos y reaccionar a errores.

## Formularios implementados

- Inicio de sesion.
- Registro de cuenta demo.
- Alta de alimentos.
- Alta de ejercicios.
- Creacion de dietas.
- Creacion de rutinas.
- Alta de alimentos dentro de dietas.
- Alta de ejercicios dentro de rutinas.

## Validaciones basicas

- Campos obligatorios.
- Minimos de longitud en nombre y contrasena.
- Numeros positivos o no negativos en calorias, macros, series y repeticiones.
- Deteccion de correo duplicado en la capa de sesion demo.
- Validacion adicional en la frontera de red del backend.

## Mensajes de error o confirmacion

- Error de login cuando el correo o la contrasena no coinciden.
- Error de registro cuando el correo ya existe.
- Confirmaciones y errores de red mediante `StatusBanner`.

## Valor de este enfoque

Tener validacion tanto en UI como en backend mejora la experiencia y evita que datos invalidos entren en la persistencia del servidor.