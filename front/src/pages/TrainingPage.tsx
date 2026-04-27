import { useState } from 'react'
import type { FormEvent } from 'react'
import type { ExerciseEntry, Routine } from '../types'
import MetricCard from '../components/MetricCard'
import ExerciseForm from '../components/ExerciseForm'
import RoutineCard from '../components/RoutineCard'
import type { ExerciseData } from '../components/ExerciseForm'

type Props = {
  exercises: ExerciseEntry[]
  setExercises: React.Dispatch<React.SetStateAction<ExerciseEntry[]>>
  routines: Routine[]
  setRoutines: React.Dispatch<React.SetStateAction<Routine[]>>
}

export default function TrainingPage({ exercises, setExercises, routines, setRoutines }: Props) {
  const [routineNameForm, setRoutineNameForm] = useState('')

  function handleAddExercise(exercise: ExerciseData) {
    setExercises((prev) => [{ id: Date.now(), ...exercise }, ...prev])
  }

  function handleCreateRoutine(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setRoutines((prev) => [
      { id: Date.now(), name: routineNameForm.trim(), exercises: [] },
      ...prev,
    ])
    setRoutineNameForm('')
  }

  function handleAddExerciseToRoutine(routineId: number, exercise: ExerciseData) {
    setRoutines((prev) =>
      prev.map((r) =>
        r.id === routineId
          ? { ...r, exercises: [...r.exercises, { id: Date.now(), ...exercise }] }
          : r,
      ),
    )
  }

  function handleDeleteRoutine(id: number) {
    setRoutines((prev) => prev.filter((r) => r.id !== id))
  }

  return (
    <main className="page-shell">
      <h1 className="page-title">Entrenamientos</h1>

      <section className="metrics-strip" aria-label="Resumen de entrenamiento">
        <MetricCard value={`${exercises.length} ejercicios`} label="En la sesion actual" />
        <MetricCard value={`${routines.length} rutinas`} label="Guardadas" />
        <MetricCard value={exercises[0]?.name ?? '—'} label="Ultimo ejercicio" />
      </section>

      <div className="inner-columns">
        <section className="inner-column">
          <h2 className="inner-section-title">Sesion del dia</h2>
          <article className="module-card training-card">
            <span className="module-tag">Entrenamientos</span>
            <h3>Agregar ejercicio</h3>
            <ExerciseForm onAdd={handleAddExercise} />
            <ul className="bullet-list">
              {exercises.map((item) => (
                <li key={item.id} className="workout-item">
                  <strong>{item.name}</strong>
                  <span>
                    {item.sets} series · {item.reps} reps · {item.intensity}% del MR
                  </span>
                </li>
              ))}
            </ul>
          </article>
        </section>

        <section className="inner-column">
          <h2 className="inner-section-title">
            Rutinas
            <span className="plan-count">{routines.length}</span>
          </h2>

          <form className="plan-create-form" onSubmit={handleCreateRoutine}>
            <input
              type="text"
              value={routineNameForm}
              onChange={(e) => setRoutineNameForm(e.target.value)}
              placeholder="Nombre de la rutina"
              required
            />
            <button type="submit" className="form-action form-action--sm">
              Nueva rutina
            </button>
          </form>

          {routines.map((routine) => (
            <RoutineCard
              key={routine.id}
              routine={routine}
              onDelete={handleDeleteRoutine}
              onAddExercise={handleAddExerciseToRoutine}
            />
          ))}

          {routines.length === 0 && (
            <p className="plans-empty">Todavia no tienes rutinas. Crea la primera arriba.</p>
          )}
        </section>
      </div>
    </main>
  )
}
