import 'dotenv/config';
import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET || 'change-this-development-secret';

export const createAuthToken = (user) => jwt.sign(
  { userId: user._id.toString(), email: user.email, role: user.role || 'user' },
  jwtSecret,
  { expiresIn: '7d' }
);

export const verifyAuthToken = (token) => jwt.verify(token, jwtSecret);
