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

export async function show({ params, response }: HttpContext) {
  try {
    const identifier = params.id_or_uuid

    let conversationQuery = Conversation.query().preload('messages')

    const conversation = await (Number.isInteger(+identifier)
      ? conversationQuery.where('id', identifier).first()
      : conversationQuery.where('session_id', identifier).first())

    if (!conversation) {
      return response.notFound({ error: 'Conversation tidak ditemukan' })
    }

    return response.ok(conversation)
  } catch (error) {
    console.error('error: ', error)
    return response.status(500).json({ error: 'Gagal mengambil covnersation' })
  }
}
