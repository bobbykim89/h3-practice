import { createApp, eventHandler } from 'h3'
import { connectDB } from '@/config'
import { postsRouter } from '@/routes/posts'

const app = createApp()

// Connect Database
connectDB()

app.use(postsRouter).use(
  '/',
  eventHandler(() => {
    return '<h1>Hello world</h1>'
  })
)

export { app }
