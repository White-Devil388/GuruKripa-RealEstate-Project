import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { getAfterApprovalDashboard } from '../../../services/api'

function DashboardPage() {
  const dashboardRef = useRef(null)
  const defaultDashboard = { name: 'Agent', totalCustomers: 0, siteVisits: 0, referrals: 0, earnings: 0, walletBalance: 0, team: 0, rank: 'Business Executive', referralCode: 'GK-1004', progress: 0, bookings: [], upcomingEmis: [], recentCommissions: [], assignedLeads: [], teamBreakdown: { level1: 0, level2: 0, level3: 0 } }
  const [dashboard, setDashboard] = useState(defaultDashboard)
  useEffect(() => { getAfterApprovalDashboard().then((data) => setDashboard((current) => ({ ...current, ...data, bookings: data.bookings || [], upcomingEmis: data.upcomingEmis || [], recentCommissions: data.recentCommissions || [], assignedLeads: data.assignedLeads || [], teamBreakdown: { ...current.teamBreakdown, ...(data.teamBreakdown || {}) } }))).catch(() => {}) }, [])

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } })
      timeline
        .from('.after-dashboard .dashboard-heading', { opacity: 0, y: -18, duration: 0.5 })
        .from('.after-dashboard .dashboard-section', { opacity: 0, y: 20, duration: 0.5, stagger: 0.12 }, '-=0.25')
        .from('.after-dashboard .metric-card', { opacity: 0, y: 16, scale: 0.96, duration: 0.4, stagger: 0.06 }, '-=0.3')
        .from('.after-dashboard .dashboard-card', { opacity: 0, y: 20, duration: 0.5, stagger: 0.1 }, '-=0.25')
        .from('.after-dashboard .quick-action, .after-dashboard .referral-dashboard-card', { opacity: 0, y: 14, duration: 0.4, stagger: 0.06 }, '-=0.25')
    }, dashboardRef)

    return () => context.revert()
  }, [])

  return (
    <section ref={dashboardRef} className="dashboard-page after-dashboard" aria-labelledby="after-dashboard-title">
      <header className="dashboard-heading">
        <div>
          <h1 id="after-dashboard-title">Welcome back, {dashboard.name}!</h1>
          <p>Here is what is happening with your business today.</p>
        </div>
        <button type="button" className="date-button">Today ▾</button>
      </header>

      <section className="dashboard-section" aria-labelledby="overview-title">
        <div className="section-title"><span id="overview-title">Overview</span><small>Updated just now</small></div>
        <div className="metric-grid top-metrics">
          <Metric icon="₹" tone="coral" label="Total Earnings" value={`₹${dashboard.earnings}`} detail="This month" />
          <Metric icon="▣" tone="blue" label="Total Leads" value={dashboard.referrals} detail="All time" />
          <Metric icon="✓" tone="green" label="Site Visits" value={dashboard.siteVisits} detail="This month" />
          <Metric icon="★" tone="amber" label="My Rank" value={dashboard.rank} detail="Current rank" />
        </div>
      </section>

      <section className="dashboard-section">
        <div className="section-title"><span>Business Overview</span><small>Performance snapshot</small></div>
        <div className="metric-grid operation-metrics">
          <Metric icon="◉" tone="coral" label="My Customers" value={dashboard.totalCustomers} detail="Total customers" />
          <Metric icon="↗" tone="blue" label="Referrals" value={dashboard.referrals} detail="Total referrals" />
          <Metric icon="₹" tone="green" label="Commissions" value={`₹${dashboard.earnings}`} detail="Earned" />
          <Metric icon="▣" tone="amber" label="Wallet Balance" value={`₹${dashboard.walletBalance}`} detail="Available balance" />
          <Metric icon="⌁" tone="teal" label="My Team" value={dashboard.team} detail="Team members" />
        </div>
      </section>

      <section className="dashboard-card rank-achievement-card">
        <div className="card-heading"><strong>Rank Achievement Progress</strong><a href="/agent-after-approval/my-rank">View rank</a></div>
        <div className="rank-achievement-content">
          <div className="rank-medal" aria-hidden="true">★</div>
          <div className="rank-progress-copy">
            <strong>{dashboard.rank}</strong>
            <span>Keep building your business to reach the next rank.</span>
            <div className="progress-track"><i style={{ width: `${dashboard.progress || 0}%` }} /></div>
            <div className="progress-labels"><span>Progress</span><b>{dashboard.progress || 0}%</b></div>
          </div>
        </div>
      </section>

      <div className="dashboard-columns">
        <DashboardTable title="Recent Bookings" rows={dashboard.bookings} action="View all" empty="No bookings found." actionLabel="Create Site Visit" />
        <DashboardTable title="Upcoming EMIs" rows={dashboard.upcomingEmis} action="View all" empty="No upcoming EMIs for your bookings." />
      </div>

      <section className="dashboard-card"><div className="card-heading"><strong>Leads assigned by Admin</strong><span>{dashboard.assignedLeads.length} leads</span></div><div className="table-wrap"><table><thead><tr><th>Lead</th><th>Source</th><th>Status</th><th>Assigned role</th></tr></thead><tbody>{dashboard.assignedLeads.length ? dashboard.assignedLeads.map((lead) => <tr key={lead.id}><td>{lead.name}<small>{lead.phone}</small></td><td>{lead.source || '-'}</td><td>{lead.status || 'New'}</td><td>{lead.assignedRole || 'Agent'}</td></tr>) : <tr><td colSpan="4" className="dashboard-empty">No leads assigned by Admin yet.</td></tr>}</tbody></table></div></section>

      <div className="dashboard-columns lower-columns">
        <section className="dashboard-card">
          <div className="card-heading"><strong>My Team</strong><a href="/agent-after-approval/my-team">View all</a></div>
          <div className="team-stats"><div><strong>{dashboard.team}</strong><span>Total Team</span></div><div><strong>{dashboard.teamBreakdown.level1 + dashboard.teamBreakdown.level2 + dashboard.teamBreakdown.level3}</strong><span>Active Members</span></div></div>
          <ul className="todo-list"><li><span className="dot blue" /> Level 1 Team <b className="todo-blue">{dashboard.teamBreakdown.level1}</b></li><li><span className="dot green" /> Level 2 Team <b className="todo-green">{dashboard.teamBreakdown.level2}</b></li><li><span className="dot amber" /> Level 3 Team <b className="todo-red">{dashboard.teamBreakdown.level3}</b></li></ul>
          <a className="team-button" href="/agent-after-approval/my-team">View My Team</a>
        </section>
        <DashboardTable title="Recent Commissions" rows={dashboard.recentCommissions} action="View all" empty="No commissions yet." />
      </div>

      <nav className="quick-actions-bar" aria-label="Quick actions">
        <QuickAction icon="⌂" label="Add Customer" href="/agent-after-approval/my-customers" tone="coral" />
        <QuickAction icon="▣" label="Site Visit" href="/agent-after-approval/site-visit" tone="green" />
        <QuickAction icon="▤" label="My Wallet" href="/agent-after-approval/my-wallet" tone="teal" />
        <QuickAction icon="↗" label="My Team" href="/agent-after-approval/my-team" tone="coral" />
        <QuickAction icon="★" label="Commissions" href="/agent-after-approval/commissions" tone="amber" />
        <QuickAction icon="⚙" label="Support" href="/agent-after-approval/support" tone="blue" />
      </nav>

      <section className="referral-dashboard-card">
        <div className="personal-link-card">
          <div className="card-heading"><strong>Your Referral Link</strong><small>Share your link and start earning referrals.</small></div>
          <div className="personal-link-row"><span>https://portal.example.com/register?ref={dashboard.referralCode}</span><button type="button" onClick={() => navigator.clipboard?.writeText(`https://portal.example.com/register?ref=${dashboard.referralCode}`)}>Copy</button></div>
          <p>Share this link with your network to grow your team.</p>
        </div>
        <div className="referral-stat-block"><span>Referral Code</span><strong>{dashboard.referralCode}</strong><span>Total Referrals</span><b>{dashboard.referrals}</b></div>
      </section>
    </section>
  )
}

