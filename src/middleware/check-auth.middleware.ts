import 'dotenv/config'
import { H3Event, createError, getRequestHeader } from 'h3'
import jwt from 'jsonwebtoken'

export const checkAuth = (event: H3Event) => {
  const bearerToken = getRequestHeader(event, 'Authorization')
  // check if token exists
  if (!bearerToken) {
    throw createError({
      status: 400,
      message: 'Unauthorized',
      statusMessage: 'No access token found, authorization denied..',
    })
  }
  const token = bearerToken?.replace('Bearer ', '')

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET!)
    event.context.user = decodedToken
  } catch (error) {
    //   throw error when token not valid
    throw createError({
      status: 401,
      message: 'Unauthorized',
      statusMessage: 'Access token is not valid',
    })
  }
}
