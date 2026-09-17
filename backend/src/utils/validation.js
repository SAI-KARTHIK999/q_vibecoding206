const ALLOWED_STATUSES = ['TODO', 'IN_PROGRESS', 'DONE'];
const ALLOWED_PRIORITIES = ['LOW', 'MEDIUM', 'HIGH'];
const ALLOWED_PERMISSIONS = ['MEMBER', 'MANAGER'];

function validateStatus(status) {
  if (!status || !ALLOWED_STATUSES.includes(status)) {
    return false;
  }
  return true;
}

function validatePriority(priority) {
  if (!priority || !ALLOWED_PRIORITIES.includes(priority)) {
    return false;
  }
  return true;
}

function validatePermission(permission) {
  if (!permission || !ALLOWED_PERMISSIONS.includes(permission)) {
    return false;
  }
  return true;
}

module.exports = {
  ALLOWED_STATUSES,
  ALLOWED_PRIORITIES,
  ALLOWED_PERMISSIONS,
  validateStatus,
  validatePriority,
  validatePermission
};
