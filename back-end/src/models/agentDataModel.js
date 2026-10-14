import mongoose from 'mongoose'

const recordSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true, default: () => new mongoose.Types.ObjectId().toString() },
}, { timestamps: true, strict: false })

const Ticket = mongoose.models.AgentTicket || mongoose.model('AgentTicket', recordSchema)
const Customer = mongoose.models.AgentCustomer || mongoose.model('AgentCustomer', recordSchema)
const SiteVisit = mongoose.models.SiteVisit || mongoose.model('SiteVisit', recordSchema)
const Withdrawal = mongoose.models.Withdrawal || mongoose.model('Withdrawal', recordSchema)
const Project = mongoose.models.AgentProject || mongoose.model('AgentProject', recordSchema)

function toPlainRecord(record) {
  if (!record) return undefined
  const plainRecord = record.toObject ? record.toObject() : record
  const { _id, __v, ...data } = plainRecord
  return data
}

async function findByEmail(Model, field, email) {
  const records = await Model.find({ [field]: email }).sort({ createdAt: -1 }).lean()
  return records.map(toPlainRecord)
}

async function upsertRecord(Model, id, data) {
  return toPlainRecord(await Model.findOneAndUpdate({ id }, { $set: data }, { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true, lean: true }))
}

export async function createTicket(ticket) { return toPlainRecord(await Ticket.create(ticket)) }
export async function findTicketsByEmail(email) { return findByEmail(Ticket, 'email', email) }
export async function createCustomer(customer) { return toPlainRecord(await Customer.create(customer)) }
export async function findCustomersByEmail(email) { return findByEmail(Customer, 'emailOwner', email) }
export async function createVisit(visit) { return toPlainRecord(await SiteVisit.create(visit)) }
export async function findVisitsByEmail(email) { return findByEmail(SiteVisit, 'emailOwner', email) }
export async function createWithdrawal(withdrawal) { return toPlainRecord(await Withdrawal.create(withdrawal)) }
export async function findWithdrawalsByEmail(email) { return findByEmail(Withdrawal, 'emailOwner', email) }
export async function getAllTickets() { return (await Ticket.find().sort({ createdAt: -1 }).lean()).map(toPlainRecord) }
export async function getAllCustomers() { return (await Customer.find().sort({ createdAt: -1 }).lean()).map(toPlainRecord) }
export async function getAllVisits() { return (await SiteVisit.find().sort({ createdAt: -1 }).lean()).map(toPlainRecord) }
export async function getAllWithdrawals() { return (await Withdrawal.find().sort({ createdAt: -1 }).lean()).map(toPlainRecord) }
export async function updateWithdrawal(id, changes) { return toPlainRecord(await Withdrawal.findOneAndUpdate({ id }, { $set: changes }, { new: true, lean: true })) }
export async function getAgentProjects() { return (await Project.find().sort({ createdAt: 1 }).lean()).map(toPlainRecord) }
export async function getAllProjects() { return (await Project.find().sort({ createdAt: 1 }).lean()).map(toPlainRecord) }
export async function upsertProject(id, project) { return upsertRecord(Project, id, { id, ...project }) }
export async function deleteProject(id) { return (await Project.deleteOne({ id })).deletedCount > 0 }
export async function upsertAgentCustomer(id, customer) { return upsertRecord(Customer, id, { id, ...customer }) }
export async function deleteAgentCustomer(id) { return (await Customer.deleteOne({ id })).deletedCount > 0 }
export async function upsertAgentTicket(id, ticket) { return upsertRecord(Ticket, id, { id, ...ticket }) }
export async function deleteAgentTicket(id) { return (await Ticket.deleteOne({ id })).deletedCount > 0 }
export async function upsertSiteVisit(id, visit) { return upsertRecord(SiteVisit, id, { id, ...visit }) }
export async function deleteSiteVisit(id) { return (await SiteVisit.deleteOne({ id })).deletedCount > 0 }
export async function upsertAgentWithdrawal(id, withdrawal) { return upsertRecord(Withdrawal, id, { id, ...withdrawal }) }