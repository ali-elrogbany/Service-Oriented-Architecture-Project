"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authService } from "@/services/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        // Basic validation
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters long");
            return;
        }

        try {
            const { confirmPassword, ...registrationData } = formData;
            const response = await authService.register(registrationData);

            if (response.createdAt) {
                setSuccess("Registration successful! Redirecting to login...");
                setTimeout(() => {
                    router.push("/login");
                }, 2000);
            } else {
                setError(response.message || "Registration failed");
            }
        } catch (err: any) {
            if (err.response?.status === 400) {
                setError(err.response.data.message);
            } else {
                setError("An error occurred during registration");
            }
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
                                <h2 className="text-center mb-4">Create your account</h2>

                                {error && (
                                    <div className="alert alert-danger" role="alert">
                                        {error}
                                    </div>
                                )}

                                {success && (
                                    <div className="alert alert-success" role="alert">
                                        {success}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="firstName" className="form-label">
                                            First Name
                                        </label>
                                        <input id="firstName" name="firstName" type="text" required value={formData.firstName} onChange={handleChange} className="form-control" placeholder="Enter your first name" />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="lastName" className="form-label">
                                            Last Name
                                        </label>
                                        <input id="lastName" name="lastName" type="text" required value={formData.lastName} onChange={handleChange} className="form-control" placeholder="Enter your last name" />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="username" className="form-label">
                                            Username
                                        </label>
                                        <input id="username" name="username" type="text" required value={formData.username} onChange={handleChange} className="form-control" placeholder="Enter your username" />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">
                                            Email
                                        </label>
                                        <input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} className="form-control" placeholder="Enter your email" />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="password" className="form-label">
                                            Password
                                        </label>
                                        <input id="password" name="password" type="password" required value={formData.password} onChange={handleChange} className="form-control" placeholder="Enter your password" />
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="confirmPassword" className="form-label">
                                            Confirm Password
                                        </label>
                                        <input id="confirmPassword" name="confirmPassword" type="password" required value={formData.confirmPassword} onChange={handleChange} className="form-control" placeholder="Confirm your password" />
                                    </div>

                                    <button type="submit" className="btn btn-primary w-100">
                                        Register
                                    </button>

                                    <div className="text-center mt-3">
                                        <p className="mb-0">
                                            Already have an account?{" "}
                                            <Link href="/login" className="text-primary text-decoration-none">
                                                Sign in
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
