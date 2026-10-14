import { useEffect, useState } from 'react'
import { getAgentKyc, submitAgentKyc } from '../../../services/api'

function KycPage() {
  const [kyc, setKyc] = useState({ status: 'Pending', details: { aadhaar: '', pan: '', accountNumber: '', ifsc: '', bankName: '' } })
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  useEffect(() => { getAgentKyc().then(setKyc).catch((error) => setMessage(error.message)).finally(() => setLoading(false)) }, [])

  function updateDetail(event) { const { name, value } = event.target; setKyc((current) => ({ ...current, details: { ...current.details, [name]: value } })); setMessage('') }

  return (
    <section className="after-kyc-page" aria-labelledby="after-kyc-title">
      <form className="after-kyc-card" onSubmit={async (event) => { event.preventDefault(); setSaving(true); const formData = new FormData(event.currentTarget); Object.entries(kyc.details).forEach(([name, value]) => formData.set(name, value)); try { const result = await submitAgentKyc(formData); setKyc(result.kyc); setMessage(result.message) } catch (error) { setMessage(error.message) } finally { setSaving(false) } }}>
        <header className="after-kyc-heading"><h1 id="after-kyc-title">KYC Verification</h1><p>Please provide your identity and bank details to get verified.</p></header>
        <div className="after-kyc-details">
          <label>Aadhaar Number<input name="aadhaar" value={kyc.details.aadhaar} onChange={updateDetail} placeholder="12 digit Aadhaar number" inputMode="numeric" maxLength="12" required disabled={loading || saving} /></label>
          <label>PAN Number<input name="pan" value={kyc.details.pan} onChange={updateDetail} placeholder="AH5GD1234F" maxLength="10" required disabled={loading || saving} /></label>
          <label>Bank Account Number<input name="accountNumber" value={kyc.details.accountNumber} onChange={updateDetail} inputMode="numeric" required disabled={loading || saving} /></label>
          <label>Bank IFSC Code<input name="ifsc" value={kyc.details.ifsc} onChange={updateDetail} placeholder="E.G. SBIN0001234" maxLength="11" required disabled={loading || saving} /></label>
          <label className="after-kyc-full-field">Bank Name<input name="bankName" value={kyc.details.bankName} onChange={updateDetail} required disabled={loading || saving} /></label>
        </div>
        <div className="after-kyc-documents">
          <h2>Document Uploads</h2>
          <label>Aadhaar Front<input name="aadhaarFront" type="file" accept="image/*,.pdf" required disabled={loading || saving} /></label><label>Aadhaar Back<input name="aadhaarBack" type="file" accept="image/*,.pdf" required disabled={loading || saving} /></label><label>PAN Document<input name="panDocument" type="file" accept="image/*,.pdf" required disabled={loading || saving} /></label><label>Bank Proof<input name="bankProof" type="file" accept="image/*,.pdf" required disabled={loading || saving} /></label>
        </div>
        {message && <p role="status">{message}</p>}
        <button type="submit" className="after-kyc-submit" disabled={loading || saving || kyc.status === 'Submitted'}>{loading ? 'Loading...' : saving ? 'Submitting...' : kyc.status === 'Submitted' ? 'KYC Submitted' : 'Submit KYC'}</button>
      </form>
    </section>
  )
}

export default KycPage
