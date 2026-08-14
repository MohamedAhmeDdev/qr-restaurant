import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function OrderSummaryCard({
  title = "Order Details",
  items = [],
  subtotal = 0,
  total = 0,
  isCollapsible = false,
  defaultExpanded = true, // Default set to true (OPEN)
  totalLabel = "Total"
}) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const totalItemCount = items.reduce((acc, item) => acc + (item.quantity || 1), 0);

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-[var(--hairline)]/60 animate-fade-up">
      {/* HEADER / TOGGLE BUTTON */}
      {isCollapsible ? (
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between text-left font-serif font-bold text-lg text-[var(--ink)]"
        >
          <span>
            {title} {items.length > 0 && `(${totalItemCount} Items)`}
          </span>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-[var(--ink-soft)]" />
          ) : (
            <ChevronDown className="w-5 h-5 text-[var(--ink-soft)]" />
          )}
        </button>
      ) : (
        <h3 className="font-serif font-bold text-lg text-[var(--ink)] mb-3">
          {title}
        </h3>
      )}

      {/* ITEM LIST */}
      {items.length > 0 && (!isCollapsible || isExpanded) && (
        <div className={`space-y-3 ${isCollapsible ? 'mt-4 pt-3 border-t border-[var(--hairline)]' : 'mb-4'}`}>
          {items.map((item, idx) => (
            <div key={item.cartItemId || item.id || idx} className="flex justify-between items-start text-sm">
              <div>
                <p className="font-semibold text-[var(--ink)]">
                  {item.quantity ? `${item.quantity}x ` : ''}{item.name}
                </p>
                {item.details && (
                  <p className="text-xs text-[var(--ink-soft)]">• {item.details}</p>
                )}
              </div>
              <span className="font-serif font-medium text-[var(--ink)] tabular-nums">
                ${(item.totalPrice ?? item.price ?? 0).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* PRICE BREAKDOWN */}
      {(!isCollapsible || isExpanded || items.length === 0) && (
        <div className="pt-3 border-t border-[var(--hairline)] space-y-2.5">
          {subtotal > 0 && (
            <div className="flex items-center text-sm text-[var(--ink-soft)]">
              <span>Subtotal</span>
              <span className="leader" />
              <span className="font-medium text-[var(--ink)] tabular-nums">
                ${subtotal.toFixed(2)}
              </span>
            </div>
          )}

          <div className="pt-2 border-t border-[var(--hairline)] flex items-center justify-between font-bold text-[var(--ink)]">
            <span className="font-serif text-lg">{totalLabel}</span>
            <span className="font-serif text-xl sm:text-2xl text-[var(--brass)] tabular-nums">
              ${total.toFixed(2)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}