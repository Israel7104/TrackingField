# Testing y mejoras

## Validaciones realizadas

Se han ejecutado comprobaciones tecnicas directas sobre el proyecto:

- Compilacion del frontend con `npm run build` en `front/`.
- Compilacion del backend con `npm run build` en `server/`.

## Pruebas manuales recomendadas

- Iniciar sesion con el usuario demo.
- Crear un alimento y comprobar que aparece en la lista.
- Crear una dieta y agregarle alimentos.
- Crear un ejercicio y una rutina.
- Navegar entre rutas y abrir una ruta inexistente para comprobar la pagina 404.
- Detener el backend y verificar el estado de error de red.

## Responsive

La interfaz existente ya incluye reglas responsivas en CSS y los nuevos bloques se apoyan en clases utilitarias compatibles con movil. Aun asi, conviene revisar manualmente anchos pequenos para confirmar espaciados y lectura de tablas o listas.

## Consola y bugs

La siguiente revision deberia comprobar:

- errores de CORS si el frontend se sirve desde otro origen
- errores de URL de API en produccion
- posibles condiciones de carrera si se enviaran muchas escrituras concurrentes

## Mejoras futuras de calidad

- Añadir tests unitarios a utilidades y validadores.
- Añadir tests de integracion para la API.
- Añadir pruebas E2E para login demo, alta de alimentos y alta de rutinas.