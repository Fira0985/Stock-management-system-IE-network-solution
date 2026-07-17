import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    BarChart2,
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
    ArrowLeft,
    AlertCircle,
    Loader2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import './Auth.css';

const Login = () => {
    const { login } = useAuth();
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleInput = (e) => {
        const { name, value } = e.target;
        setLoginData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await login(loginData);
            toast.success('Welcome to TrackEQA');
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Invalid email or password');
            toast.error(err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <Link to="/" className="auth-back-link">
                    <ArrowLeft size={16} /> Back to Home
                </Link>

                <div className="auth-header">
                    <div className="auth-logo">
                        <BarChart2 className="logo-icon" size={28} />
                        <span>Track<span className="logo-accent">EQA</span></span>
                    </div>
                    <h1 className="auth-title">Welcome Back</h1>
                    <p className="auth-subtitle">Log in to manage your inventory sanctuary.</p>
                </div>

                {error && (
                    <div className="auth-error">
                        <AlertCircle size={18} />
                        {error}
                    </div>
                )}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <div className="input-wrapper">
                            <Mail className="input-icon" size={18} />
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="auth-input"
                                placeholder="name@company.com"
                                required
                                value={loginData.email}
                                onChange={handleInput}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="label-row">
                            <label htmlFor="password">Password</label>
                            <Link to="/recover" style={{ fontSize: '12px', fontWeight: '500' }}>Forgot password?</Link>
                        </div>
                        <div className="input-wrapper">
                            <Lock className="input-icon" size={18} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                className="auth-input"
                                placeholder="••••••••"
                                required
                                value={loginData.password}
                                onChange={handleInput}
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-lg auth-submit"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" size={18} style={{ marginRight: '8px' }} />
                                Signing in...
                            </>
                        ) : (
                            <>
                                Sign In <ArrowRight size={18} style={{ marginLeft: '8px' }} />
                            </>
                        )}
                    </button>
                </form>

                <div className="auth-footer">
                    Don't have an account? <Link to="/register">Create one for free</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
