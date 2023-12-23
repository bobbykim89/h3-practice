import { Schema, model } from 'mongoose'

const commentSchema = new Schema({
  text: {
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
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
  },
  date: {
    type: Date,
    default: Date.now,
  },
})

export const Comment = model('Comment', commentSchema)
