export const buildPublicUsersFilter = () => ({
  role: { $nin: ['admin', 'subadmin'] }
});

export const validatePublicSignupRequest = (body = {}) => {
  const payload = body || {};
  const roleValue = typeof payload.role === 'string' ? payload.role.trim().toLowerCase() : '';
  const adminSecretProvided = Boolean(
    payload.adminSecret ||
    payload.adminSecretKey ||
    payload.adminSeedPassword ||
    payload.seedAdminPassword ||
    payload.isAdmin ||
    payload.is_admin ||
    payload.adminAccessCode
  );
  const kycType = typeof payload.kycType === 'string' ? payload.kycType.trim().toUpperCase() : '';
  const kycNumber = typeof payload.kycNumber === 'string' ? payload.kycNumber.trim() : '';

  if (roleValue === 'admin' || roleValue === 'administrator' || roleValue === 'superadmin' || adminSecretProvided) {
    return {
      allowed: false,
      message: 'Admin access is restricted. Public signup can only create a regular user account.'
    };
  }

  if (!kycType || !kycNumber) {
    return {
      allowed: false,
      message: 'KYC details are required for public signup. Please provide a KYC type and KYC number.'
    };
  }

  return { allowed: true };
};

export const validateUserDeleteRequest = (body = {}) => {
  const payload = body || {};
  const roleValue = typeof payload.role === 'string' ? payload.role.trim().toLowerCase() : '';

  if (roleValue === 'admin' || roleValue === 'administrator' || roleValue === 'superadmin') {
    return {
      allowed: false,
      message: 'Admin accounts cannot be deleted from the public user list.'
    };
  }

  return { allowed: true };
};

export const validateRoleUpdateRequest = (body = {}) => {
  const payload = body || {};
  const currentRole = typeof payload.currentRole === 'string' ? payload.currentRole.trim().toLowerCase() : '';
  const nextRole = typeof payload.nextRole === 'string' ? payload.nextRole.trim().toLowerCase() : '';

  const validRoles = ['user', 'subadmin'];
  if (!validRoles.includes(nextRole)) {
    return {
      allowed: false,
      message: 'Only user and subadmin roles are allowed for this action.'
    };
  }

  if (currentRole === 'admin' || nextRole === 'admin') {
    return {
      allowed: false,
      message: 'Admin promotion is restricted. Use subadmin for delegated admin access.'
    };
  }

  return { allowed: true };
};

export const validateSeedAdminRequest = (body = {}, expectedSecret = '') => {
  const payload = body || {};
  const providedSecret = [
    payload.adminSeedPassword,
    payload.seedAdminPassword,
    payload.seedPassword,
    payload.secret,
    payload.adminPassword
  ].find((value) => typeof value === 'string' && value.trim().length > 0);

  const expected = (expectedSecret || '').trim();
  if (!providedSecret) {
    return {
      allowed: false,
      message: 'Admin seed password is required to create or update an admin account.'
    };
  }

  if (expected && providedSecret !== expected) {
    return {
      allowed: false,
      message: 'Invalid admin seed password.'
    };
  }

  return { allowed: true };
};
