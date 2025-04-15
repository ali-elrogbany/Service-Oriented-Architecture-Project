const mongoose = require('mongoose');

const refundSchema = new mongoose.Schema({
    paymentId: { type: String, required: true },
    amount: { type: Number, required: true },
    reason: { type: String },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    requestedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Refund", refundSchema);
