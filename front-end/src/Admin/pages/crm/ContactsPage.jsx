import CRMSectionPage from './CRMSectionPage'
import { getAdminCustomers } from '../../../services/api'

function ContactsPage() {
  return <CRMSectionPage title="Contacts" description="Keep customer conversations and property preferences organized." loadRecords={getAdminCustomers} columns={['Contact', 'Email', 'Phone', 'Status']} mapRecord={(contact) => [contact.name || '-', contact.email || '-', contact.phone || '-', contact.status || 'Active']} />
}

export default ContactsPage
