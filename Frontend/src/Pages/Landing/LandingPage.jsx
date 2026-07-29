import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    BarChart2,
    Package,
    Shield,
    Zap,
    ArrowRight,
    CheckCircle2,
    LayoutDashboard,
    TrendingUp,
    Search
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import './Landing.css';

const LandingPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [loadingDemo, setLoadingDemo] = useState(false);

    const features = [
        {
            icon: <LayoutDashboard className="text-blue-500" size={32} />,
            title: 'Actionable Dashboard',
            description: 'Get an immediate pulse on SKUs, low stock alerts, and daily movements in secondary.'
        },
        {
            icon: <TrendingUp className="text-blue-500" size={32} />,
            title: 'Practical Analytics',
            description: 'Data-driven insights into stock turnover and slow-moving items for better decision making.'
        },
        {
            icon: <Package className="text-blue-500" size={32} />,
            title: 'Efficient Inventory',
            description: 'Manage thousands of items with high-density views, bulk actions, and inline editing.'
        },
        {
            icon: <Shield className="text-blue-500" size={32} />,
            title: 'Enterprise Ready',
            description: 'Role-based access control, audit trails, and secure data backups for your business.'
        }
    ];

    return (
        <div className="landing-container">
            {/* Navigation */}
            <nav className="landing-nav">
                <div className="nav-content">
                    <div className="nav-logo">
                        <BarChart2 className="logo-icon" size={24} />
                        <span>Track<span className="logo-accent">እቃ</span></span>
                    </div>
                    <div className="nav-links">
                        <Link to="/login" className="nav-link">Sign In</Link>
                        <Link to="/request-access" className="btn btn-primary">Request Access</Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="hero">
                <div className="hero-content">
                    <div className="hero-badge">Professional Stock Management</div>
                    <h1 className="hero-title">
                        Inventory management that <span className="highlight">works for you.</span>
                    </h1>
                    <p className="hero-subtitle">
                        A clean, functional platform that balances usability with powerful analytics.
                        No gimmicks, just the efficiency your business deserves.
                    </p>
                    <div className="hero-actions">
                        <div className="hero-actions hero-actions-one">
                            <Link to="/request-access" className="btn btn-primary btn-lg">
                                Request Access <ArrowRight size={18} />
                            </Link>
                            <button
                                type="button"
                                className="btn btn-tertiary btn-lg"
                                onClick={async () => {
                                    setLoadingDemo(true);
                                    try {
                                        await login({
                                            email: 'firafisberhanu4@gmail.com',
                                            password: 'yourpassword'
                                        });
                                        toast.success('Logged in to demo account');
                                        navigate('/dashboard');
                                    } catch (err) {
                                        console.error('Demo login failed:', err);
                                        toast.error(err.message || 'Demo login failed');
                                    } finally {
                                        setLoadingDemo(false);
                                    }
                                }}
                                disabled={loadingDemo}
                            >
                                {loadingDemo ? 'Signing in…' : 'Demo Account'}
                            </button>
                        </div>

                        <Link to="/contact" className="btn btn-secondary btn-lg">Contact Us</Link>
                    </div>

                </div>
                <div className="hero-preview">
                    <div className="preview-card card">
                        <img src="/dashboard.PNG" alt="Dashboard preview" className="hero-dashboard-image" />
                    </div>
                </div>
            </header>

            {/* Features Grid */}
            <section id="features" className="features">
                <div className="features-grid">
                    {features.map((f, i) => (
                        <div key={i} className="feature-card card">
                            <div className="feature-icon-wrapper">{f.icon}</div>
                            <h3>{f.title}</h3>
                            <p>{f.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Trust Section */}
            <section className="cta">
                <div className="cta-content">
                    <h2>Ready to streamline your operations?</h2>
                    <p>Request access for your team.</p>
                    <div className="hero-actions cta-actions">
                        <Link to="/request-access" className="btn btn-primary btn-lg">Request Access</Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="landing-footer">
                <div className="footer-content">
                    <div className="footer-brand">
                        <div className="nav-logo">
                            <BarChart2 className="logo-icon" size={20} />
                            <span>Track<span className="logo-accent">እቃ</span></span>
                        </div>
                        <p>Precise. Practical. Professional.</p>
                    </div>
                    <div className="footer-copy">
                        &copy; 2024 TrackEQA System. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
