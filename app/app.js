import express from 'express'
import cors from 'cors'
import { todosRouter } from '../routes/todos.js'

const app = express()

app.use(cors())
app.use(express.json())
app.disable('x-powered-by')

app.use('/todos', todosRouter)
const PORT = process.env.PORT ?? 4567

app.listen(PORT, () => {
  console.log(`Server listening on Port: http://localhost:${PORT}`)
})
