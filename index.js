import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { db } from './config/DbConfig.js'
import authRoutes from './routes/authRoutes.js'
import { messageRoutes } from './routes/messageRoutes.js'
import { app, server } from './config/socket.io.js'

dotenv.config()

app.use(express.json())
app.use(cookieParser())
app.use(
  cors({
    origin: 'https://chatapp-backend-production-7a54.up.railway.app',
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/api/auth', authRoutes)
app.use('/api/message', messageRoutes)

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    status: err.status || 'error',
    message: err.message || 'Something went wrong',
  })
})

server.listen(process.env.PORT_NUMBER, () => {
  console.log(`Example app listening on port ${process.env.PORT_NUMBER}`)
  db()
})
