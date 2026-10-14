import { useState, useEffect } from 'react'
import { createAdminResource, listAdminResource } from '../../services/api'
import CrudModal from '../../components/CrudModal'

function InstallmentsEmiPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [isAddOpen, setIsAddOpen] = useState(false)

  const emiFields = [
    { name: 'bookingHash', label: 'Booking #', type: 'text', placeholder: 'e.g. BK-0006', required: true },
    { name: 'customer', label: 'Customer', type: 'text', placeholder: 'e.g. John Doe', required: true },
    { name: 'plot', label: 'Plot', type: 'text', placeholder: 'e.g. p2', required: true },
    { name: 'emiName', label: 'EMI / Description', type: 'text', placeholder: 'e.g. EMI 3', required: true },
    { name: 'dueDate', label: 'Due Date', type: 'date', required: true },
    { name: 'amount', label: 'Amount (₹)', type: 'number', required: true },
    { name: 'status', label: 'Status', type: 'select', options: ['Pending', 'Paid', 'Overdue'], required: true },
  ]

  useEffect(() => {
    listAdminResource('installments-emi')
      .then(res => { setItems(res || []); setLoading(false) })
      .catch(err => { console.error(err); setLoading(false) })
  }, [])

  const handleCreate = async (data) => {
    try {
      const newItem = await createAdminResource('installments-emi', data)
      setItems((prev) => [newItem, ...prev])
      setIsAddOpen(false)
      alert('EMI generated live!')
    } catch (err) {
      alert(err.message || 'Error adding EMI')
    }
  }

  return (
    <div className="installments-emi-page">
      <header className="installments-emi-topbar">
        <div className="installments-emi-brand">ADMIN PANEL</div>

        <div className="installments-emi-actions">
          <button type="button" className="installments-emi-icon" aria-label="Toggle theme">
            ☾
          </button>
          <button type="button" className="installments-emi-icon" aria-label="Settings">
            ⚙
          </button>
          <div className="installments-emi-avatar" aria-label="User profile">
            A
          </div>
        </div>
      </header>

      <div className="installments-emi-panel">
        <div className="installments-emi-toolbar">
          <div className="installments-emi-toolbar-left">
            <span className="emi-all-invoice-label">All Installments (EMI)</span>
          </div>

          <div className="installments-emi-toolbar-right">
            <button type="button" className="emi-view-btn muted">View Draft</button>
            <button type="button" className="emi-view-btn" onClick={() => setIsAddOpen(true)}>Add EMI</button>
          </div>
        </div>

        <div className="emi-header-row">
          <div className="emi-field-group emi-status-select">
            <label>Status</label>
            <div className="emi-select-wrap">
              <select defaultValue="all">
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
              </select>
            </div>
          </div>

          <div className="emi-field-group emi-date-group">
            <label>Due Date Range</label>
            <div className="emi-date-wrap">
              <input type="text" placeholder="dd-mm-yyyy" />
              <span>to</span>
              <input type="text" placeholder="dd-mm-yyyy" />
            </div>
          </div>
        </div>

        <div className="emi-table-wrap">
          <table className="emi-table">
            <thead>
              <tr>
                <th>Booking #</th>
                <th>Customer</th>
                <th>Plot</th>
                <th>EMI</th>
                <th>Due Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>Loading data...</td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>No installments found.</td>
                </tr>
              ) : items.map((item) => (
                <tr key={item.id}>
                  <td>{item.bookingHash || item.booking || '-'}</td>
                  <td>{item.customer || '-'}</td>
                  <td>{item.plot || '-'}</td>
                  <td>{item.emiName || '-'}</td>
                  <td>{item.dueDate || '-'}</td>
                  <td>{item.amount && !isNaN(item.amount) ? `₹ ${item.amount}` : item.amount || '-'}</td>
                  <td><span className={`emi-status ${(item.status || 'pending').toLowerCase().replace(' ', '-')}`}>{item.status || 'Pending'}</span></td>
                  <td><button type="button" className="emi-view-btn small">View Booking</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="emi-footer">
          <span>Page 1 of 1 (total 5)</span>

          <div className="emi-pagination">
            <button type="button" className="emi-pagination-btn">Previous</button>
            <button type="button" className="emi-pagination-btn">Next</button>
          </div>
        </div>
      </div>
      
      <CrudModal 
        isOpen={isAddOpen} 
        onClose={() => setIsAddOpen(false)} 
        onSave={handleCreate} 
        fields={emiFields} 
        title="Create New EMI Installment" 
      />
    </div>
  )
}

export default InstallmentsEmiPage
