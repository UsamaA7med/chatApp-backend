import {
  cloudinaryDeleteImage,
  cloudinaryUploadImage,
} from '../config/cloudinaryConfig.js'
import asyncMiddleware from '../middlewares/asyncMiddleware.js'
import { User } from '../models/userModel.js'
import { generateAndSetToken } from '../utils/generateAndSetToken.js'
import generateError from '../utils/generateError.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const signup = asyncMiddleware(async (req, res, next) => {
  const userExists = await User.findOne({ email: req.body.email })
  if (userExists) {
    return next(new generateError('User already exists', 400, 'error'))
  }
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(req.body.password, salt)
  const user = await User.create({
    ...req.body,
    password: hashedPassword,
  })
  generateAndSetToken(
    {
      _id: user._id,
      email: user.email,
    },
    res
  )
  res.status(201).json({ status: 'success', data: user })
})

export const login = asyncMiddleware(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email })
  if (!user) {
    return next(new generateError('Invalid email or password', 400, 'error'))
  }
  const isMatch = await bcrypt.compare(req.body.password, user.password)
  if (!isMatch) {
    return next(new generateError('Invalid email or password', 400, 'error'))
  }
  generateAndSetToken(
    {
      _id: user._id,
      email: user.email,
    },
    res
  )
  res.status(200).json({ status: 'success', data: user })
})

export const logout = asyncMiddleware(async (req, res) => {
  res.clearCookie('token')
  res.status(200).json({ status: 'success', data: 'User logged out' })
})

export const checkAuth = asyncMiddleware(async (req, res, next) => {
  const token = req.cookies.token
  if (!token) {
    return next(new generateError('Unauthorized', 401, 'error'))
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET)
  const user = await User.findById(decoded.id).select('-password')
  if (!user) {
    return next(new generateError('Unauthorized', 401, 'error'))
  }
  res.status(200).json({ status: 'success', data: user })
})

export const updateProfile = asyncMiddleware(async (req, res) => {
  if (req.file) {
    if (req.user.profilePic.publicId) {
      await cloudinaryDeleteImage(req.user.profilePic.publicId)
    }
    const b64 = Buffer.from(req.file.buffer).toString('base64')
    const url = 'data:' + req.file.mimetype + ';base64,' + b64
    const result = await cloudinaryUploadImage(url)
    req.body.profilePic = {
      publicId: result.public_id,
      url: result.secure_url,
    }
  }
  if (req.body.password) {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)
    req.body.password = hashedPassword
  }
  const user = await User.findByIdAndUpdate(req.user.id, req.body, {
    new: true,
  })
  res.status(200).json({ status: 'success', data: user })
})

export const getAllUsers = asyncMiddleware(async (req, res) => {
  const users = await User.find({ _id: { $ne: req.user.id } }).select(
    '-password'
  )
  res.status(200).json({ status: 'success', data: users })
})
