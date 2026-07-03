import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    BarChart2,
    ShieldCheck,
    ArrowLeft,
    ArrowRight,
    AlertCircle,
    CheckCircle2,
    Loader2
} from 'lucide-react';
import { verifyCode, changePassword } from '../../services/userService';
import './Auth.css';

const VerifyCode = () => {
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleVerify = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        const email = localStorage.getItem('email');
        const newPassword = localStorage.getItem('newPassword');

        try {
            await verifyCode({ email, code });
            await changePassword({ email, password: newPassword });

            setSuccess('Verification successful! Account recovered.');

            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data?.error || 'Verification failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <Link to="/recover" className="auth-back-link">
                    <ArrowLeft size={16} /> Back to Recovery
                </Link>

                <div className="auth-header">
                    <div className="auth-logo">
                        <BarChart2 className="logo-icon" size={28} />
                        <span>Track<span className="logo-accent">EQA</span></span>
                    </div>
                    <h1 className="auth-title">Verify Identity</h1>
                    <p className="auth-subtitle">Enter the 6-digit code sent to your email to confirm the password change.</p>
                </div>

                {error && (
                    <div className="auth-error">
                        <AlertCircle size={18} />
                        {error}
                    </div>
                )}

                {success && (
                    <div className="auth-success">
                        <CheckCircle2 size={18} />
                        {success}
                    </div>
                )}

                <form className="auth-form" onSubmit={handleVerify}>
                    <div className="form-group">
                        <label htmlFor="code">Verification Code</label>
                        <div className="input-wrapper">
                            <ShieldCheck className="input-icon" size={18} />
                            <input
                                type="text"
                                id="code"
                                className="auth-input"
                                placeholder="Enter 6-digit code"
                                required
                                value={code}
                                onChange={(e) => {
                                    setCode(e.target.value);
                                    if (error) setError('');
                                }}
                            />
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
                                Verifying...
                            </>
                        ) : (
                            <>
                                Confirm Reset <ArrowRight size={18} style={{ marginLeft: '8px' }} />
                            </>
                        )}
                    </button>
                </form>

                <div className="auth-footer">
                    Didn't receive a code? <button className="text-link" style={{ background: 'none', border: 'none', color: 'var(--primary-blue)', fontWeight: '600', cursor: 'pointer' }}>Resend Code</button>
                </div>
            </div>
        </div>
    );
};

export default VerifyCode;
