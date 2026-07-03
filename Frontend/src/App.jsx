import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./Pages/Landing/LandingPage";
import Login from "./Pages/Auth/login";
import Register from "./Pages/Auth/register";
import MainPage from "./Pages/MainPage/mainPage";
import RecoverUser from "./Pages/Auth/recover";
import VerifyUser from "./Pages/Auth/verifyCode";
import { AuthProvider, useAuth } from "./context/AuthContext";
import "./index.css";

const PrivateRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    if (loading) return null; // or a loading spinner
    return isAuthenticated ? children : <Navigate to="/login" />;
};

const RoleRoute = ({ children, allowedRoles }) => {
    const { user, isAuthenticated, loading } = useAuth();
    if (loading) return null;
    if (!isAuthenticated) return <Navigate to="/login" />;
    return allowedRoles.includes(user.role) ? children : <Navigate to="/dashboard" />;
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/recover" element={<RecoverUser />} />
                    <Route path="/verifycode" element={<VerifyUser />} />

                    {/* Protected Dashboard Routes */}
                    <Route
                        path="/dashboard/*"
                        element={
                            <PrivateRoute>
                                <MainPage />
                            </PrivateRoute>
                        }
                    />

                    {/* Catch-all redirect */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
