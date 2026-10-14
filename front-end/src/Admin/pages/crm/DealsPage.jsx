import CRMSectionPage from './CRMSectionPage'

function DealsPage() {
  return <CRMSectionPage title="Deals" description="Track active opportunities, negotiations and closed property deals." resource="bookings" columns={['Deal', 'Project', 'Amount', 'Status']} mapRecord={(deal) => [`${deal.customer || 'Deal'} - ${deal.plot || '-'}`, deal.project || '-', deal.amount || '-', deal.status || 'Pending']} />
}

export default DealsPage
