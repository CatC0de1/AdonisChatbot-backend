import vine from '@vinejs/vine'

export const questionValidator = vine.compile(
  vine.object({
    question: vine.string().trim().minLength(1).maxLength(1000),
  })
)
