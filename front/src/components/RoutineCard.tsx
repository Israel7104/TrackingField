import { useState } from 'react'
import type { Routine } from '../types'
import ExerciseForm from './ExerciseForm'
import type { ExerciseData } from './ExerciseForm'

type Props = {
  routine: Routine
  onDelete: (id: number) => void
  onAddExercise: (routineId: number, exercise: ExerciseData) => void
}

export default function RoutineCard({ routine, onDelete, onAddExercise }: Props) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <article className="plan-card">
      <div className="plan-card-header">
        <div className="plan-card-title">
          <strong>{routine.name}</strong>
          <span>{routine.exercises.length} ejercicios</span>
        </div>
        <div className="plan-card-actions">
          <button
            className="plan-toggle-btn"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label={isOpen ? 'Cerrar' : 'Agregar ejercicio'}
          >
            {isOpen ? '−' : '+'}
          </button>
          <button
            className="plan-delete-btn"
            onClick={() => onDelete(routine.id)}
            aria-label="Eliminar rutina"
          >
            ×
          </button>
        </div>
      </div>

      {routine.exercises.length > 0 && (
        <ul className="plan-items-list">
          {routine.exercises.map((ex) => (
            <li key={ex.id}>
              <strong>{ex.name}</strong>
              <span>
                {ex.sets}×{ex.reps} · {ex.intensity}% MR
              </span>
            </li>
          ))}
        </ul>
      )}

      {isOpen && (
        <ExerciseForm
          compact
          submitLabel="Añadir ejercicio"
          onAdd={(exercise) => {
            onAddExercise(routine.id, exercise)
            setIsOpen(false)
          }}
        />
      )}
    </article>
  )
}
