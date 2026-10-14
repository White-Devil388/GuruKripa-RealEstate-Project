import { authenticateUser, registerUser } from '../services/api/index.js'

export async function signup(request, response) {
  const result = await registerUser(request.body)

  if (result.error) {
    return response.status(result.status).json({ message: result.error })
  }

  return response.status(201).json({ user: result.user, token: result.token, message: 'Account created successfully.' })
}

export async function login(request, response) {
  const result = await authenticateUser(request.body)

  if (result.error) {
    return response.status(result.status).json({ message: result.error })
  }

  return response.json({ user: result.user, token: result.token, message: 'Signed in successfully.' })
}
