import express from 'express'
import {
  checkAuth,
  getAllUsers,
  login,
  logout,
  signup,
  updateProfile,
} from '../controllers/userControllers.js'
import protectedRouteMiddelware from '../middlewares/protectedRouteMiddelware.js'
import { upload } from '../config/multerConfig.js'

const authRoutes = express.Router()

authRoutes.post('/signup', signup)

authRoutes.post('/login', login)

authRoutes.get('/logout', logout)

authRoutes.get('/checkAuth', checkAuth)

authRoutes.patch(
  '/updateProfile',
  protectedRouteMiddelware,
  upload.single('image'),
  updateProfile
)

authRoutes.get('/getAllUsers', protectedRouteMiddelware, getAllUsers)

export default authRoutes
