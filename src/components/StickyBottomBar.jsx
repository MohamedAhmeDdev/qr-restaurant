import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingCart, 
  ShoppingBag, 
  Smartphone, 
  ArrowRight, 
  Check, 
  CheckCircle2
} from 'lucide-react';

export default function StickyBottomBar({
  type = 'menu', // 'menu' | 'item' | 'cart' | 'checkout'
  visible = true,
  
  // Counts & Amounts
  count = 0,
  amount = 0,
  
  // Action state flags
  isLoading = false,
  isSuccess = false,
  isDisabled = false,
  
  // Handlers & Labels
  onAction,
  actionLabel,
  disabledLabel = 'Select Option',
  successMessage = 'Success!',
  loadingMessage = 'Processing...',
  
  // Custom Icon override
  icon: CustomIcon
}) {
  if (!visible) return null;

  // Render left icon based on type or custom override
  const renderIcon = () => {
    if (CustomIcon) return <CustomIcon className="w-5 h-5 text-[var(--brass-soft)]" />;
    switch (type) {
      case 'checkout':
        return <Smartphone className={`w-5 h-5 ${!isDisabled ? 'text-[var(--brass-soft)]' : 'text-current opacity-50'}`} />;
      case 'cart':
        return <ShoppingBag className="w-5 h-5 text-[var(--brass-soft)]" />;
      case 'menu':
      case 'item':
      default:
        return <ShoppingCart className={`w-5 h-5 ${!isDisabled ? 'text-[var(--brass-soft)]' : 'text-current opacity-50'}`} />;
    }
  };

  return (
    <div 
      className={`fixed bottom-3 left-0 right-0 px-4 z-50 flex justify-center transition-all duration-300 ease-out pointer-events-none ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
      }`}
    >
      <div className="w-full max-w-md pointer-events-auto flex items-center gap-3">
        
        {/* TICKET STUB MAIN CONTAINER */}
        <div 
          className={`ticket-edge-top flex-1 py-3 px-5 rounded-2xl font-serif font-semibold text-base sm:text-lg flex items-center justify-between gap-2 transition-all duration-300 shadow-2xl border border-white/10 ${
            isSuccess || !isDisabled
              ? 'bg-[var(--forest)] text-[var(--paper)]'
              : 'bg-[var(--hairline)] text-[var(--ink-soft)]/60 border-transparent shadow-none'
          }`}
        >
          {isSuccess ? (
            /* SUCCESS DISPLAY */
            <div className="w-full py-1 flex items-center justify-center gap-2">
              {type === 'checkout' ? (
                <CheckCircle2 className="w-5 h-5 text-[var(--paper)] stroke-[3]" />
              ) : (
                <Check className="w-5 h-5 text-[var(--paper)] stroke-[3]" />
              )}
              <span className="text-sm sm:text-base">{successMessage}</span>
            </div>
          ) : isLoading ? (
            /* LOADING DISPLAY */
            <div className="w-full py-1 flex items-center justify-center gap-2.5">
              <div className="w-5 h-5 border-2 rounded-full animate-spin border-[var(--paper)]/30 border-t-[var(--paper)]" />
              <span className="text-sm sm:text-base">{loadingMessage}</span>
            </div>
          ) : (
            <>
              {/* LEFT SIDE: Icon, Badge & Price */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="relative flex items-center justify-center">
                  {renderIcon()}
                  {count > 0 && (
                    <span className="absolute -top-2 -right-2.5 min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center text-[10px] font-bold leading-none bg-[var(--rust)] text-[var(--paper)] border border-[var(--forest)]">
                      {count}
                    </span>
                  )}
                </div>

                <span className={`font-serif font-bold text-base sm:text-lg tabular-nums ${!isDisabled ? 'text-[var(--paper)]' : 'text-current opacity-70'}`}>
                  ${amount.toFixed(2)}
                </span>
              </div>

              {/* RIGHT SIDE: Link (Menu/Cart) OR Action Button (Item/Checkout) */}
              {type === 'menu' && (
                <Link
                  to="/cart"
                  className="group font-serif font-semibold text-sm sm:text-base text-[var(--brass-soft)] hover:text-white transition-all flex items-center gap-1.5 py-1 px-2.5 -mr-2 rounded-xl hover:bg-white/10"
                >
                  <span className="underline underline-offset-4 decoration-[var(--brass-soft)]/50 group-hover:decoration-white">
                    View Order
                  </span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              )}

              {type === 'cart' && (
                <Link
                  to="/checkout"
                  className="group font-serif font-semibold text-sm sm:text-base text-[var(--brass-soft)] hover:text-white transition-all flex items-center gap-1.5 py-1 px-2.5 -mr-2 rounded-xl hover:bg-white/10"
                >
                  <span className="underline underline-offset-4 decoration-[var(--brass-soft)]/50 group-hover:decoration-white">
                    Checkout
                  </span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              )}

              {(type === 'item' || type === 'checkout') && (
                <button
                  type="button"
                  onClick={onAction}
                  disabled={isDisabled || isLoading || isSuccess}
                  className={`py-2 px-3.5 sm:px-4 rounded-xl font-serif font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 whitespace-nowrap transition-all duration-200 shrink-0 ${
                    !isDisabled
                      ? 'bg-[var(--brass)] text-white shadow-md hover:brightness-105 active:scale-95 cursor-pointer'
                      : 'bg-black/10 text-current opacity-60 cursor-not-allowed shadow-none'
                  }`}
                >
                  {!isDisabled ? actionLabel : disabledLabel}
                </button>
              )}
            </>
          )}
        </div>

      </div>
    </div>
  );
}