import { getOperations, updateKycStatus, updateWithdrawalStatus, updateAgentCommission, addAdminTicket, editAdminTicket, removeAdminTicket } from '../services/api/adminOperationsService.js'

export async function operations(request, response) { return response.json({ data: await getOperations() }) }

export async function setWithdrawalStatus(request, response) {
  const result = await updateWithdrawalStatus(request.params.id, request.body.status)
  if (!result) return response.status(404).json({ message: 'Withdrawal request not found.' })
  return response.json({ withdrawal: result, message: 'Withdrawal status updated.' })
}

export async function setKycStatus(request, response) {
  const result = await updateKycStatus(request.params.email, request.body.status)
  if (!result) return response.status(404).json({ message: 'KYC application not found.' })
  return response.json({ user: result, message: `KYC ${request.body.status.toLowerCase()} successfully.` })
}

export async function setAgentCommission(request, response) {
  const result = await updateAgentCommission(request.params.email, request.body.commissionDetails)
  if (!result) return response.status(404).json({ message: 'Agent not found.' })
  return response.json({ user: result, message: 'Commission updated successfully.' })
}

export async function generateTicket(request, response) {
  const result = await addAdminTicket(request.body)
  return response.json({ ticket: result, message: 'Ticket created.' })
}

export async function updateTicket(request, response) {
  const result = await editAdminTicket(request.params.id, request.body)
  return response.json({ ticket: result, message: 'Ticket updated.' })
}

export async function removeTicket(request, response) {
  await removeAdminTicket(request.params.id)
  return response.json({ message: 'Ticket deleted.' })
}