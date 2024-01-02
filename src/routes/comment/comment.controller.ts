import {
  H3Event,
  createError,
  getRouterParam,
  readValidatedBody,
  setResponseStatus,
  getResponseStatus,
  getResponseStatusText,
} from 'h3'
import { Comment, Post, User } from '@/model'
import { CommentInput } from './dto'

export class CommentController {
  public async getAllComment(e: H3Event) {
    const comments = await Comment.find({})

    if (!comments) {
      throw createError({
        status: 404,
        message: 'Not found',
        statusMessage: 'Comments not found',
      })
    }
    return comments
  }
  public async getCommentsByPostId(e: H3Event) {
    const postId = getRouterParam(e, 'id')

    const comments = await Comment.find({ post: postId })
    if (!comments) {
      throw createError({
        status: 404,
        message: 'Not found',
        statusMessage: 'Comments not found',
      })
    }

    return comments
  }
  public async createNewComment(e: H3Event) {
    const user = e.context.user
    const currentUser = await User.findById(user.id).select('-password')
    if (!currentUser) {
      throw createError({
        status: 404,
        message: 'Access denied',
        statusMessage: 'Access denied: user not found',
      })
    }
    const body = await readValidatedBody(e, (body) => {
      if (!body) {
        throw createError({
          status: 403,
          message: 'Validation error',
          statusMessage: 'Invalid client request',
        })
      }
      const { text, post } = body as CommentInput
      if (!text || !post) {
        throw createError({
          status: 403,
          message: 'Validation error',
          statusMessage:
            'Validation error: required fields are missing, please check your inputs again.',
        })
      }
      return body as CommentInput
    })
    const newComment = new Comment({
      text: body.text,
      name: currentUser.name,
      author: currentUser.id,
      post: body.post,
    })
    const comment = await newComment.save()
    if (!comment) {
      throw createError({
        status: 520,
        message: 'Unknown',
        statusMessage: 'Something went wrong, please try again.',
      })
    }
    return comment
  }
  public async deleteCommentById(e: H3Event) {
    const commentId = getRouterParam(e, 'id')
    const user = e.context.user
    const currentUser = await User.findById(user.id).select('-password')
    if (!currentUser) {
      throw createError({
        status: 404,
        message: 'Not found',
        statusMessage: 'Not found: user not found',
      })
    }
    const comment = await Comment.findById(commentId)
    if (!comment) {
      throw createError({
        status: 404,
        message: 'Not found',
        statusMessage: 'Not found: comment not found',
      })
    }
    if (comment.author!.toString() !== currentUser.id || !currentUser.admin) {
      throw createError({
        status: 401,
        message: 'Unauthorized',
        statusMessage:
          'Unauthorized: current user is not authorized for this action.',
      })
    }
    await Comment.findByIdAndDelete(commentId)
    setResponseStatus(e, 200, 'Successfuly deleted the comment.')
    const status = getResponseStatus(e)
    const statusText = getResponseStatusText(e)
    return {
      status,
      text: statusText,
    }
  }
}
