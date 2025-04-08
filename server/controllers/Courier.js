const Courier = require("../models/Courier");

const createCourier = async (req, res) => {
    try {
        const { name, phoneNumber, status, paymentPreferences } = req.body;
        const courier = new Courier({ name, phoneNumber, status, paymentPreferences });
        const saved = await courier.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(500).json({ error: "Failed to create courier", details: err });
    }
};

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

const updateCourier = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const updatedCourier = await Courier.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedCourier) {
            return res.status(404).json({ error: "Courier not found" });
        }
        res.status(200).json(updatedCourier);
    } catch (err) {
        res.status(500).json({ error: "Failed to update courier", details: err });
    }
};

const deleteCourier = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Courier.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ error: "Courier not found" });
        }
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
