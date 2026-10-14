import React, { Suspense } from 'react'
import AppShell from '../components/AppShell'
import {
  beforeApprovalDefaultRoute,
  beforeApprovalLogout,
  beforeApprovalRouteMap,
  beforeApprovalSections,
} from '../Agent/BeforeApproval/beforeApprovalMenu'

const DashboardBeforePage = React.lazy(() => import('../Agent/BeforeApproval/pages/DashboardPage'))
const MyProfileBeforePage = React.lazy(() => import('../Agent/BeforeApproval/pages/MyProfilePage'))
const KycBeforePage = React.lazy(() => import('../Agent/BeforeApproval/pages/KycPage'))
const SupportBeforePage = React.lazy(() => import('../Agent/BeforeApproval/pages/SupportPage'))
const LogoutBeforePage = React.lazy(() => import('../Agent/BeforeApproval/pages/LogoutPage'))

const beforeApprovalPageMap = {
  dashboard: DashboardBeforePage,
  'my-profile': MyProfileBeforePage,
  kyc: KycBeforePage,
  support: SupportBeforePage,
  logout: LogoutBeforePage,
}

export const beforeApprovalRoutes = beforeApprovalRouteMap.map(({ path, label, to }) => {
  const Component = beforeApprovalPageMap[path]

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

export const beforeApprovalShell = (
  <AppShell
    brand="Agent Panel"
    sections={beforeApprovalSections}
    routes={beforeApprovalRoutes}
    defaultRoute={beforeApprovalDefaultRoute}
    logout={beforeApprovalLogout}
  />
)

export default beforeApprovalRoutes
