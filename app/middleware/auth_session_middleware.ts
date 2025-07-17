import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import User from '#models/user'

export default class AuthSessionMiddleware {
  async handle({ request, response }: HttpContext, next: NextFn) {
    const header = request.header('Authorization')

    if (!header || !header.startsWith('Bearer ')) {
      return response.unauthorized({ error: 'Token tidak ditemukan' })
    }

    const token = header.replace('Bearer ', '')
    const user = await User.findBy('sessionToken', token)

    if (!user) {
      return response.unauthorized({ error: 'Token tidak valid' })
    }

    request.updateBody({ user })
    await next()
  }
}
