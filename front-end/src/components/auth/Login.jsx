import React, { useState } from 'react';
import { LockKeyhole, Mail, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLead } from '../../context/LeadContext';

const Login = ({ onSuccess, onError, onToggleSignup }) => {
  const { login } = useAuth();
  const { showToast } = useLead();
  const [form, setForm] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    onError('');

    try {
      const loggedUser = await login(form);
      if (showToast) showToast(`Welcome back, ${loggedUser.name}!`, 'success');
      if (onSuccess) onSuccess(loggedUser);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Unable to login right now';
      onError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="form-group mb-0">
        <label className="form-label" htmlFor="login-email">Email Address</label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-accent" />
          <input
            id="login-email"
            type="email"
            className="form-input pl-10"
            placeholder="name@example.com"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            required
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="form-group mb-0">
        <label className="form-label" htmlFor="login-password">Password</label>
        <div className="relative">
          <LockKeyhole className="absolute left-3 top-3 h-4 w-4 text-accent" />
          <input
            id="login-password"
            type="password"
            minLength={6}
            className="form-input pl-10"
            placeholder="••••••••"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            required
            disabled={isLoading}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="btn-gold mt-2 w-full py-3.5 flex items-center justify-center gap-2 font-bold transition-all disabled:opacity-60 cursor-pointer"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Signing in...</span>
          </>
        ) : (
          <span>Login to Account</span>
        )}
      </button>

      <div className="pt-2 text-center text-xs text-ink-muted">
        Don't have an account yet?{' '}
        <button
          type="button"
          onClick={onToggleSignup}
          className="font-bold text-accent hover:underline focus:outline-none"
        >
          Create an Account
        </button>
      </div>
    </form>
  );
};

export default Login;
