const Refund = require("../models/Refund");
const Transaction = require("../models/Transaction");

const createRefund = async (request, reply) => {
    try {
        const { transactionId, amount, reason } = request.body;

        // Verify that the transaction exists
        const transaction = await Transaction.findById(transactionId);
        if (!transaction) {
            return reply.status(404).send({ error: "Transaction not found" });
        }

        const refund = new Refund({ transactionId, amount, reason });
        const saved = await refund.save();
        return reply.status(201).send(saved);
    } catch (err) {
        return reply.status(500).send({ error: "Failed to create refund", details: err });
    }
};

const getAllRefunds = async (request, reply) => {
    try {
        const refunds = await Refund.find().populate("transactionId");
        return reply.send(refunds);
    } catch (err) {
        return reply.status(500).send({ error: "Failed to fetch refunds", details: err });
    }
};

const updateRefundStatus = async (request, reply) => {
    try {
        const { id } = request.params;
        const { status } = request.body;
        const refund = await Refund.findByIdAndUpdate(id, { status }, { new: true }).populate("transactionId");
        return reply.send(refund);
    } catch (err) {
        return reply.status(500).send({ error: "Failed to update refund", details: err });
    }
};

module.exports = {
    createRefund,
    getAllRefunds,
    updateRefundStatus,
};
