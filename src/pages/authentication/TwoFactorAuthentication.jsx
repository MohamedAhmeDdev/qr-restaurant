import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

function TwoFactorAuthentication({ email, onVerified, onBack }) {
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const [resent, setResent] = useState(false);
  const inputsRef = useRef([]);

  useEffect(() => {
    setTimeout(() => inputsRef.current[0]?.focus(), 100);
  }, []);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
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

    setIsVerifying(true);
    setError('');

    try {
      const response = await api.post('/verify-2fa', { email, code });
      onVerified(response.data);
    } catch (err) {
      const message = err?.response?.data?.message;
      setError(message);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    try {
      await api.post('/forgot-password', { email });
      setResent(true);
        toast.success(result.message);
      setTimeout(() => setResent(false), 5000);
    } catch (err) {
      toast.error(err?.response?.data?.message);
    }
  };

  return (
    <>
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
          Verify it's you
        </h1>
        <p className="text-sm text-slate-400 leading-relaxed">
          Enter the 6-digit code sent to{' '}
          <span className="text-slate-200 font-medium">{email}</span>.
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
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
          disabled={!canSubmit || isVerifying}
          className="w-full group flex items-center justify-center gap-2 py-3 bg-orange-500 hover:bg-orange-400 disabled:bg-slate-800 disabled:text-slate-500 disabled:shadow-none text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-orange-500/25 cursor-pointer disabled:cursor-not-allowed"
        >
          {isVerifying ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              Verify
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </button>
      </form>

      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500">
          Didn't get a code?{' '}
          <button
            type="button"
            onClick={handleResendCode}
            className="text-orange-400 hover:text-orange-300 font-medium transition-colors cursor-pointer"
          >
            Resend
          </button>
          {resent && <span className="text-slate-600"> · Sent</span>}
        </p>
      </div>

      <div className="pt-2">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-xs text-slate-500 hover:text-orange-400 font-medium transition-colors group cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
          Back to log in
        </button>
      </div>
    </>
  );
}

export default TwoFactorAuthentication;