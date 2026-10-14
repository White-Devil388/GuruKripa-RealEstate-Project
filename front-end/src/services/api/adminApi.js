import { request } from './apiClient'

export async function getAdminDashboard() {
  const response = await request('/admin/dashboard')
  return response.data
}

export async function getAdminProjects() {
  const response = await request('/admin/projects')
  return response.data
}

export async function getAdminCustomers() {
  const response = await request('/admin/customers')
  return response.data
}

export async function getAdminExecutives() {
  const response = await request('/admin/executives')
  return response.data
}

export async function getAdminRoles() {
  const response = await request('/admin/roles')
  return response.data
}

export async function getAdminLeads() {
  const response = await request('/admin/resources/leads')
  return response.data
}

export async function assignAdminLead(id, assignment) {
  const response = await request(`/admin/resources/leads/${id}/assign`, { method: 'PATCH', body: JSON.stringify(assignment) })
  return response.data
}

export async function addAdminLeadComment(id, text) {
  const response = await request(`/admin/resources/leads/${id}/comments`, { method: 'POST', body: JSON.stringify({ text }) })
  return response.data
}

export async function saveAdminProject(id, project) {
  const response = await request(`/admin/projects${id ? `/${id}` : ''}`, { method: id ? 'PATCH' : 'POST', body: JSON.stringify(project) })
  return response.data
}
export async function deleteAdminProject(id) {
  return request(`/admin/projects/${id}`, { method: 'DELETE' })
}

export async function saveAdminCustomer(id, customer) {
  const response = await request(`/admin/customers${id ? `/${id}` : ''}`, { method: id ? 'PATCH' : 'POST', body: JSON.stringify(customer) })
  return response.data
}
export async function deleteAdminCustomer(id) {
  return request(`/admin/customers/${id}`, { method: 'DELETE' })
}

export async function saveAdminExecutive(email, executive) {
  const method = email ? 'PATCH' : 'POST'
  const url = email ? `/admin/executives/${encodeURIComponent(email)}` : `/admin/executives`
  const response = await request(url, { method, body: JSON.stringify(executive) })
  return response.data
}
export async function deleteAdminExecutive(email) {
  return request(`/admin/executives/${encodeURIComponent(email)}`, { method: 'DELETE' })
}