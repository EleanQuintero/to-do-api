import { TodosModel } from '../models/My-SQL/todos.js'
// import { TodosModel } from '../models/LocalDB/todos.js'
import { validateTodo, validateUpdate } from '../schemes/todos.js'

export class TodoController {
  static async getAll (req, res) {
    const { id } = req.params
    const todo = await TodosModel.getAll(id)
    res.json(todo)
  }

  static async create (req, res) {
    const result = validateTodo(req.body)

    if (result.error) {
      return res.status(400).json({ error: JSON.parse('Error 400') })
    }

    const newTodo = await TodosModel.create({ input: result.data })
    console.log('Tarea creada con exito')
    console.log(newTodo)
    res.status(201).json(newTodo)
  }

  static async update (req, res) {
    const result = validateUpdate(req.body)
    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const { todoID, userID } = req.params
    const updatedTodo = await TodosModel.update({ todoID, userID, input: result.data })
    return res.json(updatedTodo)
  }

  static async delete (req, res) {
    const { id } = req.params
    const result = await TodosModel.delete({ id })

    if (result === false) {
      return res.status(404).json({ message: 'Tarea no encontrada' })
    }

    return res.json({ message: 'Tarea eliminada' })
  }

  static async deleteCompleted (req, res) {
    const { userID } = req.params
    const result = await TodosModel.deleteCompleted({ userID })

    if (result === false) {
      return res.status(404).json({ message: 'Tareas no encontradas' })
    }

    return res.json({ message: 'Tareas eliminadas' })
  }
}
