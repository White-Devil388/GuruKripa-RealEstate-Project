import fs from 'node:fs'
import path from 'node:path'
import multer from 'multer'

const uploadDirectory = path.join(process.cwd(), 'uploads', 'kyc')
fs.mkdirSync(uploadDirectory, { recursive: true })

const storage = multer.diskStorage({
  destination: uploadDirectory,
  filename: (request, file, callback) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '-')
    callback(null, `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}`)
  },
})

function fileFilter(request, file, callback) {
  if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') return callback(null, true)
  return callback(new Error('Only image or PDF KYC documents are allowed.'))
}

export const kycUpload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024, files: 4 },
})
