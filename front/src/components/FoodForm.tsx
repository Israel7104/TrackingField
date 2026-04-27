import { useState } from 'react'
import type { FormEvent } from 'react'

export type FoodData = {
  name: string
  calories: number
  protein: number
  carbs: number
  fats: number
}

type Props = {
  onAdd: (food: FoodData) => void
  submitLabel?: string
  /** Compact mode: uses plan-inline-form styles, no wrapping label for name */
  compact?: boolean
}

const empty = { name: '', calories: '', protein: '', carbs: '', fats: '' }

export default function FoodForm({ onAdd, submitLabel = 'Agregar alimento', compact = false }: Props) {
  const [form, setForm] = useState(empty)

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    onAdd({
      name: form.name.trim(),
      calories: Number(form.calories),
      protein: Number(form.protein),
      carbs: Number(form.carbs),
      fats: Number(form.fats),
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
          placeholder="Alimento"
          required
        />
      ) : (
        <label>
          <span>Alimento</span>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm((c) => ({ ...c, name: e.target.value }))}
            placeholder="Ej. avena con platano"
            required
          />
        </label>
      )}

      <div className="input-row">
        <label>
          <span>Kcal</span>
          <input
            type="number"
            min="0"
            value={form.calories}
            onChange={(e) => setForm((c) => ({ ...c, calories: e.target.value }))}
            required
          />
        </label>
        <label>
          <span>Proteina</span>
          <input
            type="number"
            min="0"
            value={form.protein}
            onChange={(e) => setForm((c) => ({ ...c, protein: e.target.value }))}
            required
          />
        </label>
      </div>

      <div className="input-row">
        <label>
          <span>Carbs</span>
          <input
            type="number"
            min="0"
            value={form.carbs}
            onChange={(e) => setForm((c) => ({ ...c, carbs: e.target.value }))}
            required
          />
        </label>
        <label>
          <span>Grasas</span>
          <input
            type="number"
            min="0"
            value={form.fats}
            onChange={(e) => setForm((c) => ({ ...c, fats: e.target.value }))}
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
