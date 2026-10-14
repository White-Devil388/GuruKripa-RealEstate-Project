import 'dotenv/config'
import { connectDatabase } from './src/config/database.js'
import { upsertAgentCustomer, upsertAgentTicket, upsertAgentWithdrawal, upsertProject, upsertSiteVisit } from './src/models/agentDataModel.js'
import { upsertUserByEmail } from './src/models/userModel.js'
import { upsertRoleByName } from './src/models/roleModel.js'
import { upsertResource } from './src/services/api/adminCrudService.js'
import mongoose from 'mongoose'

const users = [
  { email: 'admin@123.com', firstName: 'System', lastName: 'Admin', phone: '9999999999', role: 'Admin', password: 'admin123', status: 'Active' },
  { email: 'admin@northstar.test', firstName: 'Northstar', lastName: 'Admin', phone: '9999999999', role: 'Admin', password: 'Admin@123', status: 'Active' },
  { email: 'approved.agent@northstar.test', firstName: 'Aarav', lastName: 'Sharma', phone: '9876543210', role: 'Agent', password: 'Agent@123', referralCode: 'GK-1001', kycStatus: 'Approved', kycDetails: { aadhaar: '123456789012', pan: 'ABCDE1234F', accountNumber: '001234567890', ifsc: 'SBIN0001234', bankName: 'SBI' }, kycDocuments: { aadhaarFront: 'aarav-aadhaar-front.pdf', aadhaarBack: 'aarav-aadhaar-back.pdf', panDocument: 'aarav-pan.pdf', bankProof: 'aarav-bank-proof.pdf' } },
  { email: 'pending.agent@northstar.test', firstName: 'Diya', lastName: 'Verma', phone: '9876501234', role: 'Agent', password: 'Agent@123', referralCode: 'GK-1002', kycStatus: 'Submitted', kycDetails: { aadhaar: '234567890123', pan: 'FGHIJ5678K', accountNumber: '009876543210', ifsc: 'HDFC0001234', bankName: 'HDFC Bank' } },
  { email: 'rohan.agent@northstar.test', firstName: 'Rohan', lastName: 'Das', phone: '9876511111', role: 'Agent', password: 'Agent@123', referralCode: 'GK-1003', kycStatus: 'Approved', kycDetails: { aadhaar: '323456789012', pan: 'XBCDE1234F', accountNumber: '101234567890', ifsc: 'ICIC0001234', bankName: 'ICICI' } },
  { email: 'simran.agent@northstar.test', firstName: 'Simran', lastName: 'Kaur', phone: '9876522222', role: 'Agent', password: 'Agent@123', referralCode: 'GK-1004', kycStatus: 'Rejected', kycDetails: { aadhaar: '423456789012', pan: 'YBCDE1234F' } }
]

const projects = [
  ['project-crown-city', { name: 'The Crown City', location: 'Indore', plots: 248, rate: 'Rs. 2,100/sqft', status: 'Ongoing' }],
  ['project-green-valley', { name: 'Green Valley', location: 'Bhopal', plots: 120, rate: 'Rs. 1,850/sqft', status: 'Ongoing' }],
  ['project-sunrise-enclave', { name: 'Sunrise Enclave', location: 'Pune', plots: 300, rate: 'Rs. 3,500/sqft', status: 'Completed' }],
  ['project-royal-heritage', { name: 'Royal Heritage', location: 'Mumbai', plots: 50, rate: 'Rs. 15,000/sqft', status: 'Upcoming' }],
  ['project-lakeview', { name: 'Lakeview Heights', location: 'Bangalore', plots: 180, rate: 'Rs. 5,200/sqft', status: 'Ongoing' }],
  ['project-palm-groves', { name: 'Palm Groves', location: 'Delhi', plots: 80, rate: 'Rs. 10,000/sqft', status: 'Upcoming' }],
]

