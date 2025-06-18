import React, { useState } from 'react';
import './Auth.css';
import { verifyCode, changePassword } from '../../services/userService';
import { Navigate } from 'react-router-dom';

function VerifyCode() {
    const [code, setCode] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    async function handleVerify() {
        setErrorMsg('')
        const data = {
            email: localStorage.getItem('email'),
            code: code
        }
        try {
            const verify_response = await verifyCode(data)

            data = {
                email: localStorage.getItem('email'),
                password: localStorage.getItem(newPassword)
            }

            const response = await changePassword(data)
            Navigate('/dashboard')
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
