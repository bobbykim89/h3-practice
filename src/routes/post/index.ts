import { createRouter, defineEventHandler, eventHandler } from 'h3'
import { PostController } from './post.controller'

const postController = new PostController()

export const postRouter = createRouter()
  .get(
    '/post',
    defineEventHandler({
      handler: postController.getAllpost,
    })
  )
  .get(
    '/post/:id',
    defineEventHandler({
      handler: postController.getPostById,
    })
  )
