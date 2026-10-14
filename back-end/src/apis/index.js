import express from 'express'
import authRoutes from './authRoutes.js'
import healthRoutes from './healthRoutes.js'
import adminRoutes from './adminRoutes.js'
import profileRoutes from './profileRoutes.js'
import agentRoutes from './agentRoutes.js'

// Guru Kripa Public Website Routes
import leadRoutes from '../routes/leadRoutes.js'
import projectRoutes from '../routes/projectRoutes.js'
import blogRoutes from '../routes/blogRoutes.js'
import careerRoutes from '../routes/careerRoutes.js'
import companyRoutes from '../routes/companyRoutes.js'
import mediaRoutes from '../routes/mediaRoutes.js'

const router = express.Router()

// System & Portal Routes
router.use('/health', healthRoutes)
router.use('/auth', authRoutes)
router.use('/admin', adminRoutes)
router.use('/profile', profileRoutes)
router.use('/agent', agentRoutes)

// Website Routes
router.use('/leads', leadRoutes)
router.use('/projects', projectRoutes)
router.use('/blogs', blogRoutes)
router.use('/careers', careerRoutes)
router.use('/company', companyRoutes)
router.use('/media', mediaRoutes)

export default router
