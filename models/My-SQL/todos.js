import { response } from 'express'
import mysql from 'mysql2/promise'
import { DB_DATABASE, DB_HOST, DB_PASSWORD, DB_PORT, DB_USER } from './config.js'

const config = {
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  port: DB_PORT,
  database: DB_DATABASE
}

const connection = mysql.createConnection(config)

export class TodosModel {
  static async getAll () {
    const [todos] = await (await connection).query(
      'select title, completed, id FROM todos;'
    )

    return todos
  }

  static async create ({ input }) {
    const [{
      title,
      completed
    }] = input

    try {
      await (await connection).query(
          `INSERT INTO todos (title, completed) 
          VALUES (?, ?);`,
          [title, completed]
      )
    } catch (e) {
      throw new Error('Error al crear el todo')
    }

    const [newTodo] = await (await connection).query(
          `SELECT title, completed, id FROM todos WHERE title = "%${title}%";`
    )
    return newTodo[0]
  }

  static async update ({ id, input }) {
    try {
      const [rows] = await (await connection).query(`SELECT * FROM todos WHERE id = ${id}`)

      if (rows.length === 0) {
        return response.status(404).json({ message: 'No se encontro el todo' })
      }

      const fields = Object.keys(input).map(key => `${key} = ?`).join(', ')
      const values = Object.values(input)
      await (await connection).query(`UPDATE todos SET ${fields} WHERE id = ${id}`, [...values])

      const [updatedRows] = await (await connection).query(`SELECT * FROM todos WHERE id = ${id}`)
      return updatedRows[0]
    } catch (error) {
      console.error(error)
    }
  }

  static async delete ({ id }) {
    try {
      const [rows] = await (await connection).query(`SELECT * FROM todos WHERE id = ${id}`)

      if (rows.length === 0) {
        return response.status(404).json({ message: 'No se encontro el todo' })
      }

      await (await connection).query(`DELETE FROM todos  WHERE id = ${id}`)
      const [updatedRows] = await (await connection).query(`SELECT * FROM todos WHERE id = ${id}`)
      return updatedRows[0]
    } catch (error) {
      console.error(error)
    }
  }

  static async deleteCompleted () {
    try {
      const [todos] = await (await connection).query(
        'DELETE FROM todos  WHERE completed = 1;'
      )

      return todos
    } catch (error) {
      console.error(error)
    }
  }
}
