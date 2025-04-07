const Transaction = require("../models/Transaction");

const createTransaction = async (req, res) => {
    try {
        const { userId, amount, type, description } = req.body;
        const transaction = new Transaction({ userId, amount, type, description });
        const saved = await transaction.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(500).json({ error: "Failed to create transaction", details: err });
    }
};

const getUserTransactions = async (req, res) => {
    try {
        const { userId } = req.params;
        const transactions = await Transaction.find({ userId }).sort({ timestamp: -1 });
        res.status(200).json(transactions);
    } catch (err) {
        res.status(500).json({ error: "Failed to retrieve transactions", details: err });
    }
};

const getTransactionById = async (req, res) => {
    try {
        const { transactionId } = req.params;
        const transaction = await Transaction.findById(transactionId);
        if (!transaction) {
            return res.status(404).json({ error: "Transaction not found" });
        }
        res.status(200).json(transaction);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch transaction", details: err });
    }
};

module.exports = {
    createTransaction,
    getUserTransactions,
    getTransactionById,
};