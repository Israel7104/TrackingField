# Reflexion final

## Que se aprendio

Este proyecto sirve para conectar varias piezas habituales de un stack web moderno: React con TypeScript en el frontend, Express en el backend, una API REST intermedia y una capa de tipos compartidos a nivel conceptual. La parte mas importante no ha sido solo construir pantallas, sino entender como hacer que estado, rutas, formularios y persistencia encajen de forma coherente.

## Conexion entre frontend, backend y API

La conexion se apoya en una idea clara: el frontend no debe inventarse los datos principales, sino pedirlos y mutarlos a traves de la API. Por eso alimentos, ejercicios, dietas y rutinas viven en el servidor, aunque sea con persistencia sencilla en JSON. El frontend los consume con un cliente tipado y los distribuye a traves de Context API.

## Problemas encontrados

- El frontend original concentraba demasiado estado en `App.tsx`.
- Hacia falta separar datos de sesion local de datos de negocio.
- Al introducir una API, hubo que alinear contratos de tipos y manejar estados de carga, exito y error.
- En el backend aparecieron detalles de tipado de Express y validacion que obligaron a estrechar bien los datos antes de persistirlos.

## Uso de IA durante el desarrollo

La IA se utilizo como apoyo para:

- reestructurar el frontend hacia contexto, hooks y cliente API
- proponer una arquitectura de backend por capas
- redactar documentacion tecnica y metodologica con un formato consistente
- detectar y corregir errores de tipado durante las compilaciones

La parte importante no fue aceptar codigo sin criterio, sino revisar cada decision, compilar y validar el resultado.

## Siguiente paso natural

El siguiente salto de calidad seria reemplazar la persistencia en JSON por una base de datos real y añadir autenticacion de backend. Con eso, TrackingField pasaria de ser una entrega academica funcional a una base seria para evolucionar el producto.