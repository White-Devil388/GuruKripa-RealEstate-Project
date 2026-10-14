import { useEffect, useState } from 'react'
import { getProfile, updateProfile } from '../../../services/api'

function MyProfilePage() {
  const [profile, setProfile] = useState({ name: '', phone: '', email: '', gender: '', address: '' })
  const [status, setStatus] = useState({ type: '', message: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    getProfile()
      .then((loadedProfile) => setProfile(loadedProfile))
      .catch((error) => setStatus({ type: 'error', message: error.message }))
      .finally(() => setLoading(false))
  }, [])

  function updateField(event) {
    const { name, value } = event.target
    setProfile((currentProfile) => ({ ...currentProfile, [name]: value }))
    setStatus({ type: '', message: '' })
  }

  async function saveProfile(event) {
    event.preventDefault()
    setSaving(true)
    setStatus({ type: '', message: '' })

    try {
      const result = await updateProfile(profile)
      setProfile(result.profile)
      setStatus({ type: 'success', message: result.message })
    } catch (error) {
      setStatus({ type: 'error', message: error.message })
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="before-profile-page" aria-labelledby="before-profile-title">
      <header className="before-profile-heading">
        <h1 id="before-profile-title">My Profile</h1>
        <p>Manage your account information.</p>
      </header>

      <form className="before-profile-card" onSubmit={saveProfile}>
        <div className="before-profile-summary">
          <div><span>Referral Code</span><strong>GK-1004</strong></div>
          <div><span>Rank</span><strong>Business Executive</strong></div>
          <div><span>Position</span><strong>Not set</strong></div>
          <div><span>Slab / sqft</span><strong>Not set</strong></div>
          <div className="before-profile-kyc"><span>KYC Status</span><strong>Not Verified</strong></div>
        </div>

        <div className="before-profile-fields">
          <label>
            Name
            <input name="name" value={profile.name} onChange={updateField} disabled={loading || saving} required />
          </label>
          <label>
            Phone
            <input name="phone" value={profile.phone} onChange={updateField} disabled={loading || saving} required />
          </label>
          <label>
            Email
            <input name="email" value={profile.email} disabled />
            <small>Email cannot be changed.</small>
          </label>
          <label>
            Gender
            <select name="gender" value={profile.gender} onChange={updateField} disabled={loading || saving}>
              <option value="">Select Gender</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
            </select>
          </label>
          <label className="before-profile-address">
            Address
            <textarea name="address" value={profile.address} onChange={updateField} rows="3" disabled={loading || saving} />
          </label>
        </div>

        {status.message && <p role={status.type === 'error' ? 'alert' : 'status'}>{status.message}</p>}
        <button type="submit" className="before-profile-save" disabled={loading || saving}>{loading ? 'Loading Profile...' : saving ? 'Saving...' : 'Save Changes'}</button>
      </form>
    </section>
  )
}

export default MyProfilePage
