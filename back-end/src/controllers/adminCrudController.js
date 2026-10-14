import { assignLead, createResource, deleteResource, listResource, updateResource, addLeadComment } from '../services/api/adminCrudService.js'
import { findUserByEmail } from '../models/userModel.js'

async function collectionOrNotFound(resource, response) {
  const collection = await listResource(resource)
  if (!collection) response.status(404).json({ message: 'Unknown admin resource.' })
  return collection
}

export async function list(request, response) {
  const collection = await collectionOrNotFound(request.params.resource, response)
  return collection ? response.json({ data: collection }) : undefined
}

export async function create(request, response) {
  if (!await collectionOrNotFound(request.params.resource, response)) return undefined
  return response.status(201).json({ data: await createResource(request.params.resource, request.body), message: 'Resource created successfully.' })
}

export async function update(request, response) {
  if (!await collectionOrNotFound(request.params.resource, response)) return undefined
  const item = await updateResource(request.params.resource, request.params.id, request.body)
  return item ? response.json({ data: item, message: 'Resource updated successfully.' }) : response.status(404).json({ message: 'Resource item not found.' })
}

export async function remove(request, response) {
  if (!await collectionOrNotFound(request.params.resource, response)) return undefined
  return await deleteResource(request.params.resource, request.params.id) ? response.json({ message: 'Resource deleted successfully.' }) : response.status(404).json({ message: 'Resource item not found.' })
}

export async function assign(request, response) {
  const { assignedRole, assignedAgentEmail } = request.body
  if (!assignedRole || !assignedAgentEmail) return response.status(400).json({ message: 'Role and agent are required.' })

  const agent = await findUserByEmail(assignedAgentEmail)
  if (!agent || agent.role !== assignedRole) return response.status(400).json({ message: 'Selected agent does not match the selected role.' })

  const item = await assignLead(request.params.id, { assignedRole, assignedAgentEmail, assignedAt: new Date().toISOString() })
  return item ? response.json({ data: item, message: 'Lead assigned successfully.' }) : response.status(404).json({ message: 'Lead not found.' })
}

export async function addComment(request, response) {
  const { text } = request.body
  if (!text) return response.status(400).json({ message: 'Comment text is required.' })
  
  const author = 'Admin' // In real app, extract from user session
  
  const item = await addLeadComment(request.params.id, { text, author, role: 'Admin' })
  return item ? response.json({ data: item, message: 'Comment added successfully.' }) : response.status(404).json({ message: 'Lead not found.' })
}