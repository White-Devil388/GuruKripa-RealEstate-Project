import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  phone: { type: String, required: true },
  role: { type: String, required: true },
  password: { type: String, required: true, select: true },
  kycDocument: String,
  kycDocumentNumber: String,
  kycStatus: String,
  kycDetails: mongoose.Schema.Types.Mixed,
  kycDocuments: mongoose.Schema.Types.Mixed,
  gender: String,
  address: String,
  referralCode: String,
}, { timestamps: true, strict: false })

const User = mongoose.models.User || mongoose.model('User', userSchema)

function toPlainUser(user) {
  if (!user) return undefined
  const plainUser = user.toObject ? user.toObject() : user
  const { _id, __v, ...publicFields } = plainUser
  return publicFields
}

export async function findUserByEmail(email) {
  return toPlainUser(await User.findOne({ email: String(email).toLowerCase() }).lean())
}

export async function findUserByReferralCode(code) {
  return toPlainUser(await User.findOne({ referralCode: String(code).trim().toUpperCase() }).lean())
}

export async function createUser(user) {
  return toPlainUser(await User.create(user))
}

export async function userExists(email) {
  return Boolean(await User.exists({ email: String(email).toLowerCase() }))
}

export async function getAllUsers() {
  const users = await User.find().lean()
  return users.map(toPlainUser)
}

export async function updateUserByEmail(email, changes) {
  return toPlainUser(await User.findOneAndUpdate(
    { email: String(email).toLowerCase() },
    { $set: changes },
    { new: true, lean: true },
  ))
}

export async function upsertUserByEmail(email, user) {
  return toPlainUser(await User.findOneAndUpdate(
    { email: String(email).toLowerCase() },
    { $set: { ...user, email: String(email).toLowerCase() } },
    { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true, lean: true },
  ))
}

