/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

import { index as getConversations } from '#controllers/conversations_controller'
import { show as getConversationsById } from '#controllers/conversations_controller'
import { destroy as deleteConversation } from '#controllers/conversations_controller'

const QuestionsController = () => import('#controllers/questions_controller')

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.post('/questions', [QuestionsController, 'store'])

router.get('/conversation', getConversations)

router.get('/conversation/:id_or_uuid', getConversationsById)

router.delete('/conversation/:id_or_uuid', deleteConversation)
