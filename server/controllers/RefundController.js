const Refund = require("../models/Refund");
const Transaction = require("../models/Transaction");

exports.createRefund = async (req, res) => {
    try {
        const { transactionId, amount, reason } = req.body;

        // Verify that the transaction exists
        const transaction = await Transaction.findById(transactionId);
        if (!transaction) {
            return res.status(404).json({ error: "Transaction not found" });
        }

        const refund = new Refund({ transactionId, amount, reason });
        const saved = await refund.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(500).json({ error: "Failed to create refund", details: err });
    }
};

exports.getAllRefunds = async (req, res) => {
    try {
        const refunds = await Refund.find().populate("transactionId");
        res.json(refunds);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch refunds", details: err });
    }
};

exports.updateRefundStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const refund = await Refund.findByIdAndUpdate(id, { status }, { new: true }).populate("transactionId");
        res.json(refund);
    } catch (err) {
        res.status(500).json({ error: "Failed to update refund", details: err });
    }
};
