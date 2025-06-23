import React, { useState } from 'react';
import './Auth.css';
import { loginUser } from '../../services/authService';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'; // Toast imports
import 'react-toastify/dist/ReactToastify.css'; // Toast styles

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  async function handleLogin() {
    try {
      const data = await loginUser({ email, password });

      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userName', data.user.username);
        localStorage.setItem('email', data.user.email);
        localStorage.setItem('role', data.user.role)
        localStorage.setItem('phone', data.user.phone)
        localStorage.setItem('id', data.user.id)


        toast.success('Login successful!', {
          position: 'top-center',
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
        });
        // Toast here

        setTimeout(() => {
          navigate('/dashboard');
        }, 1000); // Give the toast a moment to show before navigating
      }
    } catch (error) {
      toast.error(error.message || 'Login failed',); // Toast error
    }
  }

  return (
    <div className="auth-container">
      <ToastContainer />

      <div className="auth-box">
        <h2 className="auth-title">Login</h2>
        <p className="auth-subtitle">Welcome back!</p>

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
          Forget Password? <Link to="/recover">Recover</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
