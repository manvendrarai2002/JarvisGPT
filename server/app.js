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

  if (!_dbConnected) {
    await connectDB()
    _dbConnected = true
  }

  // Razorpay signs the exact raw request body. Keep this route before JSON parsing.
  app.post('/api/razorpay/webhook', express.raw({ type: 'application/json', limit: '256kb' }), razorpayWebhook)

  const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)

  app.disable('x-powered-by')
  app.use(cors({ origin: allowedOrigins, credentials: true }))
  app.use(express.json({ limit: '256kb' }))
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff')
    res.setHeader('X-Frame-Options', 'DENY')
    res.setHeader('Referrer-Policy', 'no-referrer')
    next()
  })

  app.get('/api/health', (req, res) => res.json({ ok: true, ts: Date.now() }))
  app.get('/', (req, res) => res.send('Server is Live!'))
  app.use('/api/user', userRouter)
  app.use('/api/chat', chatRouter)
  app.use('/api/message', messageRouter)
  app.use('/api/credit', creditRouter)

  _app = app
  return _app
}

export default getApp
