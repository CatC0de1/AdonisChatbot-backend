import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'add_foreign_keys'

  async up() {
    this.schema.alterTable('messages', (table) => {
      table.foreign('conversation_id').references('id').inTable('conversations').onDelete('CASCADE')
    })

    this.schema.alterTable('conversations', (table) => {
      table.foreign('last_message_id').references('id').inTable('messages').onDelete('SET NULL')
    })
  }

  async down() {
    this.schema.alterTable('messages', (table) => {
      table.dropForeign(['conversation_id'])
    })

    this.schema.alterTable('conversations', (table) => {
      table.dropForeign(['last_message_id'])
    })
  }
}
