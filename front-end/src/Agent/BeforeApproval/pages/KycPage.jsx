import { useEffect, useState } from 'react'
import { getAgentKyc, submitAgentKyc } from '../../../services/api'

function KycPage() {
  const [kyc, setKyc] = useState({ status: 'Pending', details: { aadhaar: '', pan: '', accountNumber: '', ifsc: '', bankName: '' }, documents: {} })
  const [status, setStatus] = useState({ type: '', message: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    getAgentKyc()
      .then(setKyc)
      .catch((error) => setStatus({ type: 'error', message: error.message }))
      .finally(() => setLoading(false))
  }, [])

  function updateDetail(event) {
    const { name, value } = event.target
    setKyc((current) => ({ ...current, details: { ...current.details, [name]: value } }))
    setStatus({ type: '', message: '' })
  }

  async function submitKyc(event) {
    event.preventDefault()
    setSaving(true)
    setStatus({ type: '', message: '' })
    const formData = new FormData(event.currentTarget)
    try {
      Object.entries(kyc.details).forEach(([name, value]) => formData.set(name, value))
      const result = await submitAgentKyc(formData)
      setKyc(result.kyc)
      setStatus({ type: 'success', message: result.message })
    } catch (error) {
      setStatus({ type: 'error', message: error.message })
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="before-kyc-page" aria-labelledby="before-kyc-title">
      <form className="before-kyc-card" onSubmit={submitKyc}>
        <header className="before-kyc-heading">
          <h1 id="before-kyc-title">KYC Verification</h1>
          <p>Please provide your identity and bank details to get verified.</p>
        </header>

        <div className="before-kyc-details">
          <label>
            Aadhaar Number
            <input name="aadhaar" value={kyc.details.aadhaar} onChange={updateDetail} type="text" placeholder="12 digit Aadhaar number" inputMode="numeric" maxLength="12" required disabled={loading || saving} />
          </label>
          <label>
            PAN Number
            <input name="pan" value={kyc.details.pan} onChange={updateDetail} type="text" placeholder="AH5GD1234F" maxLength="10" required disabled={loading || saving} />
          </label>
          <label>
            Bank Account Number
            <input name="accountNumber" value={kyc.details.accountNumber} onChange={updateDetail} type="text" inputMode="numeric" required disabled={loading || saving} />
          </label>
          <label>
            Bank IFSC Code
            <input name="ifsc" value={kyc.details.ifsc} onChange={updateDetail} type="text" placeholder="E.G. SBIN0001234" maxLength="11" required disabled={loading || saving} />
          </label>
          <label className="before-kyc-full-field">
            Bank Name
            <input name="bankName" value={kyc.details.bankName} onChange={updateDetail} type="text" required disabled={loading || saving} />
          </label>
        </div>

        <div className="before-kyc-documents">
          <h2>Document Uploads</h2>
          <label>
            Aadhaar Front
            <input name="aadhaarFront" type="file" accept="image/*,.pdf" required disabled={loading || saving} />
          </label>
          <label>
            Aadhaar Back
            <input name="aadhaarBack" type="file" accept="image/*,.pdf" required disabled={loading || saving} />
          </label>
          <label>
            PAN Document
            <input name="panDocument" type="file" accept="image/*,.pdf" required disabled={loading || saving} />
          </label>
          <label>
            Bank Proof
            <input name="bankProof" type="file" accept="image/*,.pdf" required disabled={loading || saving} />
          </label>
        </div>

        {status.message && <p role={status.type === 'error' ? 'alert' : 'status'}>{status.message}</p>}
        <button type="submit" className="before-kyc-submit" disabled={loading || saving || kyc.status === 'Submitted'}>{loading ? 'Loading KYC...' : saving ? 'Submitting...' : kyc.status === 'Submitted' ? 'KYC Submitted' : 'Submit KYC'}</button>
      </form>
    </section>
  )
}

export default KycPage
