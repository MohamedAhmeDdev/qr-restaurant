import React, { useState } from 'react';
import { Eye, EyeOff, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import TwoFactorAuthentication from './TwoFactorAuthentication';
import { getDefaultRouteForRole } from '../../utils/getDefaultRouteForRole';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, setAuthSession } = useAuth();

  const from = location.state?.from?.pathname || '/';

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState('login'); // 'login' | '2fa'

  const validateForm = () => {
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const result = await login(email, password);

      if (result?.two_factor_required) {
        setStep('2fa');
        toast.success(result.message);
        return;
      }

      if (result?.success) {
        toast.success(result.message);
        const redirectPath =  getDefaultRouteForRole(result.user?.role);
        navigate(redirectPath, { replace: true });
      } else {
        setErrors({ general: result?.error});
      }
    } catch (error) {
      setErrors({ general: 'An unexpected error occurred.' });
    } finally {
      setIsLoading(false);
    }
  };

const handle2FAVerified = (data) => {
  setAuthSession({ token: data.token, user: data.user });
  toast.success(data.message);
  
  // ✅ Fixed: derive role directly from data.user
  const redirectPath = getDefaultRouteForRole(data.user?.role);
  navigate(redirectPath, { replace: true });
};

  const handleBackToLogin = () => {
    setStep('login');
    setPassword('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-hidden">
      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row items-stretch">
        <div className="w-full lg:w-[46%] flex items-center justify-center min-h-screen lg:min-h-0 px-6 sm:px-12 py-16">
          <div className="w-full max-w-sm space-y-9">
            <div className="flex items-center justify-center gap-2">
              <span className="text-lg font-bold tracking-tight text-white">
                QR<span className="text-orange-500">Restaurant</span>
              </span>
            </div>

            {step === 'login' ? (
              <>
                <div className="space-y-2">
                  <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                    Welcome back
                  </h1>
                  <p className="text-sm text-slate-400">
                    Sign in to manage your menu and orders.
                  </p>
                </div>

                {errors.general && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{errors.general}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-1.5">
                    <label htmlFor="email" className="block text-xs font-medium text-slate-400 tracking-wide uppercase">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                      }}
                      placeholder="you@restaurant.com"
                      className="w-full px-4 py-3 bg-slate-900/60 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                    />
                    {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label htmlFor="password" className="block text-xs font-medium text-slate-400 tracking-wide uppercase">
                        Password
                      </label>
                      <Link to="/forgot-password" className="text-xs text-slate-500 hover:text-orange-400 font-medium transition-colors">
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
                        }}
                        placeholder="Enter your password"
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
                    {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full group flex items-center justify-center gap-2 py-3 bg-orange-500 hover:bg-orange-400 disabled:bg-orange-500/50 disabled:cursor-not-allowed text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-orange-500/25 cursor-pointer"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        Log in
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                      </>
                    )}
                  </button>
                </form>

                <p className="text-xs text-slate-600 text-center">
                  Protected access · QRRestaurant staff portal
                </p>
              </>
            ) : (
              <TwoFactorAuthentication
                email={email}
                onVerified={handle2FAVerified}
                onBack={handleBackToLogin}
              />
            )}
          </div>
        </div>

        <div className="hidden lg:block w-full lg:w-[54%] relative">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1400&q=80"
              alt="Restaurant Interior"
              className="w-full h-full object-cover"
              style={{ filter: 'saturate(0.85) brightness(0.75)' }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/30" />
            <div className="absolute inset-0 bg-orange-500/10 mix-blend-overlay" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;