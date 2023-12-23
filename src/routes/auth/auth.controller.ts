import 'dotenv/config'
import {
  H3Event,
  createError,
  readValidatedBody,
  setResponseStatus,
  getResponseStatus,
  getResponseStatusText,
} from 'h3'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User } from '@/model'
import type { AuthInput } from './dto'

export class AuthController {
  public async getCurrentUser(e: H3Event) {
    try {
      const user = await User.findById(e.context.user.id).select('-password')
      return user
    } catch (error) {
      throw createError({
        status: 404,
        message: 'Not found',
        statusMessage: 'User not found',
      })
    }
  }
  public async loginUser(e: H3Event) {
    const body = readValidatedBody(e, (body) => {
      if (!body) {
        throw createError({
          status: 403,
          message: 'Validation error',
          statusMessage: 'Invalid client request',
        })
      }
      const { email, password } = body as AuthInput
      if (!email || !password) {
        throw createError({
          status: 403,
          message: 'Validation error',
          statusMessage: 'Invalid email or password',
        })
      }
      return body as AuthInput
    })
    const { email, password } = await body
    let user = await User.findOne({ email })

    if (!user) {
      throw createError({
        status: 403,
        message: 'Validation error',
        statusMessage:
          'Invalid credential: please check email or password again',
      })
    }
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      throw createError({
        status: 403,
        message: 'Validation error',
        statusMessage:
          'Invalid credential: please check email or password again',
      })
    }
    const payload = {
      id: user.id,
      admin: user.admin,
    }
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: '7d',
    })

    setResponseStatus(e, 200, 'Login successful!')
    const status = getResponseStatus(e)
    const text = getResponseStatusText(e)

    return {
      status,
      message: text,
      access_token: `Bearer ${accessToken}`,
    }
  }
}
