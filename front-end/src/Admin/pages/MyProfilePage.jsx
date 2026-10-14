import { useEffect, useState } from 'react'
import { getProfile, updateProfile as apiUpdateProfile, updatePassword as apiUpdatePassword } from '../../services/api'

function MyProfilePage() {
  const [profile, setProfile] = useState({ name: 'Super Admin', phone: '' })
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' })
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  useEffect(() => { getProfile().then((data) => setProfile({ name: data.name, phone: data.phone })).catch((error) => setMessage(error.message)).finally(() => setLoading(false)) }, [])

  const handleChangeProfile = (event) => setProfile((current) => ({ ...current, [event.target.name]: event.target.value }))
  const handleChangePassword = (event) => setPasswords((current) => ({ ...current, [event.target.name]: event.target.value }))
  
  const saveProfile = async (event) => { 
    event.preventDefault(); 
    setSaving(true); 
    try { 
      const result = await apiUpdateProfile({ name: profile.name, phone: profile.phone }); 
      setProfile((current) => ({ ...current, ...result.profile })); 
      setMessage(result.message) 
    } catch (error) { 
      setMessage(error.message) 
    } finally { 
      setSaving(false) 
    } 
  }
  
  const changePassword = async (event) => { 
    event.preventDefault(); 
    if (passwords.next !== passwords.confirm) {
      return setMessage('New passwords do not match.')
    }
    try {
      const result = await apiUpdatePassword({ currentPassword: passwords.current, newPassword: passwords.next })
      setMessage(result.message)
      setPasswords({ current: '', next: '', confirm: '' })
    } catch (err) {
      setMessage(err.message)
    }
  }

  return (
    <div className="admin-profile-page">
      <header className="admin-profile-heading"><span className="eyebrow">Admin Panel</span><h1>My Profile</h1><p>Manage your account information.</p></header>

      <form className="profile-card profile-details-card" onSubmit={saveProfile}>
        <div className="profile-meta-grid"><div><span>Role</span><strong>Super Admin</strong></div><div><span>Status</span><b className="profile-active-badge">Active</b></div></div>
        <div className="profile-form-grid"><label>Name<input name="name" value={profile.name} onChange={handleChangeProfile} /></label><label>Phone<input name="phone" value={profile.phone} onChange={handleChangeProfile} /></label><label>Email<input value="admin@mlm.com" readOnly disabled /><small>Email cannot be changed.</small></label></div>
        <button type="submit" className="profile-action-button" disabled={loading || saving}>{loading ? 'Loading...' : saving ? 'Saving...' : 'Save Changes'}</button>
      </form>

      <form className="profile-card password-card" onSubmit={changePassword}>
        <h2>Change Password</h2>
        <div className="password-form-grid"><label>Current Password<input type="password" name="current" value={passwords.current} onChange={handleChangePassword} required /></label><label>New Password<input type="password" name="next" value={passwords.next} onChange={handleChangePassword} required /></label><label>Confirm New Password<input type="password" name="confirm" value={passwords.confirm} onChange={handleChangePassword} required /></label></div>
        <button type="submit" className="profile-action-button">Update Password</button>
      </form>
      {message && <p className="profile-feedback" role="status">{message}</p>}
    </div>
  )
}

export default MyProfilePage
