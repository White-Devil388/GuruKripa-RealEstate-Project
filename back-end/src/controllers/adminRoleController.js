import { listRoles } from '../models/roleModel.js'
import { getAllUsers } from '../models/userModel.js'

export async function roles(request, response) {
  const [roleList, users] = await Promise.all([listRoles(), getAllUsers()])
  const agents = users
    .filter((user) => user.kycStatus === 'Approved' && ['Agent', 'Manager', 'Team Lead', 'Sales Executive'].includes(user.role))
    .map(({ password, ...user }) => user)

  return response.json({ data: { roles: roleList, agents } })
}
