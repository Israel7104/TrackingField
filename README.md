# TrackingField

TrackingField es una aplicación para llevar en un solo lugar el control básico de nutrición y entrenamiento. Permite registrar alimentos, crear dietas, guardar ejercicios y organizar rutinas desde una interfaz simple.

## Resumen

Con la aplicación puedes:

- Registrar alimentos con calorías y macronutrientes.
- Crear dietas y añadirles alimentos.
- Registrar ejercicios con series, repeticiones e intensidad.
- Crear rutinas y añadirles ejercicios.
- Consultar un resumen general desde la pantalla principal.

## Cómo usar la aplicación

La aplicación tiene dos partes: frontend y backend. Necesitas arrancar ambas.

### 1. Iniciar la API

```bash
cd server
npm install
npm run dev
```

La API queda disponible en `http://localhost:4000`.

### 2. Iniciar el frontend

En otra terminal:

```bash
cd front
npm install
npm run dev
```

Después abre en el navegador la URL que muestre Vite, normalmente `http://localhost:5173`.

## Uso básico

1. Entra en la página de usuario.
2. Inicia sesión con la cuenta demo.
3. Accede a nutrición para añadir alimentos o crear dietas.
4. Accede a entrenamientos para añadir ejercicios o crear rutinas.
5. Vuelve al inicio para ver el resumen general.

## Cuenta demo

- Correo: `demo@trackingfield.app`
- Contraseña: `demo1234`

## Nota

Si el frontend no puede conectar con la API, revisa que el servidor esté arrancado en `http://localhost:4000`. Si necesitas otra URL para la API, puedes definir `VITE_API_URL` en el frontend.