import { useState } from 'react'
import type { FormEvent } from 'react'

export type ExerciseData = {
  name: string
  sets: number
  reps: number
  intensity: number
}

type Props = {
  onAdd: (exercise: ExerciseData) => void
  submitLabel?: string
  /** Compact mode: uses plan-inline-form styles, no wrapping label for name */
  compact?: boolean
}

const empty = { name: '', sets: '', reps: '', intensity: '' }

export default function ExerciseForm({
  onAdd,
  submitLabel = 'Agregar ejercicio',
  compact = false,
}: Props) {
  const [form, setForm] = useState(empty)

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    onAdd({
      name: form.name.trim(),
      sets: Number(form.sets),
      reps: Number(form.reps),
      intensity: Number(form.intensity),
    })
    setForm(empty)
  }

  return (
    <form className={compact ? 'plan-inline-form' : 'entry-form'} onSubmit={handleSubmit}>
      {compact ? (
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm((c) => ({ ...c, name: e.target.value }))}
          placeholder="Ejercicio"
          required
        />
      ) : (
        <label>
          <span>Ejercicio</span>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm((c) => ({ ...c, name: e.target.value }))}
            placeholder="Ej. peso muerto rumano"
            required
          />
        </label>
      )}

      <div className="input-row input-row--triple">
        <label>
          <span>Series</span>
          <input
            type="number"
            min="1"
            value={form.sets}
            onChange={(e) => setForm((c) => ({ ...c, sets: e.target.value }))}
            required
          />
        </label>
        <label>
          <span>Reps</span>
          <input
            type="number"
            min="1"
            value={form.reps}
            onChange={(e) => setForm((c) => ({ ...c, reps: e.target.value }))}
            required
          />
        </label>
        <label>
          <span>% MR</span>
          <input
            type="number"
            min="1"
            max="100"
            value={form.intensity}
            onChange={(e) => setForm((c) => ({ ...c, intensity: e.target.value }))}
            required
          />
        </label>
      </div>

      <button type="submit" className={compact ? 'form-action form-action--sm' : 'form-action'}>
        {submitLabel}
      </button>
    </form>
  )
}