function Metric({ icon, tone, label, value, detail }) {
  return <article className="metric-card"><span className={`metric-icon ${tone}`}>{icon}</span><div><strong>{value}</strong><span>{label}</span><small>{detail}</small></div></article>
}

function DashboardTable({ title, action, empty, actionLabel, rows = [] }) {
  return <section className="dashboard-card"><div className="card-heading"><strong>{title}</strong><a href="#dashboard">{action}</a></div><div className="table-wrap"><table><thead><tr><th>{title === 'Recent Bookings' ? 'Project' : 'Booking'}</th><th>Status</th><th>Date</th><th>Amount</th></tr></thead><tbody>{rows.length ? rows.slice(0, 4).map((row) => <tr key={row.id}><td>{row.project || row.description || row.customer}</td><td>{row.status || 'Credited'}</td><td>{row.date || row.dueDate || '-'}</td><td>{row.amount ? `₹${row.amount}` : '-'}</td></tr>) : <tr><td colSpan="4" className="dashboard-empty">{empty}{actionLabel && <a href="/agent-after-approval/site-visit">{actionLabel}</a>}</td></tr>}</tbody></table></div></section>
}

function QuickAction({ icon, label, href, tone }) {
  return <a className="quick-action" href={href}><span className={`metric-icon ${tone}`}>{icon}</span><span>{label}</span><b className="arrow">›</b></a>
}

export default DashboardPage
