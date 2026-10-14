import { getAllCustomers, getAllProjects } from './agentDataModel.js'
import { getAllUsers } from './userModel.js'
import { listResource } from '../services/api/adminCrudService.js'

export async function getProjects() { return getAllProjects() }
export async function getCustomers() { return getAllCustomers() }
export async function getExecutives() {
  const users = await getAllUsers()
  return users.filter((user) => user.role?.toLowerCase() === 'agent').map((user) => ({
    name: `${user.firstName} ${user.lastName}`.trim(), username: user.referralCode || user.email,
    email: user.email, phone: user.phone, designation: user.designation || 'Business Executive',
    level: user.level || 'Level 1', status: user.status || 'Active',
    kyc: user.kycStatus === 'Approved' ? 'Verified' : 'Pending', created: user.createdAt,
    initial: `${user.firstName || 'A'}`.charAt(0).toUpperCase(), color: user.color || 'blue',
    customCommission: user.customCommission || '',
  }))
}

export async function getDashboard() {
  const [projects, customers, executives, bookings, leads] = await Promise.all([
    getProjects(), getCustomers(), getExecutives(), listResource('bookings'), listResource('leads'),
  ])
  return {
    topMetrics: [
      { label: 'Total Customers', value: String(customers.length), note: 'Live from MongoDB', tone: 'blue', icon: 'US' },
      { label: 'Total Executives', value: String(executives.length), note: 'Live from MongoDB', tone: 'green', icon: 'EX' },
      { label: 'Total Projects', value: String(projects.length), note: 'Stored projects', tone: 'purple', icon: 'PR' },
      { label: 'Total Bookings', value: String(bookings.length), note: 'Stored bookings', tone: 'red', icon: 'BK' },
    ],
    operationMetrics: [
      { label: 'KYC Verified', value: String(executives.filter((user) => user.kyc === 'Verified').length), tone: 'green', icon: 'KY' },
      { label: 'Pending KYC', value: String(executives.filter((user) => user.kyc !== 'Verified').length), tone: 'blue', icon: 'PN' },
      { label: 'New Leads', value: String(leads.length), tone: 'blue', icon: 'LD' },
    ],
    bookings, projects, customers, executives, plotStatus: { total: projects.reduce((sum, project) => sum + Number(project.plots || 0), 0), available: 0, booked: 0, sold: 0 }, monthlyOverview: [],
  }
}