import { useEffect, useMemo, useState } from 'react'
import { saveAgentCustomer, deleteAgentCustomer, getAgentCustomers } from '../../../services/api'
import CrudModal, { ConfirmDeleteModal } from '../../../components/CrudModal'

const customerFields = [
  { name: 'name', label: 'Full Name', required: true, placeholder: 'e.g. Amit Singh' },
  { name: 'phone', label: 'Phone', required: true, placeholder: '+91 9999...' },
  { name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'user@example.com' },
]

function MyCustomersPage() {
  const [query, setQuery] = useState('')
  const [customers, setCustomers] = useState([])
  const [message, setMessage] = useState('')
  const [isCrudOpen, setCrudOpen] = useState(false)
  const [isDeleteOpen, setDeleteOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)

  const fetchCustomers = () => { getAgentCustomers().then(setCustomers).catch((error) => setMessage(error.message)) }
  
  useEffect(() => { fetchCustomers() }, [])
  
  const visibleCustomers = useMemo(() => customers.filter((customer) => `${customer.code} ${customer.name} ${customer.phone} ${customer.email}`.toLowerCase().includes(query.toLowerCase())), [customers, query])

  const handleAdd = () => {
    setEditingItem(null)
    setCrudOpen(true)
  }

  const handleEdit = (customer) => {
    setEditingItem(customer)
    setCrudOpen(true)
  }

  const handleDeleteRequest = (customer) => {
    setEditingItem(customer)
    setDeleteOpen(true)
  }

  const handleSave = async (data) => {
    try {
      await saveAgentCustomer(editingItem?.id, data)
      setCrudOpen(false)
      fetchCustomers()
      setMessage(editingItem ? 'Customer updated successfully.' : 'Customer added successfully.')
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setMessage(err.message)
    }
  }

  const handleConfirmDelete = async () => {
    try {
      await deleteAgentCustomer(editingItem.id)
      setDeleteOpen(false)
      fetchCustomers()
      setMessage('Customer deleted.')
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setMessage(err.message)
    }
  }

  return (
    <section className="customers-page after-customers-page" aria-labelledby="customers-title">
      <header className="customers-heading after-customers-heading">
        <div>
          <h1 id="customers-title">My Customers</h1>
          <p>Customers you've added.</p>
        </div>
        <button type="button" className="add-customer-button" onClick={handleAdd}><span>+</span> Add Customer</button>
      </header>

      <section className="customers-table-card after-customers-card">
        <div className="customers-filter-card after-customers-filter">
          <label className="customer-search">
            <span aria-hidden="true">⌕</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by code, name, phone, city" aria-label="Search customers" />
          </label>
        </div>
        {message && <p role="status" style={{ margin: '1rem', color: 'var(--tone-green)', fontWeight: 500 }}>{message}</p>}
        {visibleCustomers.length ? 
          <div className="table-wrap">
            <table className="customers-table">
              <thead><tr><th>Code</th><th>Name</th><th>Phone</th><th>Email</th><th>Actions</th></tr></thead>
              <tbody>{visibleCustomers.map((customer) => <tr key={customer.id || customer.code}><td>{customer.code}</td><td>{customer.name}</td><td>{customer.phone}</td><td>{customer.email}</td><td><div style={{ display: 'flex', gap: '0.5rem' }}><button type="button" style={{ background: 'transparent', border: '1px solid var(--border)', padding: '0.3rem 0.6rem', borderRadius: '4px' }} onClick={() => handleEdit(customer)}>Edit</button><button type="button" style={{ background: 'transparent', border: '1px solid var(--tone-coral)', color: 'var(--tone-coral)', padding: '0.3rem 0.6rem', borderRadius: '4px' }} onClick={() => handleDeleteRequest(customer)}>Delete</button></div></td></tr>)}</tbody>
            </table>
          </div>
        : <div className="customers-empty after-customers-empty">{query ? `No customers found for “${query}”.` : 'No customers added yet.'}</div>}
      </section>

      <CrudModal isOpen={isCrudOpen} onClose={() => setCrudOpen(false)} onSave={handleSave} fields={customerFields} initialData={editingItem} title={editingItem ? 'Edit Customer' : 'Add Customer'} />
      <ConfirmDeleteModal isOpen={isDeleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={handleConfirmDelete} itemName={editingItem?.name} />
    </section>
  )
}

export default MyCustomersPage
