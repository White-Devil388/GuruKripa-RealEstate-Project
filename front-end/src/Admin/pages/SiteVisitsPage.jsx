import { useEffect, useMemo, useState } from 'react'
import { getAdminOperations } from '../../services/api'

function SiteVisitsPage() {
  const [visits, setVisits] = useState([])
  const [query, setQuery] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    getAdminOperations().then((data) => setVisits(data.visits)).catch((loadError) => setError(loadError.message))
  }, [])

  const visibleVisits = useMemo(() => visits.filter((visit) => `${visit.customer} ${visit.project} ${visit.emailOwner}`.toLowerCase().includes(query.toLowerCase())), [visits, query])

  return (
    <div className="site-visits-page">
      <header className="site-visits-topbar"><div className="site-visits-brand">ADMIN PANEL</div><div className="site-visits-actions"><button type="button" className="site-visits-icon" aria-label="Toggle theme">☾</button><button type="button" className="site-visits-icon" aria-label="Settings">⚙</button><div className="site-visits-avatar" aria-label="User profile">A</div></div></header>
      <div className="site-visits-header-block"><h1>Site Visits</h1><p>Visits booked by field executives from the mobile app</p></div>
      <div className="site-visits-filter-bar"><div className="site-visits-filter-group site-visits-search-box"><label htmlFor="site-search">Search</label><div className="site-search-field"><span className="search-magnifier">⌕</span><input id="site-search" value={query} onChange={(event) => setQuery(event.target.value)} type="text" placeholder="Search by name or mobile" /></div></div><div className="site-visits-filter-buttons"><button type="button" className="site-reset-btn" onClick={() => setQuery('')}>Reset</button></div></div>
      <div className="site-visits-table-wrap"><table className="site-visits-table"><thead><tr><th>CUSTOMER</th><th>PROJECT</th><th>EXECUTIVE</th><th>VISIT DATE</th><th>STATUS</th></tr></thead><tbody>{visibleVisits.map((visit) => <tr key={visit.id}><td>{visit.customer}</td><td>{visit.project}</td><td>{visit.emailOwner}</td><td>{visit.date}</td><td>{visit.status}</td></tr>)}</tbody></table>{!visibleVisits.length && <div className="site-visits-empty-state">{error || 'No site visits found.'}</div>}</div>
      <div className="site-visits-footer"><span>Page 1 of 1 ({visibleVisits.length} total)</span><div className="site-visits-pagination"><button type="button" className="site-pagination-btn" disabled>Previous</button><button type="button" className="site-pagination-btn" disabled>Next</button></div></div>
    </div>
  )
}

export default SiteVisitsPage
