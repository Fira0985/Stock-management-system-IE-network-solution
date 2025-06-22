import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; 

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('authToken');

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    try {
        const decoded = jwtDecode(token); 
        const currentTime = Date.now() / 1000; // JWT time is in seconds

        if (decoded.exp < currentTime) {
            localStorage.removeItem('authToken');
            return <Navigate to="/login" replace />;
        }
    } catch (error) {
        localStorage.removeItem('authToken');
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default PrivateRoute;
