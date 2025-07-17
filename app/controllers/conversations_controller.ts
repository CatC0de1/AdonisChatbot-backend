import type { HttpContext } from '@adonisjs/core/http'
import Conversation from '#models/conversation'

export async function index({ request, response }: HttpContext) {
  try {
    const page = request.input('page', 1)
    const perPage = request.input('perPage', 10)
    const sort = request.input('sort', 'desc')

    const sortDirection = sort === 'asc' ? 'asc' : 'desc'

    const conversation = await Conversation.query()
      .orderBy('created_at', sortDirection)
      .preload('messages')
      .paginate(page, perPage)

    return response.ok(conversation)
  } catch (error) {
    console.error('error: ', error)
    return response.status(500).json({ error: 'Gagal mengambil conversation' })
  }
}

export async function show({ params, response }: HttpContext) {
  try {
    const identifier: string = params.id_or_uuid

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

export async function destroy({ params, response }: HttpContext) {
  try {
    const identifier: string = params.id_or_uuid

    const conversationData = await (Number.isInteger(+identifier)
      ? Conversation.find(identifier)
      : Conversation.query().where('session_id', identifier).first())

    if (!conversationData) {
      return response.notFound({ error: 'Conversation tidak ditemukan' })
    }

    await conversationData.delete()

    return response.ok({ messages: 'Conversation berhasil dihapus' })
  } catch (error) {
    console.error('error: ', error)
    return response.status(500).json({ error: 'Gagal menghapus conversation' })
  }
}
