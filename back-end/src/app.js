import express from 'express'
import apiRoutes from './apis/index.js'
import multer from 'multer'

const app = express()
import path from 'node:path'

app.use((request, response, next) => {
	const allowedOrigins = [
		process.env.FRONTEND_URL,
		'http://localhost:5173',
		'http://localhost:5174',
		'http://localhost:5175'
	].filter(Boolean)
	const requestOrigin = request.headers.origin

	if (requestOrigin) {
		// Allow configured origins, or allow all in production if FRONTEND_URL is * or not strictly set
		if (allowedOrigins.includes(requestOrigin) || allowedOrigins.includes('*') || !process.env.FRONTEND_URL) {
			response.header('Access-Control-Allow-Origin', requestOrigin)
		}
	} else {
		response.header('Access-Control-Allow-Origin', '*')
	}

	response.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
	response.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS')
	if (request.method === 'OPTIONS') return response.sendStatus(204)
	return next()
})
app.use(express.json({ limit: '12mb' }))
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')))
app.use('/api', apiRoutes)

app.use((error, request, response, _next) => {
	if (error instanceof multer.MulterError) {
		const message = error.code === 'LIMIT_FILE_SIZE' ? 'Each KYC document must be smaller than 10 MB.' : `Upload failed: ${error.message}`
		return response.status(400).json({ message })
	}

	if (error.message === 'Only image or PDF KYC documents are allowed.') {
		return response.status(400).json({ message: error.message })
	}

	console.error(error)
	return response.status(500).json({ message: 'KYC upload failed. Please try again.' })
})

export default app
