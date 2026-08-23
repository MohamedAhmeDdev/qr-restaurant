import React, { useState, useEffect } from 'react';
import { Mail, Send, X, Sparkles, Link as LinkIcon, RefreshCw } from 'lucide-react';

export function RestaurantInviteModal({ 
  isOpen, 
  onClose, 
  onSendInvite, 
  isSending,
  isResend = false,
  resendEmail = '',
  modalConfig = {}
}) {
  const [email, setEmail] = useState('');

  // Pre-fill email when resending
  useEffect(() => {
    if (isResend && resendEmail) {
      setEmail(resendEmail);
    }
  }, [isResend, resendEmail]);

  // Reset email when modal closes
  useEffect(() => {
    if (!isOpen) {
      setEmail('');
    }
  }, [isOpen]);


  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !isSending) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isSending]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    onSendInvite(email);
  };

  const handleClose = () => {
    setEmail('');
    onClose();
  };

  // Determine title and description
  const title = modalConfig.title || (isResend ? 'Resend Invitation' : 'Invite Restaurant');
  const description = modalConfig.description || (isResend 
    ? `Resend onboarding registration link to ${resendEmail}` 
    : 'Send an onboarding registration link to a new manager.');
  const buttonText = modalConfig.buttonText || (isResend ? 'Resend Invitation' : 'Send Invitation');

  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      {/* MODAL CONTAINER */}
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 w-full max-w-lg rounded-2xl shadow-xl overflow-hidden text-gray-900 dark:text-slate-100 flex flex-col">
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2">
              {isResend && <RefreshCw className="w-5 h-5 text-blue-500" />}
              {title}
            </h2>
            <p className="text-xs text-gray-500 dark:text-slate-400">
              {description}
            </p>
          </div>
          <button
            onClick={handleClose}
            disabled={isSending}
            className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="owner@restaurant.com"
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors"
                  disabled={isSending}
                />
              </div>
              {isResend && (
                <p className="mt-1 text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1">
                  Resending invitation to this email
                </p>
              )}
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-gray-100 dark:border-slate-800">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSending}
                className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSending || !email.trim()}
                className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                  isResend 
                    ? 'bg-blue-500 hover:bg-blue-600' 
                    : 'bg-orange-500 hover:bg-orange-600'
                }`}
              >
                {isSending ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    {isResend ? <RefreshCw className="w-4 h-4" /> : <Send className="w-4 h-4" />}
                    {buttonText}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RestaurantInviteModal;