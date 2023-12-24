import { createApp, eventHandler } from 'h3'
import { connectDB } from '@/config'
import { userRouter, authRouter, postRouter } from '@/routes'

const app = createApp()

// Connect Database
connectDB()

app
  .use(postRouter)
  .use(authRouter)
  .use(userRouter)
  .use(
    '/',
    eventHandler(() => {
      return '<head><title>Manguito Page API</title></head><style>body {background-color: #e8e8e8;padding-top: 48px;padding-bottom: 48px;display: flex;justify-content: center;align-items:center;} .container {display: flex;flex-direction: column;justify-content: center;align-items: center;padding: 32px;border: 2px solid #4c0519;border-radius: 5px; background-color: #78be20;} .header {margin-bottom: 32px;} .img {border-radius: 10px;}</style><body><div class="container"><h1 class="header">Welcome to Manguito Page API</h1><img class="img" src="https://res.cloudinary.com/dwgni1x3t/image/upload/c_scale,w_1200/q_auto/v1666385529/ManguitoPage/jvbzjwf6vprjcm1mqjpd.jpg" height="256px"><p>Hello from pollito!</p></div></body>'
    })
  )

export { app }
