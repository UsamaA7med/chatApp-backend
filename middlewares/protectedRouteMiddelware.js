import jwt from 'jsonwebtoken'
import { User } from '../models/userModel.js'
export default async function protectedRouteMiddelware(req, res, next) {
  const token = req.cookies.token
  if (!token) {
    return res.status(401).json({ status: 'error', message: 'Unauthorized' })
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET)
  if (!decoded) {
    return res.status(401).json({ status: 'error', message: 'Unauthorized' })
  }
  const user = await User.findById(decoded.id)
  req.user = user
  next()
}
