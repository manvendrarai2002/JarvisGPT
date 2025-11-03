import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import connectDB from './configs/db.js'
import userRouter from './routes/userRoutes.js'
import chatRouter from './routes/chatRoutes.js'
import messageRouter from './routes/messageRouter.js'
import creditRouter from './routes/creditRoutes.js'
import { razorpayWebhook } from './controllers/webhooks.js'

let _app = null
let _dbConnected = false

export async function getApp() {
  if (_app) return _app

  const app = express()

  // Ensure DB connected only once per lambda warm instance
  if (!_dbConnected) {
    await connectDB()
    _dbConnected = true
  }

  // Razorpay Webhooks (raw body must be parsed before json middleware)
  app.post('/api/razorpay/webhook', express.raw({ type: 'application/json' }), razorpayWebhook)

  // Middleware
  app.use(cors())
  app.use(express.json())

  // Routes
  app.get('/', (req, res) => res.send('Server is Live!'))
  app.use('/api/user', userRouter)
  app.use('/api/chat', chatRouter)
  app.use('/api/message', messageRouter)
  app.use('/api/credit', creditRouter)

  _app = app
  return _app
}

export default getApp
