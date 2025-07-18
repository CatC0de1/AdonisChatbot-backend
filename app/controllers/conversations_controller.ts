import type { HttpContext } from '@adonisjs/core/http'
import Conversation from '#models/conversation'

export async function index({ request, response }: HttpContext) {
  try {
    const page = request.input('page', 1) // Query params paginate (index halaman), nilai default = 1
    const perPage = request.input('perPage', 10) // Query params paginate (data dalam 1 halaman), nilai default = 10
    const sort = request.input('sort', 'desc') // Query params sorting, nilai default = desc

    const sortDirection = sort === 'asc' ? 'asc' : 'desc'

    // Menampilkan conversation dengan query params yang ada
    const conversation = await Conversation.query()
      .orderBy('created_at', sortDirection) // Sorting berdasarkan waktu dibuat conversation
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

    // Mencari conversation berdasarkan id atau uuid
    const conversation = await (Number.isInteger(+identifier)
      ? conversationQuery.where('id', identifier).first()
      : conversationQuery.where('session_id', identifier).first())

    if (!conversation) {
      return response.notFound({ error: 'Conversation tidak ditemukan' })
    }

    // Jika ditemukan, menampilkan conversation
    return response.ok(conversation)
  } catch (error) {
    console.error('error: ', error)
    return response.status(500).json({ error: 'Gagal mengambil covnersation' })
  }
}

export async function destroy({ params, response }: HttpContext) {
  try {
    const identifier: string = params.id_or_uuid

    // Mencari conversation berdasarkan id atau uuid
    const conversationData = await (Number.isInteger(+identifier)
      ? Conversation.find(identifier)
      : Conversation.query().where('session_id', identifier).first())

    if (!conversationData) {
      return response.notFound({ error: 'Conversation tidak ditemukan' })
    }

    // Jika ditemukan, conversation dihapus
    await conversationData.delete()

    return response.ok({ messages: 'Conversation berhasil dihapus' })
  } catch (error) {
    console.error('error: ', error)
    return response.status(500).json({ error: 'Gagal menghapus conversation' })
  }
}
