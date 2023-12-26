import { v2 as cloudinary } from 'cloudinary'
import { H3Event, readMultipartFormData, createError } from 'h3'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export const uploadCloudinary = async (e: H3Event, key: string = 'image') => {
  const body = await readMultipartFormData(e)

  if (!body) {
    throw createError({
      status: 404,
      message: 'Not found',
      statusMessage: 'Request body not found, please try again',
    })
  }
  const file = body.find((item) => {
    return item.name === key
  })
  if (!file) {
    throw createError({
      status: 404,
      message: 'Not found',
      statusMessage: 'File not found',
    })
  }
  if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
    throw createError({
      status: 415,
      message: 'Unsupported media type',
      statusMessage:
        'Unsupported media type please check if file has png or jpeg format',
    })
  }
  const base64EncodedImage = Buffer.from(file.data).toString('base64')
  const dataUri = `data:${file.type};base64,${base64EncodedImage}`

  const { public_id, secure_url } = await cloudinary.uploader.upload(dataUri, {
    folder: 'h3-test',
  })

  e.context.file = { imageId: public_id, image: secure_url }
}
