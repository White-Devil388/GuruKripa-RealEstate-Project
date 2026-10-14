import { request } from './apiClient'

export async function getAgentDashboard() {
  const response = await request('/agent/dashboard')
  return response.dashboard
}

export async function getAgentKyc() {
  const response = await request('/agent/kyc')
  return response.kyc
}

export async function submitAgentKyc(payload) {
  return request('/agent/kyc', { method: 'POST', body: payload })
}

export async function getAgentTickets() {
  const response = await request('/agent/support/tickets')
  return response.tickets
}

export async function createAgentTicket(payload) {
  return request('/agent/support/tickets', { method: 'POST', body: JSON.stringify(payload) })
}

export async function getAfterApprovalDashboard() { return (await request('/agent/after-dashboard')).dashboard }
export async function getAgentLeads() { return (await request('/agent/leads')).leads }
export async function getAgentProjects() { return (await request('/agent/projects')).projects }
export async function getAgentCustomers() { return (await request('/agent/customers')).customers }
export async function saveAgentCustomer(id, payload) {
  return request(`/agent/customers${id ? `/${id}` : ''}`, { method: id ? 'PATCH' : 'POST', body: JSON.stringify(payload) })
}
export async function deleteAgentCustomer(id) {
  return request(`/agent/customers/${id}`, { method: 'DELETE' })
}
export async function getAgentWallet() { return (await request('/agent/wallet')).wallet }
export async function requestAgentWithdrawal(payload) { return request('/agent/wallet/withdrawals', { method: 'POST', body: JSON.stringify(payload) }) }
export async function getAgentCommissions() { return (await request('/agent/commissions')).commissions }
export async function getAgentTeam() { return (await request('/agent/team')).team }
export async function getAgentReferrals() { return (await request('/agent/referrals')).referrals }
export async function getAgentVisits() { return (await request('/agent/visits')).visits }
export async function saveAgentVisit(id, payload) {
  return request(`/agent/visits${id ? `/${id}` : ''}`, { method: id ? 'PATCH' : 'POST', body: JSON.stringify(payload) })
}
export async function deleteAgentVisit(id) {
  return request(`/agent/visits/${id}`, { method: 'DELETE' })
}
export async function getAgentRank() { return (await request('/agent/rank')).rank }
export async function addAgentLeadComment(id, text) { return (await request(`/agent/leads/${id}/comments`, { method: 'POST', body: JSON.stringify({ text }) })).data }