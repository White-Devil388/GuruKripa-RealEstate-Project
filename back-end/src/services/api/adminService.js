import { getCustomers, getDashboard, getExecutives, getProjects } from '../../models/adminDataModel.js'
import { getOperations } from './adminOperationsService.js'

export async function dashboardData() {
	const dashboard = await getDashboard()
	const [operations] = await Promise.all([getOperations()])
	const openTickets = operations.tickets.filter((ticket) => ticket.status === 'Open').length
	const pendingWithdrawals = operations.withdrawals.filter((withdrawal) => withdrawal.status === 'Pending').length

	return {
		...dashboard,
		topMetrics: dashboard.topMetrics.map((metric, index) => index === 0 ? { ...metric, value: String(dashboard.customers.length) } : metric),
		operationMetrics: [
			...dashboard.operationMetrics,
			{ label: 'Pending Withdrawals', value: String(pendingWithdrawals), tone: 'amber', icon: 'WD' },
			{ label: 'Open Tickets', value: String(openTickets), tone: 'coral', icon: 'TK' },
			{ label: 'Site Visits', value: String(operations.visits.length), tone: 'blue', icon: 'SV' },
		],
		bookings: dashboard.bookings,
		alertSummary: { dueToday: 0, overdueAmount: 'Rs. 0' },
	}
}
export function projectData() { return getProjects() }
export function customerData() { return getCustomers() }
export function executiveData() { return getExecutives() }