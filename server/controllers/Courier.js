const Courier = require("../models/Courier");
const { logAction } = require("./AuditLog"); // Import logAction for logging

const getAllCouriers = async (req, res) => {
    try {
        const couriers = await Courier.find().sort({ createdAt: -1 });
        res.status(200).json(couriers);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch couriers", details: err });
    }
};

const createCourier = async (req, res) => {
    try {
        const { name, phoneNumber, status, userId } = req.body;
        const courier = new Courier({ name, phoneNumber, status });
        const saved = await courier.save();

        try {
            // Log the courier creation
            await logAction("Courier Created", userId);
        } catch (err) {
            console.log(err);
        }

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
        const { name, phoneNumber, status, userId } = req.body;
        const updatedCourier = await Courier.findByIdAndUpdate(id, { name, phoneNumber, status }, { new: true });
        if (!updatedCourier) {
            return res.status(404).json({ error: "Courier not found" });
        }

        // Log the courier update
        await logAction("Courier Updated", userId);

        res.status(200).json(updatedCourier);
    } catch (err) {
        res.status(500).json({ error: "Failed to update courier", details: err });
    }
};

// Delete a courier
const deleteCourier = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;
        const deleted = await Courier.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ error: "Courier not found" });
        }

        try {
            // Log the courier deletion
            await logAction("Courier Deleted", userId);
        } catch (err) {
            console.log(err);
        }

        res.status(200).json({ message: "Courier deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete courier", details: err });
    }
};

module.exports = {
    getAllCouriers,
    createCourier,
    getCourierById,
    updateCourier,
    deleteCourier,
};
