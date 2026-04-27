import { useState } from 'react'
import type { Diet } from '../types'
import { foodTotals } from '../types'
import FoodForm from './FoodForm'
import type { FoodData } from './FoodForm'

type Props = {
  diet: Diet
  onDelete: (id: number) => void
  onAddFood: (dietId: number, food: FoodData) => void
}

export default function DietCard({ diet, onDelete, onAddFood }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const dt = foodTotals(diet.foods)

  return (
    <article className="plan-card">
      <div className="plan-card-header">
        <div className="plan-card-title">
          <strong>{diet.name}</strong>
          <span>
            {dt.calories} / {diet.targetCalories} kcal
          </span>
        </div>
        <div className="plan-card-actions">
          <button
            className="plan-toggle-btn"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label={isOpen ? 'Cerrar' : 'Agregar alimento'}
          >
            {isOpen ? '−' : '+'}
          </button>
          <button
            className="plan-delete-btn"
            onClick={() => onDelete(diet.id)}
            aria-label="Eliminar dieta"
          >
            ×
          </button>
        </div>
      </div>

      {diet.foods.length > 0 && (
        <p className="plan-macro-bar">
          P {dt.protein} g · C {dt.carbs} g · G {dt.fats} g
        </p>
      )}

      {diet.foods.length > 0 && (
        <ul className="plan-items-list">
          {diet.foods.map((food) => (
            <li key={food.id}>
              <strong>{food.name}</strong>
              <span>{food.calories} kcal</span>
            </li>
          ))}
        </ul>
      )}

      {isOpen && (
        <FoodForm
          compact
          submitLabel="Añadir alimento"
          onAdd={(food) => {
            onAddFood(diet.id, food)
            setIsOpen(false)
          }}
        />
      )}
    </article>
  )
}
