import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../services/api';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const validateForm = () => {
    if (!email.trim()) {
      setError('Email is required');
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await api.post('/forgot-password', { email });
      setSent(true);
      toast.success(response.data.message);
    } catch (err) {
      const message = err.response?.data?.message;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-hidden flex items-center justify-center px-6 py-16">
      <div className="relative z-10 w-full max-w-sm space-y-9">
        <div className="flex items-center justify-center gap-2">
          <span className="text-lg font-bold tracking-tight text-white">
            QR<span className="text-orange-500">Restaurant</span>
          </span>
        </div>

        {!sent ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Forgot password?
              </h1>
              <p className="text-sm text-slate-400 leading-relaxed">
                Enter the email linked to your account and we'll send you a link to reset it.
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium flex items-center gap-2">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-400 tracking-wide uppercase">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="you@restaurant.com"
                  className="w-full px-4 py-3 bg-slate-900/60 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full group flex items-center justify-center gap-2 py-3 bg-orange-500 hover:bg-orange-400 disabled:bg-orange-500/50 disabled:cursor-not-allowed text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-orange-500/25 cursor-pointer"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Send reset link
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Check your inbox
              </h1>
              <p className="text-sm text-slate-400 leading-relaxed">
                We sent a password reset link to :{' '}
                <span className="text-slate-200  font-medium">{email}</span>.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setSent(false);
                setEmail('');
                setError('');
              }}
              className="text-xs text-orange-400 hover:text-orange-300 font-medium transition-colors cursor-pointer"
            >
              Didn't get it? Send again
            </button>
          </div>
        )}

        <div className="pt-2">
          <Link
            to="/login"
            className="flex items-center gap-2 text-xs text-slate-500 hover:text-orange-400 font-medium transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
            Back to log in
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;