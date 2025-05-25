const Settlement = require("../models/Settlement");
const Transaction = require("../models/Transaction");
const { logAction } = require("./AuditLog");
const mongoose = require("mongoose");

const SettlementController = {
    async createSettlement(request, reply) {
        try {
            const { courierId, periodStart, periodEnd, paymentMethod, paymentDetails, userId } = request.body;

            // Calculate total amount and transaction count for the period
            const transactions = await Transaction.find({
                courierId,
                createdAt: { $gte: periodStart, $lte: periodEnd },
                status: "COMPLETED",
            });

            const totalAmount = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);

            const settlement = await Settlement.create({
                courierId,
                periodStart,
                periodEnd,
                totalAmount,
                transactionCount: transactions.length,
                paymentMethod,
                paymentDetails,
            });

            // Create audit log with userId from request body
            logAction("CREATE_SETTLEMENT", userId);

            return reply.code(201).send(settlement);
        } catch (error) {
            request.log.error(error);
            return reply.code(500).send({ error: "Internal Server Error" });
        }
    },

    async getCourierSettlements(request, reply) {
        try {
            const { courierId } = request.params;
            const settlements = await Settlement.find({ courierId }).sort({ periodStart: -1 });

            return reply.send(settlements);
        } catch (error) {
            request.log.error(error);
            return reply.code(500).send({ error: "Internal Server Error" });
        }
    },

    async getSettlementDetails(request, reply) {
        try {
            const { id } = request.params;
            const settlement = await Settlement.findById(id);

            if (!settlement) {
                return reply.code(404).send({ error: "Settlement not found" });
            }

            return reply.send(settlement);
        } catch (error) {
            request.log.error(error);
            return reply.code(500).send({ error: "Internal Server Error" });
        }
    },

    async updateSettlementStatus(request, reply) {
        try {
            const { id } = request.params;
            const { status, notes, userId } = request.body;

            const settlement = await Settlement.findById(id);
            if (!settlement) {
                return reply.code(404).send({ error: "Settlement not found" });
            }

            settlement.status = status;
            if (status === "PROCESSING") {
                settlement.processedAt = new Date();
            } else if (status === "COMPLETED") {
                settlement.completedAt = new Date();
            }
            if (notes) {
                settlement.notes = notes;
            }

            await settlement.save();

            await logAction("UPDATE_SETTLEMENT_STATUS", userId);

            return reply.send(settlement);
        } catch (error) {
            request.log.error(error);
            return reply.code(500).send({ error: "Internal Server Error" });
        }
    },
};

module.exports = SettlementController;
