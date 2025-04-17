const AuditLog = require("../models/auditlog");

// This function saves a new audit log
const logAction = (action, userId) => {
    const newLog = new AuditLog({
        action,
        user_id: userId,
    });

    newLog.save();
};

// Get all audit logs
const getAllAuditLogs = async (req, res) => {
    try {
        const logs = await AuditLog.find().populate("user_id", "username email").sort({ timestamp: -1 });
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get audit logs for a specific user
const getUserAuditLogs = async (req, res) => {
    try {
        const logs = await AuditLog.find({ user_id: req.params.userId }).populate("user_id", "username email").sort({ timestamp: -1 });
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get audit logs by action type
const getAuditLogsByAction = async (req, res) => {
    try {
        const logs = await AuditLog.find({ action: req.params.action }).populate("user_id", "username email").sort({ timestamp: -1 });
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    logAction,
    getAllAuditLogs,
    getUserAuditLogs,
    getAuditLogsByAction,
};
