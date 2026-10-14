import CRMSectionPage from './CRMSectionPage'
import { getAdminDashboard } from '../../../services/api'

function DashboardPage() {
  return <CRMSectionPage title="Default Dashboard" description="Overview of your CRM activity, leads and agent performance." loadRecords={async () => { const dashboard = await getAdminDashboard(); return [...(dashboard.topMetrics || []), ...(dashboard.operationMetrics || [])] }} columns={['Metric', 'Value', 'Change']} mapRecord={(metric) => [metric.label, metric.value, metric.note || 'Live data']} />
}

export default DashboardPage
