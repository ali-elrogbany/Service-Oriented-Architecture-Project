"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuditLogs from "@/components/AuditLogs/AuditLogs";

export default function AuditLogsPage() {
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
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h1 className="display-4">Audit Logs</h1>
                        <Link href="/dashboard" className="btn btn-outline-secondary">
                            <svg className="bi me-2" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Dashboard
                        </Link>
                    </div>
                    <AuditLogs />
                </div>
            </div>
            <Footer />
        </>
    );
}
