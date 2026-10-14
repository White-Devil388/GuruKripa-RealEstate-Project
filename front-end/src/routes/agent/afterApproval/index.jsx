import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import AppShell from '../../../components/AppShell'
import { getAgentDashboard } from '../../../services/api'
import {
  afterApprovalDefaultRoute,
  afterApprovalLogout,
  afterApprovalRouteMap,
  afterApprovalSections,
} from '../../../Agent/AfterApproval/afterApprovalMenu'
import DashboardAfterPage from '../../../Agent/AfterApproval/pages/DashboardPage'
import ProjectsAfterPage from '../../../Agent/AfterApproval/pages/ProjectsPage'
import MyCustomersPage from '../../../Agent/AfterApproval/pages/MyCustomersPage'
import SiteVisitPage from '../../../Agent/AfterApproval/pages/SiteVisitPage'
import ReferralsPage from '../../../Agent/AfterApproval/pages/ReferralsPage'
import MyTeamPage from '../../../Agent/AfterApproval/pages/MyTeamPage'
import CommissionsPage from '../../../Agent/AfterApproval/pages/CommissionsPage'
import MyWalletPage from '../../../Agent/AfterApproval/pages/MyWalletPage'
import MyRankPage from '../../../Agent/AfterApproval/pages/MyRankPage'
import MyProfileAfterPage from '../../../Agent/AfterApproval/pages/MyProfilePage'
import KycAfterPage from '../../../Agent/AfterApproval/pages/KycPage'
import SupportAfterPage from '../../../Agent/AfterApproval/pages/SupportPage'
import LogoutAfterPage from '../../../Agent/AfterApproval/pages/LogoutPage'
import CRMPage from '../../../Admin/pages/CRMPage'

// eslint-disable-next-line react-refresh/only-export-components
function ApprovedAgentShell() {
  const [access, setAccess] = useState('checking')

  useEffect(() => {
    getAgentDashboard()
      .then((dashboard) => setAccess(dashboard.kycStatus === 'Approved' ? 'approved' : 'blocked'))
      .catch(() => setAccess('blocked'))
  }, [])

  if (access === 'checking') return <div className="app-loading">Checking KYC approval...</div>
  if (access === 'blocked') return <Navigate to="/agent-before-approval/dashboard" replace />

  return (
    <AppShell
      brand="Agent Panel"
      sections={afterApprovalSections}
      routes={afterApprovalRoutes}
      defaultRoute={afterApprovalDefaultRoute}
      logout={afterApprovalLogout}
    />
  )
}

const afterApprovalPageMap = {
  dashboard: DashboardAfterPage,
  crm: () => <CRMPage hideAgents agentMode />,
  projects: ProjectsAfterPage,
  'my-customers': MyCustomersPage,
  'site-visit': SiteVisitPage,
  referrals: ReferralsPage,
  'my-team': MyTeamPage,
  commissions: CommissionsPage,
  'my-wallet': MyWalletPage,
  'my-rank': MyRankPage,
  'my-profile': MyProfileAfterPage,
  kyc: KycAfterPage,
  support: SupportAfterPage,
  logout: LogoutAfterPage,
}

export const afterApprovalRoutes = afterApprovalRouteMap.map(({ path, label, to }) => {
  const Component = afterApprovalPageMap[path]

  return {
    path,
    to,
    label,
    element: <Component />,
  }
})

export const afterApprovalShell = <ApprovedAgentShell />

export default afterApprovalRoutes
