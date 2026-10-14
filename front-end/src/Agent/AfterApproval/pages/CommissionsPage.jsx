import { useEffect, useState } from 'react'
import { getAgentCommissions } from '../../../services/api'

function CommissionsPage() {
  const initialFilters = { category: 'all', points: 'all', from: '', to: '' }
  const [filters, setFilters] = useState(initialFilters)
  const [applied, setApplied] = useState(false)
  const [commissions, setCommissions] = useState({ online: 0, cash: 0, records: [] })
  useEffect(() => { getAgentCommissions().then(setCommissions).catch(() => {}) }, [])
  const visibleRecords = commissions.records.filter((record) => {
    const categoryMatch = filters.category === 'all' || String(record.category || record.type || '').toLowerCase() === filters.category
    const pointsMatch = filters.points === 'all' || String(record.status || '').toLowerCase().includes(filters.points)
    const date = String(record.date || '').slice(0, 10)
    return categoryMatch && pointsMatch && (!filters.from || date >= filters.from) && (!filters.to || date <= filters.to)
  })

  function updateFilter(event) {
    const { name, value } = event.target
    setFilters((currentFilters) => ({ ...currentFilters, [name]: value }))
    setApplied(false)
  }

  function resetFilters() {
    setFilters(initialFilters)
    setApplied(false)
  }

  return (
    <section className="after-commissions-page" aria-labelledby="commissions-title">
      <header className="after-commissions-heading">
        <h1 id="commissions-title">My Commissions</h1>
        <p>Track your earnings from bookings and EMIs.</p>
      </header>

      <div className="after-commission-summary">
        <article><span>Total Online Earned</span><strong>+ ₹{commissions.online}</strong></article>
        <article><span>Total Cash Earned</span><strong>+ ₹{commissions.cash}</strong></article>
      </div>

      <form className="after-commission-filters" onSubmit={(event) => { event.preventDefault(); setApplied(true) }}>
        <label>Category<select name="category" value={filters.category} onChange={updateFilter}><option value="all">All</option><option value="booking">Booking</option><option value="emi">EMI</option></select></label>
        <label>Points<select name="points" value={filters.points} onChange={updateFilter}><option value="all">All</option><option value="earned">Earned</option><option value="pending">Pending</option></select></label>
        <label>From<input name="from" type="date" value={filters.from} onChange={updateFilter} /></label>
        <label>To<input name="to" type="date" value={filters.to} onChange={updateFilter} /></label>
        <div className="after-commission-actions"><button type="submit" className="site-apply-btn">Filter</button><button type="button" className="site-reset-btn" onClick={resetFilters}>Reset</button></div>
      </form>

      <section className="after-commission-empty">{visibleRecords.length ? <div className="table-wrap"><table><thead><tr><th>Description</th><th>Type</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead><tbody>{visibleRecords.map((record) => <tr key={record.id}><td>{record.description || 'Commission'}</td><td>{record.type || '-'}</td><td>₹{record.amount}</td><td>{record.status || 'Credited'}</td><td>{record.date || '-'}</td></tr>)}</tbody></table></div> : applied ? 'No commission records found for the selected filters.' : 'No commission records found.'}</section>
    </section>
  )
}

export default CommissionsPage
