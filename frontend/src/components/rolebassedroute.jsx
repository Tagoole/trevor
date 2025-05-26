import React from 'react';
import { Navigate } from 'react-router-dom';

const RoleBasedRoute = ({ allowedRoles, children }) => {
    const userRole = localStorage.getItem('userRole');

    if (!allowedRoles.includes(userRole)) {
    
        return <Navigate to="/signin" />;
    }

    return children;
};

export default RoleBasedRoute;