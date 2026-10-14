import { useEffect, useMemo, useState } from 'react'
import { getAdminExecutives, saveAdminExecutive, deleteAdminExecutive } from '../../services/api'
import CrudModal, { ConfirmDeleteModal } from '../../components/CrudModal'

const executiveFields = [
  { name: 'firstName', label: 'First Name', required: true, placeholder: 'e.g. Rahul' },
  { name: 'lastName', label: 'Last Name', required: true, placeholder: 'e.g. Sharma' },
  { name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'agent@northstar.test' },
  { name: 'phone', label: 'Phone', required: true, placeholder: '+91 9876543210' },
  { name: 'password', label: 'Password (Required for new agent)', type: 'password', placeholder: 'Enter initial password' },
  { name: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive'], defaultValue: 'Active' },
]

function ExecutivesPage() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('All')
  const [kyc, setKyc] = useState('All KYC')
  const [executives, setExecutives] = useState([])
  const [error, setError] = useState('')
  const [isCrudOpen, setCrudOpen] = useState(false)
  const [isDeleteOpen, setDeleteOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)

  const fetchExecutives = () => {
    getAdminExecutives().then(setExecutives).catch((loadError) => setError(loadError.message))
  }
  
  useEffect(() => {
    fetchExecutives()
  }, [])

  const filteredExecutives = useMemo(() => executives.filter((executive) => {
    const searchable = `${executive.name} ${executive.username} ${executive.email} ${executive.phone}`.toLowerCase()
    return searchable.includes(query.toLowerCase()) && (status === 'All' || executive.status === status) && (kyc === 'All KYC' || executive.kyc === kyc)
  }), [executives, query, status, kyc])

  const resetFilters = () => {
    setQuery('')
    setStatus('All')
    setKyc('All KYC')
  }

  const handleAdd = () => {
    setEditingItem(null)
    setCrudOpen(true)
  }

  const handleEdit = (executive) => {
    const [firstName, ...lastNames] = (executive.name || '').split(' ')
    setEditingItem({ ...executive, firstName, lastName: lastNames.join(' '), password: '' })
    setCrudOpen(true)
  }

  const handleDeleteRequest = (executive) => {
    setEditingItem(executive)
    setDeleteOpen(true)
  }

  const handleSave = async (data) => {
    try {
      if (editingItem?.email && !data.email) data.email = editingItem.email
      await saveAdminExecutive(editingItem ? editingItem.email : null, data)
      setCrudOpen(false)
      fetchExecutives()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleConfirmDelete = async () => {
    try {
      await deleteAdminExecutive(editingItem.email)
      setDeleteOpen(false)
      fetchExecutives()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="executives-page">
      <section className="executives-hero">
        <div>
          <span className="eyebrow">Admin Panel</span>
          <h1>Executives</h1>
          <p>View, approve, and manage all executives.</p>
        </div>
        <button type="button" className="add-executive-button" onClick={handleAdd}><span>+</span> Add Executive</button>
      </section>

      <section className="executives-filter-card" aria-label="Executive filters">
        <label className="executive-filter-field executive-search-field">
          <span>Search</span>
          <div className="executive-search-input"><b aria-hidden="true">⌕</b><input type="search" placeholder="Search name / username / email / phone" value={query} onChange={(event) => setQuery(event.target.value)} /></div>
        </label>
        <label className="executive-filter-field">
          <span>Status</span>
          <select value={status} onChange={(event) => setStatus(event.target.value)}><option>All</option><option>Active</option><option>Inactive</option></select>
        </label>
        <label className="executive-filter-field kyc-filter-field">
          <span>&nbsp;</span>
          <select value={kyc} onChange={(event) => setKyc(event.target.value)}><option>All KYC</option><option>Verified</option><option>Pending</option><option>Not Submitted</option></select>
        </label>
        <button type="button" className="reset-button" onClick={resetFilters}>Reset</button>
      </section>

      {error && <p role="alert" style={{ color: 'var(--tone-coral)', margin: '1rem' }}>{error}</p>}

      <section className="executives-table-card">
        <div className="table-wrap">
          <table className="executives-table">
            <thead><tr><th>S.No</th><th>Image</th><th>Name</th><th>Username</th><th>Email</th><th>Phone</th><th>Level</th><th>Status</th><th>Created</th><th>Actions</th></tr></thead>
            <tbody>{filteredExecutives.map((executive, index) => <tr key={executive.username + executive.name}><td>{index + 1}</td><td><span className={`executive-avatar ${executive.color}`}>{executive.initial}</span></td><td>{executive.name}</td><td>{executive.username}</td><td>{executive.email}</td><td>{executive.phone}</td><td>{executive.level}</td><td><span className="active-badge">{executive.status}</span></td><td>{executive.created}</td><td><div className="executive-actions"><button type="button" onClick={() => handleEdit(executive)} title={`Manage ${executive.name}`} aria-label={`Manage ${executive.name}`}>Edit</button><button type="button" title={`Delete ${executive.name}`} aria-label={`Delete ${executive.name}`} onClick={() => handleDeleteRequest(executive)}>♧</button></div></td></tr>)}</tbody>
          </table>
          {filteredExecutives.length === 0 && <div className="executives-empty">No executives found.</div>}
        </div>
        <footer className="executives-pagination"><span>Page 1 of 1 ({filteredExecutives.length} total)</span><div><button type="button" disabled>Previous</button><button type="button" disabled>Next</button></div></footer>
      </section>
      
      <CrudModal isOpen={isCrudOpen} onClose={() => setCrudOpen(false)} onSave={handleSave} fields={executiveFields} initialData={editingItem} title={editingItem ? 'Edit Executive' : 'Add Executive'} />
      <ConfirmDeleteModal isOpen={isDeleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={handleConfirmDelete} itemName={editingItem?.name} />
    </div>
  )
}

export default ExecutivesPage
