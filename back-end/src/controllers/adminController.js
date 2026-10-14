import { customerData, dashboardData, executiveData, projectData } from '../services/api/adminService.js'
import { upsertProject, deleteProject, upsertAgentCustomer, deleteAgentCustomer } from '../models/agentDataModel.js'
import { updateUserByEmail, userExists } from '../models/userModel.js'

export async function dashboard(request, response) { return response.json({ data: await dashboardData() }) }
export async function projects(request, response) { return response.json({ data: await projectData() }) }
export async function customers(request, response) { return response.json({ data: await customerData() }) }
export async function executives(request, response) { return response.json({ data: await executiveData() }) }

export async function saveProject(request, response) {
  const id = request.params.id || request.body.id || `PRJ-${Date.now()}`
  return response.json({ data: await upsertProject(id, request.body), message: 'Project saved successfully' })
}

export async function removeProject(request, response) {
  const result = await deleteProject(request.params.id)
  return result ? response.json({ message: 'Project deleted' }) : response.status(404).json({ message: 'Not found' })
}

export async function saveCustomer(request, response) {
  const id = request.params.id || request.body.id || `CUS-${Date.now()}`
  return response.json({ data: await upsertAgentCustomer(id, request.body), message: 'Customer saved successfully' })
}

export async function removeCustomer(request, response) {
  const result = await deleteAgentCustomer(request.params.id)
  return result ? response.json({ message: 'Customer deleted' }) : response.status(404).json({ message: 'Not found' })
}

export async function saveExecutive(request, response) {
  const email = request.params.email
  if (!email || !(await userExists(email))) return response.status(404).json({ message: 'Executive not found' })
  const result = await updateUserByEmail(email, request.body)
  return response.json({ data: result, message: 'Executive updated successfully' })
}

import mongoose from 'mongoose'
export async function removeExecutive(request, response) {
  const email = request.params.email
  const result = await mongoose.model('User').deleteOne({ email: String(email).toLowerCase() })
  return result.deletedCount > 0 ? response.json({ message: 'Executive deleted' }) : response.status(404).json({ message: 'Not found' })
}

export async function addExecutive(request, response) {
  const { email, password, firstName, lastName, phone, role } = request.body
  if (!email || !password) return response.status(400).json({ message: 'Email and password required' })
  if (await userExists(email)) return response.status(400).json({ message: 'User already exists' })
  const result = await mongoose.model('User').create({ email: String(email).toLowerCase(), password, firstName, lastName, phone, role: role || 'Agent', status: 'Active' })
  return response.status(201).json({ data: result, message: 'Executive created' })
}