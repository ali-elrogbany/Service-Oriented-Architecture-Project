import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BootstrapClient from "@/components/BootstrapClient";

export default function Home() {
    return (
        <main>
            <Navbar />

            {/* Hero Section */}
            <section className="bg-primary text-white py-5">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6 mb-4 mb-lg-0">
                            <h1 className="display-4 fw-bold mb-4">Revolutionizing Payments in Egypt's Courier Industry</h1>
                            <p className="lead mb-4">Accept payments seamlessly via NFC technology, eliminating the need for traditional PoS hardware.</p>
                            <div className="d-flex flex-column flex-sm-row gap-3">
                                <a href="/download" className="btn btn-light btn-lg">
                                    Download App
                                </a>
                                <a href="/features" className="btn btn-outline-light btn-lg">
                                    Learn More
                                </a>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="position-relative">
                                <div className="position-absolute top-0 start-0 w-100 h-100 bg-primary rounded-4" style={{ transform: "rotate(6deg)" }}></div>
                                <div className="position-relative bg-white rounded-4 p-3 shadow-lg">
                                    <img src="/mockup.png" alt="Tapay App Mockup" className="img-fluid rounded-3" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-4">
                <div className="container">
                    <h2 className="text-center mb-4">Why Choose Tapay?</h2>
                    <div className="row g-4">
                        <div className="col-md-4">
                            <div className="card h-100 border-0 shadow-sm">
                                <div className="card-body p-4">
                                    <div className="bg-primary bg-opacity-10 rounded-3 p-3 mb-4 d-inline-block">
                                        <svg className="bi text-primary" width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    <h3 className="h4 mb-3">Fast Transactions</h3>
                                    <p className="text-muted mb-0">Complete payments in seconds with our NFC technology.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card h-100 border-0 shadow-sm">
                                <div className="card-body p-4">
                                    <div className="bg-primary bg-opacity-10 rounded-3 p-3 mb-4 d-inline-block">
                                        <svg className="bi text-primary" width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <h3 className="h4 mb-3">Secure Payments</h3>
                                    <p className="text-muted mb-0">Bank-level security for all your transactions.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card h-100 border-0 shadow-sm">
                                <div className="card-body p-4">
                                    <div className="bg-primary bg-opacity-10 rounded-3 p-3 mb-4 d-inline-block">
                                        <svg className="bi text-primary" width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                    </div>
                                    <h3 className="h4 mb-3">No Hardware Needed</h3>
                                    <p className="text-muted mb-0">Accept payments with just your smartphone.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-light py-4">
                <div className="container text-center">
                    <h2 className="mb-4">Ready to Transform Your Business?</h2>
                    <p className="lead text-muted mb-4">Join hundreds of couriers who are already using Tapay to streamline their payment processes.</p>
                    <a href="/download" className="btn btn-primary btn-lg">
                        Get Started Now
                    </a>
                </div>
            </section>

            <Footer />
            <BootstrapClient />
        </main>
    );
}
