"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TransactionForm from "@/components/Transaction/TransactionForm";
import { transactionService } from "@/services/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Transaction {
    _id: string;
    amount: number;
    type: string;
    description: string;
    timestamp?: string;
    createdAt: string;
}

export default function TransactionsPage() {
    const router = useRouter();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const userId = localStorage.getItem("userId");
                if (!userId) {
                    throw new Error("User not authenticated");
                }

                const data = await transactionService.getUserTransactions(userId);
                setTransactions(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to fetch transactions");
            } finally {
                setLoading(false);
            }
        };

        // Check authentication
        const isAuthenticated = localStorage.getItem("authenticated") === "true";
        if (!isAuthenticated) {
            router.push("/login");
        } else {
            fetchTransactions();
        }
    }, [router]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <>
            <Navbar />
            <div className="container-fluid bg-light py-4">
                <div className="container">
                    <h1 className="display-4 mb-4">Transactions</h1>

                    {/* Transaction Form */}
                    <div className="card border-0 shadow-sm mb-4">
                        <div className="card-body">
                            <TransactionForm
                                onTransactionCreated={() => {
                                    // Refresh transactions after a new one is created
                                    const userId = localStorage.getItem("userId");
                                    if (userId) {
                                        transactionService
                                            .getUserTransactions(userId)
                                            .then((data) => setTransactions(data))
                                            .catch((err) => setError(err.message));
                                    }
                                }}
                            />
                        </div>
                    </div>

                    {/* Transactions List */}
                    <div className="card border-0 shadow-sm">
                        <div className="card-body">
                            <h2 className="h4 mb-4">Transaction History</h2>

                            {loading ? (
                                <div className="text-center py-4">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            ) : error ? (
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            ) : transactions.length === 0 ? (
                                <div className="text-center py-4">
                                    <p className="text-muted">No transactions found</p>
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover">
                                        <thead>
                                            <tr>
                                                <th>Date</th>
                                                <th>Type</th>
                                                <th>Description</th>
                                                <th className="text-end">Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {transactions.map((transaction) => (
                                                <tr key={transaction._id}>
                                                    <td>{formatDate(transaction.createdAt)}</td>
                                                    <td>
                                                        <span className={`badge ${transaction.type === "credit" ? "bg-success" : "bg-danger"}`}>{transaction.type}</span>
                                                    </td>
                                                    <td>{transaction.description}</td>
                                                    <td className={`text-end ${transaction.type === "credit" ? "text-success" : "text-danger"}`}>
                                                        {transaction.type === "credit" ? "+" : "-"}${transaction.amount.toFixed(2)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
