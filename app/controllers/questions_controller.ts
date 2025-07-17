import type { HttpContext } from '@adonisjs/core/http'
import { v4 as uuidv4 } from 'uuid'
import axios from 'axios'

import { questionValidator } from '#validators/quetion'
import Conversation from '#models/conversation'
import Message from '#models/message'

export default class QuestionsController {
  public async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(questionValidator)
    const question = payload.question

    // Generate session_id UUID
    const sessionId = uuidv4()

    try {
      // Simpan pesan dari user
      const conversation = await Conversation.create({ sessionId })

      const userMessage = await Message.create({
        conversationId: conversation.id,
        senderType: 'user',
        message: question,
      })

      // Kirim ke API eksternal
      const apiResponse = await axios.post(
        'https://api.majadigidev.jatimprov.go.id/api/external/chatbot/send-message',
        {
          question: question,
          additional_context: '',
          session_id: sessionId,
        }
      )

      const botMessageText = apiResponse.data?.data?.message?.[0]?.text ?? 'Jawaban tidak tersedia'

      // Simpan pesan dari bot
      const botMessage = await Message.create({
        conversationId: conversation.id,
        senderType: 'bot',
        message: botMessageText,
      })

      // Update last_message_id di conversation
      conversation.lastMessageId = botMessage.id
      await conversation.save()

      // Mengembalikan respon ke user
      return response.created({
        session_id: sessionId,
        question: userMessage.message,
        answer: botMessage.message,
      })
    } catch (error) {
      console.error('error: ', error)
      return response.status(500).json({ error: 'Gagal memproses pertanyaa' })
    }
  }
}
