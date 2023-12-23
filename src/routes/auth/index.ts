import {
  createRouter,
  eventHandler,
  defineEventHandler,
  getRouterParams,
  defineRequestMiddleware,
} from 'h3'
import { checkAuth } from '@/middleware'
import { AuthController } from './auth.controller'

const authController = new AuthController()

export const authRouter = createRouter()
  .get(
    '/auth',
    defineEventHandler({
      onRequest: [defineRequestMiddleware(checkAuth)],
      handler: eventHandler(authController.getCurrentUser),
    })
  )
  .post(
    '/auth',
    defineEventHandler({
      handler: eventHandler(authController.loginUser),
    })
  )
  .get(
    '/auth/:id',
    defineEventHandler({
      handler: eventHandler((event) => {
        const param = getRouterParams(event)
        return `<h3>Route param ${param.id}</h3>`
      }),
    })
  )
