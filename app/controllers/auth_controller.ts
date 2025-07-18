import type { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'
import { v4 as uuidv4 } from 'uuid'
import User from '#models/user'
import { loginValidator } from '#validators/login'

export async function login({ request, response }: HttpContext) {
  // Mendapatkan data user serta validasi
  const payload = await request.validateUsing(loginValidator)
  const { username, password } = payload

  // Mencari username dalam database
  const user = await User.findBy('username', username)
  if (!user) {
    return response.unauthorized({ error: 'Username tidak ditemukan' })
  }

  // Jika username cocok, password di verifikasi setelah di hash
  const isPasswordValid = await hash.verify(user.password, password)
  if (!isPasswordValid) {
    return response.unauthorized({ error: 'Password salah' })
  }

  // Menghasilkan bearer token random untuk sesi login/token
  const token = uuidv4()
  user.sessionToken = token
  await user.save()

  return response.ok({ token })
}

export async function logout({ request, response }: HttpContext) {
  // Membutuhkan header token bearer untuk logout
  const header = request.header('Authorization')
  const token = header?.replace('Bearer ', '')

  // Jika sesi token yang diinputkan dalam header cocok dengan database, maka akan menghapus sesi token
  const user = await User.findBy('sessionToken', token)

  if (!user) {
    return response.unauthorized({ error: 'Token tidak valid' })
  }

  user.sessionToken = null
  await user.save()

  return response.ok({ message: 'Berhasil logout' })
}
