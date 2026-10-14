import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import mongoose from 'mongoose';
import { createAuthToken } from '../services/authentication.js';
import { requireAdmin, requireAuth } from '../middleware/authMiddleware.js';
import { buildPublicUsersFilter, validatePublicSignupRequest, validateRoleUpdateRequest, validateSeedAdminRequest, validateUserDeleteRequest } from '../services/adminSecurity.js';

const router = express.Router();

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role === 'subadmin' ? 'subadmin' : user.role === 'admin' ? 'admin' : 'user',
  kycType: user.kycType || null,
  kycNumber: user.kycNumber || null
});

const ensureDbConnection = async () => {
  if (mongoose.connection.readyState === 1) return true;
  if (mongoose.connection.readyState === 2) {
    for (let i = 0; i < 30; i++) {
      await new Promise((res) => setTimeout(res, 100));
      if (mongoose.connection.readyState === 1) return true;
    }
  }
  return mongoose.connection.readyState === 1;
};

const authenticateUser = async (identifier, password) => {
  const normalized = (identifier || '').trim();
  if (!normalized) return null;

  const searchTerm = normalized.toLowerCase();
  const user = await User.findOne({
    $or: [
      { email: searchTerm },
      { name: { $regex: `^${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' } }
    ]
  });

  const isValidPassword = user && await bcrypt.compare(password, user.passwordHash);
  if (!isValidPassword) return null;
  return user;
};

router.post('/signup', async (req, res) => {
  try {
    const isDbConnected = await ensureDbConnection();
    if (!isDbConnected) return res.status(503).json({ message: 'Database connection is connecting or unavailable' });

    const { name, email, password, kycType, kycNumber } = req.body || {};
    if (!name?.trim() || !email?.trim() || !password) return res.status(400).json({ message: 'Name, email and password are required' });
    if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });

    const normalizedKycType = typeof kycType === 'string' ? kycType.trim().toUpperCase() : '';
    const normalizedKycNumber = typeof kycNumber === 'string' ? kycNumber.trim() : '';
    const publicSignupCheck = validatePublicSignupRequest({
      ...req.body,
      kycType: normalizedKycType,
      kycNumber: normalizedKycNumber
    });
    if (!publicSignupCheck.allowed) {
      return res.status(403).json({ message: publicSignupCheck.message });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) return res.status(409).json({ message: 'An account with this email already exists' });

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      kycType: normalizedKycType,
      kycNumber: normalizedKycNumber,
      role: 'user'
    });
    return res.status(201).json({ token: createAuthToken(user), user: publicUser(user) });
  } catch (error) {
    console.error('Signup error:', error.message);
    return res.status(500).json({ message: error.message || 'Unable to create account' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const isDbConnected = await ensureDbConnection();
    if (!isDbConnected) return res.status(503).json({ message: 'Database connection is connecting or unavailable' });

    const { email, username, password } = req.body || {};
    const identifier = email || username;
    if (!identifier?.trim() || !password) return res.status(400).json({ message: 'Email or username and password are required' });

    const user = await authenticateUser(identifier, password);
    if (!user) return res.status(401).json({ message: 'Invalid email, username or password' });

    return res.json({ token: createAuthToken(user), user: publicUser(user) });
  } catch (error) {
    console.error('Login error:', error.message);
    return res.status(500).json({ message: error.message || 'Unable to login' });
  }
});

router.get('/me', requireAuth, async (req, res) => {
  return res.json({ user: publicUser(req.user) });
});

router.get('/users', requireAdmin, async (_req, res) => {
  const users = await User.find(buildPublicUsersFilter())
    .select('name email role kycType kycNumber createdAt')
    .sort({ createdAt: -1 });

  return res.json({
    users: users.map((user) => ({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      kycType: user.kycType,
      kycNumber: user.kycNumber,
      createdAt: user.createdAt
    }))
  });
});

router.patch('/users/:id/role', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body || {};

    const userToUpdate = await User.findById(id).select('name email role');
    if (!userToUpdate) {
      return res.status(404).json({ message: 'User not found' });
    }

    const validation = validateRoleUpdateRequest({
      currentRole: userToUpdate.role,
      nextRole: role
    });

    if (!validation.allowed) {
      return res.status(400).json({ message: validation.message });
    }

    userToUpdate.role = role;
    await userToUpdate.save();

    return res.json({
      message: 'User role updated successfully.',
      user: publicUser(userToUpdate)
    });
  } catch (error) {
    console.error('Update registered user role error:', error.message);
    return res.status(500).json({ message: error.message || 'Unable to update user role' });
  }
});

router.delete('/users/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'User id is required' });
    }

    const userToDelete = await User.findById(id).select('role email name');
    if (!userToDelete) {
      return res.status(404).json({ message: 'User not found' });
    }

    const validation = validateUserDeleteRequest({ role: userToDelete.role });
    if (!validation.allowed) {
      return res.status(403).json({ message: validation.message });
    }

    await User.findByIdAndDelete(id);
    return res.json({ message: 'User deleted successfully.', userId: id });
  } catch (error) {
    console.error('Delete registered user error:', error.message);
    return res.status(500).json({ message: error.message || 'Unable to delete user' });
  }
});

export default router;
