import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

interface ProtectedRouteProps {
  allowedRoles?: Array<'ADMIN' | 'CLINIC_ADMIN' | 'DOCTOR' | 'PATIENT'>;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { token, user } = useSelector((state: any) => state.auth);
  const location = useLocation();

  if (!token || !user) {
    // Not logged in -> Redirect to login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Logged in but missing required role -> Drop to root / or unauthorized
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