const resources = {
  bookings: [
    ['booking-1001', { customer: 'Riya Mehta', project: 'The Crown City', plot: 'B-04', amount: 'Rs. 42,500', date: '12 Sep 2026', status: 'Paid', step: 'Plot 01', dueDate: '15 Sep', amountDue: 'Rs. 42,500', emailOwner: 'approved.agent@northstar.test' }],
    ['booking-1002', { customer: 'Kabir Khan', project: 'Green Valley', plot: 'A-12', amount: 'Rs. 28,000', date: '10 Sep 2026', status: 'Pending', step: 'EMI - 1', dueDate: '20 Sep', amountDue: 'Rs. 28,000', emailOwner: 'approved.agent@northstar.test' }],
    ['booking-1003', { customer: 'Amit Singh', project: 'Sunrise Enclave', plot: 'C-22', amount: 'Rs. 1,50,000', date: '15 Sep 2026', status: 'Paid', step: 'Downpayment', dueDate: '15 Sep', amountDue: 'Rs. 1,50,000', emailOwner: 'rohan.agent@northstar.test' }],
    ['booking-1004', { customer: 'Sneha Patel', project: 'Lakeview Heights', plot: 'L-01', amount: 'Rs. 80,000', date: '18 Sep 2026', status: 'Overdue', step: 'EMI - 3', dueDate: '18 Sep', amountDue: 'Rs. 80,000', emailOwner: 'rohan.agent@northstar.test' }],
    ['booking-1005', { customer: 'Vikash Gupta', project: 'The Crown City', plot: 'B-05', amount: 'Rs. 42,500', date: '21 Sep 2026', status: 'Pending', step: 'Plot 02', dueDate: '25 Sep', amountDue: 'Rs. 42,500', emailOwner: 'approved.agent@northstar.test' }],
  ],
  leads: [
    ['lead-1001', { name: 'Neha Kapoor', phone: '9988776655', source: 'Referral', status: 'New', owner: 'approved.agent@northstar.test', assignedRole: 'Agent', assignedAgentEmail: 'approved.agent@northstar.test' }],
    ['lead-1002', { name: 'Vikram Joshi', phone: '9988776656', source: 'Website', status: 'Contacted', owner: 'pending.agent@northstar.test', assignedRole: 'Agent', assignedAgentEmail: 'pending.agent@northstar.test' }],
    ['lead-1003', { name: 'Mohit Agarwal', phone: '9988776657', source: 'Facebook Ads', status: 'Qualified', owner: 'rohan.agent@northstar.test', assignedRole: 'Agent', assignedAgentEmail: 'rohan.agent@northstar.test' }],
    ['lead-1004', { name: 'Priya Iyer', phone: '9988776658', source: 'Google Ads', status: 'Lost', owner: 'admin@northstar.test', assignedRole: 'Admin', assignedAgentEmail: 'admin@northstar.test' }],
    ['lead-1005', { name: 'Karan Malhotra', phone: '9988776659', source: 'Direct', status: 'Converted', owner: 'approved.agent@northstar.test', assignedRole: 'Agent', assignedAgentEmail: 'approved.agent@northstar.test' }],
  ],
  'audit-logs': [
    ['audit-1001', { actor: 'Northstar Admin', action: 'KYC Approved', target: 'approved.agent@northstar.test', date: '17 Sep 2026', status: 'Success' }],
    ['audit-1002', { actor: 'Northstar Admin', action: 'KYC Rejected', target: 'simran.agent@northstar.test', date: '18 Sep 2026', status: 'Success' }],
    ['audit-1003', { actor: 'Northstar Admin', action: 'Lead Reassigned', target: 'lead-1003', date: '19 Sep 2026', status: 'Success' }],
    ['audit-1004', { actor: 'Aarav Sharma', action: 'Project Downloaded', target: 'The Crown City', date: '21 Sep 2026', status: 'Success' }],
  ],
  'referral-links': [
    ['referral-1001', { emailOwner: 'approved.agent@northstar.test', name: 'Ishaan Patel', email: 'ishaan@example.com', status: 'Active', kyc: 'Verified' }],
    ['referral-1002', { emailOwner: 'approved.agent@northstar.test', name: 'Meera Singh', email: 'meera@example.com', status: 'Pending', kyc: 'Pending' }],
    ['referral-1003', { emailOwner: 'rohan.agent@northstar.test', name: 'Raj Kumar', email: 'raj@example.com', status: 'Active', kyc: 'Verified' }],
    ['referral-1004', { emailOwner: 'rohan.agent@northstar.test', name: 'Alia Bhatt', email: 'alia@example.com', status: 'Pending', kyc: 'Pending' }],
  ],
  'full-tree': [
    ['tree-1001', { emailOwner: 'approved.agent@northstar.test', name: 'Ishaan Patel', level: 1, status: 'Active', kyc: 'Verified' }],
    ['tree-1002', { emailOwner: 'approved.agent@northstar.test', name: 'Meera Singh', level: 1, status: 'Pending', kyc: 'Pending' }],
    ['tree-1003', { emailOwner: 'rohan.agent@northstar.test', name: 'Raj Kumar', level: 1, status: 'Active', kyc: 'Verified' }],
    ['tree-1004', { emailOwner: 'rohan.agent@northstar.test', name: 'Arjun Das', level: 2, status: 'Active', kyc: 'Verified' }],
  ],
  'account-ledger': [
    ['ledger-1001', { emailOwner: 'approved.agent@northstar.test', type: 'online', amount: 18500, description: 'Booking commission', status: 'Credited', date: '16 Sep 2026' }],
    ['ledger-1002', { emailOwner: 'approved.agent@northstar.test', type: 'cash', amount: 7200, description: 'Referral commission', status: 'Credited', date: '14 Sep 2026' }],
    ['ledger-1003', { emailOwner: 'rohan.agent@northstar.test', type: 'online', amount: 25000, description: 'Performance Bonus', status: 'Credited', date: '19 Sep 2026' }],
    ['ledger-1004', { emailOwner: 'rohan.agent@northstar.test', type: 'online', amount: 5000, description: 'Withdrawal', status: 'Debited', date: '20 Sep 2026' }],
  ],
  'rank-levels': [
    ['rank-1001', { name: 'Business Executive', code: 'B.EX', next: 'Senior Business Executive', needed: 75 }],
    ['rank-1002', { name: 'Senior Business Executive', code: 'S.EX', next: 'Team Leader', needed: 150 }],
    ['rank-1003', { name: 'Team Leader', code: 'TL', next: 'Manager', needed: 300 }],
  ],
  'payment-plans': [
    ['plan-1001', { project: 'The Crown City', name: 'Standard 24 Months', months: 24, amount: 'Rs. 24,000' }],
    ['plan-1002', { project: 'Green Valley', name: 'Premium 12 Months', months: 12, amount: 'Rs. 50,000' }],
    ['plan-1003', { project: 'Sunrise Enclave', name: 'Early Bird 36 Months', months: 36, amount: 'Rs. 15,000' }],
  ],
  'edit-requests': [
    ['edit-1001', { booking: 'B-04', requestedBy: 'Riya Mehta', currentAmount: 'Rs. 10,000', proposedAmount: 'Rs. 12,500', status: 'Pending' }],
    ['edit-1002', { booking: 'A-12', requestedBy: 'Kabir Khan', currentAmount: 'Rs. 28,000', proposedAmount: 'Rs. 20,000', status: 'Approved' }],
  ],
  'installment-dues': [
    ['due-1001', { customer: 'Riya Mehta', project: 'The Crown City', dueDate: '15 Sep 2026', amount: 'Rs. 42,500', status: 'Pending' }],
    ['due-1002', { customer: 'Sneha Patel', project: 'Lakeview Heights', dueDate: '18 Sep 2026', amount: 'Rs. 80,000', status: 'Overdue' }],
    ['due-1003', { customer: 'Vikash Gupta', project: 'The Crown City', dueDate: '25 Sep 2026', amount: 'Rs. 42,500', status: 'Pending' }],
  ],
  'installments-emi': [
    ['emi-1001', { booking: 'booking-1001', customer: 'Riya Mehta', dueDate: '15 Sep 2026', amount: 'Rs. 10,000', status: 'Paid' }],
    ['emi-1002', { booking: 'booking-1002', customer: 'Kabir Khan', dueDate: '20 Sep 2026', amount: 'Rs. 5,000', status: 'Pending' }],
    ['emi-1003', { booking: 'booking-1004', customer: 'Sneha Patel', dueDate: '18 Sep 2026', amount: 'Rs. 8,000', status: 'Overdue' }],
  ],
  reports: [
    ['report-1001', { name: 'Q3 Sales Performance', type: 'Sales', period: 'Q3 2026', status: 'Generated' }],
    ['report-1002', { name: 'Executive Leaderboard', type: 'Performance', period: 'Sep 2026', status: 'Generated' }],
    ['report-1003', { name: 'Upcoming EMI Defaults', type: 'Finance', period: 'Future 30 Days', status: 'Pending' }],
  ],
  'subadmins': [
    ['subadmin-1001', { name: 'Anjali Sharma', email: 'anjali.admin@northstar.test', phone: '9988771122', status: 'Active' }],
    ['subadmin-1002', { name: 'Rajive Kumar', email: 'rajive.admin@northstar.test', phone: '9988773344', status: 'Inactive' }],
  ],
  'finance-tds': [
    ['tds-1001', { period: 'Aug 2026', gross: 'Rs. 5,00,000', tds: 'Rs. 25,000', net: 'Rs. 4,75,000', status: 'Filed' }],
    ['tds-1002', { period: 'Sep 2026', gross: 'Rs. 8,50,000', tds: 'Rs. 42,500', net: 'Rs. 8,07,500', status: 'Pending' }],
  ],
}

