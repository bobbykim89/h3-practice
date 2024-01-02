import {
  H3Event,
  createError,
  getRouterParam,
  readValidatedBody,
  setResponseStatus,
  getResponseStatus,
  getResponseStatusText,
} from 'h3'
import { Post, User, Comment } from '@/model'
import { deleteCloudinaryImage } from '@/middleware'
import { PutPostInput } from './dto'

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
    return allPost
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
  public async createNewPost(e: H3Event) {
    const user = e.context.user
    const file = e.context.file
    const content = e.context.content
    if (!user.admin) {
      throw createError({
        status: 401,
        message: 'Access denied',
        statusMessage: 'Access denied: unauthorized user',
      })
    }

    const currentUser = await User.findById(user.id).select('-password')

    if (!currentUser) {
      throw createError({
        status: 404,
        message: 'Access denied',
        statusMessage: 'Access denied: user not found',
      })
    }
    if (!currentUser.admin) {
      throw createError({
        status: 401,
        message: 'Access denied',
        statusMessage: 'Access denied: unauthorized user',
      })
    }
    const newPost = new Post({
      content,
      image: file.image,
      imageId: file.imageId,
      name: currentUser.name,
      author: currentUser.id,
    })

    const savePost = await newPost.save()

    return savePost
  }
  public async updatePost(e: H3Event) {
    const user = e.context.user
    const postId = getRouterParam(e, 'id')

    // validator
    const body = await readValidatedBody(e, (body) => {
      if (!body) {
        throw createError({
          status: 403,
          message: 'Validation error',
          statusMessage: 'Invalid client request',
        })
      }
      const { content } = body as PutPostInput
      if (!content) {
        throw createError({
          status: 403,
          message: 'Validation error',
          statusMessage:
            'Validation error: please fill in text in content section.',
        })
      }
      return body as PutPostInput
    })

    const post = await Post.findById(postId)

    if (!post) {
      throw createError({
        status: 404,
        message: 'Not found',
        statusMessage: 'Post not found',
      })
    }
    if (post.author?.toString() !== user.id) {
      throw createError({
        status: 401,
        message: 'Access denied',
        statusMessage:
          'Access denied: Only author of the post can update the post',
      })
    }
    const updatedPost = await Post.findByIdAndUpdate(postId, body, {
      new: true,
      returnDocument: 'after',
    })

    return updatedPost
  }
  public async deletePostById(e: H3Event) {
    const user = e.context.user
    const postId = getRouterParam(e, 'id')
    const currentUser = await User.findById(user.id).select('-password')
    if (!currentUser) {
      throw createError({
        status: 404,
        message: 'Access denied',
        statusMessage: 'Access denied: user not found',
      })
    }
    const post = await Post.findById(postId)
    // check if post exists
    if (!post) {
      throw createError({
        status: 404,
        message: 'Not found',
        statusMessage: 'Not found: post not found',
      })
    }
    // make sure user is authorized
    if (post.author?.toString() !== currentUser.id || !currentUser.admin) {
      throw createError({
        status: 401,
        message: 'Unauthorized',
        statusMessage:
          'Unauthorized: current user is not authorized for this action.',
      })
    }
    // delete comments related to comment
    const comments = await Comment.find({ post: postId })
    try {
      await Comment.deleteMany({ post: postId })
    } catch (err) {
      throw createError({
        status: 500,
        message: 'Internal server error',
        statusMessage:
          'Internal server error: unexpected error happened, please try again.',
      })
    }
    // delete cloudinary image
    await deleteCloudinaryImage(post.imageId)
    // delete post
    try {
      await Post.findByIdAndDelete(postId)
    } catch (err) {
      throw createError({
        status: 500,
        message: 'Internal server error',
        statusMessage:
          'Internal server error: unexpected error happened, please try again.',
      })
    }
    // send message after deletion completed
    setResponseStatus(e, 200, 'Successfuly deleted the post.')
    const status = getResponseStatus(e)
    const statusText = getResponseStatusText(e)
    return {
      status,
      text: statusText,
    }
  }
}
