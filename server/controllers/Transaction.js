const Transaction = require("../models/Transaction");
const { sendNotification } = require("../utils/notification");
const { logAction } = require("./AuditLog"); // Add this import to use the logging function

const createTransaction = async (request, reply) => {
    try {
        const { userId, amount, type, description, email } = request.body;
        const transaction = new Transaction({ userId, amount, type, description });
        const saved = await transaction.save();

        try {
            await sendNotification(email, "Transaction Completed", `Hi, your transaction of $${amount} was successfully processed.`);
        } catch (err) {
            console.log(err);
        }

        // Log the transaction creation action
        await logAction("Transaction Created", userId); // This logs the transaction details

        return reply.status(201).send(saved);
    } catch (err) {
        return reply.status(500).send({ error: "Failed to create transaction", details: err });
    }
};

const getUserTransactions = async (request, reply) => {
    try {
        const { userId } = request.params;
        const transactions = await Transaction.find({ userId }).sort({ timestamp: -1 });
        return reply.status(200).send(transactions);
    } catch (err) {
        return reply.status(500).send({ error: "Failed to retrieve transactions", details: err });
    }
};

const getTransactionById = async (request, reply) => {
    try {
        const { transactionId } = request.params;
        const transaction = await Transaction.findById(transactionId);
        if (!transaction) {
            return reply.status(404).send({ error: "Transaction not found" });
        }
        return reply.status(200).send(transaction);
    } catch (err) {
        return reply.status(500).send({ error: "Failed to fetch transaction", details: err });
    }
};

module.exports = {
    createTransaction,
    getUserTransactions,
    getTransactionById,
};
