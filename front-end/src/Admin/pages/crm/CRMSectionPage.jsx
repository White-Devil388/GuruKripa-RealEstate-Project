import { useCallback, useEffect, useMemo, useState } from 'react'
import { listAdminResource } from '../../../services/api'

const statusValues = ['Active', 'Pending', 'Completed', 'New', 'Open', 'Scheduled', 'Negotiation', 'Contacted', 'Paid']

function CRMSectionPage({ title, description, columns = ['Name', 'Status', 'Last activity'], resource, loadRecords, mapRecord = (record) => [record.name || record.title || record.id, record.status || '-', record.updatedAt || record.createdAt || '-'] }) {
  const [records, setRecords] = useState([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [deleteRecord, setDeleteRecord] = useState(null)
  
  const load = useCallback(() => {
    setLoading(true)
    setError('')
    const loader = loadRecords || (() => listAdminResource(resource))
    loader().then((data) => setRecords(data || [])).catch((loadError) => setError(loadError.message)).finally(() => setLoading(false))
  }, [loadRecords, resource])

  // eslint-disable-next-line react/set-state-in-effect
  useEffect(() => { load() }, [load])

  const rows = useMemo(() => records.filter((record) => !query.trim() || JSON.stringify(record).toLowerCase().includes(query.trim().toLowerCase())).map(r => ({ record: r, mapped: mapRecord(r) })), [records, query, mapRecord])
  const recordCount = records.length

  const handleConfirmDelete = async () => {
    if (!deleteRecord) return
    try {
      // Assuming a generic delete endpoint exists or you pass onDelete
      // Since it's a generic view, we can mock it unless there is an endpoint
      if (resource) {
         // await deleteAdminResource(resource, deleteRecord.id) 
      }
      setRecords((curr) => curr.filter(x => x.id !== deleteRecord.id))
      setDeleteRecord(null)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <section className="crm-section-page">
      <div className="crm-section-page-heading">
        <div><span className="crm-section-kicker">CRM Workspace / {title}</span><h2>{title}</h2><p>{description}</p></div>
        <div className="crm-section-actions">
          <span className="crm-record-count">{recordCount} records</span>
          <button type="button" className="crm-refresh-button" onClick={load} aria-label={`Refresh ${title}`}>↻</button>
          <button type="button" className="crm-create-button" onClick={() => alert('Create form would open here.')}>+ Create New</button>
        </div>
      </div>
      
      <div className="crm-section-summary">
        <div><span>Active workspace</span><strong>{title}</strong></div>
        <div><span>Records</span><strong>{recordCount}</strong></div>
        <div><span>Last updated</span><strong>{loading ? 'Loading...' : 'Just now'}</strong></div>
      </div>
      
      <div className="crm-section-toolbar">
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${title.toLowerCase()}...`} />
        <select defaultValue="all"><option value="all">All statuses</option><option>Active</option><option>Pending</option><option>Completed</option></select>
      </div>
      
      {error && <p className="crm-form-error" role="alert">{error}</p>}
      
      <div className="table-wrap crm-section-table-wrap">
        <table>
          <thead>
            <tr>{columns.map((column) => <th key={column}>{column}</th>)}<th>Actions</th></tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan={columns.length + 1} className="crm-empty-state">Loading records...</td></tr> : 
             rows.length ? rows.map(({ record, mapped }, i) => (
              <tr key={record.id || i}>
                {mapped.map((value, index) => <td key={`${record.id || i}-${index}`}>{index === mapped.length - 1 && typeof value === 'string' && statusValues.includes(value) ? <span className={`crm-record-status ${value.toLowerCase().replace(' ', '-')}`}>{value}</span> : value}</td>)}
                <td>
                  <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                    <button type="button" className="crm-row-button" onClick={() => alert('View Details')}>View</button>
                    <button type="button" className="crm-row-button" onClick={() => alert('Edit action triggered')} style={{ background: '#f1f5f9', color: '#0ea5e9' }}>Edit</button>
                    <button type="button" className="crm-row-button" onClick={() => setDeleteRecord(record)} style={{ background: '#fff1f2', color: '#e11d48' }}>Delete</button>
                  </div>
                </td>
              </tr>
            )) : <tr><td colSpan={columns.length + 1} className="crm-empty-state">No records found.</td></tr>}
          </tbody>
        </table>
      </div>
      
      {deleteRecord && (
        <div className="modal-overlay" onClick={() => setDeleteRecord(null)}>
          <div className="modal-content confirm-modal" onClick={e => e.stopPropagation()}>
            <h3>Delete Record?</h3>
            <p>Are you sure you want to delete this log/record? This cannot be undone.</p>
            <div className="modal-actions">
              <button type="button" className="cancel-btn" onClick={() => setDeleteRecord(null)}>Cancel</button>
              <button type="button" className="delete-btn" onClick={handleConfirmDelete}>Confirm Delete</button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default CRMSectionPage
