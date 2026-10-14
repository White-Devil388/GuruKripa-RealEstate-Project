import CRMSectionPage from './CRMSectionPage'
import { getAdminOperations } from '../../../services/api'

function MeetingsPage() {
  return <CRMSectionPage title="Meetings" description="Schedule and review customer meetings and site visits." loadRecords={async () => (await getAdminOperations()).visits || []} columns={['Meeting', 'Contact', 'Date', 'Status']} mapRecord={(meeting) => [`${meeting.project || 'Site'} visit`, meeting.customer || '-', meeting.date || '-', meeting.status || 'Scheduled']} />
}

export default MeetingsPage
