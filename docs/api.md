# API REST

## Base URL

`http://localhost:4000/api/v1`

## Recursos

### Health

- `GET /health`

Respuesta:

```json
{ "status": "ok" }
```

### Dashboard

- `GET /dashboard`

Devuelve todas las colecciones principales:

```json
{
  "foods": [],
  "exercises": [],
  "routines": [],
  "diets": []
}
```

### Foods

- `GET /foods`
- `POST /foods`
- `DELETE /foods/:id`

Ejemplo `POST /foods`:

```json
{
  "name": "Tortilla francesa",
  "calories": 210,
  "protein": 18,
  "carbs": 2,
  "fats": 14
}
```

### Exercises

- `GET /exercises`
- `POST /exercises`
- `DELETE /exercises/:id`

Ejemplo `POST /exercises`:

```json
{
  "name": "Peso muerto rumano",
  "sets": 4,
  "reps": 8,
  "intensity": 72
}
```

### Diets

- `GET /diets`
- `POST /diets`
- `PATCH /diets/:id`
- `POST /diets/:id/foods`
- `DELETE /diets/:id`

Ejemplo `POST /diets`:

```json
{
  "name": "Definicion moderada",
  "targetCalories": 2200
}
```

Ejemplo `POST /diets/:id/foods`:

```json
{
  "name": "Pechuga con verduras",
  "calories": 340,
  "protein": 38,
  "carbs": 12,
  "fats": 14
}
```

### Routines

- `GET /routines`
- `POST /routines`
- `PATCH /routines/:id`
- `POST /routines/:id/exercises`
- `DELETE /routines/:id`

Ejemplo `POST /routines`:

```json
{
  "name": "Torso A"
}
```

Ejemplo `POST /routines/:id/exercises`:

```json
{
  "name": "Press inclinado",
  "sets": 4,
  "reps": 10,
  "intensity": 70
}
```

## Codigos HTTP usados

- `200`: peticion correcta.
- `201`: recurso creado.
- `400`: datos invalidos.
- `404`: recurso o ruta no encontrada.
- `500`: error interno.