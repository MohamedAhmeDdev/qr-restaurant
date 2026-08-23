import React, { useState, useEffect } from 'react';
import { ShieldCheck, Check, Save, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../../contexts/AuthContext';
import api from '../../../services/api';

export default function SecurityTab() {
  const { user, updateUser } = useAuth();

  // ─── Password Form State ───
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);

  // ─── 2FA State ───
  const [twoFactor, setTwoFactor] = useState(false);
  const [pendingTwoFactor, setPendingTwoFactor] = useState(false);
  const [loading2FA, setLoading2FA] = useState(false);
  const [twoFASaved, setTwoFASaved] = useState(false);

  // Fetch current 2FA status on mount
  useEffect(() => {
    api.get('/user/2fa-status')
      .then(({ data }) => {
        const isEnabled = Boolean(data.two_factor_enabled);
        setTwoFactor(isEnabled);
        setPendingTwoFactor(isEnabled);
      })
      .catch(() => {
        const enabled = Boolean(user?.two_factor_enabled);
        setTwoFactor(enabled);
        setPendingTwoFactor(enabled);
      });
  }, [user]);

  // ─── Password Requirements ───
  const requirements = [
    { label: 'At least 8 characters', valid: passwords.newPassword.length >= 8 },
    { label: 'One number', valid: /\d/.test(passwords.newPassword) },
    { label: 'One uppercase letter', valid: /[A-Z]/.test(passwords.newPassword) },
  ];
  const allRequirementsMet = requirements.every((r) => r.valid);

  // ─── Password Submit ───
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordErrors({});
    setPasswordSaved(false);

    const errors = {};
    if (!passwords.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    if (!passwords.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (!allRequirementsMet) {
      errors.newPassword = 'Password does not meet all requirements';
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }

    setSavingPassword(true);
    try {
      await api.post('/user/change-password', {
        current_password: passwords.currentPassword,
        new_password: passwords.newPassword,
        new_password_confirmation: passwords.confirmPassword,
      });

      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordSaved(true);
      toast.success('Password updated successfully.');
      setTimeout(() => setPasswordSaved(false), 2500);
    } catch (err) {
      const serverErrors = err?.response?.data?.errors;
      if (serverErrors) {
        setPasswordErrors({
          currentPassword: serverErrors.current_password?.[0],
          newPassword: serverErrors.new_password?.[0],
          confirmPassword: serverErrors.new_password_confirmation?.[0],
        });
      } else {
        toast.error(err?.response?.data?.message || 'Failed to update password.');
      }
    } finally {
      setSavingPassword(false);
    }
  };

  // ─── 2FA Submit ───
  const handle2FASubmit = async (e) => {
    e.preventDefault();
    if (pendingTwoFactor === twoFactor) return;

    setLoading2FA(true);
    setTwoFASaved(false);

    try {
      const { data } = await api.post('/user/toggle-2fa', {
        enabled: pendingTwoFactor,
      });
      
      const newStatus = Boolean(data.two_factor_enabled ?? pendingTwoFactor);
      setTwoFactor(newStatus);
      setPendingTwoFactor(newStatus);
      updateUser({ two_factor_enabled: newStatus });
      setTwoFASaved(true);
      toast.success(data.message || `2FA ${newStatus ? 'enabled' : 'disabled'} successfully.`);
      setTimeout(() => setTwoFASaved(false), 2500);
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to update 2FA status.';
      toast.error(msg);
      setPendingTwoFactor(twoFactor);
    } finally {
      setLoading2FA(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* PASSWORD SECTION */}
      <form
        onSubmit={handlePasswordSubmit}
        className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden transition-colors duration-200"
      >
        <div className="px-6 sm:px-7 pt-6 pb-5 border-b border-gray-100 dark:border-slate-800 transition-colors duration-200">
          <span className="inline-block text-[11px] font-semibold tracking-wider uppercase text-orange-500 mb-1">
            Account
          </span>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-200">
            Change Password
          </h2>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1 leading-relaxed transition-colors duration-200">
            Update your account password to keep your account secure.
          </p>
        </div>

        <div className="px-6 sm:px-7 py-6 space-y-5">
          {/* Current Password */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 transition-colors duration-200">
              Current Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={passwords.currentPassword}
              onChange={(e) => {
                setPasswords((p) => ({ ...p, currentPassword: e.target.value }));
                if (passwordErrors.currentPassword) setPasswordErrors((prev) => ({ ...prev, currentPassword: '' }));
              }}
              className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-slate-100 border border-gray-200 dark:border-slate-700 rounded-xl text-sm outline-none placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
            />
            {passwordErrors.currentPassword && (
              <p className="text-red-500 text-xs mt-1 transition-colors duration-200">{passwordErrors.currentPassword}</p>
            )}
          </div>

          {/* New + Confirm */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 transition-colors duration-200">
                New Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={passwords.newPassword}
                onChange={(e) => {
                  setPasswords((p) => ({ ...p, newPassword: e.target.value }));
                  if (passwordErrors.newPassword) setPasswordErrors((prev) => ({ ...prev, newPassword: '' }));
                }}
                className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-slate-100 border border-gray-200 dark:border-slate-700 rounded-xl text-sm outline-none placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
              />
              {passwordErrors.newPassword && (
                <p className="text-red-500 text-xs mt-1 transition-colors duration-200">{passwordErrors.newPassword}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 transition-colors duration-200">
                Confirm New Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={passwords.confirmPassword}
                onChange={(e) => {
                  setPasswords((p) => ({ ...p, confirmPassword: e.target.value }));
                  if (passwordErrors.confirmPassword) setPasswordErrors((prev) => ({ ...prev, confirmPassword: '' }));
                }}
                className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-slate-100 border border-gray-200 dark:border-slate-700 rounded-xl text-sm outline-none placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
              />
              {passwordErrors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1 transition-colors duration-200">{passwordErrors.confirmPassword}</p>
              )}
            </div>
          </div>

          {/* Password Requirements Checklist */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider transition-colors duration-200">
              Password Requirements
            </p>
            <div className="space-y-1.5">
              {requirements.map((req) => (
                <div key={req.label} className="flex items-center gap-2 text-sm">
                  <div
                    className={`flex items-center justify-center w-4 h-4 rounded-full border transition-colors duration-200 ${
                      req.valid
                        ? 'bg-emerald-500 border-emerald-500'
                        : 'border-gray-300 dark:border-slate-600'
                    }`}
                  >
                    {req.valid && <Check className="w-2.5 h-2.5 text-white" />}
                  </div>
                  <span
                    className={`transition-colors duration-200 ${
                      req.valid
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-gray-500 dark:text-slate-400'
                    }`}
                  >
                    {req.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Password Save Button */}
          <div className="pt-2 flex items-center justify-end gap-3">
            {passwordSaved && (
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mr-auto animate-in fade-in duration-200">
                Password updated
              </span>
            )}
            <button
              type="submit"
              disabled={savingPassword}
              className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-sm rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.97]"
            >
              {savingPassword ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : passwordSaved ? (
                <Check className="w-4 h-4" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {savingPassword ? 'Saving...' : passwordSaved ? 'Saved' : 'Update Password'}
            </button>
          </div>
        </div>
      </form>

      {/* 2FA SECTION */}
      <form
        onSubmit={handle2FASubmit}
        className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden transition-colors duration-200"
      >
        <div className="px-6 sm:px-7 pt-6 pb-5 border-b border-gray-100 dark:border-slate-800 transition-colors duration-200">
          <span className="inline-block text-[11px] font-semibold tracking-wider uppercase text-orange-500 mb-1">
            Security
          </span>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-200">
            Two-Factor Authentication
          </h2>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1 leading-relaxed transition-colors duration-200">
            Secure your account using email verification codes.
          </p>
        </div>

        <div className="px-6 sm:px-7 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3 min-w-0 w-full sm:w-auto">
              <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-orange-50 dark:bg-orange-950 border border-orange-100 dark:border-orange-900 shrink-0 transition-colors duration-200">
                <ShieldCheck className="w-4 h-4 text-orange-500" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-900 dark:text-white transition-colors duration-200">
                  Email-based 2FA
                </p>
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5 leading-relaxed transition-colors duration-200">
                  A verification code will be sent to your email on every login.
                </p>
              </div>
            </div>

            {/* Toggle Switch + Label */}
            <div className="flex items-center gap-3">
              <span
                className={`text-xs font-medium px-2 py-1 rounded-md transition-colors duration-200 ${
                  pendingTwoFactor
                    ? 'bg-orange-50 text-orange-600 dark:bg-orange-950 dark:text-orange-400'
                    : 'bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-slate-400'
                }`}
              >
                {pendingTwoFactor ? 'Enabled' : 'Disabled'}
              </span>

              <button
                type="button"
                onClick={() => setPendingTwoFactor((prev) => !prev)}
                aria-pressed={pendingTwoFactor}
                className={`w-12 h-6 flex items-center rounded-full p-1 shrink-0 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer ${
                  pendingTwoFactor
                    ? 'bg-orange-500 justify-end'
                    : 'bg-gray-300 dark:bg-slate-700 justify-start'
                }`}
              >
                <div className="w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-200" />
              </button>
            </div>
          </div>

          {/* 2FA Save Button */}
          <div className="pt-6 flex items-center justify-end gap-3 border-t border-gray-100 dark:border-slate-800 mt-6 transition-colors duration-200">
            {twoFASaved && (
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mr-auto animate-in fade-in duration-200">
                2FA settings saved
              </span>
            )}
            <button
              type="submit"
              disabled={loading2FA || pendingTwoFactor === twoFactor}
              className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-sm rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.97]"
            >
              {loading2FA ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : twoFASaved ? (
                <Check className="w-4 h-4" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {loading2FA ? 'Saving...' : twoFASaved ? 'Saved' : 'Save 2FA Settings'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}