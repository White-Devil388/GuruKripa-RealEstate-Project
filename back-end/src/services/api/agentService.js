import { createCustomer, createTicket, createVisit, createWithdrawal, findCustomersByEmail, findTicketsByEmail, findVisitsByEmail, findWithdrawalsByEmail, getAgentProjects } from '../../models/agentDataModel.js'
import { updateUserByEmail } from '../../models/userModel.js'
import { listResource } from './adminCrudService.js'

function getKycStatus(user) {
  return user.kycStatus || 'Pending'
}

export function getAgentDashboard(user) {
  const name = `${user.firstName} ${user.lastName}`.trim()

  return {
    name,
    role: 'Business Executive (B.EX)',
    referralCode: user.referralCode || 'GK-1004',
    kycStatus: getKycStatus(user),
  }
}

export function getAgentKyc(user) {
  return {
    status: getKycStatus(user),
    details: user.kycDetails || { aadhaar: '', pan: '', accountNumber: '', ifsc: '', bankName: '' },
    documents: user.kycDocuments || {},
  }
}

export async function submitAgentKyc(user, data) {
  const requiredFields = ['aadhaar', 'pan', 'accountNumber', 'ifsc', 'bankName']
  const missingField = requiredFields.find((field) => !String(data[field] || '').trim())

  if (missingField) {
    return { error: 'All identity and bank details are required.', status: 400 }
  }

  const requiredDocuments = ['aadhaarFront', 'aadhaarBack', 'panDocument', 'bankProof']
  const missingDocument = requiredDocuments.find((field) => {
    const document = data.documents?.[field]
    return !document || (typeof document === 'object' ? !document.url && !document.dataUrl : !String(document).trim())
  })

  if (missingDocument) {
    return { error: 'All KYC document files are required.', status: 400 }
  }

  const updatedUser = await updateUserByEmail(user.email, {
    kycStatus: 'Submitted',
    kycDetails: Object.fromEntries(requiredFields.map((field) => [field, String(data[field]).trim()])),
    kycDocuments: Object.fromEntries(requiredDocuments.map((field) => [field, data.documents[field]])),
  })

  return { kyc: getAgentKyc(updatedUser) }
}

export async function getAgentTickets(user) {
  return await findTicketsByEmail(user.email)
}

export async function createAgentTicket(user, data) {
  const subject = String(data.subject || '').trim()
  const message = String(data.message || '').trim()

  if (!subject || !message) {
    return { error: 'Subject and message are required.', status: 400 }
  }

  return {
    ticket: await createTicket({ email: user.email, subject, message, status: 'Open', createdAt: new Date().toISOString() }),
  }
}

export async function getAfterApprovalDashboard(user) {
  const customerList = await findCustomersByEmail(user.email)
  const visits = await findVisitsByEmail(user.email)
  const withdrawalList = await findWithdrawalsByEmail(user.email)
  const [referralRecords, teamRecords, ledgerRecords, bookings, dues, ranks, leads] = await Promise.all([
    listResource('referral-links'), listResource('full-tree'), listResource('account-ledger'), listResource('bookings'), listResource('installment-dues'), listResource('rank-levels'), listResource('leads'),
  ])
  const referrals = referralRecords.filter((record) => record.emailOwner === user.email || record.owner === user.email)
  const team = teamRecords.filter((record) => record.emailOwner === user.email || record.owner === user.email)
  const ledger = ledgerRecords.filter((record) => record.emailOwner === user.email || record.owner === user.email)
  const earnings = ledger.reduce((total, record) => total + Number(record.amount || 0), 0)
  const currentRank = ranks.find((rank) => rank.code === (user.rankCode || 'B.EX')) || ranks[0]
  const agentBookings = bookings.filter((booking) => booking.emailOwner === user.email || booking.owner === user.email)
  return {
    name: `${user.firstName} ${user.lastName}`.trim(),
    referralCode: user.referralCode || 'GK-1004',
    totalCustomers: customerList.length,
    siteVisits: visits.length,
    team: team.length,
    referrals: referrals.length,
    earnings,
    walletBalance: earnings - withdrawalList.reduce((total, withdrawal) => total + Number(withdrawal.amount || 0), 0),
    pendingWithdrawals: withdrawalList.length,
    rank: currentRank?.name || 'Business Executive',
    progress: Number(user.rankProgress || 0),
    nextRank: currentRank?.next || 'Senior Business Executive',
    rankNeeded: Number(currentRank?.needed || 75),
    bookings: agentBookings,
    upcomingEmis: dues.filter((due) => due.emailOwner === user.email || due.owner === user.email),
    recentCommissions: ledger,
    assignedLeads: leads.filter((lead) => lead.assignedAgentEmail === user.email),
    teamBreakdown: { level1: team.filter((member) => String(member.level) === '1').length, level2: team.filter((member) => String(member.level) === '2').length, level3: team.filter((member) => String(member.level) === '3').length },
  }
}

