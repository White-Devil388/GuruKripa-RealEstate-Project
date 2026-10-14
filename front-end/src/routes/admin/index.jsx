import AppShell from '../../components/AppShell'
import { adminDefaultRoute, adminLogout, adminRouteMap, adminSections } from '../../Admin/adminMenu'
import DashboardPage from '../../Admin/pages/DashboardPage'
import KycVerificationPage from '../../Admin/pages/KycVerificationPage'
import ExecutivesPage from '../../Admin/pages/ExecutivesPage'
import AgentCommissionsPage from '../../Admin/pages/AgentCommissionsPage'
import ReferralLinksPage from '../../Admin/pages/ReferralLinksPage'
import ProjectsPage from '../../Admin/pages/ProjectsPage'
import CustomersPage from '../../Admin/pages/CustomersPage'
import CRMPage from '../../Admin/pages/CRMPage'
import LeadEnginePage from '../../Admin/pages/LeadEnginePage'
import BookingPage from '../../Admin/pages/BookingPage'
import SiteVisitsPage from '../../Admin/pages/SiteVisitsPage'
import InstallmentSchedulesPage from '../../Admin/pages/InstallmentSchedulesPage'
import InstallmentDuesPage from '../../Admin/pages/InstallmentDuesPage'
import EditRequestPage from '../../Admin/pages/EditRequestPage'
import InstallmentsEmiPage from '../../Admin/pages/InstallmentsEmiPage'
import ReportsPage from '../../Admin/pages/ReportsPage'
import WithdrawalsPage from '../../Admin/pages/WithdrawalsPage'
import RankLevelsPage from '../../Admin/pages/RankLevelsPage'
import FullTreePage from '../../Admin/pages/FullTreePage'
import BankManagementPage from '../../Admin/pages/BankManagementPage'
import RankingRulesPage from '../../Admin/pages/RankingRulesPage'
import AccountLedgerPage from '../../Admin/pages/AccountLedgerPage'
import FinanceAndTdsPage from '../../Admin/pages/FinanceAndTdsPage'
import SystemSettingsPage from '../../Admin/pages/SystemSettingsPage'
import AuditLogsPage from '../../Admin/pages/AuditLogsPage'
import SupportTicketPage from '../../Admin/pages/SupportTicketPage'
import MyProfilePage from '../../Admin/pages/MyProfilePage'
import LogoutPage from '../../Admin/pages/LogoutPage'
import DynamicAdminResourcePage from '../../components/DynamicAdminResourcePage'
import AdminDashboardPage from '../../pages/AdminDashboardPage'

const adminPageMap = {
  dashboard: DashboardPage,
  'kyc-verification': KycVerificationPage,
  executives: ExecutivesPage,
  'agent-commissions': AgentCommissionsPage,
  'referral-links': ReferralLinksPage,
  subadmin: () => <DynamicAdminResourcePage resource="subadmins" />,
  projects: ProjectsPage,
  customers: CustomersPage,
  crm: CRMPage,
  'lead-engine': LeadEnginePage,
  'website-cms': () => <AdminDashboardPage initialTab="overview" isEmbedded />,
  'website-blogs': () => <AdminDashboardPage initialTab="insights" isEmbedded />,
  'website-media': () => <AdminDashboardPage initialTab="media" isEmbedded />,
  'website-testimonials': () => <AdminDashboardPage initialTab="testimonials" isEmbedded />,
  'website-settings': () => <AdminDashboardPage initialTab="settings" isEmbedded />,
  booking: BookingPage,
  'site-visits': SiteVisitsPage,
  'installment-schedules': InstallmentSchedulesPage,
  'installment-dues': InstallmentDuesPage,
  'edit-request': EditRequestPage,
  'installments-emi': InstallmentsEmiPage,
  reports: ReportsPage,
  withdrawals: WithdrawalsPage,
  'rank-levels': RankLevelsPage,
  'full-tree': FullTreePage,
  'bank-management': BankManagementPage,
  'ranking-rules': RankingRulesPage,
  'account-ledger': AccountLedgerPage,
  'finance-and-tds': FinanceAndTdsPage,
  'system-settings': SystemSettingsPage,
  'audit-logs': AuditLogsPage,
  'support-ticket': SupportTicketPage,
  'my-profile': MyProfilePage,
  logout: LogoutPage,
}

export const adminRoutes = adminRouteMap.map(({ path, label, to }) => {
  const Component = adminPageMap[path]

  return {
    path,
    to,
    label,
    element: <Component />,
  }
})

export const adminShell = (
  <AppShell
    brand="Admin Panel"
    sections={adminSections}
    routes={adminRoutes}
    defaultRoute={adminDefaultRoute}
    logout={adminLogout}
  />
)

export default adminRoutes
