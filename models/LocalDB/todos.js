import { response } from 'express'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const toDos = require('./mockTodos.json')

export class TodosModel {
  static async getAll () {
    return toDos
  }

  static async create ({ input }) {
    const newTodo = {
      ...input
    }

    toDos.push(newTodo[0])

    return newTodo
  }

  static async update ({ id, input }) {
    const todoIndex = toDos.findIndex(todos => todos.id === id)
    if (todoIndex === -1) {
      return response.status(404).json({ message: 'No se encontro el toDo' })
    }

    toDos[todoIndex] = {
      ...toDos[todoIndex],
      ...input
    }

    return toDos[todoIndex]
  }

  static async delete ({ id }) {
    const todoIndex = toDos.findIndex(todo => todo.id === id)
    if (todoIndex === -1) return false

    toDos.splice(todoIndex, 1)
    return true
  }
}
