export async function request(path, options = {}) {
  const token = localStorage.getItem('northstar_token') || sessionStorage.getItem('northstar_token')
  const apiBaseUrl = import.meta.env.VITE_AGENT_API_URL || 'http://localhost:5001/api'
  const isFormData = options.body instanceof FormData
  const response = await fetch(`${apiBaseUrl}${path}`, {
    headers: { ...(isFormData ? {} : { 'Content-Type': 'application/json' }), ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers },
    ...options,
  })
  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('northstar_token')
      localStorage.removeItem('northstar_user')
      sessionStorage.removeItem('northstar_token')
      sessionStorage.removeItem('northstar_user')
    }
    throw new Error(data.message || 'Something went wrong.')
  }

  return data
}
