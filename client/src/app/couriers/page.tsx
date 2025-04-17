"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import CourierManagement from "@/components/Courier/CourierManagement";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function CouriersPage() {
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
            <div className="container-fluid bg-light py-4">
                <div className="container">
                    <h1 className="display-4 mb-4">Courier Management</h1>
                    <div className="card border-0 shadow-sm">
                        <div className="card-body">
                            <CourierManagement />
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
