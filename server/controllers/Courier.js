const Courier = require("../models/Courier");
const { logAction } = require("./AuditLog"); // Import logAction for logging

const getAllCouriers = async (request, reply) => {
    try {
        const couriers = await Courier.find().sort({ createdAt: -1 });
        return reply.status(200).send(couriers);
    } catch (err) {
        return reply.status(500).send({ error: "Failed to fetch couriers", details: err });
    }
};

const createCourier = async (request, reply) => {
    try {
        const { name, phoneNumber, status, userId } = request.body;
        const courier = new Courier({ name, phoneNumber, status });
        const saved = await courier.save();

        try {
            // Log the courier creation
            await logAction("Courier Created", userId);
        } catch (err) {
            request.log.error(err);
        }

        return reply.status(201).send(saved);
    } catch (err) {
        return reply.status(500).send({ error: "Failed to create courier", details: err });
    }
};

// Get a courier by ID
const getCourierById = async (request, reply) => {
    try {
        const { id } = request.params;
        const courier = await Courier.findById(id);
        if (!courier) {
            return reply.status(404).send({ error: "Courier not found" });
        }
        return reply.status(200).send(courier);
    } catch (err) {
        return reply.status(500).send({ error: "Failed to fetch courier", details: err });
    }
};

// Update an existing courier
const updateCourier = async (request, reply) => {
    try {
        const { id } = request.params;
        const { name, phoneNumber, status, userId } = request.body;
        const updatedCourier = await Courier.findByIdAndUpdate(id, { name, phoneNumber, status }, { new: true });
        if (!updatedCourier) {
            return reply.status(404).send({ error: "Courier not found" });
        }

        // Log the courier update
        await logAction("Courier Updated", userId);

        return reply.status(200).send(updatedCourier);
    } catch (err) {
        return reply.status(500).send({ error: "Failed to update courier", details: err });
    }
};

// Delete a courier
const deleteCourier = async (request, reply) => {
    try {
        const { id } = request.params;
        const { userId } = request.body;
        const deleted = await Courier.findByIdAndDelete(id);
        if (!deleted) {
            return reply.status(404).send({ error: "Courier not found" });
        }

        try {
            // Log the courier deletion
            await logAction("Courier Deleted", userId);
        } catch (err) {
            request.log.error(err);
        }

        return reply.status(200).send({ message: "Courier deleted successfully" });
    } catch (err) {
        return reply.status(500).send({ error: "Failed to delete courier", details: err });
    }
};

module.exports = {
    getAllCouriers,
    createCourier,
    getCourierById,
    updateCourier,
    deleteCourier,
};
