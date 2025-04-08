const mongoose = require("mongoose");

const CourierTransactionSchema = new mongoose.Schema({
    courierId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Courier",
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        enum: ["credit", "debit"],
        required: true,
    },
    description: {
        type: String,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("CourierTransaction", CourierTransactionSchema);
