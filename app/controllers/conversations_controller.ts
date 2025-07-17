import type { HttpContext } from '@adonisjs/core/http'
import Conversation from '#models/conversation'
// import Message from '#models/message'

export async function index({ request, response }: HttpContext) {
  try {
    const page = request.input('page', 1)
    const show = request.input('show', 10)

    const conversation = await Conversation
      .query()
      .preload('messages')
      .paginate(page, show)

    return response.ok(conversation)
  } catch (error) {
    console.error('error: ', error)
    return response.status(500).json({ error: 'Gagal mengambil conversation' })
  }
}
