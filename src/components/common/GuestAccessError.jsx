import React from 'react';
import { 
  Building2, 
  Store, 
  QrCode, 
  Compass, 
  RotateCcw, 
  HelpCircle 
} from 'lucide-react';

const ERROR_CONFIGS = {
  // 1. Inactive or unserviceable restaurant
  'Restaurant is currently unavailable for guest ordering.': {
    title: 'Restaurant Currently Closed',
    description: 'This restaurant is not currently accepting guest online orders. Please speak to a staff member for assistance.',
    icon: Store,
    actionType: 'retry',
  },

  // 2. Table missing from DB
  'Table not found or no longer active.': {
    title: 'Table Not Found',
    description: 'We couldn’t find a valid record for this table. It may have been updated or removed from our system.',
    icon: Compass,
    actionType: 'rescan',
  },

  // 3. Table flag set to inactive
  'Table is currently unavailable.': {
    title: 'Table Out of Service',
    description: 'This table is temporarily marked as inactive for online ordering.',
    icon: Building2,
    actionType: 'rescan',
  },

  // 4. Token missing or invalid hash match
  'Invalid or missing table scan token.': {
    title: 'Invalid QR Code',
    description: 'Your session link has expired or is invalid. Please re-scan the QR code located directly on your table.',
    icon: QrCode,
    actionType: 'rescan',
  },

  // Fallback for 404 Restaurant not found or unexpected errors
  default: {
    title: 'Access Restricted',
    description: 'We encountered an error validating your table access.',
    icon: HelpCircle,
    actionType: 'retry',
  },
};

export default function GuestAccessError({ message, onRetry }) {
  const config = ERROR_CONFIGS[message] || ERROR_CONFIGS.default;
  const Icon = config.icon;

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-paper text-ink">
      <div className="max-w-md w-full bg-paper border border-hairline rounded-2xl p-8 text-center shadow-sm space-y-5 animate-fade-in">
        
        {/* Dynamic Icon */}
        <div className="w-16 h-16 rounded-full bg-rust/10 text-rust flex items-center justify-center mx-auto">
          <Icon className="w-8 h-8" />
        </div>

        {/* Dynamic Header & Text */}
        <div className="space-y-2">
          <h2 className="font-serif font-semibold text-2xl text-ink leading-tight">
            {config.title}
          </h2>
          <p className="text-sm text-ink-soft leading-relaxed">
            {config.description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col items-center gap-3">
          {config.actionType === 'retry' && onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rust text-paper text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <RotateCcw className="w-4 h-4" /> Try Again
            </button>
          )}

          {config.actionType === 'rescan' && (
            <div className="p-3 bg-hairline/40 rounded-xl border border-hairline text-xs text-ink-soft text-center w-full">
              <p className="font-medium text-ink mb-1">How to fix this?</p>
              Please scan the official QR code located directly on your table card.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}