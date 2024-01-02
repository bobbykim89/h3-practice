import { createRouter, defineEventHandler, defineRequestMiddleware } from 'h3'
import { CommentController } from './comment.controller'
import { checkAuth } from '@/middleware'

const commentController = new CommentController()

export const commentRouter = createRouter()
  .get(
    '/comment',
    defineEventHandler({
      handler: defineEventHandler(commentController.getAllComment),
    })
  )
  .get(
    '/comment/:id',
    defineEventHandler(commentController.getCommentsByPostId)
  )
  .post(
    '/comment',
    defineEventHandler({
      onRequest: [defineRequestMiddleware(checkAuth)],
      handler: defineEventHandler(commentController.createNewComment),
    })
  )
  .delete(
    '/comment/:id',
    defineEventHandler({
      onRequest: [defineRequestMiddleware(checkAuth)],
      handler: defineEventHandler(commentController.deleteCommentById),
    })
  )
