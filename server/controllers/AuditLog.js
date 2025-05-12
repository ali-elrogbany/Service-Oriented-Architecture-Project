const AuditLog = require("../models/auditlog");

// This function saves a new audit log
const logAction = (action, userId) => {
    const newLog = new AuditLog({
        action,
        user_id: userId,
    });

    newLog.save();
};

const getAllAuditLogs = async (request, reply) => {
    try {
        const logs = await AuditLog.find().populate("user_id", "username email").sort({ timestamp: -1 });
        return reply.send(logs);
    } catch (error) {
        return reply.status(500).send({ message: error.message });
    }
};

const getUserAuditLogs = async (request, reply) => {
    try {
        const logs = await AuditLog.find({ user_id: request.params.userId }).populate("user_id", "username email").sort({ timestamp: -1 });
        return reply.send(logs);
    } catch (error) {
        return reply.status(500).send({ message: error.message });
    }
};

const getAuditLogsByAction = async (request, reply) => {
    try {
        const logs = await AuditLog.find({ action: request.params.action }).populate("user_id", "username email").sort({ timestamp: -1 });
        return reply.send(logs);
    } catch (error) {
        return reply.status(500).send({ message: error.message });
    }
};

module.exports = {
    logAction,
    getAllAuditLogs,
    getUserAuditLogs,
    getAuditLogsByAction,
};