await connectDatabase()

for (const role of ['Admin', 'Manager', 'Team Lead', 'Agent', 'Sales Executive']) await upsertRoleByName(role)

for (const user of users) await upsertUserByEmail(user.email, user)
for (const [id, project] of projects) await upsertProject(id, project)

const customers = [
  ['customer-1001', { code: 'CUST0001', name: 'Riya Mehta', phone: '9988776655', email: 'riya@example.com', addedBy: 'approved.agent@northstar.test', emailOwner: 'approved.agent@northstar.test', status: 'Active' }],
  ['customer-1002', { code: 'CUST0002', name: 'Kabir Khan', phone: '9988776656', email: 'kabir@example.com', addedBy: 'approved.agent@northstar.test', emailOwner: 'approved.agent@northstar.test', status: 'Active' }],
  ['customer-1003', { code: 'CUST0003', name: 'Amit Singh', phone: '9988776657', email: 'amit@example.com', addedBy: 'rohan.agent@northstar.test', emailOwner: 'rohan.agent@northstar.test', status: 'Active' }],
  ['customer-1004', { code: 'CUST0004', name: 'Sneha Patel', phone: '9988776658', email: 'sneha@example.com', addedBy: 'rohan.agent@northstar.test', emailOwner: 'rohan.agent@northstar.test', status: 'Active' }],
]
for (const [id, data] of customers) await upsertAgentCustomer(id, data)

