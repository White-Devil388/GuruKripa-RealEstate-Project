import { useEffect, useState } from 'react'
import { getAgentLeads } from '../../../services/api'

import { addAgentLeadComment } from '../../../services/api'

function CRMPage() {
  const [leads, setLeads] = useState([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  // Comments State
  const [commentModalLead, setCommentModalLead] = useState(null)
  const [newCommentText, setNewCommentText] = useState('')
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)

  const loadLeads = () => {
    setLoading(true)
    getAgentLeads().then(setLeads).catch((loadError) => setError(loadError.message)).finally(() => setLoading(false))
  }

  // eslint-disable-next-line react/set-state-in-effect
  useEffect(() => { loadLeads() }, [])

  const handlePostComment = async () => {
    if (!newCommentText.trim() || !commentModalLead) return
    setIsSubmittingComment(true)
    try {
      const updatedLead = await addAgentLeadComment(commentModalLead.id, newCommentText.trim())
      setLeads((current) => current.map((item) => item.id === updatedLead.id ? updatedLead : item))
      setCommentModalLead(null) // Automatically close on success per user request
      setNewCommentText('')
    } catch (err) {
      alert(`Failed to reply: ${err.message}`)
    } finally {
      setIsSubmittingComment(false)
    }
  }

  const visibleLeads = leads.filter((lead) => !query.trim() || JSON.stringify(lead).toLowerCase().includes(query.trim().toLowerCase()))

  return (
    <section className="crm-section-page agent-crm-page">
      <div className="crm-section-page-heading"><div><span className="crm-section-kicker">CRM Workspace / My Leads</span><h2>CRM</h2><p>Leads assigned to you by the Admin.</p></div><div className="crm-section-actions"><span className="crm-record-count">{leads.length} assigned</span><button type="button" className="crm-refresh-button" onClick={loadLeads} aria-label="Refresh assigned leads">↻</button></div></div>
      <div className="crm-section-summary"><div><span>My assigned leads</span><strong>{leads.length}</strong></div><div><span>Access</span><strong>Agent view</strong></div><div><span>Management</span><strong>Admin only</strong></div></div>
      <div className="crm-section-toolbar"><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search my leads..." /></div>
      {error && <p className="crm-form-error" role="alert">{error}</p>}
      <div className="table-wrap crm-section-table-wrap"><table><thead><tr><th>Lead</th><th>Phone</th><th>Source</th><th>Status</th><th>Assigned role</th><th>Comments</th></tr></thead><tbody>{loading ? <tr><td colSpan="6" className="crm-empty-state">Loading assigned leads...</td></tr> : visibleLeads.length ? visibleLeads.map((lead) => <tr key={lead.id}><td><strong>{lead.name || '-'}</strong></td><td>{lead.phone || '-'}</td><td>{lead.source || '-'}</td><td><span className="crm-record-status">{lead.status || 'New'}</span></td><td>{lead.assignedRole || 'Agent'}</td><td><button type="button" onClick={() => setCommentModalLead(lead)} style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border)', padding: '0.25rem 0.5rem', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><span>💬</span> {Array.isArray(lead.comments) ? lead.comments.length : 0}</button></td></tr>) : <tr><td colSpan="6" className="crm-empty-state">No leads have been assigned to you yet.</td></tr>}</tbody></table></div>
      
      {commentModalLead && (
        <div 
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(2px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={(e) => { if (e.target === e.currentTarget) setCommentModalLead(null) }}
        >
          <div style={{ background: 'var(--bg-card, #fff)', padding: '1.5rem', borderRadius: '12px', width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '1rem', boxShadow: '0 10px 40px rgba(0,0,0,0.2)', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
              <h3 style={{ margin: 0, fontSize: '18px' }}>Comments: {commentModalLead.name}</h3>
              <button type="button" onClick={() => setCommentModalLead(null)} style={{ background: 'var(--bg-subtle)', border: 'none', cursor: 'pointer', fontSize: '20px', lineHeight: 1, padding: '0.2rem 0.6rem', borderRadius: '4px' }}>&times;</button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '300px', overflowY: 'auto', paddingRight: '0.5rem' }}>
              {Array.isArray(commentModalLead.comments) && commentModalLead.comments.length > 0 ? (
                commentModalLead.comments.map((c, i) => (
                  <div key={i} style={{ background: 'var(--bg-subtle)', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '12px' }}>
                      <strong style={{ color: c.role === 'Admin' ? 'var(--blue)' : 'var(--green)' }}>{c.author} ({c.role})</strong>
                      <span style={{ color: 'var(--text-light)' }}>{new Date(c.createdAt).toLocaleString()}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.4 }}>{c.text}</p>
                  </div>
                ))
              ) : (
                <p style={{ margin: 0, color: 'var(--text-light)', textAlign: 'center', padding: '1rem 0' }}>No comments yet. Start the conversation!</p>
              )}
            </div>
            
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <input 
                type="text" 
                placeholder="Type your reply..." 
                value={newCommentText} 
                onChange={(e) => setNewCommentText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handlePostComment()}
                style={{ flex: 1, padding: '0.5rem 0.75rem', borderRadius: '4px', border: '1px solid var(--border)' }}
              />
              <button type="button" className="crm-create-button" onClick={handlePostComment} disabled={!newCommentText.trim() || isSubmittingComment}>
                {isSubmittingComment ? 'Sending...' : 'Reply'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default CRMPage
