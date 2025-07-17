/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { login, logout } from '#controllers/auth_controller'
import { index as getConversations } from '#controllers/conversations_controller'
import { show as getConversationsById } from '#controllers/conversations_controller'
import { destroy as deleteConversation } from '#controllers/conversations_controller'
import { middleware } from './kernel.js'

const QuestionsController = () => import('#controllers/questions_controller')

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.post('/questions', [QuestionsController, 'store'])

router.post('/login', login)

router.post('/logout', logout).use(middleware.AuthSessionMiddleware())

router.get('/conversation', getConversations).use(middleware.AuthSessionMiddleware())

router
  .get('/conversation/:id_or_uuid', getConversationsById)
  .use(middleware.AuthSessionMiddleware())

router
  .delete('/conversation/:id_or_uuid', deleteConversation)
  .use(middleware.AuthSessionMiddleware())
