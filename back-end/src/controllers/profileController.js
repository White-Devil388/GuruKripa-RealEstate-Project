import { changePassword, getProfile, updateProfile } from '../services/api/profileService.js'

export function readProfile(request, response) {
  return response.json({ profile: getProfile(request.user) })
}

export async function saveProfile(request, response) {
  const result = await updateProfile(request.user, request.body)

  if (result.error) {
    return response.status(result.status).json({ message: result.error })
  }

  return response.json({ profile: result.profile, message: 'Profile updated successfully.' })
}

export async function savePassword(request, response) {
  const result = await changePassword(request.user, request.body)
  if (result.error) return response.status(result.status).json({ message: result.error })
  return response.json(result)
}