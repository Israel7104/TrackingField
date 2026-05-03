import { Router } from 'express'
import {
  getRoutines,
  patchRoutine,
  postRoutine,
  postRoutineExercise,
  removeRoutine,
} from '../controllers/routineController.js'

export const routineRouter = Router()

routineRouter.get('/routines', getRoutines)
routineRouter.post('/routines', postRoutine)
routineRouter.patch('/routines/:id', patchRoutine)
routineRouter.post('/routines/:id/exercises', postRoutineExercise)
routineRouter.delete('/routines/:id', removeRoutine)