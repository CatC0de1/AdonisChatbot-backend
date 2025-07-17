/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { store as storeQuestion } from '#controllers/questions_controller'
import { login, logout } from '#controllers/auth_controller'
import {
  index as getConversations,
  show as getConversationsById,
  destroy as deleteConversation,
} from '#controllers/conversations_controller'
import { middleware } from './kernel.js'

router.get('/', async () => {
  return { message: 'Chatbot API online' }
})

router.post('/questions', storeQuestion)

router
  .group(() => {
    router.post('/login', login)
    router.post('/logout', logout).use(middleware.AuthSessionMiddleware())
  })
  .prefix('/auth')

router
  .group(() => {
    router.get('/', getConversations)
    router.get('/:id_or_uuid', getConversationsById)
    router.delete('/:id_or_uuid', deleteConversation)
  })
  .prefix('/conversation')
  .use(middleware.AuthSessionMiddleware())
