import CRMSectionPage from './CRMSectionPage'

function SettingsPage() {
  return <CRMSectionPage title="Settings" description="Configure CRM preferences, notifications and workspace defaults." resource="settings" columns={['Setting', 'Current value', 'Status']} mapRecord={(setting) => [setting.name || setting.key || setting.id, setting.value || '-', setting.status || 'Active']} />
}

export default SettingsPage
