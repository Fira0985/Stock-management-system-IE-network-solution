import React from 'react';
import './Auth.css';

function Login() {
  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">Login</h2>
        <p className="auth-subtitle">Welcome back!</p>
        <button className="google-button">Continue with Google</button>

        <input type="email" placeholder="email" className="auth-input" />
        <input type="password" placeholder="password" className="auth-input" />

        <button className="auth-submit">Login</button>

        <p className="auth-footer">
          No account? <a href="#">Sign up</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
