import { useEffect, useState } from 'react'
import { createAdminResource, listAdminResource, updateAdminResource } from '../../services/api'

function SystemSettingsPage() {
  const [settings, setSettings] = useState({ title: '', email: '', phone: '', copyright: '', address: '', tds: '', ownerTds: '', minimumWithdrawal: '', approvalRequired: false })
  const [logoName, setLogoName] = useState('')
  const [saved, setSaved] = useState(false)
  const [settingsId, setSettingsId] = useState('')
  useEffect(() => { listAdminResource('settings').then((items) => { if (items[0]) { setSettingsId(items[0].id || ''); setSettings((current) => ({ ...current, ...items[0] })) } }).catch(() => {}) }, [])

  const updateSetting = (event) => {
    const { name, value, type, checked } = event.target
    setSettings((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
    setSaved(false)
  }

  const saveSettings = (event) => {
    event.preventDefault()
    const saveRequest = settingsId ? updateAdminResource('settings', settingsId, settings) : createAdminResource('settings', settings)
    saveRequest.then((result) => { setSettingsId(result.id); setSettings((current) => ({ ...current, ...result })); setSaved(true) }).catch(() => setSaved(false))
  }

  return (
    <form className="system-settings-page" onSubmit={saveSettings}>
      <section className="settings-section">
        <header>Section 0 - Business Settings</header>
        <div className="settings-grid">
          <label>Site Title *<input name="title" value={settings.title} onChange={updateSetting} required /></label>
          <label>Site Email<input type="email" name="email" value={settings.email} onChange={updateSetting} /></label>
          <label>Site Phone<input name="phone" value={settings.phone} onChange={updateSetting} /></label>
          <label>Copyright Text<input name="copyright" value={settings.copyright} onChange={updateSetting} /></label>
          <label className="settings-wide">Site Address<textarea name="address" value={settings.address} onChange={updateSetting} /></label>
          <label className="settings-wide">Site Logo<input type="file" accept=".jpg,.jpeg,.png" onChange={(event) => setLogoName(event.target.files?.[0]?.name || '')} /><small>Accepted: JPG, PNG (max 2MB). Click “Save All Settings” after choosing a file.</small></label>
        </div>
      </section>

      <section className="settings-section agent-settings-section">
        <header>Section 1 - Agent Settings</header>
        <div className="settings-toggle-row"><label><input type="checkbox" name="approvalRequired" checked={settings.approvalRequired} onChange={updateSetting} /> Agent Approval Required</label><p>When enabled, new agent registrations require admin approval before they can login</p></div>
      </section>

      <section className="settings-section">
        <header>Section 2 - Financial Settings</header>
        <div className="settings-grid financial-settings-grid">
          <label>TDS Percentage (%) *<input type="number" min="0" max="100" name="tds" value={settings.tds} onChange={updateSetting} /><small>Deducted from withdrawal amount</small></label>
          <label>Owner TDS Percentage (%) *<input type="number" min="0" max="100" name="ownerTds" value={settings.ownerTds} onChange={updateSetting} /><small>Applied to Company’s commission share</small></label>
          <label>Minimum Withdrawal Amount *<input type="number" min="0" name="minimumWithdrawal" value={settings.minimumWithdrawal} onChange={updateSetting} /><small>Minimum amount agent can withdraw</small></label>
        </div>
      </section>

      <button type="submit" className="save-settings-button">{saved ? 'Settings Saved' : 'Save All Settings'}</button>
      {logoName && <span className="settings-file-name">Selected logo: {logoName}</span>}
    </form>
  )
}

export default SystemSettingsPage
