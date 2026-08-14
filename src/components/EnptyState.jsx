import React from 'react';
import { Search, UtensilsCrossed, ShoppingBag } from 'lucide-react';

const ICON_MAP = {
  search: Search,
  menu: UtensilsCrossed,
  cart: ShoppingBag,
};

export default function EmptyState({
  icon = 'search',
  title = 'No results found',
  description = 'Try adjusting your search or filters.',
  actionLabel,
}) {
  const IconComponent = ICON_MAP[icon] || Search;

  return (
    <div className="text-center py-16 px-4 animate-fade-in flex flex-col items-center">
      <div className="w-12 h-12 rounded-full bg-[var(--hairline)]/40 text-[var(--ink-soft)] flex items-center justify-center mb-3">
        <IconComponent className="w-5 h-5" />
      </div>

      <h3 className="font-serif font-bold text-lg text-[var(--ink)]">
        {title}
      </h3>

      {description && (
        <p className="text-xs text-[var(--ink-soft)] mt-1 max-w-xs leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}