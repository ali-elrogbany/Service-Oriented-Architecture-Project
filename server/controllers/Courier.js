const Courier = require("../models/Courier");
const { logAction } = require('./auditLogController'); // Import logAction for logging

// Create a new courier
const createCourier = async (req, res) => {
    try {
        const { name, phoneNumber, status, paymentPreferences } = req.body;
        const courier = new Courier({ name, phoneNumber, status, paymentPreferences });
        const saved = await courier.save();

        // Log the courier creation
        await logAction('Courier Created', req.user._id, { name, phoneNumber, status, paymentPreferences });

        res.status(201).json(saved);
    } catch (err) {
        res.status(500).json({ error: "Failed to create courier", details: err });
    }
};

// Get a courier by ID
const getCourierById = async (req, res) => {
    try {
        const { id } = req.params;
        const courier = await Courier.findById(id);
        if (!courier) {
            return res.status(404).json({ error: "Courier not found" });
        }
        res.status(200).json(courier);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch courier", details: err });
    }
};

// Update an existing courier
const updateCourier = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const updatedCourier = await Courier.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedCourier) {
            return res.status(404).json({ error: "Courier not found" });
        }

        // Log the courier update
        await logAction('Courier Updated', req.user._id, { id, updates });

        res.status(200).json(updatedCourier);
    } catch (err) {
        res.status(500).json({ error: "Failed to update courier", details: err });
    }
};

// Delete a courier
const deleteCourier = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Courier.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ error: "Courier not found" });
        }

        // Log the courier deletion
        await logAction('Courier Deleted', req.user._id, { id });

        res.status(200).json({ message: "Courier deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete courier", details: err });
    }
};

module.exports = {
    createCourier,
    getCourierById,
    updateCourier,
    deleteCourier,
};
