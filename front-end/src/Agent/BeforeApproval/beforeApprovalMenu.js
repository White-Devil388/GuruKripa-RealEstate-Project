export const beforeApprovalMenu = [
  {
    title: 'Main Agent',
    items: [{ label: 'Dashboard', path: 'dashboard' }],
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

export const beforeApprovalLogout = { label: 'Logout', path: 'logout', to: '/agent-before-approval/logout' }

export const beforeApprovalRouteMap = [
  ...beforeApprovalMenu.flatMap((section) =>
  section.items.map((item) => ({
    ...item,
    to: `/agent-before-approval/${item.path}`,
    routePath: `/agent-before-approval/${item.path}`,
  }))
  ),
  beforeApprovalLogout,
]

export const beforeApprovalSections = beforeApprovalMenu.map((section) => ({
  ...section,
  items: section.items.map((item) => ({
    ...item,
    to: `/agent-before-approval/${item.path}`,
  })),
}))

export const beforeApprovalDefaultRoute = '/agent-before-approval/dashboard'
