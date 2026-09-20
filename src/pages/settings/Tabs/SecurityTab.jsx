import React, { useState, useEffect } from 'react';
import { Loader2, Lock, Key, ShieldCheck, Mail, CheckCircle2, AlertCircle } from 'lucide-react';
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

  // ─── 2FA State ───
  const [twoFactor, setTwoFactor] = useState(false);
  const [pendingTwoFactor, setPendingTwoFactor] = useState(false);
  const [loading2FA, setLoading2FA] = useState(false);

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

  // ─── Password Validation Rules ───
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

    const errors = {};
    if (!passwords.currentPassword) {
      errors.currentPassword = 'Old password is required.';
    }
    if (!passwords.newPassword) {
      errors.newPassword = 'New password is required.';
    } else if (!allRequirementsMet) {
      errors.newPassword = 'Password does not meet all requirement criteria.';
    }
    if (!passwords.confirmPassword) {
      errors.confirmPassword = 'Please confirm your new password.';
    } else if (passwords.newPassword !== passwords.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
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
      toast.success('Password updated successfully.');
    } catch (err) {
      const serverErrors = err?.response?.data?.errors;
      if (serverErrors) {
        setPasswordErrors({
          currentPassword: serverErrors.current_password?.[0],
          newPassword: serverErrors.new_password?.[0],
          confirmPassword: serverErrors.new_password_confirmation?.[0],
        });
      } else {
        toast.error(err?.response?.data?.message);
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
    try {
      const { data } = await api.post('/user/toggle-2fa', { enabled: pendingTwoFactor });
      const newStatus = Boolean(data.two_factor_enabled ?? pendingTwoFactor);
      setTwoFactor(newStatus);
      setPendingTwoFactor(newStatus);
      updateUser({ two_factor_enabled: newStatus });
      toast.success(data.message);
    } catch (err) {
      toast.error(err?.response?.data?.message);
      setPendingTwoFactor(twoFactor);
    } finally {
      setLoading2FA(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      {/* Password Section */}
      <form onSubmit={handlePasswordSubmit} className="space-y-6" noValidate>
        {/* Header Section */}
        <div className="flex items-start justify-between border-b border-gray-200 dark:border-slate-800 pb-5">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2.5">
              <div className="p-2 bg-orange-500/10 dark:bg-orange-500/20 rounded-lg text-orange-500">
                <Lock className="w-5 h-5" />
              </div>
              Change Password
            </h2>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
              Update your password to keep your account secure.
            </p>
          </div>
        </div>

        {/* Password Form Card */}
        <div className="p-6 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-xs space-y-6">
          <div className="grid grid-cols-1 gap-5">
            {/* Old Password */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-slate-400 mb-2">
                Old Password
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-gray-400 dark:text-slate-500 pointer-events-none">
                  <Key className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={passwords.currentPassword}
                  onChange={(e) => {
                    setPasswords((p) => ({ ...p, currentPassword: e.target.value }));
                    if (passwordErrors.currentPassword) {
                      setPasswordErrors((prev) => ({ ...prev, currentPassword: '' }));
                    }
                  }}
                  placeholder="Enter your current password"
                  className={`w-full pl-10 pr-3.5 py-2 bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 border rounded-lg text-sm transition-all focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 ${
                    passwordErrors.currentPassword
                      ? 'border-red-500 dark:border-red-500'
                      : 'border-gray-300 dark:border-slate-800'
                  }`}
                />
              </div>
              {passwordErrors.currentPassword && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {passwordErrors.currentPassword}
                </p>
              )}
            </div>

            {/* New Password */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-slate-400 mb-2">
                New Password
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-gray-400 dark:text-slate-500 pointer-events-none">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={passwords.newPassword}
                  onChange={(e) => {
                    setPasswords((p) => ({ ...p, newPassword: e.target.value }));
                    if (passwordErrors.newPassword) {
                      setPasswordErrors((prev) => ({ ...prev, newPassword: '' }));
                    }
                  }}
                  placeholder="Enter your new password"
                  className={`w-full pl-10 pr-3.5 py-2 bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 border rounded-lg text-sm transition-all focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 ${
                    passwordErrors.newPassword
                      ? 'border-red-500 dark:border-red-500'
                      : 'border-gray-300 dark:border-slate-800'
                  }`}
                />
              </div>
              {passwordErrors.newPassword && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {passwordErrors.newPassword}
                </p>
              )}

              {/* Password Requirement Hints */}
              <div className="mt-3 space-y-1.5">
                <p className="text-xs font-medium text-gray-600 dark:text-slate-400">
                  Password requirements:
                </p>
                <ul className="text-xs space-y-1">
                  {requirements.map((req) => (
                    <li
                      key={req.label}
                      className={`flex items-center gap-2 transition-colors ${
                        req.valid
                          ? 'text-emerald-600 dark:text-emerald-400 font-medium'
                          : 'text-gray-500 dark:text-slate-400'
                      }`}
                    >
                      <span className="text-sm">
                        {req.valid ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          <span className="text-gray-400 dark:text-slate-600">•</span>
                        )}
                      </span>
                      <span>{req.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-slate-400 mb-2">
                Confirm New Password
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-gray-400 dark:text-slate-500 pointer-events-none">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={passwords.confirmPassword}
                  onChange={(e) => {
                    setPasswords((p) => ({ ...p, confirmPassword: e.target.value }));
                    if (passwordErrors.confirmPassword) {
                      setPasswordErrors((prev) => ({ ...prev, confirmPassword: '' }));
                    }
                  }}
                  placeholder="Confirm your new password"
                  className={`w-full pl-10 pr-3.5 py-2 bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 border rounded-lg text-sm transition-all focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 ${
                    passwordErrors.confirmPassword
                      ? 'border-red-500 dark:border-red-500'
                      : 'border-gray-300 dark:border-slate-800'
                  }`}
                />
              </div>
              {passwordErrors.confirmPassword && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {passwordErrors.confirmPassword}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-end pt-2">
          <button
            type="submit"
            disabled={savingPassword}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white shadow-xs transition-all ${
              !savingPassword
                ? 'bg-orange-500 hover:bg-orange-600 active:bg-orange-700 cursor-pointer'
                : 'bg-gray-300 dark:bg-slate-800 text-gray-500 dark:text-slate-500 cursor-not-allowed'
            }`}
          >
            {savingPassword ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Updating Password...
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                Update Password
              </>
            )}
          </button>
        </div>
      </form>

      {/* Two-Factor Authentication Section */}
      <form onSubmit={handle2FASubmit} className="space-y-6 pt-4">
        {/* Header Section */}
        <div className="flex items-start justify-between border-b border-gray-200 dark:border-slate-800 pb-5">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2.5">
              <div className="p-2 bg-orange-500/10 dark:bg-orange-500/20 rounded-lg text-orange-500">
                <ShieldCheck className="w-5 h-5" />
              </div>
              Two-Factor Authentication
            </h3>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
              Add an extra layer of security to your account.
            </p>
          </div>
        </div>

        {/* 2FA Card */}
        <div className="p-6 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-slate-200 flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-500 dark:text-slate-400" />
                Email Verification
              </p>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                Receive single-use codes via email upon logging in.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setPendingTwoFactor((p) => !p)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                pendingTwoFactor
                  ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-950/60'
                  : 'border-gray-300 dark:border-slate-700 text-gray-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700'
              }`}
            >
              {pendingTwoFactor ? (
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Enabled
                </span>
              ) : (
                'Disabled'
              )}
            </button>
          </div>
        </div>

        {/* Action Button */}
        {pendingTwoFactor !== twoFactor && (
          <div className="flex items-center justify-end pt-2">
            <button
              type="submit"
              disabled={loading2FA}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white shadow-xs transition-all ${
                !loading2FA
                  ? 'bg-orange-500 hover:bg-orange-600 active:bg-orange-700 cursor-pointer'
                  : 'bg-gray-300 dark:bg-slate-800 text-gray-500 dark:text-slate-500 cursor-not-allowed'
              }`}
            >
              {loading2FA ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  Save 2FA Preference
                </>
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}