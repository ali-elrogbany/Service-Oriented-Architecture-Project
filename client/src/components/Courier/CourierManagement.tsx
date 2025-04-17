"use client";

import { useState, useEffect } from "react";
import { courierService } from "@/services/api";

interface Courier {
    _id: string;
    name: string;
    phoneNumber: string;
    status: "active" | "inactive";
}

export default function CourierManagement() {
    const [couriers, setCouriers] = useState<Courier[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: "",
        phoneNumber: "",
    });

    useEffect(() => {
        fetchCouriers();
    }, []);

    const fetchCouriers = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await courierService.getAllCouriers();
            setCouriers(response);
        } catch (err) {
            setError("Failed to fetch couriers");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setActionLoading("create");
            setError(null);
            const userId = localStorage.getItem("userId");
            if (!userId) {
                throw new Error("User ID not found");
            }
            const newCourier = await courierService.createCourier({
                ...formData,
                status: "active",
                userId: userId,
            });
            setCouriers([...couriers, newCourier]);
            setFormData({ name: "", phoneNumber: "" });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create courier");
            console.error(err);
        } finally {
            setActionLoading(null);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const toggleStatus = async (id: string, currentStatus: "active" | "inactive") => {
        try {
            setActionLoading(`toggle-${id}`);
            setError(null);
            const userId = localStorage.getItem("userId");
            if (!userId) {
                throw new Error("User ID not found");
            }
            const updatedCourier = await courierService.updateCourier(id, {
                status: currentStatus === "active" ? "inactive" : "active",
                userId: userId,
            });
            setCouriers(couriers.map((courier) => (courier._id === id ? updatedCourier : courier)));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update courier status");
            console.error(err);
        } finally {
            setActionLoading(null);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this courier?")) {
            return;
        }
        try {
            setActionLoading(`delete-${id}`);
            setError(null);
            const userId = localStorage.getItem("userId");
            if (!userId) {
                throw new Error("User ID not found");
            }
            await courierService.deleteCourier(id, userId);
            setCouriers(couriers.filter((courier) => courier._id !== id));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to delete courier");
            console.error(err);
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) {
        return <div className="text-center">Loading couriers...</div>;
    }

    return (
        <div className="row">
            {error && (
                <div className="col-12">
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                </div>
            )}
            {/* Add Courier Form */}
            <div className="col-md-4 mb-4">
                <div className="card border-0 shadow-sm">
                    <div className="card-body">
                        <h3 className="card-title h5 mb-4">Add New Courier</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">
                                    Name
                                </label>
                                <input type="text" className="form-control" id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Enter courier name" required />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="phoneNumber" className="form-label">
                                    Phone Number
                                </label>
                                <input type="tel" className="form-control" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Enter phone number" required />
                            </div>

                            <button type="submit" className="btn btn-primary w-100" disabled={actionLoading === "create"}>
                                {actionLoading === "create" ? "Adding..." : "Add Courier"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Couriers List */}
            <div className="col-md-8">
                <div className="table-responsive">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Phone</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {couriers.map((courier) => (
                                <tr key={courier._id}>
                                    <td>{courier.name}</td>
                                    <td>{courier.phoneNumber}</td>
                                    <td>
                                        <span className={`badge ${courier.status === "active" ? "bg-success" : "bg-secondary"}`}>{courier.status}</span>
                                    </td>
                                    <td>
                                        <button className={`btn btn-sm ${courier.status === "active" ? "btn-warning" : "btn-success"} me-2`} onClick={() => toggleStatus(courier._id, courier.status)} disabled={actionLoading === `toggle-${courier._id}`}>
                                            {actionLoading === `toggle-${courier._id}` ? "Updating..." : courier.status === "active" ? "Deactivate" : "Activate"}
                                        </button>
                                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(courier._id)} disabled={actionLoading === `delete-${courier._id}`}>
                                            {actionLoading === `delete-${courier._id}` ? "Deleting..." : "Delete"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
