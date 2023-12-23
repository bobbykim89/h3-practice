import { createRouter, eventHandler } from 'h3'
import { PostController } from './post.controller'

const postController = new PostController()

export const postRouter = createRouter()
  .get('/post', eventHandler(postController.getAllPost))
  .get('/post/:id', eventHandler(postController.getPostById))
