const Refund = require("../models/Refund");

exports.createRefund = async (req, res) => {
    try {
        const { paymentId, amount, reason } = req.body;
        const refund = new Refund({ paymentId, amount, reason });
        const saved = await refund.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(500).json({ error: "Failed to create refund", details: err });
    }
};

exports.getAllRefunds = async (req, res) => {
    const refunds = await Refund.find();
    res.json(refunds);
};

exports.updateRefundStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const refund = await Refund.findByIdAndUpdate(id, { status }, { new: true });
        res.json(refund);
    } catch (err) {
        res.status(500).json({ error: "Failed to update refund", details: err });
    }
};
