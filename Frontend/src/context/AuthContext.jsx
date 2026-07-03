import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userInfo');
        localStorage.removeItem('role');
        setUser(null);
        setIsAuthenticated(false);
    }, []);

    const login = async (credentials) => {
        try {
            const response = await api.post('/login', credentials);
            const { token, refreshToken, user: userData } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('role', userData.role);
            localStorage.setItem('userInfo', JSON.stringify(userData));

            setUser(userData);
            setIsAuthenticated(true);
            return userData;
        } catch (error) {
            throw error.response?.data || { message: 'Login failed' };
        }
    };

    const checkAuth = useCallback(async () => {
        const token = localStorage.getItem('token');
        const userInfo = localStorage.getItem('userInfo');

        if (token && userInfo) {
            try {
                setUser(JSON.parse(userInfo));
                setIsAuthenticated(true);
            } catch (e) {
                logout();
            }
        }
        setLoading(false);
    }, [logout]);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            isAuthenticated,
            login,
            logout,
            checkAuth
        }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
