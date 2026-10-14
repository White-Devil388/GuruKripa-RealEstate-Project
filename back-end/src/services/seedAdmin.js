import bcrypt from 'bcryptjs';
import User from '../models/User.js';

export const resolveAdminConfig = ({ env = process.env } = {}) => {
  const email = (env.ADMIN_EMAIL || 'admin@gurukripaarcon.com').trim().toLowerCase();
  const password = (env.ADMIN_PASSWORD || 'GurukripaAdmin@2026').trim();
  const name = (env.ADMIN_NAME || 'Gurukripa Admin').trim();
  const kycType = (env.ADMIN_KYC_TYPE || 'ADMIN').trim().toUpperCase();
  const kycNumber = (env.ADMIN_KYC_NUMBER || 'ADMIN-SEED-01').trim().toUpperCase();

  return { email, password, name, kycType, kycNumber };
};

export const ensureAdminAccount = async () => {
  const { email, password, name, kycType, kycNumber } = resolveAdminConfig();

  await User.updateMany(
    { $or: [{ role: { $exists: false } }, { role: null }, { role: '' }] },
    { $set: { role: 'user' } }
  );

  const existing = await User.findOne({ email });

  if (!existing) {
    const passwordHash = await bcrypt.hash(password, 12);
    await User.create({
      name,
      email,
      passwordHash,
      kycType,
      kycNumber,
      role: 'admin'
    });
    console.log(`Admin account created (${email}). Public signup cannot grant admin access.`);
    return;
  }

  existing.role = 'admin';
  existing.name = existing.name?.trim() || name;

  if (!existing.kycType) {
    existing.kycType = kycType;
  }

  if (!existing.kycNumber) {
    existing.kycNumber = kycNumber;
  }

  const hasExplicitPasswordOverride = typeof process.env.ADMIN_PASSWORD === 'string' && process.env.ADMIN_PASSWORD.trim().length > 0;
  if (hasExplicitPasswordOverride || !existing.passwordHash || !existing.passwordHash.startsWith('$2')) {
    existing.passwordHash = await bcrypt.hash(password, 12);
  }

  await existing.save();

  console.log(`Admin account ready (${email}). Public signup cannot grant admin access.`);
};
