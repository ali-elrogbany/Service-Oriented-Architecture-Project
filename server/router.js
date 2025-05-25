const { Login, Register, ForgetPassword } = require("./controllers/User");
const TransactionController = require("./controllers/Transaction");
const CourierController = require("./controllers/Courier");
const { createRefund, getAllRefunds, updateRefundStatus } = require("./controllers/RefundController");
const { getAllAuditLogs, getUserAuditLogs, getAuditLogsByAction } = require("./controllers/AuditLog");
const SettlementController = require("./controllers/SettlementController");

async function routes(fastify, options) {
    fastify.get("/", async (request, reply) => {
        return { message: "Let's build a CRUD API!" };
    });

    // Auth routes
    fastify.post("/auth/login", Login);
    fastify.post("/auth/register", Register);
    fastify.put("/auth/forget-password", ForgetPassword);

    // Transaction routes
    fastify.post("/transactions", TransactionController.createTransaction);
    fastify.get("/transactions/:userId", TransactionController.getUserTransactions);
    fastify.get("/transactions/details/:transactionId", TransactionController.getTransactionById);

    // Courier routes
    fastify.get("/couriers", CourierController.getAllCouriers);
    fastify.post("/couriers", CourierController.createCourier);
    fastify.get("/couriers/:id", CourierController.getCourierById);
    fastify.put("/couriers/:id", CourierController.updateCourier);
    fastify.delete("/couriers/:id", CourierController.deleteCourier);

    // Refund routes
    fastify.post("/refunds", createRefund);
    fastify.get("/refunds", getAllRefunds);
    fastify.put("/refunds/:id", updateRefundStatus);

    // Audit log routes
    fastify.get("/audit-logs", getAllAuditLogs);
    fastify.get("/audit-logs/user/:userId", getUserAuditLogs);
    fastify.get("/audit-logs/action/:action", getAuditLogsByAction);

    fastify.post("/settlements", SettlementController.createSettlement);
    fastify.get("/settlements/courier/:courierId", SettlementController.getCourierSettlements);
    fastify.get("/settlements/:id", SettlementController.getSettlementDetails);
    fastify.put("/settlements/:id/status", SettlementController.updateSettlementStatus);
}

module.exports = routes;
