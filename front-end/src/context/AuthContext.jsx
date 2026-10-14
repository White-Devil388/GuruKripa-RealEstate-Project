import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchCurrentUser, loginUser, signupUser } from '../api/authApi';

const AuthContext = createContext();

const persistSession = (token, user) => {
  localStorage.setItem('teca-token', token);
  localStorage.setItem('teca-user', JSON.stringify(user));
};

const clearSession = () => {
  localStorage.removeItem('teca-token');
  localStorage.removeItem('teca-user');
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('teca-user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('teca-token') || null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [isRestoring, setIsRestoring] = useState(Boolean(localStorage.getItem('teca-token')));

  const openAuthModal = (mode = 'login') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const applySession = (data) => {
    persistSession(data.token, data.user);
    setToken(data.token);
    setUser(data.user);
    setIsAuthModalOpen(false);
    return data.user;
  };

  const login = async (credentials) => {
    const data = await loginUser(credentials);
    if (data && data.token && data.user) {
      return applySession(data);
    }
    throw new Error('Invalid server response');
  };

  const signup = async (details) => {
    const data = await signupUser(details);
    if (data && data.token && data.user) {
      return applySession(data);
    }
    throw new Error('Invalid server response');
  };

  const logout = () => {
    clearSession();
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    const restoreSession = async () => {
      const existingToken = localStorage.getItem('teca-token');
      if (!existingToken) {
        setIsRestoring(false);
        return;
      }

      try {
        const data = await fetchCurrentUser();
        if (data?.user) {
          setUser(data.user);
          localStorage.setItem('teca-user', JSON.stringify(data.user));
        }
      } catch {
        clearSession();
        setToken(null);
        setUser(null);
      } finally {
        setIsRestoring(false);
      }
    };

    restoreSession();
  }, []);

  const isAdmin = user?.role === 'admin' || user?.role === 'subadmin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(user && token),
        isAdmin,
        isRestoring,
        isAuthModalOpen,
        authMode,
        setAuthMode,
        openAuthModal,
        closeAuthModal,
        login,
        signup,
        logout
      }}
    >
      {children}
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
