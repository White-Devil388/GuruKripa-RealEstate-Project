import { request } from './apiClient'

export function getApiHealth() {
  return request('/health')
}
