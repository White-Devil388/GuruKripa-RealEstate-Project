import { request } from './apiClient'

export async function getAdminOperations() {
  const response = await request('/admin/operations')
  return response.data
}

export async function updateAdminWithdrawal(id, status) {
  return request(`/admin/withdrawals/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) })
}

export async function updateAdminKyc(email, status) {
  return request(`/admin/kyc/${encodeURIComponent(email)}`, { method: 'PATCH', body: JSON.stringify({ status }) })
}

export async function updateAgentCommission(email, commissionDetails) {
  return request(`/admin/executives/${encodeURIComponent(email)}/commission`, { method: 'PATCH', body: JSON.stringify({ commissionDetails }) })
}

export async function createAdminTicket(ticketData) {
  return request('/admin/operations/tickets', { method: 'POST', body: JSON.stringify(ticketData) })
}

export async function updateAdminTicket(id, ticketData) {
  return request(`/admin/operations/tickets/${id}`, { method: 'PATCH', body: JSON.stringify(ticketData) })
}

export async function removeAdminTicket(id) {
  return request(`/admin/operations/tickets/${id}`, { method: 'DELETE' })
}