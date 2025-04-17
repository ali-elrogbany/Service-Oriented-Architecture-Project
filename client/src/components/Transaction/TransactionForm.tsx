"use client";

import { useState } from "react";
import { transactionService } from "@/services/api";
import { useRouter } from "next/navigation";

interface TransactionFormData {
    amount: string;
    description: string;
    type: string;
}

interface TransactionFormProps {
    onTransactionCreated?: () => void;
}

export default function TransactionForm({ onTransactionCreated }: TransactionFormProps) {
    const router = useRouter();
    const [formData, setFormData] = useState<TransactionFormData>({
        amount: "",
        description: "",
        type: "credit",
    });
    const [error, setError] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        try {
            // Get user info from localStorage
            const userId = localStorage.getItem("userId");
            const userEmail = localStorage.getItem("userEmail");

            if (!userId || !userEmail) {
                throw new Error("User not authenticated");
            }

            await transactionService.createTransaction({
                userId: userId,
                amount: parseFloat(formData.amount),
                type: formData.type,
                description: formData.description,
                email: userEmail,
            });

            // Reset form and redirect to transactions list
            setFormData({ amount: "", description: "", type: "credit" });

            // Call the callback if provided
            if (onTransactionCreated) {
                onTransactionCreated();
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create transaction");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            <div className="row g-3">
                <div className="col-md-6">
                    <div className="form-group">
                        <label htmlFor="type" className="form-label">
                            Transaction Type
                        </label>
                        <select className="form-select" id="type" name="type" value={formData.type} onChange={handleChange} required>
                            <option value="credit">Credit</option>
                            <option value="debit">Debit</option>
                        </select>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="form-group">
                        <label htmlFor="amount" className="form-label">
                            Amount
                        </label>
                        <div className="input-group">
                            <span className="input-group-text">$</span>
                            <input type="number" className="form-control" id="amount" name="amount" value={formData.amount} onChange={handleChange} placeholder="Enter amount" required min="0" step="0.01" />
                        </div>
                    </div>
                </div>

                <div className="col-12">
                    <div className="form-group">
                        <label htmlFor="description" className="form-label">
                            Description
                        </label>
                        <input type="text" className="form-control" id="description" name="description" value={formData.description} onChange={handleChange} placeholder="Enter transaction description" required />
                    </div>
                </div>

                <div className="col-12">
                    <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Processing...
                            </>
                        ) : (
                            "Submit Transaction"
                        )}
                    </button>
                </div>
            </div>
        </form>
    );
}
