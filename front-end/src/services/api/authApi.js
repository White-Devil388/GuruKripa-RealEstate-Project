import { request } from './apiClient'

export function loginUser(payload) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function getSessionData(key) {
  return localStorage.getItem(key) || sessionStorage.getItem(key)
}

export function clearSession() {
  localStorage.removeItem('northstar_token')
  localStorage.removeItem('northstar_user')
  sessionStorage.removeItem('northstar_token')
  sessionStorage.removeItem('northstar_user')
}

export function saveSession(result, remember = true) {
  clearSession()
  const storage = remember ? localStorage : sessionStorage
  if (result.token) storage.setItem('northstar_token', result.token)
  if (result.user) storage.setItem('northstar_user', JSON.stringify(result.user))
  return result
}

export function signupUser(payload) {
  return request('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
