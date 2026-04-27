import { useState } from 'react'
import type { FormEvent } from 'react'
import type { FoodEntry, Diet } from '../types'
import { foodTotals } from '../types'
import MetricCard from '../components/MetricCard'
import FoodForm from '../components/FoodForm'
import DietCard from '../components/DietCard'
import type { FoodData } from '../components/FoodForm'

type Props = {
  foods: FoodEntry[]
  setFoods: React.Dispatch<React.SetStateAction<FoodEntry[]>>
  diets: Diet[]
  setDiets: React.Dispatch<React.SetStateAction<Diet[]>>
}

export default function NutritionPage({ foods, setFoods, diets, setDiets }: Props) {
  const [dietForm, setDietForm] = useState({ name: '', targetCalories: '' })
  const totals = foodTotals(foods)

  function handleAddFood(food: FoodData) {
    setFoods((prev) => [{ id: Date.now(), ...food }, ...prev])
  }

  function handleCreateDiet(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setDiets((prev) => [
      {
        id: Date.now(),
        name: dietForm.name.trim(),
        targetCalories: Number(dietForm.targetCalories),
        foods: [],
      },
      ...prev,
    ])
    setDietForm({ name: '', targetCalories: '' })
  }

  function handleAddFoodToDiet(dietId: number, food: FoodData) {
    setDiets((prev) =>
      prev.map((d) =>
        d.id === dietId ? { ...d, foods: [...d.foods, { id: Date.now(), ...food }] } : d,
      ),
    )
  }

  function handleDeleteDiet(id: number) {
    setDiets((prev) => prev.filter((d) => d.id !== id))
  }

  return (
    <main className="page-shell">
      <h1 className="page-title">Dieta</h1>

      <section className="metrics-strip" aria-label="Resumen nutricional">
        <MetricCard value={`${totals.calories} kcal`} label="Calorias hoy" />
        <MetricCard value={`${totals.protein} g`} label="Proteina" />
        <MetricCard value={`${totals.carbs} g · ${totals.fats} g`} label="Carbs · Grasas" />
      </section>

      <div className="inner-columns">
        <section className="inner-column">
          <h2 className="inner-section-title">Registro del dia</h2>
          <article className="module-card nutrition-card">
            <span className="module-tag">Nutricion</span>
            <h3>Agregar alimento</h3>
            <FoodForm onAdd={handleAddFood} />
            <div className="feature-stack">
              {foods.map((item) => (
                <div key={item.id} className="feature-item">
                  <strong>{item.name}</strong>
                  <p>
                    {item.calories} kcal · P {item.protein} g · C {item.carbs} g · G {item.fats} g
                  </p>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="inner-column">
          <h2 className="inner-section-title">
            Dietas
            <span className="plan-count">{diets.length}</span>
          </h2>

          <form className="plan-create-form" onSubmit={handleCreateDiet}>
            <input
              type="text"
              value={dietForm.name}
              onChange={(e) => setDietForm((c) => ({ ...c, name: e.target.value }))}
              placeholder="Nombre de la dieta"
              required
            />
            <label className="plan-create-form__inline-label">
              <span>Kcal objetivo</span>
              <input
                type="number"
                min="0"
                value={dietForm.targetCalories}
                onChange={(e) => setDietForm((c) => ({ ...c, targetCalories: e.target.value }))}
                placeholder="2500"
                required
              />
            </label>
            <button type="submit" className="form-action form-action--sm">
              Nueva dieta
            </button>
          </form>

          {diets.map((diet) => (
            <DietCard
              key={diet.id}
              diet={diet}
              onDelete={handleDeleteDiet}
              onAddFood={handleAddFoodToDiet}
            />
          ))}

          {diets.length === 0 && (
            <p className="plans-empty">Todavia no tienes dietas. Crea la primera arriba.</p>
          )}
        </section>
      </div>
    </main>
  )
}
