import React from 'react';
import './Auth.css';

function Signup() {
  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">Sign Up</h2>
        <p className="auth-subtitle">create an account</p>
        <button className="google-button">Continue with Google</button>

        <input type="text" placeholder="name" className="auth-input" />
        <input type="text" placeholder="last name" className="auth-input" />
        <input type="email" placeholder="email" className="auth-input" />
        <input type="password" placeholder="password" className="auth-input" />

        <button className="auth-submit">Sign Up</button>

        <p className="auth-footer">
          Already have an account? <a href="#">Login</a>
        </p>
      </div>
    </div>
  );
}

export default Signup;
