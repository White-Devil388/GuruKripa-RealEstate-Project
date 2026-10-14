import CRMSectionPage from './CRMSectionPage'

function EmailsPage() {
  return <CRMSectionPage title="Emails" description="Review customer emails and your grouped smartlists." resource="audit-logs" columns={['Subject', 'Contact', 'Date', 'Status']} mapRecord={(email) => [email.action || '-', email.target || email.actor || '-', email.date || '-', email.status || 'Open']} />
}

export default EmailsPage
