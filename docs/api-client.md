# Capa de red del frontend

## Archivo principal

La capa de red esta centralizada en `front/src/api/client.ts`.

## Responsabilidades

- Construir la URL base de la API.
- Enviar peticiones `fetch`.
- Convertir cuerpos JSON.
- Lanzar errores con mensaje legible cuando la respuesta no es correcta.
- Devolver datos tipados para que el resto del frontend no trabaje con `any`.

## Funciones principales

- `getDashboard`
- `createFood`
- `createExercise`
- `createDiet`
- `deleteDiet`
- `addFoodToDiet`
- `createRoutine`
- `deleteRoutine`
- `addExerciseToRoutine`

## Tipos compartidos

Los tipos del cliente se alinean con el dominio de la aplicacion:

- `FoodEntry`
- `ExerciseEntry`
- `Diet`
- `Routine`
- `DashboardData`
- tipos de alta como `NewFoodEntry` o `NewRoutine`

## Estados de red en UI

La interfaz contempla tres estados:

- Carga: mientras se sincroniza con el backend.
- Exito: cuando una operacion termina correctamente.
- Error: cuando la API devuelve un fallo y se ofrece reintento.

Estos estados se exponen mediante `AppContext` y se visualizan con `StatusBanner`.