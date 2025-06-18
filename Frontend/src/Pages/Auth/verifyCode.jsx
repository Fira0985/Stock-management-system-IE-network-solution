import React, { useState } from 'react';
import './Auth.css';

function VerifyCode() {
    const [code, setCode] = useState('');

    function handleVerify() {
        // Add actual code verification here if needed
    }

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2 className="auth-title">Verify Code</h2>
                <p className="auth-subtitle">Enter the 6-digit code sent to your email</p>

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
