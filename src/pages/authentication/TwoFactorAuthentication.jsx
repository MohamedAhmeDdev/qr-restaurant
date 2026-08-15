import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, ArrowLeft, ShieldCheck, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

function TwoFactorAuth() {
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [resent, setResent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [destination] = useState('your email');
  const inputsRef = useRef([]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // digits only
    const next = [...digits];
    next[index] = value.slice(-1);
    setDigits(next);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    e.preventDefault();
    const next = pasted.split('');
    while (next.length < 6) next.push('');
    setDigits(next);
    const lastIndex = Math.min(pasted.length, 6) - 1;
    inputsRef.current[lastIndex]?.focus();
  };

  const code = digits.join('');
  const canSubmit = code.length === 6;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    setIsLoading(true);
    setError('');
    
    try {
      // Your 2FA verification API call here
      console.log('Verifying code:', code);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      // Handle successful verification
      console.log('2FA verification successful');
    } catch (err) {
      setError(err.message || 'Invalid verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = () => {
    // Your resend code API call here
    console.log('Resending verification code');
    setResent(true);
    // Reset resent status after 5 seconds
    setTimeout(() => setResent(false), 5000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-hidden flex items-center justify-center px-6 py-16">
      <div className="relative z-10 w-full max-w-sm space-y-9">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2">
          <span className="text-lg font-bold tracking-tight text-white">
            QR<span className="text-orange-500">Restaurant</span>
          </span>
        </div>

        {/* Floating Form Container */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Verify it's you
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed">
              Enter the 6-digit code we sent to{' '}
              <span className="text-slate-200 font-medium">{destination}</span>.
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Code inputs */}
            <div className="flex justify-between gap-2" onPaste={handlePaste}>
              {digits.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => (inputsRef.current[i] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => {
                    handleChange(i, e.target.value);
                    if (error) setError('');
                  }}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className="w-11 h-13 sm:w-12 sm:h-14 text-center text-lg font-semibold bg-slate-900/60 border border-slate-800 rounded-xl text-white outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={!canSubmit || isLoading}
              className="w-full group flex items-center justify-center gap-2 py-3 bg-orange-500 hover:bg-orange-400 disabled:bg-slate-800 disabled:text-slate-500 disabled:shadow-none text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-orange-500/25 cursor-pointer disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Verify
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>

          <p className="text-xs text-slate-500 text-left">
            Didn't get a code?{' '}
            <button
              type="button"
              onClick={handleResendCode}
              className="text-orange-400 hover:text-orange-300 font-medium transition-colors"
            >
              Resend
            </button>
            {resent && <span className="text-slate-600"> · Sent</span>}
          </p>
        </div>

        {/* Back Link */}
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

export default TwoFactorAuth;