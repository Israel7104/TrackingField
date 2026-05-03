# Despliegue

## Frontend en Vercel

Pasos recomendados:

- Conectar el repositorio GitHub a Vercel.
- Seleccionar la carpeta `front/` como raiz del proyecto frontend.
- Configurar el comando de build como `npm run build`.
- Configurar el directorio de salida como `dist`.
- Definir `VITE_API_URL` apuntando a la API desplegada.

## Backend

Hay dos opciones razonables:

- Desplegar el backend como proyecto Node separado en Vercel, Render o Railway.
- Adaptar Express a funciones serverless si se quiere mantener todo dentro de Vercel.

Para una entrega academica simple suele ser mas directo desplegar el frontend en Vercel y la API en un servicio Node dedicado.

## Variables de entorno

- Frontend: `VITE_API_URL`
- Backend: `PORT`, `FRONTEND_ORIGIN`

## Comprobaciones despues del despliegue

- Abrir la pagina principal.
- Iniciar sesion demo.
- Crear un alimento y una rutina.
- Confirmar que la UI recibe respuestas correctas de la API.
- Revisar consola del navegador y logs del servidor.

## Estado actual

No se ha realizado el despliegue real desde este entorno porque requiere acceso a cuentas externas y configuracion remota. La documentacion deja preparado el procedimiento para completarlo cuando se disponga de esas credenciales.