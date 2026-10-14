import { request } from './apiClient'

export async function listAdminResource(resource) { return (await request(`/admin/resources/${resource}`)).data }
export async function createAdminResource(resource, payload) { return (await request(`/admin/resources/${resource}`, { method: 'POST', body: JSON.stringify(payload) })).data }
export async function updateAdminResource(resource, id, payload) { return (await request(`/admin/resources/${resource}/${id}`, { method: 'PATCH', body: JSON.stringify(payload) })).data }
export async function deleteAdminResource(resource, id) { return request(`/admin/resources/${resource}/${id}`, { method: 'DELETE' }) }