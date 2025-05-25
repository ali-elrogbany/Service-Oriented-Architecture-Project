"use client";

import { useEffect, useState } from "react";
import { settlementService } from "@/services/api";
import { courierService } from "@/services/api";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Settlement {
    _id: string;
    courierId: string;
    periodStart: string;
    periodEnd: string;
    totalAmount: number;
    transactionCount: number;
    status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
    paymentMethod: "BANK_TRANSFER" | "CASH" | "MOBILE_WALLET";
    createdAt: string;
}

interface Courier {
    _id: string;
    name: string;
    phoneNumber: string;
    status: "active" | "inactive";
}

export default function SettlementsPage() {
    const [settlements, setSettlements] = useState<Settlement[]>([]);
    const [couriers, setCouriers] = useState<Courier[]>([]);
    const [selectedCourierId, setSelectedCourierId] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchCouriers = async () => {
            try {
                const data = await courierService.getAllCouriers();
                setCouriers(data);
                if (data.length > 0) {
                    setSelectedCourierId(data[0]._id);
                }
            } catch (err) {
                setError("Failed to fetch couriers");
                console.error(err);
            }
        };

        fetchCouriers();
    }, []);

    useEffect(() => {
        const fetchSettlements = async () => {
            if (!selectedCourierId) return;

            setLoading(true);
            try {
                const data = await settlementService.getCourierSettlements(selectedCourierId);
                setSettlements(data);
            } catch (err) {
                setError("Failed to fetch settlements");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchSettlements();
    }, [selectedCourierId]);

    const handleCourierChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCourierId(e.target.value);
    };

    return (
        <>
            <Navbar />
            <div className="container-fluid bg-light py-4 min-vh-100">
                <div className="container">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h1 className="display-4">Settlements</h1>
                        <button onClick={() => router.push("/settlements/new")} className="btn btn-primary">
                            Create New Settlement
                        </button>
                    </div>

                    <div className="card border-0 shadow-sm mb-4">
                        <div className="card-body">
                            <div className="mb-3">
                                <label htmlFor="courier-select" className="form-label">
                                    Select Courier
                                </label>
                                <select id="courier-select" value={selectedCourierId} onChange={handleCourierChange} className="form-select">
                                    {couriers.map((courier) => (
                                        <option key={courier._id} value={courier._id}>
                                            {courier.name} ({courier.status})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="card border-0 shadow-sm">
                            <div className="card-body text-center py-5">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    ) : settlements.length === 0 ? (
                        <div className="card border-0 shadow-sm">
                            <div className="card-body text-center py-5 text-muted">No settlements found for this courier</div>
                        </div>
                    ) : (
                        <div className="card border-0 shadow-sm">
                            <div className="card-body p-0">
                                <div className="table-responsive">
                                    <table className="table table-hover mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Period</th>
                                                <th>Amount</th>
                                                <th>Transactions</th>
                                                <th>Status</th>
                                                <th>Payment Method</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {settlements.map((settlement) => (
                                                <tr key={settlement._id}>
                                                    <td>
                                                        {new Date(settlement.periodStart).toLocaleDateString()} - {new Date(settlement.periodEnd).toLocaleDateString()}
                                                    </td>
                                                    <td>${settlement.totalAmount.toFixed(2)}</td>
                                                    <td>{settlement.transactionCount}</td>
                                                    <td>
                                                        <span className={`badge ${settlement.status === "COMPLETED" ? "bg-success" : settlement.status === "FAILED" ? "bg-danger" : settlement.status === "PROCESSING" ? "bg-warning" : "bg-secondary"}`}>{settlement.status}</span>
                                                    </td>
                                                    <td>{settlement.paymentMethod}</td>
                                                    <td>
                                                        <button onClick={() => router.push(`/settlements/${settlement._id}`)} className="btn btn-link text-primary p-0">
                                                            View
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
}
