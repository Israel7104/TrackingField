export type FoodEntry = {
  id: number
  name: string
  calories: number
  protein: number
  carbs: number
  fats: number
}

export type NewFoodEntry = Omit<FoodEntry, 'id'>

export type ExerciseEntry = {
  id: number
  name: string
  sets: number
  reps: number
  intensity: number
}

export type NewExerciseEntry = Omit<ExerciseEntry, 'id'>

export type Routine = {
  id: number
  name: string
  exercises: ExerciseEntry[]
}

export type NewRoutine = Pick<Routine, 'name'>

export type Diet = {
  id: number
  name: string
  targetCalories: number
  foods: FoodEntry[]
}

export type NewDiet = Pick<Diet, 'name' | 'targetCalories'>

export type DashboardData = {
  foods: FoodEntry[]
  exercises: ExerciseEntry[]
  routines: Routine[]
  diets: Diet[]
}

export type DashboardTotals = ReturnType<typeof foodTotals>

export type AuthAccount = {
  id: number
  name: string
  email: string
  password: string
}

export type SessionUser = {
  name: string
  email: string
}

export type RegisterResult = {
  ok: boolean
  message?: string
}

export type ApiFeedbackState = 'idle' | 'loading' | 'success' | 'error'

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