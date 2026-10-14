import { useEffect } from 'react'
import LoginDashboard from './LoginDashboard'

function AdminLoginDashboard() {
  useEffect(() => {
    localStorage.removeItem('northstar_token')
    localStorage.removeItem('northstar_user')
    sessionStorage.removeItem('northstar_token')
    sessionStorage.removeItem('northstar_user')
  }, [])

  return <LoginDashboard accountType="Admin" adminMode />
}

export default AdminLoginDashboard