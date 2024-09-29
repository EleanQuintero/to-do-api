import { Router } from 'express'
import { TodoController } from '../controllers/todos.js'

export const todosRouter = Router()

todosRouter.get('/:id', TodoController.getAll)
todosRouter.post('/newTodo', TodoController.create)
todosRouter.patch('/update/:todoID/:userID', TodoController.update)
todosRouter.delete('/delete/:id', TodoController.delete)
todosRouter.delete('/completed/delete/:userID', TodoController.deleteCompleted)
