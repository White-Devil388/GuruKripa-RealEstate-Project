import { useEffect, useState, useMemo, useCallback } from 'react'
import { useDebounce, useInfiniteScroll } from '../../../hooks'
import { assignAdminLead, getAdminLeads, getAdminRoles, addAdminLeadComment, deleteAdminResource } from '../../../services/api'
import { ConfirmDeleteModal } from '../../../components/CrudModal'

function LeadsPage() {
  const [leads, setLeads] = useState([])
  const [roles, setRoles] = useState([])
  const [agents, setAgents] = useState([])
  const [assignments, setAssignments] = useState({})
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  
  // Delete State
  const [deleteModalLead, setDeleteModalLead] = useState(null)
  
  // Bulk Assignment State
  const [filterType, setFilterType] = useState('All')
  const [selectedLeads, setSelectedLeads] = useState([])
  const [bulkRole, setBulkRole] = useState('')
  const [bulkAgent, setBulkAgent] = useState('')
  const [isAssigningBulk, setIsAssigningBulk] = useState(false)

  // Extended Filtering and Search States
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedQuery = useDebounce(searchQuery, 300)
  const [sourceFilter, setSourceFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [displayCount, setDisplayCount] = useState(10)

  // Comments State
  const [commentModalLead, setCommentModalLead] = useState(null)
  const [newCommentText, setNewCommentText] = useState('')
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)

  useEffect(() => {
    Promise.all([getAdminLeads(), getAdminRoles()])
      .then(([leadData, roleData]) => {
        setLeads(leadData)
        setRoles(roleData.roles || [])
        setAgents(roleData.agents || [])
      })
      .catch((loadError) => setError(loadError.message))
  }, [])

  const updateAssignment = useCallback((leadId, key, value) => {
    setAssignments((current) => ({ ...current, [leadId]: { ...current[leadId], [key]: value } }))
  }, [])

  const saveAssignment = useCallback(async (lead) => {
    const assignment = assignments[lead.id] || {}
    if (!assignment.assignedRole || !assignment.assignedAgentEmail) {
      setError('Select both a role and an agent before assigning the lead.')
      return
    }

    try {
      const updatedLead = await assignAdminLead(lead.id, assignment)
      setLeads((current) => current.map((item) => item.id === updatedLead.id ? updatedLead : item))
      setStatus(`${lead.name} assigned successfully.`)
      setError('')
    } catch (saveError) {
      setError(saveError.message)
    }
  }, [assignments])

  const saveBulkAssignment = async () => {
    if (!bulkRole || !bulkAgent || selectedLeads.length === 0) {
      setError('Select both a role and an agent to bulk assign.')
      return
    }
    
    setIsAssigningBulk(true)
    setError('')
    setStatus('')
    
    try {
      const assignment = { assignedRole: bulkRole, assignedAgentEmail: bulkAgent }
      const promises = selectedLeads.map(leadId => assignAdminLead(leadId, assignment))
      const updatedLeadsList = await Promise.all(promises)
      
      setLeads((current) => current.map((item) => {
        const found = updatedLeadsList.find(updated => updated.id === item.id)
        return found ? found : item
      }))
      
      setStatus(`${selectedLeads.length} leads assigned successfully.`)
      setSelectedLeads([])
      setBulkRole('')
      setBulkAgent('')
    } catch (err) {
      setError(err.message)
    } finally {
      setIsAssigningBulk(false)
    }
  }

  const handlePostComment = async () => {
    if (!newCommentText.trim() || !commentModalLead) return
    setIsSubmittingComment(true)
    try {
      const updatedLead = await addAdminLeadComment(commentModalLead.id, newCommentText.trim())
      setLeads((current) => current.map((item) => item.id === updatedLead.id ? updatedLead : item))
      setCommentModalLead(null) // Automatically close on success per user request!
      setNewCommentText('')
    } catch (err) {
      alert(`Failed to add comment: ${err.message}`)
    } finally {
      setIsSubmittingComment(false)
    }
  }

  const handleDeleteLeadRequest = (lead) => {
    setDeleteModalLead(lead)
  }

  const handleConfirmDelete = async () => {
    if (!deleteModalLead) return
    try {
      await deleteAdminResource('leads', deleteModalLead.id)
      setLeads((current) => current.filter((l) => l.id !== deleteModalLead.id))
      setSelectedLeads((current) => current.filter((id) => id !== deleteModalLead.id))
      setDeleteModalLead(null)
      setStatus(`Lead ${deleteModalLead.name || deleteModalLead.id} deleted successfully.`)
      setTimeout(() => setStatus(''), 3000)
    } catch (err) {
      setError(`Failed to delete lead: ${err.message}`)
    }
  }

  // Dynamic filter lists
  const availableSources = useMemo(() => Array.from(new Set(leads.map(l => l.source || 'Direct'))).filter(Boolean).sort(), [leads])
  const availableStatuses = useMemo(() => Array.from(new Set(leads.map(l => l.status || 'New'))).filter(Boolean).sort(), [leads])

  const visibleLeads = useMemo(() => leads.filter(lead => {
    if (filterType === 'Unassigned' && lead.assignedAgentEmail) return false;
    
    const lSource = lead.source || 'Direct';
    if (sourceFilter !== 'All' && lSource !== sourceFilter) return false;
    
    const lStatus = lead.status || 'New';
    if (statusFilter !== 'All' && lStatus !== statusFilter) return false;
    
    if (debouncedQuery.trim()) {
      const qs = debouncedQuery.toLowerCase().trim();
      if (!`${lead.name} ${lead.phone} ${lead.id}`.toLowerCase().includes(qs)) {
        return false;
      }
    }
    
    return true;
  }), [leads, filterType, sourceFilter, statusFilter, debouncedQuery])
  
  const displayLeads = useMemo(() => visibleLeads.slice(0, displayCount), [visibleLeads, displayCount])

  const onLoadMore = useCallback(() => {
    setDisplayCount((prev) => prev + 10)
  }, [])
  
  const observerRef = useInfiniteScroll(onLoadMore, displayCount < visibleLeads.length, false)

  const isAllSelected = visibleLeads.length > 0 && selectedLeads.length === visibleLeads.length
  
  const toggleSelectAll = useCallback(() => {
    if (isAllSelected) setSelectedLeads([])
    else setSelectedLeads(visibleLeads.map(l => l.id))
  }, [isAllSelected, visibleLeads])

  const toggleSelectLead = useCallback((id) => {
    setSelectedLeads(curr => curr.includes(id) ? curr.filter(x => x !== id) : [...curr, id])
  }, [])
  
  const bulkEligibleAgents = useMemo(() => agents.filter((agent) => !bulkRole || agent.role === bulkRole), [agents, bulkRole])

  return (
    <section className="crm-section-page crm-leads-page">
      <div className="crm-section-page-heading">
        <div>
          <span className="crm-section-kicker">CRM Workspace / Leads</span>
          <h2>Leads</h2>
          <p>Assign every lead to an agent through the correct role.</p>
        </div>
        <div className="crm-section-actions">
          <span className="crm-record-count">{leads.length} records</span>
          <button type="button" className="crm-create-button">+ Create New</button>
        </div>
      </div>
      <div className="crm-section-summary">
        <div><span>Assignment mode</span><strong>Role based</strong></div>
        <div><span>Available roles</span><strong>{roles.length}</strong></div>
        <div><span>Available agents</span><strong>{agents.length}</strong></div>
      </div>
      
      <div className="crm-section-toolbar leads-toolbar">
        <input 
          type="search" 
          placeholder="Search by name, phone or ID..." 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)} 
          className="leads-search-input"
        />
        
        <select value={filterType} onChange={(e) => { setFilterType(e.target.value); setSelectedLeads([]) }}>
          <option value="All">All Leads</option>
          <option value="Unassigned">Unassigned Only</option>
        </select>
        
        <select value={sourceFilter} onChange={(e) => { setSourceFilter(e.target.value); setSelectedLeads([]) }}>
          <option value="All">All Sources</option>
          {availableSources.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setSelectedLeads([]) }}>
          <option value="All">All Statuses</option>
          {availableStatuses.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        
        <label className="leads-select-all">
          <input type="checkbox" checked={isAllSelected} onChange={toggleSelectAll} disabled={visibleLeads.length === 0} />
          Select Filtered
        </label>
      </div>

      {selectedLeads.length > 0 && (
        <div className="crm-bulk-action-bar">
          <strong>{selectedLeads.length} leads selected</strong>
          <span className="flex-spacer" />
          <select value={bulkRole} onChange={(e) => setBulkRole(e.target.value)}>
            <option value="">Select bulk role</option>
            {roles.map((role) => <option key={role.name} value={role.name}>{role.name}</option>)}
          </select>
          <select value={bulkAgent} onChange={(e) => setBulkAgent(e.target.value)}>
            <option value="">Select bulk agent</option>
            {bulkEligibleAgents.map((agent) => <option key={agent.email} value={agent.email}>{agent.firstName} {agent.lastName} ({agent.role})</option>)}
          </select>
          <button type="button" className="crm-create-button" onClick={saveBulkAssignment} disabled={isAssigningBulk}>
            {isAssigningBulk ? 'Assigning...' : `Assign ${selectedLeads.length} Leads`}
          </button>
        </div>
      )}

      {status && <p className="crm-form-success" role="status">{status}</p>}
      {error && <p className="crm-form-error" role="alert">{error}</p>}
      
      <div className="crm-lead-assignment-list">{displayLeads.length ? displayLeads.map((lead) => {
        const assignment = assignments[lead.id] || { assignedRole: lead.assignedRole || '', assignedAgentEmail: lead.assignedAgentEmail || '' }
        const eligibleAgents = agents.filter((agent) => !assignment.assignedRole || agent.role === assignment.assignedRole)
        const isSelected = selectedLeads.includes(lead.id)
        
        return <article className={`crm-lead-assignment-card ${isSelected ? 'selected' : ''}`} key={lead.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem', padding: '1.25rem 1.5rem', margin: '0.75rem 0', borderRadius: '12px', border: isSelected ? '2px solid var(--tone-blue, #3b82f6)' : '1px solid var(--border)', background: isSelected ? '#f0f7ff' : '#ffffff', boxShadow: '0 6px 16px rgba(0,0,0,0.03)', transition: 'all 0.25s ease' }}>
          
          {/* Left: Info */}
          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', flex: '1 1 300px' }}>
            <label style={{ display: 'flex', cursor: 'pointer', padding: '0.25rem' }}>
              <input type="checkbox" checked={isSelected} onChange={() => toggleSelectLead(lead.id)} style={{ width: '18px', height: '18px', accentColor: 'var(--tone-blue, #3b82f6)', cursor: 'pointer' }} />
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                 <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-1)', fontWeight: 700, letterSpacing: '-0.01em' }}>{lead.name}</h3>
                 <span style={{ padding: '0.2rem 0.6rem', background: '#f1f5f9', color: '#475569', fontSize: '0.7rem', fontWeight: 700, borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{lead.id}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--text-2)', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>📞 {lead.phone}</span>
                <span style={{ color: '#cbd5e1' }}>|</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>🌍 {lead.source || 'Direct'}</span>
                <span style={{ color: '#cbd5e1' }}>|</span>
                <span style={{ display: 'inline-flex', padding: '0.25rem 0.75rem', background: lead.status === 'New' ? '#ecfdf5' : '#f8fafc', color: lead.status === 'New' ? '#10b981' : '#64748b', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600 }}>{lead.status || 'New'}</span>
              </div>
            </div>
          </div>

          {/* Right: Assignments & Actions */}
          <div className="crm-assignment-controls">
            
            {/* Pickers */}
            <div className="crm-assignment-pickers">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
                <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, letterSpacing: '0.04em' }}>Role</span>
                <select value={assignment.assignedRole} onChange={(event) => updateAssignment(lead.id, 'assignedRole', event.target.value)} className="crm-picker-select">
                  <option value="">Select role...</option>
                  {roles.map((role) => <option key={role.name} value={role.name}>{role.name}</option>)}
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
                <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, letterSpacing: '0.04em' }}>Agent</span>
                <select value={assignment.assignedAgentEmail} onChange={(event) => updateAssignment(lead.id, 'assignedAgentEmail', event.target.value)} className="crm-picker-select">
                  <option value="">Choose agent...</option>
                  {eligibleAgents.map((agent) => <option key={agent.email} value={agent.email}>{agent.firstName} {agent.lastName} ({agent.role})</option>)}
                </select>
              </div>
            </div>

            <div style={{ width: '1px', height: '42px', background: '#e2e8f0' }} />

            {/* Actions */}
            <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center' }}>
              <button type="button" onClick={() => saveAssignment(lead)} style={{ background: 'linear-gradient(135deg, #0ea5e9, #0284c7)', color: 'white', border: 'none', padding: '0.55rem 1.25rem', borderRadius: '8px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', boxShadow: '0 4px 10px rgba(14, 165, 233, 0.25)', transition: 'transform 0.2s' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                Assign
              </button>
              
              <button type="button" onClick={() => setCommentModalLead(lead)} style={{ position: 'relative', background: '#fff', border: '1px solid #cbd5e1', color: '#475569', padding: '0.55rem 0.8rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }} onMouseOver={(e) => { e.currentTarget.style.borderColor = '#94a3b8'; e.currentTarget.style.background = '#f8fafc'; }} onMouseOut={(e) => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.background = '#fff'; }} title="View Comments">
                💬
                {Array.isArray(lead.comments) && lead.comments.length > 0 && <span style={{ position: 'absolute', top: '-8px', right: '-8px', background: '#ef4444', color: 'white', fontSize: '0.65rem', fontWeight: 800, padding: '2px 6px', borderRadius: '12px', border: '2px solid white', boxShadow: '0 2px 4px rgba(0,0,0,0.15)' }}>{lead.comments.length}</span>}
              </button>
              
              <button type="button" onClick={() => handleDeleteLeadRequest(lead)} style={{ background: '#fff', border: '1px solid #fecdd3', color: '#e11d48', padding: '0.55rem 0.8rem', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }} title="Delete Lead" onMouseOver={(e) => { e.currentTarget.style.background = '#fff1f2'; e.currentTarget.style.borderColor = '#fda4af'; }} onMouseOut={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#fecdd3'; }}>
                🗑️
              </button>
            </div>
          </div>
        </article>
      }) : <div className="crm-empty-state">No leads found.</div>}</div>
      
      {/* Infinite scroll observer target */}
      <div ref={observerRef} style={{ height: '20px', width: '100%' }} />

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
                <p style={{ margin: 0, color: 'var(--text-light)', textAlign: 'center', padding: '1rem 0' }}>No comments yet.</p>
              )}
            </div>
            
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <input 
                type="text" 
                placeholder="Type a comment..." 
                value={newCommentText} 
                onChange={(e) => setNewCommentText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handlePostComment()}
                style={{ flex: 1, padding: '0.5rem 0.75rem', borderRadius: '4px', border: '1px solid var(--border)' }}
              />
              <button type="button" className="crm-create-button" onClick={handlePostComment} disabled={!newCommentText.trim() || isSubmittingComment}>
                {isSubmittingComment ? 'Sending...' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      <ConfirmDeleteModal 
        isOpen={!!deleteModalLead} 
        onClose={() => setDeleteModalLead(null)} 
        onConfirm={handleConfirmDelete} 
        itemName={deleteModalLead?.name || 'this lead'} 
      />
    </section>
  )
}

export default LeadsPage
