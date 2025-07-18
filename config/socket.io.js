import { Server } from 'socket.io'
import http from 'http'
import express from 'express'

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: 'https://chat-app-frontend-chi-two.vercel.app',
    methods: ['GET', 'POST', 'OPTIONS', 'PATCH', 'DELETE'],
    credentials: true,
  },
})

const userSocketMap = {}

const getReceiverSocket = (userId) => {
  return userSocketMap[userId]
}

io.on('connection', (socket) => {
  console.log('a user connected', socket.id)

  const { userId } = socket.handshake.query

  if (userId) {
    userSocketMap[userId] = socket.id
  }
  io.emit('getOnlineUsers', Object.keys(userSocketMap))
  socket.on('disconnect', () => {
    console.log('user disconnected', socket.id)
    delete userSocketMap[userId]
    io.emit('getOnlineUsers', Object.keys(userSocketMap))
  })
})

export { io, server, app, getReceiverSocket }
