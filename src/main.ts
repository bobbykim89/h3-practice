import { createApp, eventHandler } from 'h3'
import { connectDB } from '@/config'
import { userRouter, authRouter, postRouter } from '@/routes'

const app = createApp()

// Connect Database
connectDB()

app.use(postRouter).use(authRouter).use(userRouter)
// .use(
//   '/',
//   eventHandler(() => {
//     return '<h1>Hello world</h1>'
//   })
// )

export { app }
