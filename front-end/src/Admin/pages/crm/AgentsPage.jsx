import { useEffect, useState } from 'react'
import { getAdminExecutives } from '../../../services/api'

function AgentsPage() {
  const [agents, setAgents] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    getAdminExecutives().then((executives) => setAgents(executives.filter((agent) => agent.kyc === 'Verified'))).catch((loadError) => setError(loadError.message))
  }, [])

  return (
    <section className="crm-section-page">
      <div className="crm-section-page-heading"><div><span className="crm-section-kicker">CRM Workspace / Agents</span><h2>Approved Agents</h2><p>Every agent appears here automatically after KYC verification is approved.</p></div><span className="crm-record-count">{agents.length} approved</span></div>
      <div className="crm-section-summary"><div><span>Approved agents</span><strong>{agents.length}</strong></div><div><span>Lead assignment</span><strong>Enabled</strong></div><div><span>Data source</span><strong>Live users</strong></div></div>
      {error && <p className="crm-form-error" role="alert">{error}</p>}
      <div className="table-wrap crm-section-table-wrap"><table><thead><tr><th>Agent</th><th>Email</th><th>Role</th><th>KYC</th><th>Status</th></tr></thead><tbody>{agents.length ? agents.map((agent) => <tr key={agent.email}><td><strong>{agent.name}</strong></td><td>{agent.email}</td><td>{agent.designation}</td><td><span className="crm-record-status active">Verified</span></td><td>{agent.status}</td></tr>) : <tr><td colSpan="5" className="crm-empty-state">No approved agents yet. Agents will appear here after KYC approval.</td></tr>}</tbody></table></div>
    </section>
  )
}

export default AgentsPage
