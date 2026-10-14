import 'dotenv/config'
import app from './src/app.js'
import { connectDatabase } from './src/config/database.js'

const port = process.env.PORT || 5000

try {
  await connectDatabase()
  app.listen(port, () => {
    console.log(`Guru Kripa Unified API server running at http://localhost:${port}`)
  })
} catch (error) {
  console.error(`MongoDB connection failed: ${error.message}`)
  process.exit(1)
}
