import { AdminResource, toPlainResource } from '../../models/adminResourceModel.js'

const allowedResources = new Set(['banks', 'rules', 'settings', 'leads', 'bookings', 'payment-plans', 'edit-requests', 'installment-dues', 'installments-emi', 'reports', 'rank-levels', 'full-tree', 'referral-links', 'subdomains', 'audit-logs', 'account-ledger', 'finance-tds'])

function isAllowedResource(resource) { return allowedResources.has(resource) }

export async function listResource(resource) {
  if (!isAllowedResource(resource)) return undefined
  const records = await AdminResource.find({ resource }).sort({ createdAt: -1 }).lean()
  return records.map(toPlainResource)
}

export async function createResource(resource, data) {
  if (!isAllowedResource(resource)) return undefined
  const record = await AdminResource.create({
    resource,
    id: `${resource}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    data,
  })
  return toPlainResource(record)
}

export async function updateResource(resource, id, data) {
  if (!isAllowedResource(resource)) return undefined
  const record = await AdminResource.findOneAndUpdate({ resource, id }, { $set: { data } }, { new: true, lean: true })
  return toPlainResource(record)
}

export async function deleteResource(resource, id) {
  if (!isAllowedResource(resource)) return false
  const result = await AdminResource.deleteOne({ resource, id })
  return result.deletedCount > 0
}

export async function upsertResource(resource, id, data) {
  if (!isAllowedResource(resource)) return undefined
  const record = await AdminResource.findOneAndUpdate(
    { resource, id },
    { $set: { resource, id, data } },
    { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true, lean: true },
  )
  return toPlainResource(record)
}

export async function assignLead(id, assignment) {
  const record = await AdminResource.findOne({ resource: 'leads', id }).lean()
  if (!record) return undefined

  const updated = await AdminResource.findOneAndUpdate(
    { resource: 'leads', id },
    { $set: { data: { ...record.data, ...assignment } } },
    { new: true, lean: true },
  )
  return toPlainResource(updated)
}
export async function addLeadComment(id, comment) {
  const record = await AdminResource.findOne({ resource: 'leads', id }).lean()
  if (!record) return undefined

  const comments = Array.isArray(record.data?.comments) ? record.data.comments : []
  const updatedComments = [...comments, { ...comment, createdAt: new Date().toISOString() }]

  const updated = await AdminResource.findOneAndUpdate(
    { resource: 'leads', id },
    { $set: { data: { ...(record.data || {}), comments: updatedComments } } },
    { new: true, lean: true },
  )
  return toPlainResource(updated)
}
