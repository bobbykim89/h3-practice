import {
  createRouter,
  eventHandler,
  defineEventHandler,
  getRouterParams,
  defineRequestMiddleware,
} from 'h3'
import { checkAuth } from '@/middleware'
import { UserController } from './user.controller'

const userController = new UserController()

export const userRouter = createRouter().post(
  '/user',
  defineEventHandler({
    handler: eventHandler(userController.signupUser),
  })
)
