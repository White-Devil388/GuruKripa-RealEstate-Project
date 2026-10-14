import { Router } from 'express'
import { addCustomer, removeCustomer, addSiteVisit, removeVisit, addTicket, afterDashboard, assignedLeads, commissions, customers, dashboard, listTickets, projects, rank, readKyc, referrals, saveKyc, team, visits, wallet, withdrawal, addAgentComment } from '../controllers/agentController.js'
import { requireApprovedAgent, requireAuth, requireRole } from '../middleware/authMiddleware.js'
import { kycUpload } from '../middleware/uploadMiddleware.js'

const router = Router()

router.use(requireAuth, requireRole('Agent'))
router.get('/dashboard', dashboard)
router.get('/after-dashboard', requireApprovedAgent, afterDashboard)
router.get('/kyc', readKyc)
router.post('/kyc', kycUpload.fields([
	{ name: 'aadhaarFront', maxCount: 1 },
	{ name: 'aadhaarBack', maxCount: 1 },
	{ name: 'panDocument', maxCount: 1 },
	{ name: 'bankProof', maxCount: 1 },
]), saveKyc)
router.get('/support/tickets', listTickets)
router.post('/support/tickets', addTicket)
router.use(requireApprovedAgent)
router.get('/leads', assignedLeads)
router.post('/leads/:id/comments', addAgentComment)
router.get('/projects', projects)
router.get('/customers', customers)
router.post('/customers', addCustomer)
router.patch('/customers/:id', addCustomer) // Wait, addCustomer function needs to handle update if we reuse it
router.delete('/customers/:id', removeCustomer)
router.get('/wallet', wallet)
router.post('/wallet/withdrawals', withdrawal)
router.get('/commissions', commissions)
router.get('/team', team)
router.get('/referrals', referrals)
router.get('/visits', visits)
router.post('/visits', addSiteVisit)
router.patch('/visits/:id', addSiteVisit)
router.delete('/visits/:id', removeVisit)
router.get('/rank', rank)

export default router