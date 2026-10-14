import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAdminDashboard } from '../../services/api'

const topMetrics = [
  { label: 'Total Customers', value: '248', note: '+12 this month', tone: 'blue', icon: 'US' },
  { label: 'Total Executives', value: '36', note: '+4 this month', tone: 'green', icon: 'EX' },
  { label: 'Total Projects', value: '17', note: '3 active projects', tone: 'purple', icon: 'PR' },
  { label: 'Total Bookings', value: '82', note: '+8 this month', tone: 'red', icon: 'BK' },
]

const operationMetrics = [
  { label: 'KYC Verified', value: '194', tone: 'green', icon: 'KY' },
  { label: 'Pending KYC', value: '12', tone: 'blue', icon: 'PN' },
  { label: 'New Leads', value: '64', tone: 'blue', icon: 'LD' },
  { label: 'Pending Withdrawals', value: '8', tone: 'amber', icon: 'WD' },
  { label: 'Open Tickets', value: '21', tone: 'coral', icon: 'TK' },
  { label: 'Site Visits', value: '29', tone: 'blue', icon: 'SV' },
  { label: 'Paid Installments', value: '116', tone: 'green', icon: 'PI' },
  { label: 'Overdue Installments', value: '7', tone: 'purple', icon: 'OD' },
]



const metricRoutes = {
  'Total Customers': '/admin/customers',
  'Total Executives': '/admin/executives',
  'Total Projects': '/admin/projects',
  'Total Bookings': '/admin/booking',
  'Pending KYC': '/admin/kyc-verification',
  'New Leads': '/admin/lead-engine',
  'Pending Withdrawals': '/admin/withdrawals',
  'Open Tickets': '/admin/support-ticket',
  'Site Visits': '/admin/site-visits',
  'Overdue Installments': '/admin/installment-dues',
}

function MetricCard({ metric }) {
  const content = (
    <>
      <span className={`metric-icon ${metric.tone}`}>{metric.icon}</span>
      <div>
        <strong>{metric.value}</strong>
        <span>{metric.label}</span>
        {metric.note && <small>{metric.note}</small>}
      </div>
    </>
  )
  const route = metricRoutes[metric.label]
  return route ? <Link to={route} className="metric-card">{content}</Link> : <div className="metric-card">{content}</div>
}

