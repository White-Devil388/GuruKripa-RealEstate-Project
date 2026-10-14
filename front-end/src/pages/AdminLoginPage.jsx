import React, { useEffect } from 'react';

const AdminLoginPage = () => {
  useEffect(() => {
    const portalUrl = import.meta.env.VITE_PORTAL_URL || 'http://localhost:5174';
    window.location.href = `${portalUrl}/admin-login`;
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-bg">
      <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4" />
      <p className="font-semibold text-ink">Redirecting to Admin Portal...</p>
    </div>
  );
};

export default AdminLoginPage;
