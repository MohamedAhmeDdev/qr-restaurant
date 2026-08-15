import React, { useState } from 'react';
import { Eye, EyeOff, ArrowRight, Store, Check, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    ownerName: '',
    email: '',
    phone: '',
    password: '',
  });
  const [errors, setErrors] = useState({});

  const update = (key) => (e) => {
    setForm({ ...form, [key]: e.target.value });
    // Clear error for this field when user types
    if (errors[key]) {
      setErrors({ ...errors, [key]: '' });
    }
  };

  const passwordChecks = [
    { label: 'At least 8 characters', valid: form.password.length >= 8 },
    { label: 'One number', valid: /\d/.test(form.password) },
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.ownerName.trim()) {
      newErrors.ownerName = 'Owner name is required';
    }
    
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!form.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    if (!form.password) {
      newErrors.password = 'Password is required';
    } else if (form.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Handle registration logic here
      console.log('Registration form data:', form);
      // You would typically make an API call here
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-hidden">
      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row-reverse items-stretch">
        
        {/* Form Container */}
        <div className="w-full lg:w-1/2 flex items-center justify-center min-h-screen lg:min-h-0 px-6 sm:px-12 py-16">
          <div className="w-full max-w-md space-y-8">
            
            {/* Logo */}
            <div className="flex items-center justify-center gap-2">
              <span className="text-lg font-bold tracking-tight text-white">
                QR<span className="text-orange-500">Restaurant</span>
              </span>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Register your restaurant
              </h1>
              <p className="text-sm text-slate-400">
                Set up your dashboard in a couple of minutes.
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* Owner Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-400 tracking-wide uppercase">
                  Owner / manager name <span className="text-orange-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.ownerName}
                  onChange={update('ownerName')}
                  placeholder="Full name"
                  className="w-full px-4 py-3.5 bg-slate-900/60 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                />
                {errors.ownerName && (
                  <div className="flex items-center gap-1.5 text-red-400 text-xs mt-1">
                    <span>{errors.ownerName}</span>
                  </div>
                )}
              </div>

              {/* Email + Phone Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-slate-400 tracking-wide uppercase">
                    Email <span className="text-orange-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={update('email')}
                    placeholder="you@restaurant.com"
                    className="w-full px-4 py-3.5 bg-slate-900/60 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                  />
                  {errors.email && (
                    <div className="flex items-center gap-1.5 text-red-400 text-xs mt-1">

                      <span>{errors.email}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-slate-400 tracking-wide uppercase">
                    Phone <span className="text-orange-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={update('phone')}
                    placeholder="+254 7XX XXX"
                    className="w-full px-4 py-3.5 bg-slate-900/60 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                  />
                  {errors.phone && (
                    <div className="flex items-center gap-1.5 text-red-400 text-xs mt-1">

                      <span>{errors.phone}</span>
                    </div>
                  )}
                </div>
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
                    placeholder="Create a password"
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
                    <span>{errors.password}</span>
                  </div>
                )}

                {/* Password Checks */}
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

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full group flex items-center justify-center gap-2 py-3.5 bg-orange-500 hover:bg-orange-400 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-orange-500/25 !mt-7 cursor-pointer"
              >
                Create account
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </form>

            {/* Login Link */}
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

        {/* Side Image */}
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