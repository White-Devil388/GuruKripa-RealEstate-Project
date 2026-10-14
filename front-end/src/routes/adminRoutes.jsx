import React, { Suspense } from 'react'
import AppShell from '../components/AppShell'
import { adminDefaultRoute, adminLogout, adminRouteMap, adminSections } from '../Admin/adminMenu'

const DashboardPage = React.lazy(() => import('../Admin/pages/DashboardPage'))
const KycVerificationPage = React.lazy(() => import('../Admin/pages/KycVerificationPage'))
const ExecutivesPage = React.lazy(() => import('../Admin/pages/ExecutivesPage'))
const ReferralLinksPage = React.lazy(() => import('../Admin/pages/ReferralLinksPage'))
const SubadminPage = React.lazy(() => import('../Admin/pages/SubadminPage'))
const ProjectsPage = React.lazy(() => import('../Admin/pages/ProjectsPage'))
const CustomersPage = React.lazy(() => import('../Admin/pages/CustomersPage'))
const CRMPage = React.lazy(() => import('../Admin/pages/CRMPage'))
const LeadEnginePage = React.lazy(() => import('../Admin/pages/LeadEnginePage'))
const BookingPage = React.lazy(() => import('../Admin/pages/BookingPage'))
const SiteVisitsPage = React.lazy(() => import('../Admin/pages/SiteVisitsPage'))
const InstallmentSchedulesPage = React.lazy(() => import('../Admin/pages/InstallmentSchedulesPage'))
const InstallmentDuesPage = React.lazy(() => import('../Admin/pages/InstallmentDuesPage'))
const EditRequestPage = React.lazy(() => import('../Admin/pages/EditRequestPage'))
const InstallmentsEmiPage = React.lazy(() => import('../Admin/pages/InstallmentsEmiPage'))
const ReportsPage = React.lazy(() => import('../Admin/pages/ReportsPage'))
const WithdrawalsPage = React.lazy(() => import('../Admin/pages/WithdrawalsPage'))
const RankLevelsPage = React.lazy(() => import('../Admin/pages/RankLevelsPage'))
const FullTreePage = React.lazy(() => import('../Admin/pages/FullTreePage'))
const BankManagementPage = React.lazy(() => import('../Admin/pages/BankManagementPage'))
const RankingRulesPage = React.lazy(() => import('../Admin/pages/RankingRulesPage'))
const AccountLedgerPage = React.lazy(() => import('../Admin/pages/AccountLedgerPage'))
const FinanceAndTdsPage = React.lazy(() => import('../Admin/pages/FinanceAndTdsPage'))
const SystemSettingsPage = React.lazy(() => import('../Admin/pages/SystemSettingsPage'))
const AuditLogsPage = React.lazy(() => import('../Admin/pages/AuditLogsPage'))
const SupportTicketPage = React.lazy(() => import('../Admin/pages/SupportTicketPage'))
const MyProfilePage = React.lazy(() => import('../Admin/pages/MyProfilePage'))
const LogoutPage = React.lazy(() => import('../Admin/pages/LogoutPage'))
const DynamicAdminResourcePage = React.lazy(() => import('../components/DynamicAdminResourcePage'))
const AdminDashboardPage = React.lazy(() => import('../pages/AdminDashboardPage'))

const adminPageMap = {
  dashboard: DashboardPage,
  'kyc-verification': KycVerificationPage,
  executives: ExecutivesPage,
  'referral-links': ReferralLinksPage,
  subadmin: SubadminPage,
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

const dynamicResources = {
  booking: 'bookings',
  'installment-schedules': 'payment-plans',
  'installment-dues': 'installment-dues',
  'edit-request': 'edit-requests',
  'installments-emi': 'installments-emi',
  reports: 'reports',
  'rank-levels': 'rank-levels',
  'full-tree': 'full-tree',
  'referral-links': 'referral-links',
  subadmin: 'subadmins',
  'audit-logs': 'audit-logs',
  'account-ledger': 'account-ledger',
  'finance-and-tds': 'finance-tds',
  'lead-engine': 'leads',
}

export const adminRoutes = adminRouteMap.map(({ path, label, to }) => {
  const Component = dynamicResources[path] ? () => <DynamicAdminResourcePage resource={dynamicResources[path]} /> : adminPageMap[path]

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
