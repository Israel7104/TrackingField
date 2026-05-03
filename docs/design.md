# Arquitectura de la aplicacion

## Estructura principal

El proyecto se divide en dos partes:

- Frontend en `front/`, responsable de interfaz, navegacion, contexto global y consumo de API.
- Backend en `server/`, responsable de exponer endpoints REST y persistir alimentos, ejercicios, dietas y rutinas.

## Componentes principales del frontend

- `App`: monta router y provider global.
- `Layout`: renderiza navegacion y feedback de red.
- `HomePage`: dashboard de entrada.
- `NutritionPage`: alta de alimentos y gestion de dietas.
- `TrainingPage`: alta de ejercicios y gestion de rutinas.
- `UserPage`: acceso demo y resumen de usuario.
- `NotFoundPage`: ruta 404.

## Componentes reutilizables

- `MetricCard`: muestra KPIs cortos.
- `FoodForm`: formulario reutilizable para alimentos normales o embebidos en dietas.
- `ExerciseForm`: formulario reutilizable para ejercicios normales o embebidos en rutinas.
- `DietCard`: contenedor de una dieta con listado y alta de alimentos.
- `RoutineCard`: contenedor de una rutina con listado y alta de ejercicios.
- `StatusBanner`: feedback de carga, exito o error para llamadas a red.

## Gestion del estado

La aplicacion usa una combinacion de estado local y estado global:

- `useState` para formularios y estados de interfaz.
- `AppContext` para compartir alimentos, ejercicios, dietas, rutinas, sesion demo y feedback de red.
- `usePersistentState` para guardar en LocalStorage las cuentas demo y la sesion.
- `useMemo` para calcular totales nutricionales sin recalculo innecesario.
- `useCallback` para estabilizar acciones del contexto y evitar recrear handlers de forma constante.

## API y recursos REST

La API sigue el prefijo `/api/v1`.

- `GET /api/v1/health`: comprueba que el servidor responde.
- `GET /api/v1/dashboard`: devuelve el estado agregado del dominio.
- `GET|POST|DELETE /api/v1/foods`
- `GET|POST|DELETE /api/v1/exercises`
- `GET|POST|PATCH|DELETE /api/v1/diets`
- `POST /api/v1/diets/:id/foods`
- `GET|POST|PATCH|DELETE /api/v1/routines`
- `POST /api/v1/routines/:id/exercises`

## Contratos de datos

- `FoodEntry`: `id`, `name`, `calories`, `protein`, `carbs`, `fats`.
- `ExerciseEntry`: `id`, `name`, `sets`, `reps`, `intensity`.
- `Diet`: `id`, `name`, `targetCalories`, `foods`.
- `Routine`: `id`, `name`, `exercises`.
- `DashboardData`: agrega las cuatro colecciones anteriores.

## Persistencia: servidor vs cliente

- Persistido en servidor: alimentos, ejercicios, dietas y rutinas.
- Persistido solo en cliente: sesion demo y cuentas demo para acceso local.

Esta separacion mantiene la API como fuente de verdad para los datos funcionales y evita mezclar los datos de negocio con la simulacion de autenticacion.

## Diagrama de flujo de datos

```mermaid
flowchart LR
  UI[Paginas React] --> Ctx[AppContext]
  Ctx --> Api[src/api/client.ts]
  Api --> Rest[/api/v1/...]
  Rest --> Ctrl[Controllers]
  Ctrl --> Svc[Services]
  Svc --> Json[(store.json)]
  Json --> Svc
  Svc --> Ctrl
  Ctrl --> Api
  Api --> Ctx
  Ctx --> UI
```

## Decisiones clave

- Se mantiene una API propia aunque la persistencia sea simple, porque eso obliga a separar responsabilidades y deja el frontend preparado para escalar.
- Se usa un archivo JSON como persistencia para reducir complejidad de infraestructura en una entrega academica.
- La proteccion de rutas se limita a la sesion demo, suficiente para demostrar flujo de aplicacion sin introducir autenticacion completa.