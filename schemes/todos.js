import z from 'zod'

const todoSchema = z.object({
  title: z.string({
    required_error: 'todo title is required.'
  }),
  completed: z.boolean()

})

const todosSchema = z.array(todoSchema)

export function validateTodo (object) {
  return todosSchema.safeParse(object)
}

export function validateUpdate (object) {
  return todoSchema.partial().safeParse(object)
}
