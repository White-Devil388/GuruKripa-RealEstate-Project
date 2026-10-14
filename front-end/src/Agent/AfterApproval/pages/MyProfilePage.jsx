import { useEffect, useState } from 'react'
import { getProfile, updatePassword } from '../../../services/api'

function MyProfilePage() {
  const [profile, setProfile] = useState({ name: '', phone: '', email: '', gender: '', address: '' })
  const [password, setPassword] = useState({ current: '', next: '', confirm: '' })
  const [feedback, setFeedback] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => { getProfile().then(setProfile).catch((error) => setFeedback(error.message)).finally(() => setLoading(false)) }, [])

  function updateProfile(event) {
    const { name, value } = event.target
    setProfile((current) => ({ ...current, [name]: value }))
    setFeedback('')
  }

  function updatePasswordFields(event) {
    const { name, value } = event.target
    setPassword((current) => ({ ...current, [name]: value }))
    setFeedback('')
  }

  async function saveProfile(event) {
    event.preventDefault()
    setSaving(true)
    try { const result = await updateProfile(profile); setProfile(result.profile); setFeedback(result.message) } catch (error) { setFeedback(error.message) } finally { setSaving(false) }
  }

  return (
    <section className="after-profile-page" aria-labelledby="after-profile-title">
      <header className="after-profile-heading"><h1 id="after-profile-title">My Profile</h1><p>Manage your account information.</p></header>
      <form className="after-profile-card" onSubmit={saveProfile}>
        <div className="after-profile-summary">
          <div><span>Referral Code</span><strong>{profile.referralCode || '-'}</strong></div><div><span>Rank</span><strong>{profile.rank || 'Business Executive'}</strong></div><div><span>Position</span><strong>{profile.position || 'Not set'}</strong></div><div><span>Slab / sqft</span><strong>{profile.slab || 'Not set'}</strong></div><div><span>KYC Status</span><b>{profile.kycStatus || 'Pending'}</b></div>
        </div>
        <div className="after-profile-fields">
          <label>Name<input name="name" value={profile.name} onChange={updateProfile} /></label><label>Phone<input name="phone" value={profile.phone} onChange={updateProfile} /></label>
          <label>Email<input value={profile.email} disabled /><small>Email cannot be changed.</small></label><label>Gender<select name="gender" value={profile.gender} onChange={updateProfile}><option value="">Select Gender</option><option value="female">Female</option><option value="male">Male</option><option value="other">Other</option></select></label>
          <label className="after-profile-address">Address<textarea name="address" value={profile.address} onChange={updateProfile} rows="3" /></label>
        </div>
        <button type="submit" className="after-profile-button" disabled={loading || saving}>{loading ? 'Loading...' : saving ? 'Saving...' : 'Save Changes'}</button>
      </form>
      <form className="after-password-card" onSubmit={async (event) => { event.preventDefault(); try { const result = await updatePassword(password); setFeedback(result.message); setPassword({ current: '', next: '', confirm: '' }) } catch (error) { setFeedback(error.message) } }}>
        <h2>Change Password</h2><div className="after-password-fields"><label>Current Password<input type="password" name="current" value={password.current} onChange={updatePasswordFields} required /></label><label>New Password<input type="password" name="next" value={password.next} onChange={updatePasswordFields} minLength="8" required /></label><label>Confirm New Password<input type="password" name="confirm" value={password.confirm} onChange={updatePasswordFields} minLength="8" required /></label></div><button type="submit" className="after-profile-button">Update Password</button>
      </form>
      {feedback && <p className="after-profile-feedback" role="status">{feedback}</p>}
    </section>
  )
}

export default MyProfilePage
