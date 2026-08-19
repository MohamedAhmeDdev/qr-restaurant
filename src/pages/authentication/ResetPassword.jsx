import React, { useState } from 'react';
import { Eye, EyeOff, ArrowRight, Check, AlertCircle } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../services/api';

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const email = searchParams.get('email') || '';

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const checks = [
    { label: 'At least 8 characters', valid: password.length >= 8 },
    { label: 'One number', valid: /\d/.test(password) },
    { label: 'One uppercase letter', valid: /[A-Z]/.test(password) },
  ];

  const passwordsMatch = confirm.length > 0 && password === confirm;


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token || !email) {
      const msg = 'Invalid reset URL token or email parameter.';
      setError(msg);
      toast.error(msg);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await api.post('/reset-password', {
        token,
        email,
        password,
        password_confirmation: confirm,
      });

      toast.success(response.data.message);
      navigate('/login');
    } catch (err) {
      const message = err.response?.data?.message;
      setError(message);
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

        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Set a new password
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed">
              Choose a strong password you haven't used before.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-400 tracking-wide uppercase">
                New password 
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Enter new password"
                  className="w-full pl-4 pr-11 py-3 bg-slate-900/60 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-orange-400 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-400 tracking-wide uppercase">
                Confirm password 
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  required
                  value={confirm}
                  onChange={(e) => {
                    setConfirm(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Re-enter new password"
                  className={`w-full pl-4 pr-11 py-3 bg-slate-900/60 border rounded-xl text-sm text-white placeholder-slate-600 outline-none focus:ring-2 transition-all ${
                    confirm.length > 0 && !passwordsMatch
                      ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20'
                      : 'border-slate-800 focus:border-orange-500 focus:ring-orange-500/20'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-orange-400 transition-colors"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {confirm.length > 0 && !passwordsMatch && (
                <div className="flex items-center gap-1.5 text-red-400 text-xs mt-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Passwords don't match</span>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-1.5 pt-1">
              {checks.map((check) => (
                <span
                  key={check.label}
                  className={`flex items-center gap-1.5 text-xs transition-colors ${
                    check.valid ? 'text-orange-400' : 'text-slate-600'
                  }`}
                >
                  <Check className="w-3 h-3" />
                  {check.label}
                </span>
              ))}
            </div>

            <button
              type="submit"
              disabled={ isLoading}
              className="w-full group flex items-center justify-center gap-2 py-3 bg-orange-500 hover:bg-orange-400 disabled:bg-slate-800 disabled:text-slate-500 disabled:shadow-none text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-orange-500/25 !mt-6 cursor-pointer disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Reset password
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;