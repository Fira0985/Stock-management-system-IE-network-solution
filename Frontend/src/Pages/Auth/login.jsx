import React, { useState } from 'react';
import './Auth.css';
import { loginUser } from '../../services/authService';
import { useNavigate, Link } from 'react-router-dom';

function Login(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  async function handleLogin() {
    try {
      const data = await loginUser({ email, password });

      // Save token if returned
      if (data.token) {
        localStorage.setItem('token', data.token);
        navigate('/dashboard');
      }
      localStorage.setItem('userName', data.user.username); 
      localStorage.setItem('email', email)

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
          Don't have Account? <Link to="/">Register</Link>
        </p>
        <p className="auth-footer">
          Forget Password? <a href="#">Recover</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
