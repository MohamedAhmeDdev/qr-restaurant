import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, ArrowRight, Check, AlertCircle, Loader2, User, Lock, Mail, Building2 } from 'lucide-react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom'; 
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { getDefaultRouteForRole } from '../../utils/getDefaultRouteForRole';

function Register() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifyingToken, setIsVerifyingToken] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();
  const { register } = useAuth();

  const from = location.state?.from?.pathname || '/';

  const [form, setForm] = useState({
    name: '',
    email: '',
    organizationName: '',
    password: '',
    password_confirmation: '',
  });

  const [errors, setErrors] = useState({});

  const passwordChecks = [
    { label: 'At least 8 characters', valid: form.password.length >= 8 },
    { label: 'One number', valid: /\d/.test(form.password) },
    { label: 'One uppercase letter', valid: /[A-Z]/.test(form.password) },
  ];

  useEffect(() => {
    const verifyInviteToken = async () => {
      if (!token) {
        setErrors({ general: 'Invitation token is missing or invalid.' });
        setIsVerifyingToken(false);
        return;
      }

      try {
        const { data } = await api.get(`/verify-invite?token=${token}`);
        if (data.valid) {
          setForm((prev) => ({ ...prev, email: data.email }));
        }
      } catch (err) {
        setErrors({
          general: err?.response?.data?.message,
        });
      } finally {
        setIsVerifyingToken(false);
      }
    };

    verifyInviteToken();
  }, [token]);

  const update = (key) => (e) => {
    const value = e.target.value;

    if (key === 'password') {
      setForm((prev) => ({
        ...prev,
        password: value,
        password_confirmation: value,
      }));
    } else {
      setForm((prev) => ({ ...prev, [key]: value }));
    }

    if (errors[key] || errors.general) {
      setErrors((prev) => ({ ...prev, [key]: '', general: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!token) {
      newErrors.general = 'Valid invitation token is required to register.';
    }

    if (!form.name.trim()) {
      newErrors.name = 'Admin name is required';
    }

    if (!form.organizationName.trim()) {
      newErrors.organizationName = 'Organization name is required';
    }

    if (!form.password) {
      newErrors.password = 'Password is required';
    } else if (form.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/\d/.test(form.password)) {
      newErrors.password = 'Password must contain at least one number';
    } else if (!/[A-Z]/.test(form.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter';
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
      const userData = {
        token,
        name: form.name,
        password: form.password,
        password_confirmation: form.password_confirmation,
        organization_name: form.organizationName,
      };

      const result = await register(userData);

      if (result.success) {
        toast.success(result.message);
        const redirectPath = getDefaultRouteForRole(result.user?.role);
        navigate(redirectPath, { replace: true });
      } else {
        if (typeof result.error === 'object') {
          setErrors(result.error);
        } else {
          setErrors({ general: result.error });
        }
      }
    } catch (error) {
      const serverErrors = error?.response?.data?.errors;
      if (serverErrors) {
        setErrors({
          name: serverErrors.name?.[0],
          organizationName: serverErrors.organization_name?.[0],
          general: error?.response?.data?.message,
        });
      } else {
        setErrors({ general: 'An unexpected error occurred.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isVerifyingToken) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        <p className="text-xs text-slate-400">Verifying invitation link...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-hidden">
      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row-reverse items-stretch">
        <div className="w-full lg:w-1/2 flex items-center justify-center min-h-screen lg:min-h-0 px-6 sm:px-12 py-16">
          <div className="w-full max-w-md space-y-8">
            <div className="flex items-center justify-center gap-2">
              <span className="text-lg font-bold tracking-tight text-white">
                QR<span className="text-orange-500">Restaurant</span>
              </span>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Complete Registration
              </h1>
              <p className="text-sm text-slate-400">
                Set up your account and organization details to access your dashboard.
              </p>
            </div>

            {errors.general && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errors.general}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Admin Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-400 tracking-wide uppercase">
                  Name <span className="text-orange-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={form.name}
                    onChange={update('name')}
                    placeholder="Your full name"
                    className="w-full pl-10 pr-4 py-3.5 bg-slate-900/60 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                  />
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
                {errors.name && (
                  <div className="flex items-center gap-1.5 text-red-400 text-xs mt-1">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{errors.name}</span>
                  </div>
                )}
              </div>

              {/* Email (Read-Only) */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-400 tracking-wide uppercase flex items-center justify-between">
                  <span>Email Address</span>
                  <span className="text-[10px] text-orange-400 border border-orange-500/30 bg-orange-500/10 px-1.5 py-0.5 rounded">
                    Verified
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={form.email}
                    readOnly
                    tabIndex={-1}
                    className="w-full pl-10 pr-4 py-3.5 bg-slate-900/30 border border-slate-800/80 rounded-xl text-sm text-slate-400 cursor-not-allowed outline-none select-none"
                  />
                  <Mail className="w-4 h-4 text-slate-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Organization Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-400 tracking-wide uppercase">
                  Organization Name <span className="text-orange-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={form.organizationName}
                    onChange={update('organizationName')}
                    placeholder="e.g. Acme Hospitality Group"
                    className="w-full pl-10 pr-4 py-3.5 bg-slate-900/60 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                  />
                  <Building2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
                {(errors.organizationName || errors.organization_name) && (
                  <div className="flex items-center gap-1.5 text-red-400 text-xs mt-1">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{errors.organizationName || errors.organization_name}</span>
                  </div>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-400 tracking-wide uppercase">
                  Password <span className="text-orange-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={update('password')}
                    placeholder="Create a secure password"
                    className="w-full pl-10 pr-11 py-3.5 bg-slate-900/60 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                  />
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-orange-400 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {errors.password && (
                  <div className="flex items-center gap-1.5 text-red-400 text-xs mt-1">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{errors.password}</span>
                  </div>
                )}

                {/* Dynamic Password Validation Checks */}
                {form.password.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1.5">
                    {passwordChecks.map((check) => (
                      <span
                        key={check.label}
                        className={`flex items-center gap-1 text-[11px] transition-colors ${
                          check.valid ? 'text-orange-400 font-medium' : 'text-slate-600'
                        }`}
                      >
                        <Check className="w-3 h-3 flex-shrink-0" />
                        {check.label}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full group flex items-center justify-center gap-2 py-3.5 bg-orange-500 hover:bg-orange-400 disabled:bg-orange-500/50 disabled:cursor-not-allowed text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-orange-500/25 !mt-7 cursor-pointer"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </form>

            <p className="text-xs text-slate-500 text-center">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-orange-400 hover:text-orange-300 font-medium transition-colors"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>

        <div className="hidden lg:block w-full lg:w-1/2 relative">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=80"
              alt="Restaurant interior"
              className="w-full h-full object-cover"
              style={{ filter: 'saturate(0.85) brightness(0.75)' }}
            />
            <div className="absolute inset-0 bg-gradient-to-l from-slate-950 via-slate-950/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/30" />
            <div className="absolute inset-0 bg-orange-500/10 mix-blend-overlay" />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-transparent to-transparent" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;