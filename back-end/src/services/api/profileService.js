import { updateUserByEmail } from '../../models/userModel.js'

function publicProfile(user) {
  const { password: _password, firstName, lastName, ...profile } = user

  return {
    ...profile,
    name: `${firstName} ${lastName}`.trim(),
    gender: user.gender || '',
    address: user.address || '',
  }
}

export function getProfile(user) {
  return publicProfile(user)
}

export async function updateProfile(user, data) {
  const nameParts = String(data.name || '').trim().split(/\s+/).filter(Boolean)

  if (!nameParts.length || !String(data.phone || '').trim()) {
    return { error: 'Name and phone are required.', status: 400 }
  }

  const updatedUser = await updateUserByEmail(user.email, {
    firstName: nameParts.shift(),
    lastName: nameParts.join(' '),
    phone: String(data.phone).trim(),
    gender: String(data.gender || '').trim(),
    address: String(data.address || '').trim(),
  })

  return { profile: publicProfile(updatedUser) }
}

export async function changePassword(user, data) {
  if (!data.current || !data.next || data.next !== data.confirm) return { error: 'Passwords are required and must match.', status: 400 }
  if (user.password !== data.current) return { error: 'Current password is incorrect.', status: 401 }
  if (String(data.next).length < 8) return { error: 'New password must be at least 8 characters.', status: 400 }
  await updateUserByEmail(user.email, { password: data.next })
  return { message: 'Password updated successfully.' }
}