import React, { useState } from 'react';
import './Auth.css';
import { Link, useNavigate } from 'react-router-dom'; // For routing
import { verfyUser } from '../../services/userService';

function Register(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  async function handleSubmit() {
    setErrorMsg('');
    setSuccessMsg('');

    const data = {
      email: email, 
      password: password, 
      newPassword: newPassword
    }

    try {
      const response = await verfyUser(data)

      setSuccessMsg(response.data.message);

      // Store the new password in localStorage/sessionStorage for next step
      localStorage.setItem('newPassword', newPassword);

      // Redirect to verification page
      navigate('/verifycode');
    } catch (error) {
      if (error.response && error.response.data) {
        setErrorMsg(error.response.data.message || error.response.data.error);
      } else {
        setErrorMsg('An unexpected error occurred');
      }
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">Register</h2>
        <p className="auth-subtitle">Enter your email and create new password.</p>

        {errorMsg && <p className="auth-error">{errorMsg}</p>}
        {successMsg && <p className="auth-success">{successMsg}</p>}

        <input
          type="email"
          placeholder="Email"
          className="auth-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Given Password"
          className="auth-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="New Password"
          className="auth-input"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <button className="auth-submit" onClick={handleSubmit}>Submit</button>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
