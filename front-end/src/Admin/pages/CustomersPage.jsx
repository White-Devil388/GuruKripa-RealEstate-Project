import { useMemo, useState, useCallback } from 'react'
import { useFetchData, usePagination, useDebounce } from '../../hooks'
import { getAdminCustomers, saveAdminCustomer, deleteAdminCustomer } from '../../services/api'
import CrudModal, { ConfirmDeleteModal } from '../../components/CrudModal'

const customerFields = [
  { name: 'code', label: 'Customer Code', required: true, placeholder: 'CUS-001' },
  { name: 'name', label: 'Full Name', required: true, placeholder: 'e.g. Rahul Sharma' },
  { name: 'phone', label: 'Phone', required: true, placeholder: '+91 9999...' },
  { name: 'email', label: 'Email', type: 'email', required: false, placeholder: 'customer@example.com' },
  { name: 'addedBy', label: 'Added By (Agent Email)', required: true, placeholder: 'agent@northstar.test' },
  { name: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive'], defaultValue: 'Active' },
]

function CustomersPage() {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 300)
  const [status, setStatus] = useState('All Status')
  
  const { data: customers, loading, error, refetch: fetchCustomers } = useFetchData(getAdminCustomers, [], [])
  
  const [isCrudOpen, setCrudOpen] = useState(false)
  const [isDeleteOpen, setDeleteOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)

  const filteredCustomers = useMemo(() => customers.filter((customer) => {
    const searchable = `${customer.code} ${customer.name} ${customer.phone} ${customer.email} ${customer.addedBy}`.toLowerCase()
    return searchable.includes(debouncedQuery.toLowerCase()) && (status === 'All Status' || customer.status === status)
  }), [customers, debouncedQuery, status])

  const { paginatedData, currentPage, maxPage, nextPage, prevPage, isFirstPage, isLastPage, totalItems } = usePagination(filteredCustomers, 10)

  const handleAdd = useCallback(() => {
    setEditingItem(null)
    setCrudOpen(true)
  }, [])

  const handleEdit = useCallback((customer) => {
    setEditingItem(customer)
    setCrudOpen(true)
  }, [])

  const handleDeleteRequest = useCallback((customer) => {
    setEditingItem(customer)
    setDeleteOpen(true)
  }, [])

  const handleSave = useCallback(async (data) => {
    try {
      await saveAdminCustomer(editingItem?.id, data)
      setCrudOpen(false)
      fetchCustomers()
    } catch (err) {
      alert(err.message)
    }
  }, [editingItem, fetchCustomers])

  const handleConfirmDelete = useCallback(async () => {
    try {
      await deleteAdminCustomer(editingItem.id)
      setDeleteOpen(false)
      fetchCustomers()
    } catch (err) {
      alert(err.message)
    }
  }, [editingItem, fetchCustomers])

  return (
    <div className="customers-page">
      <header className="customers-heading">
        <div><span className="eyebrow">Admin Panel</span><h1>Customer Management</h1><p>View and manage all customers across agents.</p></div>
        <button type="button" className="add-customer-button" onClick={handleAdd}><span>♟</span> Add Customer</button>
      </header>

      <section className="customers-filter-card" aria-label="Customer filters">
        <label className="customer-search"><span aria-hidden="true">⌕</span><input type="search" placeholder="Search by code, name, phone, email, city..." value={query} onChange={(event) => setQuery(event.target.value)} /></label>
        <label className="customer-status"><span className="sr-only">Filter by status</span><select value={status} onChange={(event) => setStatus(event.target.value)}><option>All Status</option><option>Active</option><option>Inactive</option></select></label>
      </section>

      {error && <p role="alert" style={{ color: 'var(--tone-coral)', margin: '1rem' }}>{error}</p>}

      <section className="customers-table-card">
        {loading && <p style={{ padding: '2rem', textAlign: 'center' }}>Loading customers...</p>}
        {!loading && (
          <div className="table-wrap"><table className="customers-table"><thead><tr><th>Code</th><th>Name</th><th>Phone</th><th>Email</th><th>Added By</th><th>Status</th><th>Actions</th></tr></thead><tbody>{paginatedData.map((customer) => <tr key={customer.code || customer.id}><td>{customer.code}</td><td>{customer.name}</td><td>{customer.phone}</td><td>{customer.email}</td><td>{customer.addedBy}</td><td><span className="customer-active-badge">{customer.status}</span></td><td><div className="customer-actions"><button type="button" onClick={() => handleEdit(customer)}>Edit</button><button type="button" onClick={() => handleDeleteRequest(customer)}>Delete</button></div></td></tr>)}</tbody></table>{paginatedData.length === 0 && <div className="customers-empty">No customers found.</div>}</div>
        )}
        <footer className="customers-pagination"><span>Page {currentPage} of {maxPage || 1} ({totalItems} total)</span><div><button type="button" onClick={prevPage} disabled={isFirstPage}>Previous</button><button type="button" onClick={nextPage} disabled={isLastPage}>Next</button></div></footer>
      </section>
      
      <CrudModal isOpen={isCrudOpen} onClose={() => setCrudOpen(false)} onSave={handleSave} fields={customerFields} initialData={editingItem} title={editingItem ? 'Edit Customer' : 'Add Customer'} />
      <ConfirmDeleteModal isOpen={isDeleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={handleConfirmDelete} itemName={editingItem?.name} />
    </div>
  )
}

export default CustomersPage
