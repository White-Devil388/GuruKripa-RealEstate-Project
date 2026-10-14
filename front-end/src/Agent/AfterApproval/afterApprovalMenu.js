export const afterApprovalMenu = [
  {
    title: 'Main',
    items: [
      { label: 'Dashboard', path: 'dashboard' },
      { label: 'Projects', path: 'projects' },
      { label: 'CRM', path: 'crm' },
    ],
  },
  {
    title: 'My Business',
    items: [
      { label: 'My Customers', path: 'my-customers' },
      { label: 'Site Visit', path: 'site-visit' },
    ],
  },
  {
    title: 'My Team',
    items: [
      { label: 'Referrals', path: 'referrals' },
      { label: 'My Team', path: 'my-team' },
    ],
  },
  {
    title: 'Earnings',
    items: [
      { label: 'Commissions', path: 'commissions' },
      { label: 'My Wallet', path: 'my-wallet' },
      { label: 'My Rank', path: 'my-rank' },
    ],
  },
  {
    title: 'Account',
    items: [
      { label: 'My Profile', path: 'my-profile' },
      { label: 'KYC', path: 'kyc' },
      { label: 'Support', path: 'support' },
    ],
  },
]

export const afterApprovalLogout = { label: 'Logout', path: 'logout', to: '/agent-after-approval/logout' }

export const afterApprovalRouteMap = [
  ...afterApprovalMenu.flatMap((section) =>
  section.items.map((item) => ({
    ...item,
    to: `/agent-after-approval/${item.path}`,
    routePath: `/agent-after-approval/${item.path}`,
  }))
  ),
  afterApprovalLogout,
]

export const afterApprovalSections = afterApprovalMenu.map((section) => ({
  ...section,
  items: section.items.map((item) => ({
    ...item,
    to: `/agent-after-approval/${item.path}`,
  })),
}))

export const afterApprovalDefaultRoute = '/agent-after-approval/dashboard'
