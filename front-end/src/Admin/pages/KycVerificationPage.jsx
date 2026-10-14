import { useEffect, useMemo, useState } from 'react'
import { getAdminOperations, updateAdminKyc } from '../../services/api'

function KycVerificationPage() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('Pending')
  const [applications, setApplications] = useState([])
  const [error, setError] = useState('')
  const [updatingEmail, setUpdatingEmail] = useState('')
  const [selectedApplication, setSelectedApplication] = useState(null)
  const [previewDocument, setPreviewDocument] = useState(null)
  const [actionMessage, setActionMessage] = useState('')
  useEffect(() => { getAdminOperations().then((data) => setApplications(data.kyc)).catch((loadError) => setError(loadError.message)) }, [])
  useEffect(() => {
    function closePreview(event) {
      if (event.key === 'Escape') setPreviewDocument(null)
    }
    window.addEventListener('keydown', closePreview)
    return () => window.removeEventListener('keydown', closePreview)
  }, [])
  const visibleApplications = useMemo(() => applications.filter((application) => `${application.name} ${application.email} ${application.pan} ${application.aadhaar}`.toLowerCase().includes(query.toLowerCase()) && (status === 'Pending' ? application.status === 'Submitted' : application.status === status)), [applications, query, status])

  async function updateStatus(email, nextStatus) {
    setUpdatingEmail(email)
    setError('')
    setActionMessage('')
    try {
      await updateAdminKyc(email, nextStatus)
      setApplications((current) => current.map((application) => application.email === email ? { ...application, status: nextStatus } : application))
      setSelectedApplication((current) => current?.email === email ? { ...current, status: nextStatus } : current)
      setActionMessage(`KYC ${nextStatus.toLowerCase()} successfully.`)
    } catch (updateError) {
      setError(updateError.message)
    } finally {
      setUpdatingEmail('')
    }
  }

  return (
    <div className="kyc-page">
      <div className="kyc-heading">
        <span className="eyebrow">Admin Panel</span>
        <h1>KYC Approvals</h1>
        <p>Review and approve agent KYC submissions.</p>
      </div>

      <section className="kyc-filter-card" aria-label="KYC filters">
        <label className="kyc-search">
          <span aria-hidden="true">⌕</span>
          <input
            type="search"
            placeholder="Search by agent name, PAN, Aadhaar..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <label className="kyc-status-filter">
          <span className="sr-only">Filter by status</span>
          <select value={status} onChange={(event) => setStatus(event.target.value)}>
            <option>Pending</option>
            <option>Approved</option>
            <option>Rejected</option>
          </select>
        </label>
      </section>

      <section className="kyc-table-card">
        <div className="table-wrap">
          <table className="kyc-table">
            <thead>
              <tr>
                <th>Agent</th>
                <th>Email</th>
                <th>Aadhaar No.</th>
                <th>PAN No.</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>{visibleApplications.length ? visibleApplications.map((application) => <tr key={application.email}><td>{application.name}</td><td>{application.email}</td><td>{application.aadhaar}</td><td>{application.pan}</td><td>{application.status}</td><td><button type="button" onClick={() => setSelectedApplication(application)}>Review</button></td></tr>) : <tr><td colSpan="6" className="kyc-empty-state">{error || 'No KYC applications found.'}</td></tr>}</tbody>
          </table>
        </div>
        <footer className="kyc-pagination">
          <span>Page 1 of 1 (0 total)</span>
          <div>
            <button type="button" disabled>Previous</button>
            <button type="button" disabled>Next</button>
          </div>
        </footer>
      </section>

      {selectedApplication && (
        <section className="kyc-review-card" aria-labelledby="kyc-review-title">
          <div className="kyc-review-heading">
            <div>
              <span className="eyebrow">KYC Verification</span>
              <h2 id="kyc-review-title">Review {selectedApplication.name}&apos;s application</h2>
            </div>
            <button type="button" onClick={() => setSelectedApplication(null)}>Close</button>
          </div>
          <div className="kyc-review-grid">
            <div><span>Full name</span><strong>{selectedApplication.name}</strong></div>
            <div><span>Email</span><strong>{selectedApplication.email}</strong></div>
            <div><span>Phone</span><strong>{selectedApplication.phone || '-'}</strong></div>
            <div><span>Aadhaar number</span><strong>{selectedApplication.aadhaar}</strong></div>
            <div><span>PAN number</span><strong>{selectedApplication.pan}</strong></div>
            <div><span>Bank account</span><strong>{selectedApplication.accountNumber}</strong></div>
            <div><span>IFSC code</span><strong>{selectedApplication.ifsc}</strong></div>
            <div><span>Bank name</span><strong>{selectedApplication.bankName}</strong></div>
          </div>
          <div className="kyc-review-documents">
            <h3>Uploaded documents</h3>
            {Object.keys(selectedApplication.documents || {}).length ? Object.entries(selectedApplication.documents).map(([documentName, value]) => {
              const document = typeof value === 'object' ? value : { name: value, url: '' }
              return <div key={documentName}><span>{documentName}</span>{document.url && document.type?.startsWith('image/') ? <button type="button" className="kyc-document-button" onClick={() => setPreviewDocument({ url: document.url, name: document.name || documentName })} aria-label={`Enlarge ${documentName}`}><img className="kyc-document-preview" src={document.url} alt={`${documentName} uploaded document`} /></button> : null}{document.url ? <a href={document.url} download={document.name || documentName}>{document.name || 'Open document'}</a> : <strong>{document.name || '-'}</strong>}</div>
            }) : <p className="kyc-documents-empty">No uploaded files found. Ask the agent to upload and submit the KYC documents again.</p>}
          </div>
          <div className="kyc-review-actions">
            <span>Current status: <strong className={`kyc-status-text ${selectedApplication.status.toLowerCase()}`}>{selectedApplication.status}</strong></span>
            <div>
              <button className="kyc-action-button kyc-reject-button" type="button" disabled={updatingEmail === selectedApplication.email || selectedApplication.status === 'Rejected'} onClick={() => updateStatus(selectedApplication.email, 'Rejected')}><span aria-hidden="true">×</span>{updatingEmail === selectedApplication.email ? 'Updating...' : selectedApplication.status === 'Rejected' ? 'Rejected' : 'Reject KYC'}</button>
              <button className="kyc-action-button kyc-approve-button" type="button" disabled={updatingEmail === selectedApplication.email || selectedApplication.status === 'Approved'} onClick={() => updateStatus(selectedApplication.email, 'Approved')}><span aria-hidden="true">✓</span>{updatingEmail === selectedApplication.email ? 'Updating...' : selectedApplication.status === 'Approved' ? 'Approved' : 'Approve KYC'}</button>
            </div>
          </div>
          {actionMessage && <p className="kyc-action-message" role="status">{actionMessage}</p>}
        </section>
      )}

      {previewDocument && (
        <div className="kyc-image-lightbox" role="dialog" aria-modal="true" aria-label={`Preview of ${previewDocument.name}`} onClick={() => setPreviewDocument(null)}>
          <button type="button" className="kyc-lightbox-close" onClick={() => setPreviewDocument(null)} aria-label="Close image preview">Close</button>
          <img src={previewDocument.url} alt={previewDocument.name} onClick={(event) => event.stopPropagation()} />
        </div>
      )}
    </div>
  )
}

export default KycVerificationPage
