import { Schema, model } from 'mongoose'

const postSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  imageId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  date: {
    type: Date,
    default: Date.now,
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'comment',
    },
  ],
})

export const Post = model('Post', postSchema)
