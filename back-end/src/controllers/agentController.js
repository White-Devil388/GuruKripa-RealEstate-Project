import { addCustomerForAgent, addVisitForAgent, createAgentTicket, getAfterApprovalDashboard, getAgentDashboard, getAgentKyc, getAgentTickets, getCommissionsForAgent, getCustomersForAgent, getLeadsForAgent, getProjectsForAgent, getRankForAgent, getReferralsForAgent, getTeamForAgent, getVisitsForAgent, getWalletForAgent, requestWithdrawalForAgent, submitAgentKyc } from '../services/api/agentService.js'
import { addLeadComment } from '../services/api/adminCrudService.js'

export async function dashboard(request, response) {
  return response.json({ dashboard: await getAgentDashboard(request.user) })
}

export async function readKyc(request, response) {
  return response.json({ kyc: getAgentKyc(request.user) })
}

export async function saveKyc(request, response) {
  const documents = Object.fromEntries(['aadhaarFront', 'aadhaarBack', 'panDocument', 'bankProof'].map((name) => {
    const file = request.files?.[name]?.[0]
    return [name, file ? { name: file.originalname, type: file.mimetype, url: `/uploads/kyc/${file.filename}` } : undefined]
  }))
  const result = await submitAgentKyc(request.user, { ...(request.body || {}), documents })

  if (result.error) return response.status(result.status).json({ message: result.error })

  return response.json({ kyc: result.kyc, message: 'KYC submitted successfully.' })
}

export async function listTickets(request, response) {
  return response.json({ tickets: await getAgentTickets(request.user) })
}

export async function addTicket(request, response) {
  const result = await createAgentTicket(request.user, request.body)

  if (result.error) return response.status(result.status).json({ message: result.error })

  return response.status(201).json({ ticket: result.ticket, message: 'Support ticket submitted successfully.' })
}

export async function afterDashboard(request, response) { return response.json({ dashboard: await getAfterApprovalDashboard(request.user) }) }
export async function assignedLeads(request, response) { return response.json({ leads: await getLeadsForAgent(request.user) }) }
export async function projects(request, response) { return response.json({ projects: await getProjectsForAgent() }) }
export async function customers(request, response) { return response.json({ customers: await getCustomersForAgent(request.user) }) }
export async function addCustomer(request, response) {
  const result = await addCustomerForAgent(request.user, { ...(request.params.id ? { id: request.params.id } : {}), ...request.body })
  if (result.error) return response.status(result.status).json({ message: result.error })
  return request.params.id ? response.json({ customer: result.customer, message: 'Customer updated successfully.' }) : response.status(201).json({ customer: result.customer, message: 'Customer added successfully.' })
}
import { deleteAgentCustomer, deleteSiteVisit } from '../models/agentDataModel.js'
export async function removeCustomer(request, response) {
  const result = await deleteAgentCustomer(request.params.id)
  return result ? response.json({ message: 'Customer deleted' }) : response.status(404).json({ message: 'Not found' })
}
export async function wallet(request, response) { return response.json({ wallet: await getWalletForAgent(request.user) }) }
export async function withdrawal(request, response) {
  const result = await requestWithdrawalForAgent(request.user, request.body)
  if (result.error) return response.status(result.status).json({ message: result.error })
  return response.status(201).json({ withdrawal: result.withdrawal, message: 'Withdrawal request submitted.' })
}
export async function commissions(request, response) { return response.json({ commissions: await getCommissionsForAgent(request.user) }) }
export async function team(request, response) { return response.json({ team: await getTeamForAgent(request.user) }) }
export async function referrals(request, response) { return response.json({ referrals: await getReferralsForAgent(request.user) }) }
export async function visits(request, response) { return response.json({ visits: await getVisitsForAgent(request.user) }) }
export async function addSiteVisit(request, response) {
  const result = await addVisitForAgent(request.user, { ...(request.params.id ? { id: request.params.id } : {}), ...request.body })
  if (result.error) return response.status(result.status).json({ message: result.error })
  return request.params.id ? response.json({ visit: result.visit, message: 'Site visit updated successfully.' }) : response.status(201).json({ visit: result.visit, message: 'Site visit scheduled successfully.' })
}
export async function removeVisit(request, response) {
  const result = await deleteSiteVisit(request.params.id)
  return result ? response.json({ message: 'Site visit deleted' }) : response.status(404).json({ message: 'Not found' })
}
export async function rank(request, response) { return response.json({ rank: await getRankForAgent(request.user) }) }

export async function addAgentComment(request, response) {
  const { text } = request.body
  if (!text) return response.status(400).json({ message: 'Comment text is required.' })

  const author = `${request.user.firstName} ${request.user.lastName}`.trim() || request.user.email
  
  // Security check: Only allow if lead is actually assigned to them!
  const leads = await getLeadsForAgent(request.user)
  if (!leads.find(l => l.id === request.params.id)) {
    return response.status(403).json({ message: 'You can only comment on leads assigned to you.' })
  }

  const item = await addLeadComment(request.params.id, { text, author, role: 'Agent' })
  return item ? response.json({ data: item, message: 'Comment added successfully.' }) : response.status(404).json({ message: 'Lead not found.' })
}