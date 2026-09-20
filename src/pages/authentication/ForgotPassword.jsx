import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, CheckCircle2, AlertCircle, Mail, ExternalLink, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../services/api';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendCountdown, setResendCountdown] = useState(0);

  // Countdown timer for resend button
  useEffect(() => {
    let timer;
    if (resendCountdown > 0) {
      timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCountdown]);

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
    if (e) e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await api.post('/forgot-password', { email });
      setSent(true);
      setResendCountdown(30); // 30-second cooldown
    } catch (err) {
      const message = err.response?.data?.message;
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-hidden flex items-center justify-center px-6 py-16">
      <div className="relative z-10 w-full max-w-sm space-y-8">
        <div className="flex items-center justify-center gap-2">
          <span className="text-xl font-bold tracking-tight text-white">
            QR<span className="text-orange-500">Restaurant</span>
          </span>
        </div>

        {!sent ? (
          <div className="space-y-6">
            <div className="space-y-2 text-center sm:text-left">
              <h1 className="text-3xl font-bold text-white tracking-tight">
                Forgot password?
              </h1>
              <p className="text-sm text-slate-400 leading-relaxed">
                Enter the email linked to your account and we'll send you a link to reset it.
              </p>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium flex items-center gap-2.5 animate-in fade-in slide-in-from-top-1 duration-200">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-400 tracking-wider uppercase">
                  Email Address
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
                  className="w-full px-4 py-3 bg-slate-900/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full group flex items-center justify-center gap-2 py-3 px-4 bg-orange-500 hover:bg-orange-400 disabled:bg-orange-500/50 disabled:cursor-not-allowed text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-orange-500/20 active:scale-[0.99] cursor-pointer"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Send reset link
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="p-6 bg-slate-900/60 border border-slate-800/80 rounded-2xl text-center space-y-4 shadow-xl backdrop-blur-sm">
              <div className="w-12 h-12 bg-orange-500/10 border border-orange-500/20 rounded-full flex items-center justify-center mx-auto text-orange-500">
                <Mail className="w-6 h-6" />
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  Check your inbox
                </h1>
                <p className="text-xs text-slate-400 leading-relaxed">
                  We sent a password reset link to:
                </p>
                <div className="inline-block px-3 py-1 bg-slate-800/80 border border-slate-700/60 rounded-lg text-xs font-medium text-orange-400 break-all max-w-full">
                  {email}
                </div>
              </div>

              {/* Action options */}
              <div className="pt-2 space-y-3">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={resendCountdown > 0 || isLoading}
                  className="w-full flex items-center justify-center gap-1.5 text-xs text-slate-400 hover:text-orange-400 disabled:text-slate-600 font-medium transition-colors cursor-pointer disabled:cursor-not-allowed py-1"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                  {resendCountdown > 0
                    ? `Resend email in ${resendCountdown}s`
                    : "Didn't get it? Resend email"}
                </button>
              </div>
            </div>

            {/* Back to edit email trigger */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setSent(false);
                  setError('');
                }}
                className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
              >
                Entered the wrong email? <span className="underline decoration-slate-600 underline-offset-4">Change email</span>
              </button>
            </div>
          </div>
        )}

        {/* Global Footer Back Link */}
        <div className="pt-2 flex justify-center">
          <Link
            to="/login"
            className="flex items-center gap-2 text-xs text-slate-400 hover:text-orange-400 font-medium transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
            Back to log in
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;