import { response } from 'express'
import mysql from 'mysql2/promise'
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } from './config.js'

const config = {
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  port: DB_PORT,
  database: DB_NAME
}

const connection = mysql.createConnection(config)

export class TodosModel {
  static async getAll (id) {
    const [todos] = await (await connection).query(
      `select * from todos where user_id ='${id}';`
    )

    return todos
  }

  static async create ({ input }) {
    const {
      userid,
      title,
      status
    } = input

    try {
      await (await connection).query(
          `INSERT INTO todos (user_id, todo_title, todo_status) 
          VALUES (?, ?, ?)
          ;`,
          [userid, title, status]
      )
    } catch (e) {
      throw new Error('Error al crear el todo')
    }

    const [newTodo] = await (await connection).query(
      'SELECT * FROM todos WHERE todo_title = ? AND user_id = ?;', [title, userid]
    )
    return newTodo[0]
  }

  static async update ({ todoID, userID, input }) {
    try {
      const [rows] = await (await connection).query('SELECT * FROM todos WHERE user_id = ? AND todo_id = ? ;', [userID, todoID])

      if (rows.length === 0) {
        return response.status(404).json({ message: 'No se encontro el todo' })
      }

      const fields = Object.keys(input).map(key => `${key} = ?`).join(', ')
      const values = Object.values(input)
      await (await connection).query(`UPDATE todos SET ${fields} WHERE user_id = ? AND todo_id = ?;`, [...values, userID, todoID
      ])

      const [updatedRows] = await (await connection).query('SELECT * FROM todos WHERE user_id = ? AND todo_id = ? ;', [userID, todoID])
      return updatedRows[0]
    } catch (error) {
      console.error(error)
    }
  }

  static async delete ({ id }) {
    try {
      const [rows] = await (await connection).query('SELECT * FROM todos WHERE todo_id = ?', [id])

      if (rows.length === 0) {
        return response.status(404).json({ message: 'No se encontro el todo' })
      }

      await (await connection).query('DELETE FROM todos WHERE todo_id = ? ', [id])
      const [updatedRows] = await (await connection).query('SELECT * FROM todos WHERE todo_id = ? ', [id])
      return updatedRows[0]
    } catch (error) {
      console.error(error)
    }
  }

  static async deleteCompleted ({ userID }) {
    try {
      const [todos] = await (await connection).query(
        'DELETE FROM todos WHERE user_id = ? AND todo_status = 1;', [userID]
      )

      return todos
    } catch (error) {
      console.error(error)
    }
  }
}
