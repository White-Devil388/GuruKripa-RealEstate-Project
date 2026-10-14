import dns from 'dns'
import mongoose from 'mongoose'

// Fix for SRV DNS resolution ECONNREFUSED issues on certain Windows networks/ISPs
try {
  dns.setServers(['8.8.8.8', '1.1.1.1'])
} catch {
  // Ignore DNS override errors in restricted environments
}

export async function connectDatabase() {
  const connectionString = process.env.MONGODB_URI || process.env.MONGO_URI

  if (!connectionString) {
    throw new Error('MONGODB_URI is not configured in .env')
  }

  await mongoose.connect(connectionString)

  console.log(`MongoDB connected: ${mongoose.connection.host}/${mongoose.connection.name}`)
}

export default connectDatabase
