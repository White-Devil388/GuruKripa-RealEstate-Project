import { getAllCustomers, getAllTickets, getAllVisits, getAllWithdrawals, updateWithdrawal, upsertAgentTicket, deleteAgentTicket } from '../../models/agentDataModel.js'
import { getAllUsers, updateUserByEmail } from '../../models/userModel.js'
import { listResource } from './adminCrudService.js'

export async function getOperations() {
  const [users, visits, withdrawals, tickets, customers] = await Promise.all([
    getAllUsers(),
    getAllVisits(),
    getAllWithdrawals(),
    getAllTickets(),
    getAllCustomers(),
  ])
  return {
    bookings: await listResource('bookings'),
    leads: await listResource('leads'),
    visits,
    withdrawals,
    tickets,
    customers,
    kyc: users.filter((user) => user.role?.toLowerCase() === 'agent' && ['Submitted', 'Approved', 'Rejected'].includes(user.kycStatus)).map((user) => ({
      email: user.email,
      name: `${user.firstName} ${user.lastName}`.trim(),
      phone: user.phone || '',
      aadhaar: user.kycDetails?.aadhaar || '',
      pan: user.kycDetails?.pan || '',
      accountNumber: user.kycDetails?.accountNumber || '',
      ifsc: user.kycDetails?.ifsc || '',
      bankName: user.kycDetails?.bankName || '',
      documents: user.kycDocuments || {},
      submittedAt: user.updatedAt || user.createdAt || '',
      status: user.kycStatus,
    })),
  }
}

export async function updateKycStatus(email, status) {
  if (!['Approved', 'Rejected'].includes(status)) return undefined
  return updateUserByEmail(email, { kycStatus: status })
}

export async function updateWithdrawalStatus(id, status) {
  return updateWithdrawal(id, { status })
}

export async function updateAgentCommission(email, commissionDetails) {
  return updateUserByEmail(email, { customCommission: commissionDetails })
}

export async function addAdminTicket(ticketData) {
  const id = `ticket-${Math.floor(1000 + Math.random() * 9000)}`;
  return upsertAgentTicket(id, { ...ticketData, id, status: 'Open' });
}

export async function editAdminTicket(id, ticketData) {
  return upsertAgentTicket(id, { ...ticketData, id });
}

export async function removeAdminTicket(id) {
  return deleteAgentTicket(id);
}