import type { NewDiet, NewExerciseEntry, NewFoodEntry, NewRoutine } from '../types.js'

type ValidationResult<T> =
  | { ok: true; data: T }
  | { ok: false; message: string }

function isNonEmptyString(value: unknown) {
  return typeof value === 'string' && value.trim().length > 0
}

function isNonNegativeNumber(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0
}

function isPositiveNumber(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value) && value > 0
}

export function parseId(value: string | string[]) {
  if (Array.isArray(value)) {
    return null
  }

  const id = Number(value)
  return Number.isInteger(id) && id > 0 ? id : null
}

export function validateFoodPayload(payload: unknown): ValidationResult<NewFoodEntry> {
  if (typeof payload !== 'object' || payload === null) {
    return { ok: false, message: 'El cuerpo de la peticion debe ser un objeto JSON.' }
  }

  const candidate = payload as Record<string, unknown>

  if (
    !isNonEmptyString(candidate.name)
    || !isNonNegativeNumber(candidate.calories)
    || !isNonNegativeNumber(candidate.protein)
    || !isNonNegativeNumber(candidate.carbs)
    || !isNonNegativeNumber(candidate.fats)
  ) {
    return { ok: false, message: 'El alimento requiere nombre y macros validos.' }
  }

  return {
    ok: true,
    data: {
      name: (candidate.name as string).trim(),
      calories: candidate.calories as number,
      protein: candidate.protein as number,
      carbs: candidate.carbs as number,
      fats: candidate.fats as number,
    },
  }
}

export function validateExercisePayload(payload: unknown): ValidationResult<NewExerciseEntry> {
  if (typeof payload !== 'object' || payload === null) {
    return { ok: false, message: 'El cuerpo de la peticion debe ser un objeto JSON.' }
  }

  const candidate = payload as Record<string, unknown>

  if (
    !isNonEmptyString(candidate.name)
    || !isPositiveNumber(candidate.sets)
    || !isPositiveNumber(candidate.reps)
    || !isPositiveNumber(candidate.intensity)
  ) {
    return { ok: false, message: 'El ejercicio requiere nombre, series, repeticiones e intensidad validos.' }
  }

  return {
    ok: true,
    data: {
      name: (candidate.name as string).trim(),
      sets: candidate.sets as number,
      reps: candidate.reps as number,
      intensity: candidate.intensity as number,
    },
  }
}

export function validateDietPayload(payload: unknown): ValidationResult<NewDiet> {
  if (typeof payload !== 'object' || payload === null) {
    return { ok: false, message: 'El cuerpo de la peticion debe ser un objeto JSON.' }
  }

  const candidate = payload as Record<string, unknown>

  if (!isNonEmptyString(candidate.name) || !isNonNegativeNumber(candidate.targetCalories)) {
    return { ok: false, message: 'La dieta requiere nombre y calorias objetivo validas.' }
  }

  return {
    ok: true,
    data: {
      name: (candidate.name as string).trim(),
      targetCalories: candidate.targetCalories as number,
    },
  }
}

export function validateRoutinePayload(payload: unknown): ValidationResult<NewRoutine> {
  if (typeof payload !== 'object' || payload === null) {
    return { ok: false, message: 'El cuerpo de la peticion debe ser un objeto JSON.' }
  }

  const candidate = payload as Record<string, unknown>

  if (!isNonEmptyString(candidate.name)) {
    return { ok: false, message: 'La rutina requiere un nombre valido.' }
  }

  return {
    ok: true,
    data: {
      name: (candidate.name as string).trim(),
    },
  }
}