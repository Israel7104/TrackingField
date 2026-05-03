import { useState } from 'react'
import type { FormEvent } from 'react'
import MetricCard from '../components/MetricCard'
import ExerciseForm from '../components/ExerciseForm'
import RoutineCard from '../components/RoutineCard'
import type { ExerciseData } from '../components/ExerciseForm'
import { useAppContext } from '../context/AppContext'

export default function TrainingPage() {
  const [routineNameForm, setRoutineNameForm] = useState('')
  const { exercises, routines, addExercise, createRoutine, addExerciseToRoutine, deleteRoutine } = useAppContext()

  function handleAddExercise(exercise: ExerciseData) {
    return addExercise(exercise)
  }

  async function handleCreateRoutine(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    await createRoutine({ name: routineNameForm.trim() })
    setRoutineNameForm('')
  }

  function handleAddExerciseToRoutine(routineId: number, exercise: ExerciseData) {
    return addExerciseToRoutine(routineId, exercise)
  }

  function handleDeleteRoutine(id: number) {
    return deleteRoutine(id)
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
