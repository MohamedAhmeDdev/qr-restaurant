import React, { useState } from 'react';
import { Mail, Send, X, Sparkles, Link as LinkIcon, User } from 'lucide-react';

export function RestaurantInviteModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    ownerName: '',
    email: ''
  });

  const [generatedInvite, setGeneratedInvite] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isSending, setIsSending] = useState(false);

  if (!isOpen) return null;

  const handleGenerateInvite = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.ownerName) return;

    setIsSending(true);

    // Simulate invite link generation
    setTimeout(() => {
      const inviteCode = Math.random().toString(36).substring(2, 10);
      const inviteUrl = `https://app.yourplatform.com/register/restaurant?code=${inviteCode}`;

      setGeneratedInvite({
        url: inviteUrl,
        sentTo: formData.email,
        ownerName: formData.ownerName
      });
      setIsSending(false);
    }, 600);
  };

  const handleCopyLink = () => {
    if (!generatedInvite) return;
    navigator.clipboard.writeText(generatedInvite.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setGeneratedInvite(null);
    setFormData({
      ownerName: '',
      email: ''
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      {/* MODAL CONTAINER */}
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 w-full max-w-lg rounded-2xl shadow-xl overflow-hidden text-gray-900 dark:text-slate-100 flex flex-col">
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-bold">Invite Restaurant</h2>
            <p className="text-xs text-gray-500 dark:text-slate-400">
              Send an onboarding registration link to a new manager.
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="p-5 space-y-5">
          {/* FORM */}
          <form onSubmit={handleGenerateInvite} className="space-y-4">
            {/* Owner Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">
                Manager / Owner Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Marco Rossi"
                  value={formData.ownerName}
                  onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  required
                  placeholder="owner@restaurant.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-gray-100 dark:border-slate-800">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSending}
                className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors shadow-sm disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                {isSending ? 'Sending...' : 'Send Invitation'}
              </button>
            </div>
          </form>

          {/* GENERATED INVITATION RESULT CARD */}
          {generatedInvite && (
            <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-4 rounded-xl space-y-3">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-semibold text-xs">
                <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Invite Sent to {generatedInvite.ownerName} ({generatedInvite.sentTo})!</span>
              </div>

              {/* Link & Copy Action */}
              <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-lg border border-emerald-200 dark:border-slate-800">
                <LinkIcon className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <input
                  type="text"
                  readOnly
                  value={generatedInvite.url}
                  className="w-full text-xs bg-transparent outline-none text-gray-700 dark:text-slate-300 select-all"
                />
                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-medium transition-colors shrink-0"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RestaurantInviteModal;