import z from 'zod'

const todoSchema = z.object({
  userid: z.string({
    required_error: 'userID is required.'
  }),
  title: z.string({
    required_error: 'todo title is required.'
  }),
  todo_status: z.boolean()

})

const updateTodoSchema = z.object({
  userid: z.string({
    required_error: 'userID is required.'
  }),
  todo_title: z.string({
    required_error: 'todo title is required.'
  }),
  todo_status: z.boolean()

})

export function validateTodo (object) {
  return todoSchema.safeParse(object)
}

export function validateUpdate (object) {
  return updateTodoSchema.partial().safeParse(object)
}
