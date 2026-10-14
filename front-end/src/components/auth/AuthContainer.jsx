import React, { useState } from 'react';
import { motion as m, AnimatePresence as AP } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';
import Login from './Login';
import Signup from './Signup';
import { useAuth } from '../../context/AuthContext';

const AuthContainer = ({ onAuthenticated }) => {
  const { isAuthModalOpen, closeAuthModal, authMode, setAuthMode } = useAuth();
  const [errorMessage, setErrorMessage] = useState('');

  const isSignup = authMode === 'signup';

  const handleClose = () => {
    setErrorMessage('');
    closeAuthModal();
  };

  const handleSuccess = (user) => {
    setErrorMessage('');
    if (onAuthenticated) {
      onAuthenticated(user);
    }
  };

  const switchTab = (mode) => {
    setErrorMessage('');
    setAuthMode(mode);
  };

  return (
    <AP>
      {isAuthModalOpen && (
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 p-4 backdrop-blur-md"
          onClick={handleClose}
        >
          <m.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="w-full max-w-md overflow-hidden rounded-3xl border border-accent/35 bg-surface shadow-2xl relative"
            onClick={(event) => event.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border bg-muted/60 px-6 py-4">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-accent flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Gurukripa Private Account</span>
                </div>
                <h2 className="mt-0.5 font-heading text-2xl font-bold text-ink">
                  {isSignup ? 'Create Account' : 'Welcome Back'}
                </h2>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="p-2 text-ink-secondary transition-colors hover:text-accent rounded-full hover:bg-surface"
                aria-label="Close authentication modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8">
              {/* Tab Selector */}
              <div className="mb-6 grid grid-cols-2 rounded-2xl bg-muted p-1 border border-border">
                <button
                  type="button"
                  onClick={() => switchTab('login')}
                  className={`py-2.5 text-xs font-bold rounded-xl transition-all ${
                    !isSignup
                      ? 'bg-surface text-accent shadow-sm border border-accent/20 font-extrabold'
                      : 'text-ink-muted hover:text-ink'
                  }`}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => switchTab('signup')}
                  className={`py-2.5 text-xs font-bold rounded-xl transition-all ${
                    isSignup
                      ? 'bg-surface text-accent shadow-sm border border-accent/20 font-extrabold'
                      : 'text-ink-muted hover:text-ink'
                  }`}
                >
                  Sign Up
                </button>
              </div>

              {/* Error Message Alert */}
              {errorMessage && (
                <m.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 rounded-xl border border-rose-500/40 bg-rose-500/10 px-3.5 py-2.5 text-xs font-medium text-rose-500 flex items-center justify-between"
                >
                  <span>{errorMessage}</span>
                  <button type="button" onClick={() => setErrorMessage('')} className="text-rose-400 hover:text-rose-600 font-bold ml-2">
                    ×
                  </button>
                </m.div>
              )}

              {/* Form Render */}
              {isSignup ? (
                <Signup
                  onError={setErrorMessage}
                  onSuccess={handleSuccess}
                  onToggleLogin={() => switchTab('login')}
                />
              ) : (
                <Login
                  onError={setErrorMessage}
                  onSuccess={handleSuccess}
                  onToggleSignup={() => switchTab('signup')}
                />
              )}
            </div>
          </m.div>
        </m.div>
      )}
    </AP>
  );
};

export default AuthContainer;
