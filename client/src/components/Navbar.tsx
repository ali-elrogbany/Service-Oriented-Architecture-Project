"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        // Check if user is authenticated
        const checkAuth = () => {
            const auth = localStorage.getItem("authenticated");
            setIsAuthenticated(auth === "true");
        };
        checkAuth();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("authenticated");
        localStorage.removeItem("userId");
        localStorage.removeItem("userEmail");
        setIsAuthenticated(false);
        window.location.href = "/";
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom">
            <div className="container">
                <Link href="/" className="navbar-brand">
                    <span className="fw-bold text-primary">Tapay</span>
                </Link>

                <button className="navbar-toggler" type="button" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-controls="navbarNav" aria-expanded={isMobileMenuOpen} aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className={`collapse navbar-collapse ${isMobileMenuOpen ? "show" : ""}`} id="navbarNav">
                    {isAuthenticated ? (
                        <>
                            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                <li className="nav-item">
                                    <Link href="/dashboard" className={`nav-link ${pathname === "/dashboard" ? "active fw-semibold" : ""}`}>
                                        Dashboard
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link href="/transactions" className={`nav-link ${pathname === "/transactions" ? "active fw-semibold" : ""}`}>
                                        Transactions
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link href="/refunds" className={`nav-link ${pathname === "/refunds" ? "active fw-semibold" : ""}`}>
                                        Refunds
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link href="/couriers" className={`nav-link ${pathname === "/couriers" ? "active fw-semibold" : ""}`}>
                                        Couriers
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link href="/audit-logs" className={`nav-link ${pathname === "/audit-logs" ? "active fw-semibold" : ""}`}>
                                        Audit Logs
                                    </Link>
                                </li>
                            </ul>
                            <div className="ms-auto">
                                <button onClick={handleLogout} className="btn btn-primary">
                                    Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="ms-auto">
                            <Link href="/login" className="btn btn-primary">
                                Login
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