function DashboardPage() {
  const [dashboard, setDashboard] = useState({ topMetrics, operationMetrics, bookings: [], alertSummary: { dueToday: 0, overdueAmount: 'Rs. 0' }, plotStatus: { total: 248, available: 176, booked: 48, sold: 24 }, monthlyOverview: [24, 38, 30, 46, 58, 82] })
  const [error, setError] = useState('')

  useEffect(() => {
    getAdminDashboard().then(setDashboard).catch((loadError) => setError(loadError.message))
  }, [])

  return (
    <div className="dashboard-page">
      <div className="dashboard-heading">
        <div>
          <span className="eyebrow">Admin Panel</span>
          <h1>Welcome back, Admin</h1>
          <p>Here is what is happening across your property business today.</p>
        </div>
        <time className="date-button" dateTime={new Date().toISOString().slice(0, 10)}>{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</time>
      </div>

      <section className="dashboard-section">
        <div className="section-title"><span>Overall Business Summary</span><small>Live overview</small></div>
        <div className="metric-grid top-metrics">{dashboard.topMetrics.map((metric) => <MetricCard key={metric.label} metric={metric} />)}</div>
      </section>

      <section className="dashboard-section">
        <div className="section-title"><span>Key Operations &amp; Quick Stats</span><small>Updated just now</small></div>
        <div className="metric-grid operation-metrics">{dashboard.operationMetrics.map((metric) => <MetricCard key={metric.label} metric={metric} />)}</div>
      </section>

      <section className="alert-panel">
        <div className="alert-heading"><div><span className="alert-mark">!</span><div><strong>Attention Required</strong><small>Items that need your attention</small></div></div><Link to="/admin/installment-dues">View all</Link></div>
        <div className="alert-stats"><div><span>Due Today</span><strong>{dashboard.alertSummary?.dueToday || 0}</strong></div><div><span>Total Overdue</span><strong>{dashboard.alertSummary?.overdueAmount || 'Rs. 0'}</strong></div></div>
        <div className="table-wrap"><table><thead><tr><th>Customer</th><th>Project / Plot</th><th>Step</th><th>Due Date</th><th>Amount Due</th><th /></tr></thead><tbody>{dashboard.bookings.length ? dashboard.bookings.map((booking, index) => <tr key={`${booking.customer}-${index}`}><td>{booking.customer}</td><td>{booking.project}<small>{booking.plot}</small></td><td>{booking.step}</td><td>{booking.dueDate}</td><td>{booking.amountDue}</td><td><Link className="row-action" to="/admin/booking">View</Link></td></tr>) : <tr><td colSpan="6">No overdue installments.</td></tr>}</tbody></table></div>
      </section>

      <div className="dashboard-columns">
        <section className="dashboard-card status-card"><div className="card-heading"><strong>Plot Status Summary</strong><span>Current inventory</span></div><div className="status-content"><div className="donut"><div><strong>{dashboard.plotStatus.total}</strong><span>Total Plots</span></div></div><ul><li><i className="dot green" />Available <b>{dashboard.plotStatus.available} Plots</b></li><li><i className="dot amber" />Booked <b>{dashboard.plotStatus.booked} Plots</b></li><li><i className="dot coral" />Sold <b>{dashboard.plotStatus.sold} Plots</b></li></ul></div></section>
        <section className="dashboard-card chart-card"><div className="card-heading"><strong>Monthly Overview</strong><span><i className="dot green" /> Bookings <i className="dot blue" /> Collections</span></div><div className="bar-chart">{['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'].map((month, index) => <div className="bar-column" key={month}><div className="bar" style={{ height: `${dashboard.monthlyOverview[index]}%` }} /><span>{month}</span></div>)}</div></section>
      </div>

      <div className="dashboard-columns lower-columns">
        <section className="dashboard-card quick-card"><div className="card-heading"><strong>Quick Actions</strong><span>Jump to a common task</span></div><div className="quick-grid">{[['Add New Project', 'projects', 'blue'], ['Add New Executive', 'executives', 'green'], ['New Booking', 'booking', 'purple'], ['Add New Lead', 'lead-engine', 'amber'], ['Manage Customers', 'customers', 'teal'], ['View Reports', 'reports', 'coral']].map(([label, path, tone]) => <Link to={`/admin/${path}`} className="quick-action" key={label}><span className={`metric-icon ${tone}`}>+</span>{label}<span className="arrow">-&gt;</span></Link>)}</div></section>
        <section className="dashboard-card todo-card"><div className="card-heading"><strong>To-Do List</strong><span>3 open items</span></div><ul className="todo-list"><li><input type="checkbox" /> Verify pending KYC documents <b className="todo-red">!</b></li><li><input type="checkbox" /> Follow up on overdue dues <b className="todo-green">!</b></li><li><input type="checkbox" /> Review withdrawal requests <b className="todo-blue">!</b></li></ul></section>
      </div>

      <section className="dashboard-card recent-card"><div className="card-heading"><strong>Recent Bookings</strong><Link to="/admin/booking">View all</Link></div><div className="table-wrap"><table><thead><tr><th>Customer</th><th>Project</th><th>Plot</th><th>Amount</th><th>Date</th><th>Status</th></tr></thead><tbody>{dashboard.bookings.map((booking) => <tr key={`${booking.customer}-${booking.plot}`}><td>{booking.customer}</td><td>{booking.project}</td><td>{booking.plot}</td><td>{booking.amount}</td><td>{booking.date}</td><td><span className="status-paid">{booking.status}</span></td></tr>)}</tbody></table></div></section>
      {error && <p role="alert">{error}</p>}
    </div>
  )
}

export default DashboardPage
