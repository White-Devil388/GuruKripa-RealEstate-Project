import { request } from './apiClient'

export async function getProfile() {
  const response = await request('/profile')
  return response.profile
}

export async function updateProfile(profile) {
  const response = await request('/profile', {
    method: 'PATCH',
    body: JSON.stringify(profile),
  })
  return response
}

export async function updatePassword(passwords) {
  const response = await request('/profile/password', { method: 'PATCH', body: JSON.stringify(passwords) })
  return response
}