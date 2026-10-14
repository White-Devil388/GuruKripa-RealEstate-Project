import { Router } from 'express'
import { readProfile, savePassword, saveProfile } from '../controllers/profileController.js'
import { requireAuth } from '../middleware/authMiddleware.js'

const router = Router()

router.use(requireAuth)
router.get('/', readProfile)
router.patch('/', saveProfile)
router.patch('/password', savePassword)

export default router