import { cloudinaryUploadImage } from '../config/cloudinaryConfig.js'
import { getReceiverSocket, io } from '../config/socket.io.js'
import asyncMiddleware from '../middlewares/asyncMiddleware.js'
import { Message } from '../models/messageModel.js'
import { User } from '../models/userModel.js'

export const sendMessage = asyncMiddleware(async (req, res) => {
  if (req.file) {
    const b64 = Buffer.from(req.file.buffer).toString('base64')
    const url = 'data:' + req.file.mimetype + ';base64,' + b64
    const result = await cloudinaryUploadImage(url)
    req.body.image = {
      publicId: result.public_id,
      url: result.secure_url,
    }
  }
  await Message.create({
    ...req.body,
    sender: req.user.id,
    reciver: req.params.id,
  })
  const allMessages = await Message.find({
    $or: [
      { sender: req.user.id, reciver: req.params.id },
      { sender: req.params.id, reciver: req.user.id },
    ],
  }).populate('reciver sender')
  const reciverSocketId = getReceiverSocket(req.params.id)
  if (reciverSocketId) {
    io.to(reciverSocketId).emit('newMessage', [allMessages, req.user.id])
  }
  res.status(200).json({ status: 'success', data: allMessages })
})

export const getMessagesBetweenTwo = asyncMiddleware(async (req, res) => {
  const messages = await Message.find({
    $or: [
      { sender: req.user.id, reciver: req.params.id },
      { sender: req.params.id, reciver: req.user.id },
    ],
  }).populate('reciver sender')
  res.status(200).json({ status: 'success', data: messages })
})

export const selectedUser = asyncMiddleware(async (req, res) => {
  const user = await User.findById(req.params.id)
  res.status(200).json({ status: 'success', data: user })
})
