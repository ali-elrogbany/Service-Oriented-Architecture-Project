"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authService } from "@/services/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function LoginPage() {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });
    const [error, setError] = useState("");
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const response = await authService.login(formData.username, formData.password);
            if (response.authenticated) {
                localStorage.setItem("authenticated", "true");
                localStorage.setItem("userId", response.userId || "");
                localStorage.setItem("userEmail", response.email || "");
                router.push("/dashboard");
            } else {
                setError("Invalid credentials");
            }
        } catch (err) {
            setError("An error occurred during login");
        }
    };

    return (
        <>
            <Navbar />
            <div className="container-fluid bg-light py-5">
                <div className="row justify-content-center">
                    <div className="col-12 col-sm-8 col-md-6 col-lg-4">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body p-4">
                                <h2 className="text-center mb-4">Sign in to your account</h2>

                                {error && (
                                    <div className="alert alert-danger" role="alert">
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="username" className="form-label">
                                            Username
                                        </label>
                                        <input id="username" name="username" type="text" required value={formData.username} onChange={handleChange} className="form-control" placeholder="Enter your username" />
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="password" className="form-label">
                                            Password
                                        </label>
                                        <input id="password" name="password" type="password" required value={formData.password} onChange={handleChange} className="form-control" placeholder="Enter your password" />
                                    </div>

                                    <button type="submit" className="btn btn-primary w-100">
                                        Sign in
                                    </button>

                                    <div className="text-center mt-3">
                                        <p className="mb-0">
                                            Don't have an account?{" "}
                                            <Link href="/register" className="text-primary text-decoration-none">
                                                Sign up
                                            </Link>
                                        </p>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
