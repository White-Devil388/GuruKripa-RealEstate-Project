import { Router } from 'express'
import { customers, dashboard, executives, projects, saveProject, removeProject, saveCustomer, removeCustomer, saveExecutive, removeExecutive, addExecutive } from '../controllers/adminController.js'
import { requireAuth, requireRole } from '../middleware/authMiddleware.js'
import { operations, setKycStatus, setWithdrawalStatus, setAgentCommission, generateTicket, updateTicket, removeTicket } from '../controllers/adminOperationsController.js'
import { assign, create, list, remove, update, addComment } from '../controllers/adminCrudController.js'
import { roles } from '../controllers/adminRoleController.js'

const router = Router()

router.use(requireAuth, requireRole('Admin'))

router.get('/dashboard', dashboard)
router.get('/projects', projects)
router.post('/projects', saveProject)
router.patch('/projects/:id', saveProject)
router.delete('/projects/:id', removeProject)

router.get('/customers', customers)
router.post('/customers', saveCustomer)
router.patch('/customers/:id', saveCustomer)
router.delete('/customers/:id', removeCustomer)

router.get('/executives', executives)
router.post('/executives', addExecutive)
router.patch('/executives/:email', saveExecutive)
router.delete('/executives/:email', removeExecutive)

router.get('/roles', roles)
router.get('/operations', operations)
router.post('/operations/tickets', generateTicket)
router.patch('/operations/tickets/:id', updateTicket)
router.delete('/operations/tickets/:id', removeTicket)
router.patch('/kyc/:email', setKycStatus)
router.patch('/executives/:email/commission', setAgentCommission)
router.patch('/withdrawals/:id', setWithdrawalStatus)
router.get('/resources/:resource', list)
router.post('/resources/:resource', create)
router.patch('/resources/:resource/:id', update)
router.patch('/resources/leads/:id/assign', assign)
router.post('/resources/leads/:id/comments', addComment)
router.delete('/resources/:resource/:id', remove)

export default router