export async function getProjectsForAgent() { return getAgentProjects() }
export async function getCustomersForAgent(user) { return findCustomersByEmail(user.email) }
export async function addCustomerForAgent(user, data) {
  const name = String(data.name || '').trim()
  const phone = String(data.phone || '').trim()
  const email = String(data.email || '').trim().toLowerCase()
  if (!name || !phone || !email) return { error: 'Name, phone, and email are required.', status: 400 }
  return { customer: await createCustomer({ name, phone, email, emailOwner: user.email, addedBy: user.email, status: 'Active' }) }
}
export async function getWalletForAgent(user) {
  const [withdrawals, ledger] = await Promise.all([findWithdrawalsByEmail(user.email), listResource('account-ledger')])
  const records = ledger.filter((record) => record.emailOwner === user.email || record.owner === user.email)
  return { online: records.filter((record) => record.type === 'online').reduce((total, record) => total + Number(record.amount || 0), 0), cash: records.filter((record) => record.type === 'cash').reduce((total, record) => total + Number(record.amount || 0), 0), withdrawals, transactions: records }
}
export async function requestWithdrawalForAgent(user, data) {
  const amount = Number(data.amount)
  if (!Number.isFinite(amount) || amount < 5000) return { error: 'Minimum withdrawal amount is Rs. 5000.', status: 400 }
  return { withdrawal: await createWithdrawal({ emailOwner: user.email, type: data.type === 'cash' ? 'cash' : 'online', amount, status: 'Pending' }) }
}
export async function getCommissionsForAgent(user) {
  const records = (await listResource('account-ledger')).filter((record) => record.emailOwner === user.email || record.owner === user.email)
  return { online: records.filter((record) => record.type === 'online').reduce((total, record) => total + Number(record.amount || 0), 0), cash: records.filter((record) => record.type === 'cash').reduce((total, record) => total + Number(record.amount || 0), 0), records }
}
export async function getTeamForAgent(user) {
  const members = (await listResource('full-tree')).filter((record) => record.emailOwner === user.email || record.owner === user.email)
  return { total: members.length, active: members.filter((member) => member.status === 'Active').length, pendingKyc: members.filter((member) => member.kyc === 'Pending').length, members }
}
export async function getReferralsForAgent(user) {
  const members = (await listResource('referral-links')).filter((record) => record.emailOwner === user.email || record.owner === user.email)
  return { code: user.referralCode || 'GK-1004', total: members.length, active: members.filter((member) => member.status === 'Active').length, pendingKyc: members.filter((member) => member.kyc === 'Pending').length, members }
}
export async function getVisitsForAgent(user) { return findVisitsByEmail(user.email) }
export async function addVisitForAgent(user, data) {
  const customer = String(data.customer || '').trim()
  const project = String(data.project || '').trim()
  const date = String(data.date || '').trim()
  if (!customer || !project || !date) return { error: 'Customer, project, and date are required.', status: 400 }
  return { visit: await createVisit({ emailOwner: user.email, customer, project, date, notes: String(data.notes || '').trim(), status: 'Scheduled' }) }
}
export async function getRankForAgent(user) {
  const ranks = await listResource('rank-levels')
  const current = ranks.find((rank) => rank.code === (user.rankCode || 'B.EX')) || ranks[0]
  return { current: current?.name || 'Business Executive', code: current?.code || 'B.EX', progress: Number(user.rankProgress || 0), next: current?.next || 'Senior Business Executive', needed: Number(current?.needed || 75), levels: ranks, history: user.rankHistory || [] }
}

export async function getLeadsForAgent(user) {
  const leads = await listResource('leads')
  return leads.filter((lead) => lead.assignedAgentEmail === user.email)
}