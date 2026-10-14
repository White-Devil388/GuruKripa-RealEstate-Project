import mongoose from 'mongoose'

const adminResourceSchema = new mongoose.Schema({
  resource: { type: String, required: true, index: true },
  id: { type: String, required: true, unique: true, index: true },
  data: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true })

const AdminResource = mongoose.models.AdminResource || mongoose.model('AdminResource', adminResourceSchema)

function toPlainResource(record) {
  if (!record) return undefined
  return {
    ...record.data,
    id: record.id,
    createdAt: record.createdAt?.toISOString?.() || record.createdAt,
    updatedAt: record.updatedAt?.toISOString?.() || record.updatedAt,
  }
}

export { AdminResource, toPlainResource }
