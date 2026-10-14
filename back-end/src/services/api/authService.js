import { createUser, findUserByEmail, userExists, findUserByReferralCode } from '../../models/userModel.js'
import { createAccessToken } from '../../config/jwt.js'

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase()
}

export async function registerUser(data) {
  const normalizedEmail = normalizeEmail(data.email)

  if (!data.firstName || !data.lastName || !normalizedEmail || !data.phone || !data.role || !data.kycDocument || !data.kycDocumentNumber || !data.password) {
    return { error: 'All signup fields are required.', status: 400 }
  }

  if (String(data.role).toLowerCase() !== 'agent') {
    return { error: 'Only agent accounts can sign up.', status: 403 }
  }

  if (await userExists(normalizedEmail)) {
    return { error: 'An account with this email already exists.', status: 409 }
  }

  const newReferralCode = 'GK-' + Math.floor(1000 + Math.random() * 9000);
  const user = {
    firstName: data.firstName,
    lastName: data.lastName,
    email: normalizedEmail,
    phone: data.phone,
    role: data.role,
    kycDocument: data.kycDocument,
    kycDocumentNumber: data.kycDocumentNumber,
    referralCode: newReferralCode,
    referredBy: data.referredBy
  }
  await createUser({ ...user, password: data.password })

  if (data.referredBy) {
    const { createResource } = await import('./adminCrudService.js');
    const name = `${user.firstName} ${user.lastName}`.trim();
    
    let currentSponsorCode = data.referredBy;
    let currentLevel = 1;
    
    while (currentSponsorCode) {
      const parentAgent = await findUserByReferralCode(currentSponsorCode);
      if (!parentAgent) break; // Break if no parent agent matches the code
      
      // Add this new user to the sponsor's downline tree
      await createResource('full-tree', { 
        emailOwner: parentAgent.email, 
        name, 
        level: currentLevel, 
        status: 'Active', 
        kyc: 'Submitted' 
      });

      // Direct referral-links resource is strictly for Level 1 immediate referrals
      if (currentLevel === 1) {
        await createResource('referral-links', { 
          emailOwner: parentAgent.email, 
          name, 
          email: user.email, 
          status: 'Active', 
          kyc: 'Submitted' 
        });
      }
      
      // Move up the tree to the next sponsor for Level 2, Level 3...
      currentSponsorCode = parentAgent.referredBy;
      currentLevel++;
      
      // Safeguard against circular dependencies or extremely deep spam trees
      if (currentLevel > 15) break;
    }
  }

  return { user, token: createAccessToken(user) }
}

export async function authenticateUser(data) {
  const requestedRole = String(data.role || '').toLowerCase()

  if (!['agent', 'admin'].includes(requestedRole)) {
    return { error: 'Invalid account type.', status: 403 }
  }

  const user = await findUserByEmail(normalizeEmail(data.email))

  if (!user || user.password !== data.password || user.role.toLowerCase() !== requestedRole) {
    return { error: 'Invalid email, password, or account type.', status: 401 }
  }

  const { password: _password, ...publicUser } = user
  return { user: publicUser, token: createAccessToken(user) }
}
