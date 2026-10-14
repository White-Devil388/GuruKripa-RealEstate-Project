import { useState, useEffect, useMemo } from 'react'
import { getAdminOperations, updateAdminWithdrawal } from '../../services/api'
function WithdrawalsPage() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('Pending')
  const [type, setType] = useState('All Types')
  const [withdrawals, setWithdrawals] = useState([])
  const [message, setMessage] = useState('')
  useEffect(() => { getAdminOperations().then((data) => setWithdrawals(data.withdrawals)).catch((error) => setMessage(error.message)) }, [])
  const visibleWithdrawals = useMemo(() => withdrawals.filter((item) => `${item.id} ${item.emailOwner}`.toLowerCase().includes(query.toLowerCase()) && (status === 'Pending' || item.status === status) && (type === 'All Types' || item.type.toLowerCase() === type.toLowerCase())), [withdrawals, query, status, type])
  async function changeStatus(id, nextStatus) { try { const result = await updateAdminWithdrawal(id, nextStatus); setWithdrawals((current) => current.map((item) => item.id === id ? result.withdrawal : item)); setMessage(result.message) } catch (error) { setMessage(error.message) } }

  return (
    <div className="withdrawals-page">
      <div className="withdrawals-heading">
        <span className="eyebrow">Admin Panel</span>
        <h1>Withdrawal Management</h1>
        <p>Review and process agent withdrawal requests.</p>
      </div>

      <section className="withdrawal-metrics" aria-label="Withdrawal summary">
        <div className="withdrawal-metric-card"><strong>0</strong><span>Pending Requests</span></div>
        <div className="withdrawal-metric-card"><strong>₹0</strong><span>Paid This Month</span></div>
        <div className="withdrawal-metric-card"><strong>₹0</strong><span>Total Paid Online</span></div>
        <div className="withdrawal-metric-card"><strong>₹0</strong><span>Total Paid Cash</span></div>
      </section>

      <section className="withdrawal-filter-card" aria-label="Withdrawal filters">
        <label className="withdrawal-search">
          <span aria-hidden="true">⌕</span>
          <input type="search" placeholder="Search by agent name or reference..." value={query} onChange={(event) => setQuery(event.target.value)} />
        </label>
        <label className="withdrawal-select">
          <span className="sr-only">Filter by status</span>
          <select value={status} onChange={(event) => setStatus(event.target.value)}>
            <option>Pending</option><option>Approved</option><option>Rejected</option><option>Paid</option>
          </select>
        </label>
        <label className="withdrawal-select">
          <span className="sr-only">Filter by withdrawal type</span>
          <select value={type} onChange={(event) => setType(event.target.value)}>
            <option>All Types</option><option>Online</option><option>Cash</option>
          </select>
        </label>
      </section>

      <section className="withdrawal-table-card">
        <div className="table-wrap">
          <table className="withdrawal-table">
            <thead><tr><th>Agent</th><th>Type</th><th>Amount</th><th>TDS</th><th>Net Amount</th><th>Status</th><th>Requested</th><th>Actions</th></tr></thead>
            <tbody>{visibleWithdrawals.length ? visibleWithdrawals.map((item) => <tr key={item.id}><td>{item.emailOwner}</td><td>{item.type}</td><td>Rs. {item.amount}</td><td>2%</td><td>Rs. {Math.round(item.amount * 0.98)}</td><td>{item.status}</td><td>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}</td><td><button type="button" onClick={() => changeStatus(item.id, 'Approved')}>Approve</button><button type="button" onClick={() => changeStatus(item.id, 'Rejected')}>Reject</button></td></tr>) : <tr><td colSpan="8" className="withdrawal-empty-state">{message || 'No withdrawal requests found.'}</td></tr>}</tbody>
          </table>
        </div>
        <footer className="withdrawal-pagination">
          <span>Page 1 of 1 (0 total)</span>
          <div><button type="button" disabled>Previous</button><button type="button" disabled>Next</button></div>
        </footer>
      </section>
    </div>
  )
}

export default WithdrawalsPage
