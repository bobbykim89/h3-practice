import {
  H3Event,
  EventHandlerRequest,
  getRouterParams,
  createError,
  getRouterParam,
} from 'h3'
import { Post } from '@/model'

export class PostController {
  public async getAllpost(e: H3Event) {
    // @route GET /post
    const allPost = await Post.find({}).sort({ date: -1 })

    if (!allPost) {
      throw createError({
        status: 404,
        message: 'Not found',
        statusMessage: 'Post not found',
      })
    }
  }
  public async getPostById(e: H3Event) {
    // @route GET /post/:id
    const postId = getRouterParam(e, 'id')
    const post = await Post.findById(postId)

    if (!post) {
      throw createError({
        status: 404,
        message: 'Not found',
        statusMessage: 'Cannot find post with corresponding id',
      })
    }
    return post
  }
}
