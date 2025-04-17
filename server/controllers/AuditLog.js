const AuditLog = require('../models/auditlog');

// This function saves a new audit log
const logAction = (action, user_id, meta = {}) => {
  const newLog = new AuditLog({
    action,
    user_id,
    meta
  });

  newLog.save()
    .then(log => console.log('✅ Audit log saved:', log))
    .catch(err => console.error('❌ Error saving audit log:', err));
};

module.exports = { logAction };
