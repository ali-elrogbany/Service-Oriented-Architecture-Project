"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Dashboard() {
    const router = useRouter();

    useEffect(() => {
        // Check authentication
        const isAuthenticated = localStorage.getItem("authenticated") === "true";
        if (!isAuthenticated) {
            router.push("/login");
        }
    }, [router]);

    return (
        <>
            <Navbar />
            <div className="container-fluid bg-light py-4 min-vh-100">
                <div className="container">
                    <h1 className="display-4 mb-4">Dashboard</h1>

                    <div className="row g-4">
                        {/* Transactions Card */}
                        <div className="col-12 col-sm-6 col-lg-3">
                            <Link href="/transactions" className="text-decoration-none">
                                <div className="card h-100 border-0 shadow-sm hover-shadow">
                                    <div className="card-body p-4">
                                        <div className="d-flex align-items-center">
                                            <div className="bg-primary rounded p-3 me-3">
                                                <svg className="bi text-white" width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h3 className="h5 mb-1 text-dark">Transactions</h3>
                                                <p className="text-muted mb-0">Manage your transactions</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>

                        {/* Refunds Card */}
                        <div className="col-12 col-sm-6 col-lg-3">
                            <Link href="/refunds" className="text-decoration-none">
                                <div className="card h-100 border-0 shadow-sm hover-shadow">
                                    <div className="card-body p-4">
                                        <div className="d-flex align-items-center">
                                            <div className="bg-warning rounded p-3 me-3">
                                                <svg className="bi text-white" width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h3 className="h5 mb-1 text-dark">Refunds</h3>
                                                <p className="text-muted mb-0">Manage refund requests</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>

                        {/* Couriers Card */}
                        <div className="col-12 col-sm-6 col-lg-3">
                            <Link href="/couriers" className="text-decoration-none">
                                <div className="card h-100 border-0 shadow-sm hover-shadow">
                                    <div className="card-body p-4">
                                        <div className="d-flex align-items-center">
                                            <div className="bg-success rounded p-3 me-3">
                                                <svg className="bi text-white" width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h3 className="h5 mb-1 text-dark">Couriers</h3>
                                                <p className="text-muted mb-0">Manage courier services</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>

                        {/* Audit Logs Card */}
                        <div className="col-12 col-sm-6 col-lg-3">
                            <Link href="/audit-logs" className="text-decoration-none">
                                <div className="card h-100 border-0 shadow-sm hover-shadow">
                                    <div className="card-body p-4">
                                        <div className="d-flex align-items-center">
                                            <div className="bg-info rounded p-3 me-3">
                                                <svg className="bi text-white" width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h3 className="h5 mb-1 text-dark">Audit Logs</h3>
                                                <p className="text-muted mb-0">View system activity logs</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
            <style jsx>{`
                .hover-shadow {
                    transition: box-shadow 0.3s ease-in-out;
                }
                .hover-shadow:hover {
                    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
                }
            `}</style>
        </>
    );
}
