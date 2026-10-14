import jwt from 'jsonwebtoken'

const secret = process.env.JWT_SECRET

if (!secret) {
  throw new Error('JWT_SECRET environment variable is required.')
}

export function createAccessToken(user) {
  return jwt.sign(
    { role: user.role },
    secret,
    { subject: user.email, expiresIn: process.env.JWT_EXPIRES_IN || '1d' },
  )
}

export function verifyAccessToken(token) {
  return jwt.verify(token, secret)
}