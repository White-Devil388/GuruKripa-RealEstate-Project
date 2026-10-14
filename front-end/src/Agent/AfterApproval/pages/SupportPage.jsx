import { useEffect, useState } from 'react'
import { createAgentTicket, getAgentTickets } from '../../../services/api'

function SupportPage() {
  const [query, setQuery] = useState('')
  const [tickets, setTickets] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [message, setMessage] = useState('')
  useEffect(() => { getAgentTickets().then(setTickets).catch((error) => setMessage(error.message)) }, [])
  const visibleTickets = tickets.filter((ticket) => `${ticket.id} ${ticket.subject} ${ticket.message}`.toLowerCase().includes(query.toLowerCase()))

  async function saveTicket(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    try { const result = await createAgentTicket({ subject: formData.get('subject'), message: formData.get('message') }); setTickets((current) => [result.ticket, ...current]); setShowForm(false); setMessage(result.message) } catch (error) { setMessage(error.message) }
  }

  return (
    <section className="after-support-page" aria-labelledby="after-support-title">
      <header className="after-support-heading">
        <div>
          <h1 id="after-support-title">Support Tickets</h1>
          <p>Raise and track your support requests.</p>
        </div>
        <button type="button" className="after-new-ticket" onClick={() => setShowForm((current) => !current)}><span>+</span> New Ticket</button>
      </header>

      <section className="after-support-card">
        <label className="after-support-search">
          <span aria-hidden="true">⌕</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by ticket no, subject, category" aria-label="Search support tickets" />
        </label>
        {showForm && <form onSubmit={saveTicket}><input name="subject" placeholder="Subject" required /><textarea name="message" placeholder="Message" required /><button type="submit">Submit Ticket</button></form>}
        <div className="after-support-empty">{visibleTickets.length ? visibleTickets.map((ticket) => <p key={ticket.id}>{ticket.id} · {ticket.subject} · {ticket.status}</p>) : query ? `No tickets found for “${query}”.` : 'No tickets raised yet.'}</div>
        {message && <p role="status">{message}</p>}
      </section>
    </section>
  )
}

export default SupportPage
