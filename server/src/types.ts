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

export type DashboardData = {
  foods: FoodEntry[]
  exercises: ExerciseEntry[]
  routines: Routine[]
  diets: Diet[]
}

export type NewFoodEntry = Omit<FoodEntry, 'id'>
export type NewExerciseEntry = Omit<ExerciseEntry, 'id'>
export type NewRoutine = Pick<Routine, 'name'>
export type NewDiet = Pick<Diet, 'name' | 'targetCalories'>