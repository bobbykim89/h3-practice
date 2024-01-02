import {
  H3Event,
  createRouter,
  defineEventHandler,
  defineRequestMiddleware,
} from 'h3'
import { PostController } from './post.controller'
import { uploadCloudinary, readFormDataText, checkAuth } from '@/middleware'

const postController = new PostController()

export const postRouter = createRouter()
  .get(
    '/post',
    defineEventHandler({
      handler: defineEventHandler(postController.getAllpost),
    })
  )
  .get(
    '/post/:id',
    defineEventHandler({
      handler: defineEventHandler(postController.getPostById),
    })
  )
  .post(
    '/post',
    defineEventHandler({
      onRequest: [
        defineRequestMiddleware(checkAuth),
        defineRequestMiddleware(async (e: H3Event) => {
          await uploadCloudinary(e)
          await readFormDataText(e)
        }),
      ],
      handler: defineEventHandler(postController.createNewPost),
    })
  )
  .put(
    '/post/:id',
    defineEventHandler({
      onRequest: [defineRequestMiddleware(checkAuth)],
      handler: defineEventHandler(postController.updatePost),
    })
  )
  .delete(
    '/post/:id',
    defineEventHandler({
      onRequest: [checkAuth],
      handler: defineEventHandler(postController.deletePostById),
    })
  )
