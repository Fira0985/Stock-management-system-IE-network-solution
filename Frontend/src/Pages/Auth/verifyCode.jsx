import React, { useState } from 'react';
import './Auth.css';
import { verifyCode, changePassword } from '../../services/userService';
import { useNavigate } from 'react-router-dom';

function VerifyCode() {
    const [code, setCode] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const navigate = useNavigate();

    async function handleVerify() {
        setErrorMsg('');
        setSuccessMsg('');

        const email = localStorage.getItem('email');
        const newPassword = localStorage.getItem('newPassword'); // Fix: Key should be a string, not a variable

        try {
            const verify_response = await verifyCode({ email, code });

            await changePassword({ email, password: newPassword });

            setSuccessMsg('Registered Successfully! Redirecting...');

            setTimeout(() => {
                navigate('/login');
            }, 2000); // Wait 2 seconds before redirecting
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
                <h2 className="auth-title">Verify Code</h2>
                <p className="auth-subtitle">Enter the 6-digit code sent to your email</p>

                {errorMsg && <p className="auth-error">{errorMsg}</p>}
                {successMsg && <p className="auth-success">{successMsg}</p>}

                <input
                    type="text"
                    className="auth-input"
                    placeholder="Enter 6-digit code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                />

                <button className="auth-submit" onClick={handleVerify}>Verify</button>
            </div>
        </div>
    );
}

export default VerifyCode;
