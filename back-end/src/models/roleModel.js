import mongoose from 'mongoose'

const roleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  description: { type: String, default: '' },
  active: { type: Boolean, default: true },
}, { timestamps: true })

const Role = mongoose.models.Role || mongoose.model('Role', roleSchema)

export function toPlainRole(role) {
  if (!role) return undefined
  const plainRole = role.toObject ? role.toObject() : role
  const { _id, __v, ...publicFields } = plainRole
  return publicFields
}

export async function listRoles() {
  const roles = await Role.find({ active: true }).sort({ name: 1 }).lean()
  return roles.map(toPlainRole)
}

export async function upsertRoleByName(name, data = {}) {
  return toPlainRole(await Role.findOneAndUpdate(
    { name },
    { $set: { name, ...data } },
    { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true, lean: true },
  ))
}