const tickets = [
  ['ticket-1001', { email: 'approved.agent@northstar.test', subject: 'Welcome support request', message: 'Please share the onboarding checklist.', status: 'Open', createdAt: new Date().toISOString() }],
  ['ticket-1002', { email: 'rohan.agent@northstar.test', subject: 'Payout issue', message: 'My last commission is delayed.', status: 'Closed', createdAt: new Date(Date.now() - 86400000).toISOString() }],
  ['ticket-1003', { email: 'pending.agent@northstar.test', subject: 'KYC Document update', message: 'I need to upload a clearer PAN card image.', status: 'Open', createdAt: new Date(Date.now() - 3600000).toISOString() }],
]
for (const [id, data] of tickets) await upsertAgentTicket(id, data)

const visits = [
  ['visit-1001', { emailOwner: 'approved.agent@northstar.test', customer: 'Riya Mehta', project: 'The Crown City', date: '2026-09-20', notes: 'Site visit scheduled.', status: 'Scheduled' }],
  ['visit-1002', { emailOwner: 'rohan.agent@northstar.test', customer: 'Amit Singh', project: 'Sunrise Enclave', date: '2026-09-18', notes: 'Customer loved the view.', status: 'Completed' }],
  ['visit-1003', { emailOwner: 'approved.agent@northstar.test', customer: 'Vikash Gupta', project: 'The Crown City', date: '2026-09-22', notes: 'Follow up required after visit.', status: 'Scheduled' }],
]
for (const [id, data] of visits) await upsertSiteVisit(id, data)

const withdrawals = [
  ['withdrawal-1001', { emailOwner: 'approved.agent@northstar.test', type: 'online', amount: 12500, status: 'Pending' }],
  ['withdrawal-1002', { emailOwner: 'rohan.agent@northstar.test', type: 'online', amount: 20000, status: 'Approved' }],
  ['withdrawal-1003', { emailOwner: 'approved.agent@northstar.test', type: 'cash', amount: 5000, status: 'Rejected' }],
]
for (const [id, data] of withdrawals) await upsertAgentWithdrawal(id, data)

for (const [resource, records] of Object.entries(resources)) {
  for (const [id, data] of records) await upsertResource(resource, id, data)
}

console.log('MongoDB seed completed successfully.')
await mongoose.disconnect()