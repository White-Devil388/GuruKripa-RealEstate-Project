export const adminMenu = [
  {
    title: 'User Management',
    items: [
      { label: 'Dashboard', path: 'dashboard' },
      { label: 'KYC Verification', path: 'kyc-verification' },
      { label: 'Executives', path: 'executives' },
      { label: 'Agent Commissions', path: 'agent-commissions' },
      { label: 'Referral Links', path: 'referral-links' },
      { label: 'Sub Admin', path: 'subadmin' },
    ],
  },
  {
    title: 'Inventory Management',
    items: [
      { label: 'Projects', path: 'projects' },
      { label: 'Customers', path: 'customers' },
      { label: 'CRM', path: 'crm' },
      { label: 'Lead Engine', path: 'lead-engine' },
    ],
  },
  {
    title: 'Website CMS',
    items: [
      { label: 'Website CMS Hub', path: 'website-cms' },
      { label: 'Manage Blogs', path: 'website-blogs' },
      { label: 'Manage Media', path: 'website-media' },
      { label: 'Testimonials & About', path: 'website-testimonials' },
      { label: 'Website Settings', path: 'website-settings' },
    ],
  },
  {
    title: 'Sales and Finance',
    items: [
      { label: 'Booking', path: 'booking' },
      { label: 'Site Visits', path: 'site-visits' },
      { label: 'Installment Schedules', path: 'installment-schedules' },
      { label: 'Installment Dues', path: 'installment-dues' },
      { label: 'Edit Request', path: 'edit-request' },
      { label: 'Installments (EMI)', path: 'installments-emi' },
    ],
  },
  {
    title: 'Finance',
    items: [
      {
        label: 'Reports',
        path: 'reports',
        children: [
          { label: 'Overview', path: 'reports' },
          { label: 'Date Range Report', path: 'reports/date-range' },
          { label: 'Month-End Report', path: 'reports/month-end' },
          { label: 'Single Unit Report', path: 'reports/single-unit' },
          { label: 'EMI Collections', path: 'reports/emi-collections' },
          { label: 'Commission Pending', path: 'reports/commission-pending' },
          { label: 'Commissions', path: 'reports/commissions' },
          { label: 'Executive Earnings', path: 'reports/executive-earnings' },
          { label: 'Executive TDS Report', path: 'reports/executive-tds' },
          { label: 'Project Sales', path: 'reports/project-sales' },
          { label: 'Cancelled Bookings', path: 'reports/cancelled-bookings' },
          { label: 'Payouts', path: 'reports/payouts' },
          { label: 'Booked Plots', path: 'reports/booked-plots' },
          { label: 'Executive Commission Report', path: 'reports/executive-commission' },
        ],
      },
      { label: 'Withdrawals', path: 'withdrawals' },
      { label: 'Rank Levels', path: 'rank-levels' },
      { label: 'Full Tree', path: 'full-tree' },
      { label: 'Bank Management', path: 'bank-management' },
      { label: 'Ranking Rules', path: 'ranking-rules' },
      { label: 'Account Ledger', path: 'account-ledger' },
      { label: 'Finance and TDS', path: 'finance-and-tds' },
    ],
  },
  {
    title: 'Settings',
    items: [{ label: 'System Settings', path: 'system-settings' }],
  },
  {
    title: 'Security',
    items: [{ label: 'Audit Logs', path: 'audit-logs' }],
  },
  {
    title: 'Support',
    items: [{ label: 'Support Ticket', path: 'support-ticket' }],
  },
  {
    title: 'Account',
    items: [
      { label: 'My Profile', path: 'my-profile' },
    ],
  },
]

export const adminLogout = { label: 'Logout', path: 'logout', to: '/admin/logout' }

export const adminRouteMap = [
  ...adminMenu.flatMap((section) =>
  section.items.map((item) => ({
    ...item,
    to: `/admin/${item.path}`,
    routePath: `/admin/${item.path}`,
  }))
  ),
  adminLogout,
]

export const adminSections = adminMenu.map((section) => ({
  ...section,
  items: section.items.map((item) => ({
    ...item,
    to: `/admin/${item.path}`,
  })),
}))

export const adminDefaultRoute = '/admin/dashboard'
