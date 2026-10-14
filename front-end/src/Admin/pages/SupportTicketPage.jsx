import { useEffect, useMemo, useState } from 'react'
import { getAdminOperations, createAdminTicket, updateAdminTicket, removeAdminTicket } from '../../services/api'
import CrudModal, { ConfirmDeleteModal } from '../../components/CrudModal'

function SupportTicketPage() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('All Status')
  const [priority, setPriority] = useState('All Priorities')
  const [tickets, setTickets] = useState([])
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [deletingItem, setDeletingItem] = useState(null)

  const fetchTickets = () => {
    getAdminOperations().then((data) => setTickets(data.tickets)).catch(() => {})
  }

  useEffect(() => { fetchTickets() }, [])

  const ticketFields = [
    { name: 'email', label: 'User Email', type: 'text', placeholder: 'e.g. agent@northstar.test', required: true },
    { name: 'subject', label: 'Subject', type: 'text', placeholder: 'e.g. Needs assistance', required: true },
    { name: 'message', label: 'Message / Issue', type: 'textarea', placeholder: 'Describe the issue...', required: true },
  ]

  const handleSave = async (data) => {
    try {
      if (editingItem) {
        await updateAdminTicket(editingItem.id, data)
      } else {
        await createAdminTicket(data)
      }
      fetchTickets()
      setIsAddOpen(false)
      setEditingItem(null)
    } catch (err) {
      alert(err.message || 'Error saving ticket')
    }
  }

  const handleDelete = async () => {
    try {
      if (deletingItem) {
        await removeAdminTicket(deletingItem.id)
        fetchTickets()
        setIsDeleteOpen(false)
        setDeletingItem(null)
      }
    } catch (err) {
      alert(err.message || 'Error deleting ticket')
    }
  }

  const openEdit = (ticket) => {
    setEditingItem(ticket)
    setIsAddOpen(true)
  }

  const openDelete = (ticket) => {
    setDeletingItem(ticket)
    setIsDeleteOpen(true)
  }
  const visibleTickets = useMemo(() => tickets.filter((ticket) => `${ticket.id} ${ticket.subject} ${ticket.email}`.toLowerCase().includes(query.toLowerCase()) && (status === 'All Status' || ticket.status === status) && (priority === 'All Priorities' || ticket.priority === priority)), [tickets, query, status, priority])

  return (
    <div className="support-ticket-page">
      <header className="support-ticket-heading"><div><span className="eyebrow">Admin Panel</span><h1>Support Tickets</h1><p>Manage and respond to agent support requests.</p></div><button type="button" className="new-ticket-button" onClick={() => setIsAddOpen(true)}>+ New ticket</button></header>
      <section className="ticket-summary-grid"><article><strong>{tickets.length}</strong><span>Total Tickets</span></article><article className="open"><strong>{tickets.filter((ticket) => ticket.status === 'Open').length}</strong><span>Open</span></article><article className="progress"><strong>{tickets.filter((ticket) => ticket.status === 'In Progress').length}</strong><span>In Progress</span></article><article className="resolved"><strong>{tickets.filter((ticket) => ticket.status === 'Resolved').length}</strong><span>Resolved</span></article></section>
      <section className="ticket-filter-card"><label className="ticket-search"><span aria-hidden="true">⌕</span><input type="search" placeholder="Search ticket, subject or user..." value={query} onChange={(event) => setQuery(event.target.value)} /></label><label><span className="sr-only">Filter by status</span><select value={status} onChange={(event) => setStatus(event.target.value)}><option>All Status</option><option>Open</option><option>In Progress</option><option>Resolved</option></select></label><label><span className="sr-only">Filter by priority</span><select value={priority} onChange={(event) => setPriority(event.target.value)}><option>All Priorities</option><option>High</option><option>Medium</option><option>Low</option></select></label></section>
      <section className="support-ticket-table-card"><div className="table-wrap"><table className="support-ticket-table"><thead><tr><th>Ticket</th><th>Subject</th><th>User</th><th>Status</th><th>Updated</th><th>Action</th></tr></thead><tbody>{visibleTickets.length ? visibleTickets.map((ticket) => <tr key={ticket.id}><td>{ticket.id}</td><td>{ticket.subject}</td><td>{ticket.email}</td><td>{ticket.status}</td><td>{ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : '-'}</td><td><button type="button" className="view-ticket-button" onClick={() => openEdit(ticket)}>Edit</button> <button type="button" className="view-ticket-button" style={{color: 'red'}} onClick={() => openDelete(ticket)}>Delete</button></td></tr>) : <tr><td colSpan="6" className="ticket-empty-state">No support tickets found.</td></tr>}</tbody></table></div><footer className="ticket-pagination"><span>Showing {visibleTickets.length} of {tickets.length} tickets</span></footer></section>
      <CrudModal 
        isOpen={isAddOpen} 
        onClose={() => { setIsAddOpen(false); setEditingItem(null); }} 
        onSave={handleSave}
        initialData={editingItem}
        fields={ticketFields} 
        title={editingItem ? "Edit Support Ticket" : "Add Support Ticket"}
      />
      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => { setIsDeleteOpen(false); setDeletingItem(null); }}
        onConfirm={handleDelete}
        itemName={deletingItem ? `Ticket ${deletingItem.id}` : ''}
      />
    </div>
  )
}

export default SupportTicketPage
