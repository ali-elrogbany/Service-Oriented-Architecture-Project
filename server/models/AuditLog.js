const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  action: { type: String, required: true }, // What happened? (e.g. "Delivered")
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Who did it?
  timestamp: { type: Date, default: Date.now }, // When did it happen?
  meta: { type: mongoose.Schema.Types.Mixed, default: {} } // Extra info (optional)
});

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

module.exports = AuditLog;
