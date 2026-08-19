import React, { useState } from 'react';
import { Eye, EyeOff, ArrowRight, Check, AlertCircle, Loader2, Store, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    restaurantName: '',
    restaurantSlug: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { register } = useAuth();

  const update = (key) => (e) => {
    const value = e.target.value;

    if (key === 'restaurantName') {
      // Auto-generate slug from restaurant name
      const generatedSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');

      setForm((prev) => ({
        ...prev,
        restaurantName: value,
        restaurantSlug: generatedSlug,
      }));
    } else {
      setForm((prev) => ({ ...prev, [key]: value }));
    }

    // Clear errors when user types
    if (errors[key] || errors.general) {
      setErrors((prev) => ({ ...prev, [key]: '', general: '' }));
    }
  };

  const passwordChecks = [
    { label: 'At least 8 characters', valid: form.password.length >= 8 },
    { label: 'One number', valid: /\d/.test(form.password) },
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = 'Admin name is required';
    }

    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!form.restaurantName.trim()) {
      newErrors.restaurantName = 'Restaurant name is required';
    }

    if (!form.restaurantSlug.trim()) {
      newErrors.restaurantSlug = 'Restaurant slug is required';
    }

    if (!form.password) {
      newErrors.password = 'Password is required';
    } else if (form.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
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
        name: form.name,
        email: form.email,
        password: form.password,
        restaurant_name: form.restaurantName,
        restaurant_slug: form.restaurantSlug,
      };

      const result = await register(userData);

      if (result.success) {
        toast.success(result.message);
        // Redirect to dashboard or switcher
        navigate(`/r/${form.restaurantSlug}/dashboard`);
      } else {
        setErrors({ general: result.error });
        toast.error(result.error);
      }
    } catch (error) {
      console.error(error);
      setErrors({ general: 'An unexpected error occurred.' });
    } finally {
      setIsLoading(false);
    }
  };

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
                Create Admin Account
              </h1>
              <p className="text-sm text-slate-400">
                Register your restaurant and create your admin profile.
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
                  Admin Name <span className="text-orange-500">*</span>
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

              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-400 tracking-wide uppercase">
                  Email Address <span className="text-orange-500">*</span>
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={update('email')}
                  placeholder="admin@restaurant.com"
                  className="w-full px-4 py-3.5 bg-slate-900/60 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                />
                {errors.email && (
                  <div className="flex items-center gap-1.5 text-red-400 text-xs mt-1">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{errors.email}</span>
                  </div>
                )}
              </div>

              {/* Restaurant Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-400 tracking-wide uppercase">
                  Restaurant Name <span className="text-orange-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={form.restaurantName}
                    onChange={update('restaurantName')}
                    placeholder="e.g. Urban Bistro"
                    className="w-full pl-10 pr-4 py-3.5 bg-slate-900/60 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                  />
                  <Store className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
                {errors.restaurantName && (
                  <div className="flex items-center gap-1.5 text-red-400 text-xs mt-1">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{errors.restaurantName}</span>
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
                    className="w-full pl-4 pr-11 py-3.5 bg-slate-900/60 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                  />
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

                {form.password.length > 0 && !errors.password && (
                  <div className="flex gap-4 pt-1">
                    {passwordChecks.map((check) => (
                      <span
                        key={check.label}
                        className={`flex items-center gap-1 text-xs transition-colors ${
                          check.valid ? 'text-orange-400' : 'text-slate-600'
                        }`}
                      >
                        <Check className="w-3 h-3" />
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