import React, { useState, useEffect } from 'react';
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
    Loader2,
    ShieldCheck,
    CheckCircle2
} from 'lucide-react';
import { verifyCode, changePassword } from '../../services/userService';
import { toast } from 'react-toastify';
import './Auth.css';

const Register = () => {
    const [step, setStep] = useState(1); // 1: Verify Code, 2: Set Password
    const [authData, setAuthData] = useState({
        email: localStorage.getItem('invitedEmail') || '',
        code: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleInput = (e) => {
        const { name, value } = e.target;
        setAuthData(prev => ({ ...prev, [name]: value }));
        if (error) setError('');
    };

    const handleVerifyCode = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await verifyCode({ email: authData.email, code: authData.code });
            setStep(2);
            toast.success('Code verified. Please set your password.');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid or expired code.');
        } finally {
            setLoading(false);
        }
    };

    const handleSetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await changePassword({ email: authData.email, password: authData.password });
            toast.success('Account activated successfully!');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to set password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <Link to="/login" className="auth-back-link">
                    <ArrowLeft size={16} /> Back to Sign In
                </Link>

                <div className="auth-header">
                    <div className="auth-logo">
                        <BarChart2 className="logo-icon" size={28} />
                        <span>Track<span className="logo-accent">EQA</span></span>
                    </div>
                    <h1 className="auth-title">
                        {step === 1 ? 'Activate Account' : 'Set Password'}
                    </h1>
                    <p className="auth-subtitle">
                        {step === 1
                            ? 'Enter the code from your invitation email.'
                            : 'Create a secure password for your new account.'}
                    </p>
                </div>

                {error && (
                    <div className="auth-error">
                        <AlertCircle size={18} />
                        {error}
                    </div>
                )}

                {step === 1 ? (
                    <form className="auth-form" onSubmit={handleVerifyCode}>
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
                                    value={authData.email}
                                    onChange={handleInput}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="code">Verification Code</label>
                            <div className="input-wrapper">
                                <ShieldCheck className="input-icon" size={18} />
                                <input
                                    type="text"
                                    id="code"
                                    name="code"
                                    className="auth-input"
                                    placeholder="6-digit code"
                                    required
                                    value={authData.code}
                                    onChange={handleInput}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-lg auth-submit"
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="animate-spin" size={18} /> : 'Verify Code'}
                        </button>
                    </form>
                ) : (
                    <form className="auth-form" onSubmit={handleSetPassword}>
                        <div className="form-group">
                            <label htmlFor="password">New Password</label>
                            <div className="input-wrapper">
                                <Lock className="input-icon" size={18} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    className="auth-input"
                                    placeholder="••••••••"
                                    required
                                    value={authData.password}
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
                            {loading ? <Loader2 className="animate-spin" size={18} /> : 'Complete Activation'}
                        </button>
                    </form>
                )}

                <div className="auth-footer text-sm">
                    {step === 1 ? (
                        <span>Didn't receive an invite? Contact your administrator.</span>
                    ) : (
                        <span>Your password must be at least 6 characters long.</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Register;
