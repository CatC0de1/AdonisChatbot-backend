import type { HttpContext } from '@adonisjs/core/http'
import Conversation from '#models/conversation'
// import Message from '#models/message'

export async function index({ response }: HttpContext) {
  try {
    const conversation = await Conversation.query().preload('messages')

    return response.ok(conversation)
  } catch (error) {
    console.error('error: ', error)
    return response.status(500).json({ error: 'Gaga; mengambil conversation' })
  }
}
