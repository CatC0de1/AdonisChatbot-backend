import { BaseSeeder } from '@adonisjs/lucid/seeders'
import hash from '@adonisjs/core/services/hash'
import User from '#models/user'

export default class UserSeeder extends BaseSeeder {
  async run() {
    await User.create({
      username: 'admin',
      password: await hash.make('bukanAdmin123'),
    })
  }
}
