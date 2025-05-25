"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import { settlementService } from "@/services/api";
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
    paymentDetails: {
        accountNumber?: string;
        bankName?: string;
    };
    processedAt?: string;
    completedAt?: string;
    notes?: string;
    createdAt: string;
}

export default function SettlementDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { id } = use(params);
    const [settlement, setSettlement] = useState<Settlement | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [statusUpdate, setStatusUpdate] = useState({
        status: "",
        notes: "",
    });

    useEffect(() => {
        const fetchSettlement = async () => {
            try {
                const data = await settlementService.getSettlementDetails(id);
                setSettlement(data);
            } catch (err) {
                setError("Failed to fetch settlement details");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchSettlement();
    }, [id]);

    const handleStatusUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!settlement) return;

        const userId = localStorage.getItem("userId");
        if (!userId) {
            setError("User not authenticated");
            return;
        }

        try {
            const updatedSettlement = await settlementService.updateSettlementStatus(settlement._id, {
                status: statusUpdate.status as "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED",
                notes: statusUpdate.notes,
                userId: userId,
            });
            setSettlement(updatedSettlement);
            setStatusUpdate({ status: "", notes: "" });
        } catch (err) {
            setError("Failed to update settlement status");
            console.error(err);
        }
    };

    return (
        <>
            <Navbar />
            <div className="container-fluid bg-light py-4 min-vh-100">
                <div className="container">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h1 className="display-4">Settlement Details</h1>
                        <button onClick={() => router.back()} className="btn btn-outline-secondary">
                            Back to Settlements
                        </button>
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
                    ) : !settlement ? (
                        <div className="alert alert-warning" role="alert">
                            Settlement not found
                        </div>
                    ) : (
                        <>
                            <div className="card border-0 shadow-sm mb-4">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <h2 className="h5 mb-4">Settlement Information</h2>
                                            <dl className="row mb-0">
                                                <dt className="col-sm-4 text-muted">Period</dt>
                                                <dd className="col-sm-8">
                                                    {new Date(settlement.periodStart).toLocaleDateString()} - {new Date(settlement.periodEnd).toLocaleDateString()}
                                                </dd>

                                                <dt className="col-sm-4 text-muted">Total Amount</dt>
                                                <dd className="col-sm-8">${settlement.totalAmount.toFixed(2)}</dd>

                                                <dt className="col-sm-4 text-muted">Transaction Count</dt>
                                                <dd className="col-sm-8">{settlement.transactionCount}</dd>

                                                <dt className="col-sm-4 text-muted">Status</dt>
                                                <dd className="col-sm-8">
                                                    <span className={`badge ${settlement.status === "COMPLETED" ? "bg-success" : settlement.status === "FAILED" ? "bg-danger" : settlement.status === "PROCESSING" ? "bg-warning" : "bg-secondary"}`}>{settlement.status}</span>
                                                </dd>
                                            </dl>
                                        </div>
                                        <div className="col-md-6">
                                            <h2 className="h5 mb-4">Payment Information</h2>
                                            <dl className="row mb-0">
                                                <dt className="col-sm-4 text-muted">Payment Method</dt>
                                                <dd className="col-sm-8">{settlement.paymentMethod}</dd>

                                                {settlement.paymentMethod === "BANK_TRANSFER" && (
                                                    <>
                                                        <dt className="col-sm-4 text-muted">Account Number</dt>
                                                        <dd className="col-sm-8">{settlement.paymentDetails.accountNumber}</dd>

                                                        <dt className="col-sm-4 text-muted">Bank Name</dt>
                                                        <dd className="col-sm-8">{settlement.paymentDetails.bankName}</dd>
                                                    </>
                                                )}
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="card border-0 shadow-sm">
                                <div className="card-body">
                                    <h2 className="h5 mb-4">Update Status</h2>
                                    <form onSubmit={handleStatusUpdate}>
                                        <div className="mb-3">
                                            <label htmlFor="status" className="form-label">
                                                New Status
                                            </label>
                                            <select id="status" className="form-select" value={statusUpdate.status} onChange={(e) => setStatusUpdate((prev) => ({ ...prev, status: e.target.value }))} required>
                                                <option value="">Select a status</option>
                                                <option value="PENDING">Pending</option>
                                                <option value="PROCESSING">Processing</option>
                                                <option value="COMPLETED">Completed</option>
                                                <option value="FAILED">Failed</option>
                                            </select>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="notes" className="form-label">
                                                Notes
                                            </label>
                                            <textarea id="notes" className="form-control" value={statusUpdate.notes} onChange={(e) => setStatusUpdate((prev) => ({ ...prev, notes: e.target.value }))} rows={3} />
                                        </div>
                                        <div className="d-flex justify-content-end">
                                            <button type="submit" className="btn btn-primary">
                                                Update Status
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
}
