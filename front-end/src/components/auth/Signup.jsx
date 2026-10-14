import React, { useState } from 'react';
import { LockKeyhole, Mail, UserRound, Loader2, IdCard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLead } from '../../context/LeadContext';

const Signup = ({ onSuccess, onError, onToggleLogin }) => {
  const { signup } = useAuth();
  const { showToast } = useLead();
  const [form, setForm] = useState({ name: '', email: '', password: '', kycType: 'PAN', kycNumber: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isLoading) return;

    if (!form.kycNumber.trim()) {
      onError('KYC number is required to create an account.');
      return;
    }

    setIsLoading(true);
    onError('');

    try {
      const newUser = await signup({
        ...form,
        kycType: form.kycType,
        kycNumber: form.kycNumber.trim()
      });
      if (showToast) showToast(`Account created! Welcome to Gurukripa, ${newUser.name}!`, 'success');
      if (onSuccess) onSuccess(newUser);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Unable to create account right now';
      onError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="form-group mb-0">
        <label className="form-label" htmlFor="signup-name">Full Name</label>
        <div className="relative">
          <UserRound className="absolute left-3 top-3 h-4 w-4 text-accent" />
          <input
            id="signup-name"
            className="form-input pl-10"
            placeholder="John Doe"
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            required
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="form-group mb-0">
        <label className="form-label" htmlFor="signup-email">Email Address</label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-accent" />
          <input
            id="signup-email"
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
        <label className="form-label" htmlFor="signup-password">Password</label>
        <div className="relative">
          <LockKeyhole className="absolute left-3 top-3 h-4 w-4 text-accent" />
          <input
            id="signup-password"
            type="password"
            minLength={6}
            className="form-input pl-10"
            placeholder="Minimum 6 characters"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            required
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="form-group mb-0">
          <label className="form-label" htmlFor="signup-kyc-type">KYC Type</label>
          <div className="relative">
            <IdCard className="absolute left-3 top-3 h-4 w-4 text-accent" />
            <select
              id="signup-kyc-type"
              className="form-input pl-10"
              value={form.kycType}
              onChange={(event) => setForm({ ...form, kycType: event.target.value })}
              disabled={isLoading}
            >
              <option value="PAN">PAN</option>
              <option value="AADHAAR">Aadhaar</option>
              <option value="PASSPORT">Passport</option>
              <option value="DRIVING_LICENSE">Driving License</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
        </div>

        <div className="form-group mb-0">
          <label className="form-label" htmlFor="signup-kyc-number">KYC Number</label>
          <input
            id="signup-kyc-number"
            className="form-input"
            placeholder="ABCDE1234F"
            value={form.kycNumber}
            onChange={(event) => setForm({ ...form, kycNumber: event.target.value })}
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
            <span>Creating account...</span>
          </>
        ) : (
          <span>Create Account</span>
        )}
      </button>

      <div className="pt-2 text-center text-xs text-ink-muted">
        Already have an account?{' '}
        <button
          type="button"
          onClick={onToggleLogin}
          className="font-bold text-accent hover:underline focus:outline-none"
        >
          Log In
        </button>
      </div>
    </form>
  );
};

export default Signup;
