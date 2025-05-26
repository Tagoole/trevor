// ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles, children }) => {
    // Get authentication data from local storage
    const authToken = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('userRole');

    // If no token or role, redirect to signin
    if (!authToken || !userRole) {
        return <Navigate to="/signin" replace />;
    };

    // Check if user's role is in the allowedRoles array
    if (!allowedRoles.includes(userRole)) {
        // If not authorized, redirect to appropriate dashboard or signin
        switch (userRole) {
            case 'student':
                return <Navigate to="/app/dashboard" replace />;
            case 'lecturer':
                return <Navigate to="/lecturer/dashboard" replace />;
            case 'registrar':
                return <Navigate to="/registrar-dashboard/dashboard" replace />;
            };
        };
    
        // If authorized, render the child routes
    return children ? children : <Outlet />;
};

export default ProtectedRoute;