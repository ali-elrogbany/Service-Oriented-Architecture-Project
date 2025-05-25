"use client";

import { useState, useEffect } from "react";
import { settlementService, courierService } from "@/services/api";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type PaymentMethod = "BANK_TRANSFER" | "CASH" | "MOBILE_WALLET";

interface Courier {
    _id: string;
    name: string;
    phoneNumber: string;
    status: "active" | "inactive";
}

export default function NewSettlementPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [couriers, setCouriers] = useState<Courier[]>([]);

    const [formData, setFormData] = useState({
        courierId: "",
        periodStart: "",
        periodEnd: "",
        paymentMethod: "BANK_TRANSFER" as PaymentMethod,
        paymentDetails: {
            accountNumber: "",
            bankName: "",
        },
    });

    useEffect(() => {
        const fetchCouriers = async () => {
            try {
                const data = await courierService.getAllCouriers();
                setCouriers(data);
                if (data.length > 0) {
                    setFormData((prev) => ({ ...prev, courierId: data[0]._id }));
                }
            } catch (err) {
                setError("Failed to fetch couriers");
                console.error(err);
            }
        };

        fetchCouriers();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const userId = localStorage.getItem("userId");
        if (!userId) {
            setError("User not authenticated");
            setLoading(false);
            return;
        }

        try {
            await settlementService.createSettlement({
                ...formData,
                periodStart: new Date(formData.periodStart),
                periodEnd: new Date(formData.periodEnd),
                userId: userId,
            });
            router.push("/settlements");
        } catch (err) {
            setError("Failed to create settlement");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name.startsWith("paymentDetails.")) {
            const field = name.split(".")[1];
            setFormData((prev) => ({
                ...prev,
                paymentDetails: {
                    ...prev.paymentDetails,
                    [field]: value,
                },
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value as PaymentMethod,
            }));
        }
    };

    return (
        <>
            <Navbar />
            <div className="container-fluid bg-light py-4 min-vh-100">
                <div className="container">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h1 className="display-4">Create New Settlement</h1>
                        <button onClick={() => router.back()} className="btn btn-outline-secondary">
                            Back to Settlements
                        </button>
                    </div>

                    <div className="card border-0 shadow-sm">
                        <div className="card-body">
                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="courierId" className="form-label">
                                        Select Courier
                                    </label>
                                    <select className="form-select" id="courierId" name="courierId" value={formData.courierId} onChange={handleChange} required>
                                        <option value="">Select a courier</option>
                                        {couriers.map((courier) => (
                                            <option key={courier._id} value={courier._id}>
                                                {courier.name} ({courier.status})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label htmlFor="periodStart" className="form-label">
                                            Period Start
                                        </label>
                                        <input type="date" className="form-control" id="periodStart" name="periodStart" value={formData.periodStart} onChange={handleChange} required />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="periodEnd" className="form-label">
                                            Period End
                                        </label>
                                        <input type="date" className="form-control" id="periodEnd" name="periodEnd" value={formData.periodEnd} onChange={handleChange} required />
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="paymentMethod" className="form-label">
                                        Payment Method
                                    </label>
                                    <select className="form-select" id="paymentMethod" name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} required>
                                        <option value="BANK_TRANSFER">Bank Transfer</option>
                                        <option value="CASH">Cash</option>
                                        <option value="MOBILE_WALLET">Mobile Wallet</option>
                                    </select>
                                </div>

                                {formData.paymentMethod === "BANK_TRANSFER" && (
                                    <>
                                        <div className="mb-3">
                                            <label htmlFor="accountNumber" className="form-label">
                                                Account Number
                                            </label>
                                            <input type="text" className="form-control" id="accountNumber" name="paymentDetails.accountNumber" value={formData.paymentDetails.accountNumber} onChange={handleChange} required />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="bankName" className="form-label">
                                                Bank Name
                                            </label>
                                            <input type="text" className="form-control" id="bankName" name="paymentDetails.bankName" value={formData.paymentDetails.bankName} onChange={handleChange} required />
                                        </div>
                                    </>
                                )}

                                <div className="d-flex justify-content-end gap-2">
                                    <button type="button" onClick={() => router.back()} className="btn btn-outline-secondary">
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary" disabled={loading}>
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Creating...
                                            </>
                                        ) : (
                                            "Create Settlement"
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
