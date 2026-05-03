# Configuracion de Firebase Auth

Esta guia explica exactamente que copiar desde Firebase Console para que el registro e inicio de sesion funcionen en TrackingField.

## 1. Crear proyecto en Firebase

1. Entra a Firebase Console.
2. Pulsa Crear proyecto.
3. Elige nombre del proyecto y completa el asistente.

## 2. Crear app web y copiar credenciales

1. Dentro del proyecto, pulsa Agregar app y selecciona Web.
2. Asigna un nombre a la app.
3. Firebase mostrara la configuracion del SDK.
4. Copia estos valores:
   - apiKey
   - authDomain
   - projectId
   - appId

## 3. Pegar variables en el frontend

1. Abre [front/.env.example](front/.env.example).
2. Crea el archivo front/.env en la misma carpeta.
3. Completa estos campos con los valores del paso anterior:
   - VITE_FIREBASE_API_KEY
   - VITE_FIREBASE_AUTH_DOMAIN
   - VITE_FIREBASE_PROJECT_ID
   - VITE_FIREBASE_APP_ID

Tambien puedes ajustar VITE_API_URL si tu API no corre en localhost.

## 4. Activar proveedor Email y Password

1. En Firebase Console, abre Authentication.
2. Entra en Sign-in method.
3. Activa Email/Password.
4. Guarda cambios.

## 5. Revisar dominios autorizados

1. En Authentication, abre Settings.
2. En Authorized domains confirma que exista localhost.
3. Si pruebas en otro dominio, agregalo.

## 6. Reiniciar y probar

1. Reinicia el frontend.
2. Abre la pagina de usuario.
3. Crea una cuenta nueva.
4. Cierra sesion e inicia sesion con ese mismo correo.

## Errores comunes

- Correo ya registrado: ya existe una cuenta en Firebase Auth.
- Firebase no configurado: falta alguna variable VITE_FIREBASE en front/.env.
- Operacion no permitida: Email/Password aun no esta habilitado.
- Dominio no autorizado: agrega localhost o tu dominio en Authorized domains.