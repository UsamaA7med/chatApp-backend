import express from 'express'
import protectedRouteMiddelware from '../middlewares/protectedRouteMiddelware.js'
import {
  getMessagesBetweenTwo,
  selectedUser,
  sendMessage,
} from '../controllers/messageControllers.js'
import { upload } from '../config/multerConfig.js'

export const messageRoutes = express.Router()

messageRoutes.post(
  '/send/:id',
  protectedRouteMiddelware,
  upload.single('image'),
  sendMessage
)

messageRoutes.get('/getUser/:id', protectedRouteMiddelware, selectedUser)

messageRoutes.get(
  '/getMessages/:id',
  protectedRouteMiddelware,
  getMessagesBetweenTwo
)
