import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoutes = ({ children }) => {
  const { isAuthenticated, isRestoring } = useAuth();
  const location = useLocation();

  if (isRestoring) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace state={{ from: location.pathname }} />;
  }

  return children;
};

export const AdminProtectedRoute = () => {
  React.useEffect(() => {
    const portalUrl = import.meta.env.VITE_PORTAL_URL || 'http://localhost:5174';
    window.location.href = `${portalUrl}/admin-login`;
  }, []);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4" />
      <p className="font-semibold text-ink">Redirecting to Admin Portal...</p>
    </div>
  );
};

export default ProtectedRoutes;
