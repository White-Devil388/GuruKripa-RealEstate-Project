import AppShell from '../../../components/AppShell'
import {
  beforeApprovalDefaultRoute,
  beforeApprovalLogout,
  beforeApprovalRouteMap,
  beforeApprovalSections,
} from '../../../Agent/BeforeApproval/beforeApprovalMenu'
import DashboardBeforePage from '../../../Agent/BeforeApproval/pages/DashboardPage'
import MyProfileBeforePage from '../../../Agent/BeforeApproval/pages/MyProfilePage'
import KycBeforePage from '../../../Agent/BeforeApproval/pages/KycPage'
import SupportBeforePage from '../../../Agent/BeforeApproval/pages/SupportPage'
import LogoutBeforePage from '../../../Agent/BeforeApproval/pages/LogoutPage'

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
    element: <Component />,
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
