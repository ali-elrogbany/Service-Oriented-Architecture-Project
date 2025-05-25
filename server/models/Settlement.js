const mongoose = require("mongoose");

const settlementSchema = new mongoose.Schema(
    {
        courierId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Courier",
            required: true,
        },
        periodStart: {
            type: Date,
            required: true,
        },
        periodEnd: {
            type: Date,
            required: true,
        },
        totalAmount: {
            type: Number,
            required: true,
            default: 0,
        },
        transactionCount: {
            type: Number,
            required: true,
            default: 0,
        },
        status: {
            type: String,
            enum: ["PENDING", "PROCESSING", "COMPLETED", "FAILED"],
            default: "PENDING",
        },
        paymentMethod: {
            type: String,
            enum: ["BANK_TRANSFER", "CASH", "MOBILE_WALLET"],
            required: true,
        },
        paymentDetails: {
            type: Object,
            required: true,
        },
        processedAt: {
            type: Date,
        },
        completedAt: {
            type: Date,
        },
        notes: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

settlementSchema.index({ courierId: 1, periodStart: 1, periodEnd: 1 });
settlementSchema.index({ status: 1 });

module.exports = mongoose.model("Settlement", settlementSchema);
