import { useEffect, useState } from 'react'
import { createAgentTicket, getAgentTickets } from '../../../services/api'

function SupportPage() {
  const [tickets, setTickets] = useState([])
  const [status, setStatus] = useState({ type: '', message: '' })
  const [sending, setSending] = useState(false)

  useEffect(() => {
    getAgentTickets().then(setTickets).catch((error) => setStatus({ type: 'error', message: error.message }))
  }, [])

  async function submitTicket(event) {
    event.preventDefault()
    setSending(true)
    setStatus({ type: '', message: '' })
    const formData = new FormData(event.currentTarget)

    try {
      const result = await createAgentTicket({ subject: formData.get('subject'), message: formData.get('message') })
      setTickets((current) => [result.ticket, ...current])
      event.currentTarget.reset()
      setStatus({ type: 'success', message: result.message })
    } catch (error) {
      setStatus({ type: 'error', message: error.message })
    } finally {
      setSending(false)
    }
  }

  const openTickets = tickets.filter((ticket) => ticket.status === 'Open').length
  const inProgressTickets = tickets.filter((ticket) => ticket.status === 'In Progress').length
  const resolvedTickets = tickets.filter((ticket) => ticket.status === 'Resolved').length

  return (
    <section className="before-support-page" aria-labelledby="before-support-title">
      <header className="before-support-heading">
        <div>
          <h1 id="before-support-title">Support</h1>
          <p>We are here to help you with your account and verification.</p>
        </div>
        <span className="before-support-online"><i /> Support online</span>
      </header>

      <div className="before-support-summary" aria-label="Support ticket summary">
        <article><strong>{openTickets}</strong><span>Open Tickets</span></article>
        <article><strong>{inProgressTickets}</strong><span>In Progress</span></article>
        <article><strong>{resolvedTickets}</strong><span>Resolved Tickets</span></article>
      </div>

      <div className="before-support-layout">
        <form className="before-support-card before-support-form" onSubmit={submitTicket}>
          <h2>Raise a Support Ticket</h2>
          <p>Tell us what you need help with and our team will get back to you.</p>
          <label>
            Subject
            <input name="subject" type="text" placeholder="What do you need help with?" required disabled={sending} />
          </label>
          <label>
            Message
            <textarea name="message" placeholder="Describe your issue" rows="5" required disabled={sending} />
          </label>
          {status.message && <p role={status.type === 'error' ? 'alert' : 'status'}>{status.message}</p>}
          <button type="submit" className="before-support-submit" disabled={sending}>{sending ? 'Submitting...' : 'Submit Ticket'}</button>
        </form>

        <aside className="before-support-card before-support-contact">
          <h2>Need quick help?</h2>
          <p>Our support team is available to assist you with KYC and profile verification.</p>
          <div><span>Email</span><strong>support@propertyportal.com</strong></div>
          <div><span>Response time</span><strong>Within 24 hours</strong></div>
        </aside>
      </div>
    </section>
  )
}

export default SupportPage
