import React, { Suspense } from 'react'
import AppShell from '../components/AppShell'
import {
  afterApprovalDefaultRoute,
  afterApprovalLogout,
  afterApprovalRouteMap,
  afterApprovalSections,
} from '../Agent/AfterApproval/afterApprovalMenu'

const DashboardAfterPage = React.lazy(() => import('../Agent/AfterApproval/pages/DashboardPage'))
const ProjectsAfterPage = React.lazy(() => import('../Agent/AfterApproval/pages/ProjectsPage'))
const MyCustomersPage = React.lazy(() => import('../Agent/AfterApproval/pages/MyCustomersPage'))
const SiteVisitPage = React.lazy(() => import('../Agent/AfterApproval/pages/SiteVisitPage'))
const ReferralsPage = React.lazy(() => import('../Agent/AfterApproval/pages/ReferralsPage'))
const MyTeamPage = React.lazy(() => import('../Agent/AfterApproval/pages/MyTeamPage'))
const CommissionsPage = React.lazy(() => import('../Agent/AfterApproval/pages/CommissionsPage'))
const MyWalletPage = React.lazy(() => import('../Agent/AfterApproval/pages/MyWalletPage'))
const MyRankPage = React.lazy(() => import('../Agent/AfterApproval/pages/MyRankPage'))
const MyProfileAfterPage = React.lazy(() => import('../Agent/AfterApproval/pages/MyProfilePage'))
const KycAfterPage = React.lazy(() => import('../Agent/AfterApproval/pages/KycPage'))
const SupportAfterPage = React.lazy(() => import('../Agent/AfterApproval/pages/SupportPage'))
const LogoutAfterPage = React.lazy(() => import('../Agent/AfterApproval/pages/LogoutPage'))
const CRMPage = React.lazy(() => import('../Admin/pages/CRMPage'))

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
    element: (
      <Suspense fallback={<div className="page-loader" style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>}>
        <Component />
      </Suspense>
    ),
  }
})

export const afterApprovalShell = (
  <AppShell
    brand="Agent Panel"
    sections={afterApprovalSections}
    routes={afterApprovalRoutes}
    defaultRoute={afterApprovalDefaultRoute}
    logout={afterApprovalLogout}
  />
)

export default afterApprovalRoutes
