import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAdminOperations } from '../../services/api'
import DashboardPage from './crm/DashboardPage'
import LeadsPage from './crm/LeadsPage'
import AgentsPage from './crm/AgentsPage'
import DealsPage from './crm/DealsPage'
import ContactsPage from './crm/ContactsPage'
import TasksPage from './crm/TasksPage'
import MeetingsPage from './crm/MeetingsPage'
import EmailsPage from './crm/EmailsPage'
import RemindersPage from './crm/RemindersPage'
import ReportsPage from './crm/ReportsPage'
import SettingsPage from './crm/SettingsPage'
import AssignedLeadsPage from '../../Agent/AfterApproval/pages/CRMPage'
import AIToolsPage from './crm/AIToolsPage'

const crmNav = {
  Main: ['Dashboard', 'Leads', 'Agents', 'Deals', 'Contacts'],
  Tools: ['AI Tools', 'Tasks', 'Meetings', 'Emails'],
  Manage: ['Reminders', 'Reports'],
}

const pageComponents = { Dashboard: DashboardPage, Leads: LeadsPage, Agents: AgentsPage, Deals: DealsPage, Contacts: ContactsPage, 'AI Tools': AIToolsPage, Tasks: TasksPage, Meetings: MeetingsPage, Emails: EmailsPage, Reminders: RemindersPage, Reports: ReportsPage, Settings: SettingsPage }

function CRMPage({ hideAgents = false, agentMode = false }) {
  const navigate = useNavigate()
  const [profile] = useState(() => {
    try {
      const userStr = localStorage.getItem('northstar_user') || sessionStorage.getItem('northstar_user')
      return JSON.parse(userStr || 'null') || {}
    } catch {
      return {}
    }
  })
  const [activeNav, setActiveNav] = useState('Dashboard')
  const [query, setQuery] = useState('')
  const [notificationCount, setNotificationCount] = useState(0)
  const ActivePage = agentMode && activeNav === 'Leads' ? AssignedLeadsPage : (pageComponents[activeNav] || DashboardPage)
  const profileName = `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || profile.email || 'Admin'
  const profileInitial = (profile.firstName || profile.email || 'A').charAt(0).toUpperCase()
  const profileRole = profile.role || 'Admin'
  const visibleNav = hideAgents
    ? Object.fromEntries(Object.entries(crmNav).map(([group, items]) => [group, items.filter((item) => item !== 'Agents')]))
    : crmNav

  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    getAdminOperations().then((operations) => {
      const pendingKyc = (operations.kyc || []).filter((item) => item.status === 'Submitted').length
      const pendingWithdrawals = (operations.withdrawals || []).filter((item) => item.status === 'Pending').length
      const openTickets = (operations.tickets || []).filter((item) => item.status === 'Open').length
      setNotificationCount(pendingKyc + pendingWithdrawals + openTickets)
    }).catch(() => setNotificationCount(0))
  }, [])

  // Lock body scroll when mobile sidebar is open so page doesn't scroll underneath
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [sidebarOpen])

  // Close sidebar on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSidebarOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className={`crm-dashboard ${sidebarOpen ? 'sidebar-open' : ''}`}>
      {sidebarOpen && <button type="button" className="crm-sidebar-backdrop" aria-label="Close navigation" onClick={() => setSidebarOpen(false)} />}
      <aside className={`crm-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="crm-brand" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="crm-brand-mark" style={{ color: '#a56f28', borderColor: '#a56f28' }}>G</span>
            <strong>Gurukripa<span style={{ color: '#a56f28' }}>CRM</span></strong>
          </div>
          <button
            type="button"
            className="crm-sidebar-close"
            aria-label="Close navigation"
            onClick={() => setSidebarOpen(false)}
          >
            ✕
          </button>
        </div>
        <div className="crm-profile"><span className="crm-profile-avatar">{profileInitial}</span><div><strong>{profileName}</strong><small>{profileRole}</small></div><button type="button" aria-label="Open profile menu">•••</button></div>
        {Object.entries(visibleNav).map(([group, items]) => <div className="crm-nav-group" key={group}><small>{group}</small>{items.map((item) => <button type="button" className={`crm-nav-item ${activeNav === item ? 'active' : ''}`} onClick={() => { setActiveNav(item); setSidebarOpen(false); }} key={item}><span className="crm-nav-icon">{item === 'Dashboard' ? '⌘' : item === 'Leads' ? '♧' : item === 'Agents' ? '♙' : item === 'Deals' ? '▱' : item === 'Contacts' ? '◯' : item === 'Tasks' ? '☑' : item === 'Meetings' ? '□' : item === 'Emails' ? '✉' : item === 'Reminders' ? '♧' : '▥'}</span>{item}</button>)}</div>)}
        <button type="button" className={`crm-settings-item ${activeNav === 'Settings' ? 'active' : ''}`} onClick={() => { setActiveNav('Settings'); setSidebarOpen(false); }}>⚙ <span>Settings</span></button>
      </aside>

      <div className="crm-workspace">
        <header className="crm-topbar">
          <button type="button" className="crm-mobile-toggle md:hidden" onClick={() => setSidebarOpen(true)} title="Open Menu">☰</button>
          <button type="button" className="crm-back-button" onClick={() => navigate(-1)} aria-label="Go back">← <span>Back</span></button>
          <div className="crm-global-search"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search across Leads, Agents and more..." /></div>
          <div className="crm-top-actions"><button type="button" aria-label="Notifications">♧{notificationCount > 0 && <b>{notificationCount}</b>}</button><button type="button" aria-label="Help">?</button><button type="button" aria-label="Toggle theme">☾</button><span className="crm-user-avatar">{profileInitial}</span></div>
        </header>
        <main className="crm-main-content"><div className="crm-dashboard-title"><h1>{activeNav === 'Dashboard' ? 'Default Dashboard' : activeNav}</h1><div><span className="crm-refresh-label">Last refreshed: Just now</span><button type="button" className="crm-refresh-button">↻</button></div></div><ActivePage /></main>
      </div>
    </div>
  )
}

export default CRMPage
