import { Router } from 'express'
import { TodoController } from '../controllers/todos.js'

export const todosRouter = Router()

todosRouter.get('/', TodoController.getAll)
todosRouter.post('/newTodo', TodoController.create)
todosRouter.patch('/update/:id', TodoController.update)
todosRouter.delete('/delete/:id', TodoController.delete)
todosRouter.delete('/completed/delete', TodoController.deleteCompleted)
