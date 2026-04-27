export type FoodEntry = {
  id: number
  name: string
  calories: number
  protein: number
  carbs: number
  fats: number
}

export type ExerciseEntry = {
  id: number
  name: string
  sets: number
  reps: number
  intensity: number
}

export type Routine = {
  id: number
  name: string
  exercises: ExerciseEntry[]
}

export type Diet = {
  id: number
  name: string
  targetCalories: number
  foods: FoodEntry[]
}

export function foodTotals(foods: FoodEntry[]) {
  return foods.reduce(
    (acc, item) => ({
      calories: acc.calories + item.calories,
      protein: acc.protein + item.protein,
      carbs: acc.carbs + item.carbs,
      fats: acc.fats + item.fats,
    }),
    { calories: 0, protein: 0, carbs: 0, fats: 0 },
  )
}
