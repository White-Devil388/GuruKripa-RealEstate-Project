import { useEffect, useMemo, useState } from 'react'
import { getAdminExecutives, updateAgentCommission } from '../../services/api'

function AgentCommissionsPage() {
  const [query, setQuery] = useState('')
  const [executives, setExecutives] = useState([])
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [commissions, setCommissions] = useState({})

  useEffect(() => {
    getAdminExecutives().then(data => {
      setExecutives(data)
      const commissionState = {}
      data.forEach(ex => {
        commissionState[ex.email] = ex.customCommission || ''
      })
      setCommissions(commissionState)
    }).catch((loadError) => setError(loadError.message))
  }, [])

  const filteredExecutives = useMemo(() => executives.filter((executive) => {
    const searchable = `${executive.name} ${executive.username} ${executive.email} ${executive.phone}`.toLowerCase()
    return searchable.includes(query.toLowerCase())
  }), [executives, query])

  const handleCommissionChange = (email, value) => {
    setCommissions(prev => ({ ...prev, [email]: value }))
  }

  const saveCommission = async (email) => {
    setMessage('')
    setError('')
    try {
      await updateAgentCommission(email, commissions[email])
      setMessage(`Commission updated successfully for ${email}`)
      window.setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setError(err.message)
    }
  }

  const clearCommission = async (email) => {
    setCommissions((prev) => ({ ...prev, [email]: '' }))
    setMessage('')
    setError('')
    try {
      await updateAgentCommission(email, '')
      setMessage(`Commission cleared successfully for ${email}`)
      window.setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="executives-page">
      <section className="executives-hero">
        <div>
          <span className="eyebrow">Admin Panel</span>
          <h1>Agent Commissions</h1>
          <p>Configure custom commission rates per agent.</p>
        </div>
      </section>

      <section className="executives-filter-card" aria-label="Executive filters">
        <label className="executive-filter-field executive-search-field">
          <span>Search</span>
          <div className="executive-search-input"><b aria-hidden="true">⌕</b><input type="search" placeholder="Search agent name / email" value={query} onChange={(event) => setQuery(event.target.value)} /></div>
        </label>
      </section>

      <section className="executives-table-card">
        <div className="table-wrap">
          <table className="executives-table">
            <thead><tr><th>S.No</th><th>Name</th><th>Username</th><th>Email</th><th>Designation</th><th>Custom Commission</th><th>Action</th></tr></thead>
            <tbody>{filteredExecutives.map((executive, index) => <tr key={executive.email}><td>{index + 1}</td><td>{executive.name}</td><td>{executive.username}</td><td>{executive.email}</td><td>{executive.designation}</td><td>
              <input type="text" placeholder="e.g. ₹50/sqft or 2%" style={{ padding: '0.4rem 0.6rem', borderRadius: '4px', border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-1)' }} value={commissions[executive.email] || ''} onChange={(e) => handleCommissionChange(executive.email, e.target.value)} />
            </td><td>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button type="button" className="rank-edit-button" onClick={() => saveCommission(executive.email)}>Save</button>
                <button type="button" className="rank-edit-button" style={{ background: 'var(--tone-coral)', borderColor: 'var(--tone-coral)' }} onClick={() => clearCommission(executive.email)}>Clear</button>
              </div>
            </td></tr>)}</tbody>
          </table>
          {filteredExecutives.length === 0 && <div className="executives-empty">No executives found.</div>}
          {message && <p role="status" style={{ color: 'var(--tone-green)', margin: '1rem', fontWeight: 500 }}>{message}</p>}
          {error && <p role="alert" style={{ color: 'var(--tone-coral)', margin: '1rem', fontWeight: 500 }}>{error}</p>}
        </div>
        <footer className="executives-pagination"><span>Page 1 of 1 ({filteredExecutives.length} total)</span><div><button type="button" disabled>Previous</button><button type="button" disabled>Next</button></div></footer>
      </section>
    </div>
  )
}

export default AgentCommissionsPage
