import { useEffect, useMemo, useState } from 'react'
import { saveAgentVisit, deleteAgentVisit, getAgentCustomers, getAgentProjects, getAgentVisits } from '../../../services/api'
import CrudModal, { ConfirmDeleteModal } from '../../../components/CrudModal'

function SiteVisitPage() {
  const [search, setSearch] = useState('')
  const [date, setDate] = useState('')
  const [visits, setVisits] = useState([])
  const [projects, setProjects] = useState([])
  const [customers, setCustomers] = useState([])
  const [message, setMessage] = useState('')
  const [isCrudOpen, setCrudOpen] = useState(false)
  const [isDeleteOpen, setDeleteOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)

  const fetchData = () => { Promise.all([getAgentVisits(), getAgentProjects(), getAgentCustomers()]).then(([loadedVisits, loadedProjects, loadedCustomers]) => { setVisits(loadedVisits); setProjects(loadedProjects); setCustomers(loadedCustomers) }).catch((error) => setMessage(error.message)) }
  
  useEffect(() => { fetchData() }, [])
  const visibleVisits = useMemo(() => visits.filter((visit) => `${visit.customer} ${visit.project}`.toLowerCase().includes(search.toLowerCase()) && (!date || visit.date === date)), [visits, search, date])

  function resetFilters() {
    setSearch('')
    setDate('')
  }

  const visitFields = [
    { name: 'customer', label: 'Customer', type: 'select', required: true, options: customers.map(c => c.name) },
    { name: 'project', label: 'Project', type: 'select', required: true, options: projects.map(p => p.name) },
    { name: 'date', label: 'Date', type: 'date', required: true },
    { name: 'notes', label: 'Notes', type: 'textarea', placeholder: 'Any special requirements...' },
  ]

  const handleAdd = () => {
    setEditingItem(null)
    setCrudOpen(true)
  }

  const handleEdit = (visit) => {
    setEditingItem(visit)
    setCrudOpen(true)
  }

  const handleDeleteRequest = (visit) => {
    setEditingItem(visit)
    setDeleteOpen(true)
  }

  const handleSave = async (data) => {
    try {
      await saveAgentVisit(editingItem?.id, data)
      setCrudOpen(false)
      fetchData()
      setMessage(editingItem ? 'Site visit updated successfully.' : 'Site visit scheduled successfully.')
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setMessage(err.message)
    }
  }

  const handleConfirmDelete = async () => {
    try {
      await deleteAgentVisit(editingItem.id)
      setDeleteOpen(false)
      fetchData()
      setMessage('Site visit deleted.')
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setMessage(err.message)
    }
  }

  return (
    <section className="site-visits-page after-site-page" aria-labelledby="after-site-title">
      <header className="after-site-heading">
        <div>
          <h1 id="after-site-title">Site Visits</h1>
          <p>Schedule and manage your site visits.</p>
        </div>
        <button type="button" className="add-customer-button" onClick={handleAdd}><span>+</span> Add Site Visit</button>
      </header>

      <section className="after-site-card">
        <form className="after-site-filters" onSubmit={(event) => event.preventDefault()}>
          <label className="after-site-search">
            <span aria-hidden="true">⌕</span>
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by customer or project" aria-label="Search site visits" />
          </label>
          <label className="after-site-date">
            <span>Date</span>
            <input type="date" value={date} onChange={(event) => setDate(event.target.value)} aria-label="Filter by date" />
          </label>
          <div className="after-site-filter-actions">
            <button type="button" className="site-reset-btn" onClick={resetFilters}>Reset</button>
            <button type="submit" className="site-apply-btn">Apply</button>
          </div>
        </form>
        
        {message && <p role="status" style={{ margin: '1rem', color: 'var(--tone-green)', fontWeight: 500 }}>{message}</p>}
        {visibleVisits.length ? 
          <div className="table-wrap">
            <table className="customers-table">
              <thead><tr><th>Customer</th><th>Project</th><th>Date</th><th>Notes</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>{visibleVisits.map((visit) => <tr key={visit.id}><td>{visit.customer}</td><td>{visit.project}</td><td>{visit.date}</td><td>{visit.notes || '-'}</td><td><span className="ongoing-badge">{visit.status || 'Pending'}</span></td><td><div style={{ display: 'flex', gap: '0.5rem' }}><button type="button" style={{ background: 'transparent', border: '1px solid var(--border)', padding: '0.3rem 0.6rem', borderRadius: '4px' }} onClick={() => handleEdit(visit)}>Edit</button><button type="button" style={{ background: 'transparent', border: '1px solid var(--tone-coral)', color: 'var(--tone-coral)', padding: '0.3rem 0.6rem', borderRadius: '4px' }} onClick={() => handleDeleteRequest(visit)}>Delete</button></div></td></tr>)}</tbody>
            </table>
          </div>
        : <div className="after-site-empty">{search || date ? 'No site visits found for the selected filters.' : 'No site visits scheduled yet.'}</div>}
      </section>

      <CrudModal isOpen={isCrudOpen} onClose={() => setCrudOpen(false)} onSave={handleSave} fields={visitFields} initialData={editingItem} title={editingItem ? 'Edit Site Visit' : 'Schedule Site Visit'} />
      <ConfirmDeleteModal isOpen={isDeleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={handleConfirmDelete} itemName={`${editingItem?.customer} at ${editingItem?.project}`} />
    </section>
  )
}

export default SiteVisitPage
