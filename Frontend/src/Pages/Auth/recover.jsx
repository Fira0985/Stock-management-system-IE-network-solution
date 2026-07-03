import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BarChart2,
  Mail,
  Lock,
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { RecoverUser } from '../../services/userService';
import './Auth.css';

const Recover = () => {
  const [recoverData, setRecoverData] = useState({ email: '', newPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleInput = (e) => {
    const { name, value } = e.target;
    setRecoverData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await RecoverUser(recoverData);
      setSuccess(response.data.message || 'Recovery code sent to your email.');

      localStorage.setItem('email', recoverData.email);
      localStorage.setItem('newPassword', recoverData.newPassword);

      setTimeout(() => navigate('/verifycode'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Recovery failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/login" className="auth-back-link">
          <ArrowLeft size={16} /> Back to Login
        </Link>

        <div className="auth-header">
          <div className="auth-logo">
            <BarChart2 className="logo-icon" size={28} />
            <span>Track<span className="logo-accent">EQA</span></span>
          </div>
          <h1 className="auth-title">Reset Password</h1>
          <p className="auth-subtitle">Enter your email and a new password to recover access.</p>
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
                value={recoverData.email}
                onChange={handleInput}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={18} />
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                className="auth-input"
                placeholder="••••••••"
                required
                value={recoverData.newPassword}
                onChange={handleInput}
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
                Sending code...
              </>
            ) : (
              <>
                Recover Account <ArrowRight size={18} style={{ marginLeft: '8px' }} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Recover;
