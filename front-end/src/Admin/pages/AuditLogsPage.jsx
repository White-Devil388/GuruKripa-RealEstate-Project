import { useEffect, useMemo, useState } from 'react'
import { createAdminResource, listAdminResource } from '../../services/api'
import CrudModal from '../../components/CrudModal'

function AuditLogsPage() {
  const [logs, setLogs] = useState([])
  const [user, setUser] = useState('All Users')
  const [admin, setAdmin] = useState('All Actions')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [ip, setIp] = useState('')
  const [isAddOpen, setIsAddOpen] = useState(false)

  const fetchLogs = () => {
    listAdminResource('audit-logs')
      .then((data) => {
        const formatted = data.map((log) => [
          log.date || 'Unknown Date',
          log.actor || 'System',
          log.actor === 'Super Admin' ? 'Super_admin' : 'Agent',
          log.action || 'Action',
          log.target || 'N/A',
          log.ip || '192.168.1.1'
        ])
        setLogs(formatted)
      })
      .catch(console.error)
  }

  useEffect(() => {
    fetchLogs()
  }, [])

  const logFields = [
    { name: 'date', label: 'Date & Time', type: 'date', required: true },
    { name: 'actor', label: 'User / Actor', type: 'text', placeholder: 'e.g. Super Admin', required: true },
    { name: 'action', label: 'Action', type: 'text', placeholder: 'e.g. KYC Approved', required: true },
    { name: 'target', label: 'Description/Target', type: 'text', placeholder: 'e.g. User XYZ', required: true },
    { name: 'ip', label: 'IP Address', type: 'text', placeholder: 'e.g. 192.168.1.1' },
  ]

  const handleCreate = async (data) => {
    try {
      await createAdminResource('audit-logs', data)
      fetchLogs()
      setIsAddOpen(false)
    } catch (err) {
      alert(err.message || 'Error adding log')
    }
  }

  const filteredLogs = useMemo(() => logs.filter((log) => {
    const matchesUser = user === 'All Users' || log[1] === user
    const matchesAction = admin === 'All Actions' || log[3] === admin
    const matchesIp = !ip || log[5].includes(ip)
    return matchesUser && matchesAction && matchesIp
  }), [admin, ip, user])

  const resetFilters = () => { setUser('All Users'); setAdmin('All Actions'); setFrom(''); setTo(''); setIp('') }

  return (
    <div className="audit-logs-page">
      <header className="audit-heading"><span className="eyebrow">Admin Panel</span><h1>Audit Logs</h1><p>Track all administrative actions and system events.</p></header>
      <section className="audit-filter-card">
        <label>User<select value={user} onChange={(event) => setUser(event.target.value)}><option>All Users</option><option>Super Admin</option><option>trial</option><option>System</option></select></label>
        <label>Action<select value={admin} onChange={(event) => setAdmin(event.target.value)}><option>All Actions</option><option>Added login</option><option>Updated profile</option><option>KYC Approved</option><option>System Settings Saved</option></select></label>
        <label>Date From<input type="date" value={from} onChange={(event) => setFrom(event.target.value)} /></label>
        <label>Date To<input type="date" value={to} onChange={(event) => setTo(event.target.value)} /></label>
        <label>IP Address<input placeholder="Search IP..." value={ip} onChange={(event) => setIp(event.target.value)} /></label>
      </section>
      <div className="audit-toolbar"><button type="button" className="audit-add-button" onClick={() => setIsAddOpen(true)}>⊕ Add</button><button type="button" className="audit-reset-button" onClick={resetFilters}>Reset</button></div>
      <section className="audit-table-card">
        <div className="table-wrap"><table className="audit-table"><thead><tr><th>Date &amp; Time</th><th>User</th><th>Role</th><th>Action</th><th>Description</th><th>IP Address</th></tr></thead><tbody>{filteredLogs.map((log) => <tr key={`${log[0]}-${log[1]}-${log[3]}`}><td>{log[0]}</td><td>{log[1]}</td><td>{log[2]}</td><td><span className={`audit-action ${log[3].includes('KYC') ? 'success' : ''}`}>{log[3]}</span></td><td>{log[4]}</td><td>{log[5]}</td></tr>)}</tbody></table></div>
        <footer className="audit-pagination"><span>Page 1 of 1 ({filteredLogs.length} total)</span><div><button type="button" disabled>Previous</button><button type="button" disabled>Next</button></div></footer>
      </section>
      <CrudModal 
        isOpen={isAddOpen} 
        onClose={() => setIsAddOpen(false)} 
        onSave={handleCreate} 
        fields={logFields} 
        title="Add Audit Log" 
      />
    </div>
  )
}

export default AuditLogsPage
