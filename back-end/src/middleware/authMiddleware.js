import { verifyAccessToken } from '../config/jwt.js'
import { findUserByEmail } from '../models/userModel.js'
import mongoose from 'mongoose'

export const requireAuth = async (req, res, next) => {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : ''

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' })
  }

  try {
    const payload = verifyAccessToken(token)
    const email = payload.sub || payload.email
    let user = null

    if (email) {
      user = await findUserByEmail(email)
    }

    if (!user && payload.userId) {
      const UserModel = mongoose.models.User
      if (UserModel) {
        user = await UserModel.findById(payload.userId).lean()
      }
    }

    if (!user) {
      return res.status(401).json({ message: 'User account not found' })
    }

    req.user = user
    next()
  } catch {
    return res.status(401).json({ message: 'Invalid or expired session' })
  }
}

export const requireRole = (role) => (req, res, next) => {
  if (!req.user || String(req.user.role).toLowerCase() !== String(role).toLowerCase()) {
    return res.status(403).json({ message: 'Forbidden: Insufficient permissions' })
  }
  next()
}

export const requireApprovedAgent = (req, res, next) => {
  if (req.user?.role?.toLowerCase() === 'agent' && req.user?.kycStatus !== 'Approved') {
    return res.status(403).json({ message: 'KYC approval required to access this resource.' })
  }
  next()
}

export const requireAdmin = (req, res, next) => {
  requireAuth(req, res, () => {
    const role = String(req.user?.role || '').toLowerCase()
    if (role !== 'admin' && role !== 'subadmin') {
      return res.status(403).json({ message: 'Admin access required' })
    }
    next()
  })
}

export default {
  requireAuth,
  requireRole,
  requireApprovedAgent,
  requireAdmin,
}
