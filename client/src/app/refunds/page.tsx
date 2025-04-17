"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { refundService, transactionService } from "@/services/api";

interface Refund {
    _id: string;
    transactionId: {
        _id: string;
        amount: number;
        type: string;
        description: string;
        timestamp: string;
    };
    amount: number;
    reason: string;
    status: "pending" | "approved" | "rejected";
    requestedAt: string;
}

interface NewRefund {
    transactionId: string;
    amount: string;
    reason: string;
}

interface Transaction {
    _id: string;
    amount: number;
    type: string;
    description: string;
    timestamp: string;
}

export default function RefundsPage() {
    const router = useRouter();
    const [refunds, setRefunds] = useState<Refund[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newRefund, setNewRefund] = useState<NewRefund>({
        transactionId: "",
        amount: "",
        reason: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check authentication
        const isAuthenticated = localStorage.getItem("authenticated") === "true";
        if (!isAuthenticated) {
            router.push("/login");
        } else {
            loadData();
        }
    }, [router]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [refundsData, transactionsData] = await Promise.all([refundService.getAllRefunds(), transactionService.getUserTransactions(localStorage.getItem("userId") || "")]);
            console.log(refundsData);
            setRefunds(refundsData);
            setTransactions(transactionsData);
        } catch (err) {
            setError("Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateRefund = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const selectedTransaction = transactions.find((t) => t._id === newRefund.transactionId);
            if (!selectedTransaction) {
                setError("Please select a valid transaction");
                return;
            }

            await refundService.createRefund({
                ...newRefund,
                amount: parseFloat(newRefund.amount),
            });
            setShowCreateForm(false);
            setNewRefund({ transactionId: "", amount: "", reason: "" });
            loadData();
        } catch (err) {
            setError("Failed to create refund");
        }
    };

    const handleUpdateStatus = async (id: string, newStatus: "approved" | "rejected") => {
        try {
            await refundService.updateRefundStatus(id, newStatus);
            loadData();
        } catch (err) {
            setError("Failed to update refund status");
        }
    };

    return (
        <>
            <Navbar />
            <div className="container-fluid bg-light py-4 min-vh-100">
                <div className="container">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h1 className="display-4">Refunds</h1>
                        <button className="btn btn-primary" onClick={() => setShowCreateForm(!showCreateForm)}>
                            {showCreateForm ? "Cancel" : "Create New Refund"}
                        </button>
                    </div>

                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )}

                    {showCreateForm && (
                        <div className="card mb-4">
                            <div className="card-body">
                                <h5 className="card-title">Create New Refund</h5>
                                <form onSubmit={handleCreateRefund}>
                                    <div className="mb-3">
                                        <label className="form-label">Select Transaction</label>
                                        <select
                                            className="form-select"
                                            value={newRefund.transactionId}
                                            onChange={(e) => {
                                                const selectedTransaction = transactions.find((t) => t._id === e.target.value);
                                                setNewRefund({
                                                    ...newRefund,
                                                    transactionId: e.target.value,
                                                    amount: selectedTransaction ? selectedTransaction.amount.toString() : "",
                                                });
                                            }}
                                            required
                                        >
                                            <option value="">Select a transaction</option>
                                            {transactions.map((transaction) => (
                                                <option key={transaction._id} value={transaction._id}>
                                                    {new Date(transaction.timestamp).toLocaleString()} - ${transaction.amount.toFixed(2)} -{transaction.description}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Amount</label>
                                        <input type="number" className="form-control" value={newRefund.amount} onChange={(e) => setNewRefund({ ...newRefund, amount: e.target.value })} required disabled />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Reason</label>
                                        <textarea className="form-control" value={newRefund.reason} onChange={(e) => setNewRefund({ ...newRefund, reason: e.target.value })} required />
                                    </div>
                                    <button type="submit" className="btn btn-primary">
                                        Submit Refund Request
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}

                    {loading ? (
                        <div className="text-center">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Transaction Details</th>
                                        <th>Amount</th>
                                        <th>Reason</th>
                                        <th>Status</th>
                                        <th>Requested At</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {refunds.map((refund) => {
                                        return (
                                            <tr key={refund._id}>
                                                <td>
                                                    {refund.transactionId ? (
                                                        <>
                                                            <div>Date: {new Date(refund.transactionId.timestamp).toLocaleString()}</div>
                                                            <div>Description: {refund.transactionId.description}</div>
                                                            <div>Type: {refund.transactionId.type}</div>
                                                        </>
                                                    ) : (
                                                        <span className="text-muted">Transaction not found</span>
                                                    )}
                                                </td>
                                                <td>${refund.amount.toFixed(2)}</td>
                                                <td>{refund.reason}</td>
                                                <td>
                                                    <span className={`badge bg-${refund.status === "approved" ? "success" : refund.status === "rejected" ? "danger" : "warning"}`}>{refund.status}</span>
                                                </td>
                                                <td>{new Date(refund.requestedAt).toLocaleString()}</td>
                                                <td>
                                                    {refund.status === "pending" && (
                                                        <div className="btn-group">
                                                            <button className="btn btn-sm btn-success" onClick={() => handleUpdateStatus(refund._id, "approved")}>
                                                                Approve
                                                            </button>
                                                            <button className="btn btn-sm btn-danger" onClick={() => handleUpdateStatus(refund._id, "rejected")}>
                                                                Reject
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
}
