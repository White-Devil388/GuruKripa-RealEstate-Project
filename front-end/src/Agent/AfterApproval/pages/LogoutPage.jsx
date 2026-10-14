import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PlaceholderPage from '../../../components/PlaceholderPage'

function LogoutPage() {
  const navigate = useNavigate()

  useEffect(() => {
    localStorage.clear()
    sessionStorage.clear()
    navigate('/', { replace: true })
  }, [navigate])

  return <PlaceholderPage title="Logging out..." />
}

export default LogoutPage
