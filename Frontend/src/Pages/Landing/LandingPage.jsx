import React from 'react';
import { Link } from 'react-router-dom';
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
import './Landing.css';

const LandingPage = () => {
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
                        <span>Track<span className="logo-accent">EQA</span></span>
                    </div>
                    <div className="nav-links">
                        <Link to="/login" className="nav-link">Sign In</Link>
                        <Link to="/register" className="btn btn-primary">Get Started</Link>
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
                        <Link to="/register" className="btn btn-primary btn-lg">
                            Start Free Trial <ArrowRight size={18} />
                        </Link>
                        <a href="#features" className="btn btn-secondary btn-lg">View Features</a>
                    </div>
                </div>
                <div className="hero-preview">
                    <div className="preview-card card">
                        <div className="preview-header">
                            <div className="dots"><span></span><span></span><span></span></div>
                            <div className="title">TrackEQA Dashboard</div>
                        </div>
                        <div className="preview-body">
                            <div className="stats-row">
                                <div className="stat-box">Total SKUs <strong>1,280</strong></div>
                                <div className="stat-box">Low Stock <strong className="text-danger">12</strong></div>
                            </div>
                            <div className="table-skeleton">
                                <div className="row header"></div>
                                <div className="row"></div>
                                <div className="row"></div>
                                <div className="row"></div>
                            </div>
                        </div>
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
                    <p>Join businesses that trust TrackEQA for their daily inventory needs.</p>
                    <Link to="/register" className="btn btn-primary btn-lg">Create Account</Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="landing-footer">
                <div className="footer-content">
                    <div className="footer-brand">
                        <div className="nav-logo">
                            <BarChart2 className="logo-icon" size={20} />
                            <span>Track<span className="logo-accent">EQA</span></span>
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
