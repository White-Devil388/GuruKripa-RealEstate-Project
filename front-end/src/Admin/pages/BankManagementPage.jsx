import { useEffect, useState } from 'react'
import { createAdminResource, updateAdminResource, deleteAdminResource, listAdminResource } from '../../services/api'
import CrudModal, { ConfirmDeleteModal } from '../../components/CrudModal'

const bankFields = [
  { name: 'bankName', label: 'Bank Name', required: true, placeholder: 'HDFC Bank' },
  { name: 'holderName', label: 'Account Holder Name', required: true, placeholder: 'Crown City Pvt Ltd' },
  { name: 'accountNumber', label: 'Account Number', placeholder: 'Optional' },
  { name: 'ifsc', label: 'IFSC Code', placeholder: 'Optional' },
  { name: 'branch', label: 'Branch', placeholder: 'Optional' },
  { name: 'sortOrder', label: 'Sort Order', type: 'number', defaultValue: '0' },
  { name: 'active', label: 'Status', type: 'select', options: ['Active', 'Inactive'], defaultValue: 'Active' },
]

function BankManagementPage() {
  const [banks, setBanks] = useState([])
  const [message, setMessage] = useState('')
  const [isCrudOpen, setCrudOpen] = useState(false)
  const [isDeleteOpen, setDeleteOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)

  const fetchBanks = () => { listAdminResource('banks').then(setBanks).catch((error) => setMessage(error.message)) }
  
  useEffect(() => { fetchBanks() }, [])

  const handleAdd = () => {
    setEditingItem(null)
    setCrudOpen(true)
  }

  const handleEdit = (bank) => {
    // Map boolean active to Active/Inactive for select dropdown
    setEditingItem({ ...bank, active: bank.active !== false ? 'Active' : 'Inactive' })
    setCrudOpen(true)
  }

  const handleDeleteRequest = (bank) => {
    setEditingItem(bank)
    setDeleteOpen(true)
  }

  const handleSave = async (data) => {
    try {
      const payload = { ...data, active: data.active === 'Active' }
      if (editingItem?.id) {
        await updateAdminResource('banks', editingItem.id, payload)
      } else {
        await createAdminResource('banks', payload)
      }
      setCrudOpen(false)
      fetchBanks()
      setMessage('Bank saved successfully.')
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setMessage(err.message)
    }
  }

  const handleConfirmDelete = async () => {
    try {
      await deleteAdminResource('banks', editingItem.id)
      setDeleteOpen(false)
      fetchBanks()
    } catch (err) {
      setMessage(err.message)
    }
  }

  return (
    <div className="bank-management-page">
      <header className="customers-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '2rem 2rem 0', background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '12px' }}>
        <div><span className="eyebrow">Admin Panel</span><h1 style={{ margin: 0 }}>Company Banks</h1><p style={{ margin: 0, color: 'var(--text-2)' }}>Manage bank accounts for agent payment logic.</p></div>
        <button type="button" className="add-bank-button" onClick={handleAdd} style={{ padding: '0.6rem 1.2rem', borderRadius: '8px', background: 'var(--tone-blue)', color: 'white', border: 'none', cursor: 'pointer' }}>Add Bank</button>
      </header>

      <section className="bank-list-card" style={{ marginTop: '1.5rem' }}>
        {banks.length === 0 ? <p className="bank-empty-state">No banks added yet.</p> : <div className="table-wrap"><table className="bank-table"><thead><tr><th>Bank Name</th><th>Account Holder</th><th>Account Number</th><th>IFSC</th><th>Status</th><th>Actions</th></tr></thead><tbody>{banks.map((bank) => <tr key={bank.id}><td>{bank.bankName}</td><td>{bank.holderName}</td><td>{bank.accountNumber || '-'}</td><td>{bank.ifsc || '-'}</td><td>{bank.active ? 'Active' : 'Inactive'}</td><td><div style={{ display: 'flex', gap: '0.5rem' }}><button type="button" style={{ background: 'transparent', border: '1px solid var(--border)', padding: '0.3rem 0.6rem', borderRadius: '4px' }} onClick={() => handleEdit(bank)}>Edit</button><button type="button" style={{ background: 'transparent', border: '1px solid var(--tone-coral)', color: 'var(--tone-coral)', padding: '0.3rem 0.6rem', borderRadius: '4px' }} onClick={() => handleDeleteRequest(bank)}>Delete</button></div></td></tr>)}</tbody></table></div>}
      </section>
      
      {message && <p role="status" style={{ margin: '1rem 2rem', color: 'var(--tone-green)', fontWeight: 500 }}>{message}</p>}

      <CrudModal isOpen={isCrudOpen} onClose={() => setCrudOpen(false)} onSave={handleSave} fields={bankFields} initialData={editingItem} title={editingItem ? 'Edit Bank' : 'Add Bank'} />
      <ConfirmDeleteModal isOpen={isDeleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={handleConfirmDelete} itemName={editingItem?.bankName} />
    </div>
  )
}

export default BankManagementPage
