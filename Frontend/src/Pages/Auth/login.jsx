import React, { useState } from 'react';
import './Auth.css';
import { loginUser } from '../../services/authService'; // Adjust path as needed

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleLogin() {
    try {
      const data = await loginUser({ email, password });
      console.log('Logged in:', data);

      // Save token if returned
      if (data.token) {
        localStorage.setItem('token', data.token);
      }

      // Redirect or update UI here
      alert('Login successful!');
    } catch (error) {
      setErrorMsg(error.message || 'Login failed');
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">Login</h2>
        <p className="auth-subtitle">Welcome back!</p>

        {errorMsg && <p className="auth-error">{errorMsg}</p>}

        <button className="google-button">Continue with Google</button>

        <input
          type="email"
          placeholder="Email"
          className="auth-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="auth-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="auth-submit" onClick={handleLogin}>Login</button>

        <p className="auth-footer">
          Forget Password? <a href="#">Recover</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
