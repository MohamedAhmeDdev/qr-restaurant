import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Plus, Minus, Check, ChefHat,
  ShoppingCart, Info, Utensils, Flame, Sparkles
} from 'lucide-react';
import '../../Customer.css';
import StickyBottomBar from '../../components/StickyBottomBar';

// --- MOCK DATA ---
const MENU_ITEMS = [
  {
    id: '2',
    name: 'Gourmet Chicken Burger',
    description: 'Crispy seasoned chicken breast, artisan coleslaw, dill pickles, and house spicy mayo served on a toasted brioche bun with hand-cut truffle fries.',
    price: 14.00,
    image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    prepTime: '15-20 mins',
    calories: '850 kcal',
    popular: true,
    modifiers: [
      {
        id: 'size',
        type: 'single',
        required: true,
        title: 'Choose Your Size',
        display: 'segmented',
        options: [
          { id: 'reg', name: 'Regular', price: 0, desc: 'Standard serving' },
          { id: 'lg', name: 'Large', price: 4.00, desc: 'Extra patty & fries' },
          { id: 'xl', name: 'XL Combo', price: 7.50, desc: 'Drink & dessert' },
        ]
      },
      {
        id: 'addons',
        type: 'multi',
        required: false,
        title: 'Boost Your Meal',
        display: 'grid',
        options: [
          { id: 'bacon', name: 'Crispy Bacon', price: 2.50 },
          { id: 'cheese', name: 'Aged Cheddar', price: 1.50 },
          { id: 'egg', name: 'Fried Egg', price: 2.00 },
          { id: 'avocado', name: 'Fresh Avocado', price: 3.00 },
        ]
      },
      {
        id: 'prefs',
        type: 'multi',
        required: false,
        title: 'Cooking Preferences',
        display: 'list',
        options: [
          { id: 'no_slaw', name: 'No Coleslaw', price: 0 },
          { id: 'no_pickle', name: 'No Pickles', price: 0 },
          { id: 'extra_sauce', name: 'Extra Spicy Mayo', price: 0 },
          { id: 'well_done', name: 'Well Done Patty', price: 0 },
        ]
      }
    ]
  },
  {
    id: '1',
    name: 'Bruschetta al Pomodoro',
    description: 'Toasted ciabatta, fresh vine tomatoes, garlic, basil, and extra virgin olive oil drizzle.',
    price: 8.50,
    image: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    prepTime: '10 mins',
    modifiers: []
  }
];

export default function ItemDetailPage() {
  const { itemId } = useParams();
  const navigate = useNavigate();

  const item = useMemo(() =>
    MENU_ITEMS.find(i => i.id === itemId) || MENU_ITEMS[0],
    [itemId]);

  // --- STATE ---
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [specialNotes, setSpecialNotes] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);

  useEffect(() => {
    const initialOptions = {};
    item.modifiers.forEach(mod => {
      if (mod.type === 'single' && mod.required && mod.options.length > 0) {
        initialOptions[mod.id] = [mod.options[0].id];
      }
    });
    setSelectedOptions(initialOptions);
  }, [item]);

  // --- LOGIC ---
  const toggleOption = (modifier, optionId) => {
    setSelectedOptions(prev => {
      const currentSelected = prev[modifier.id] || [];
      if (modifier.type === 'single') {
        return { ...prev, [modifier.id]: [optionId] };
      } else {
        if (currentSelected.includes(optionId)) {
          return { ...prev, [modifier.id]: currentSelected.filter(id => id !== optionId) };
        } else {
          return { ...prev, [modifier.id]: [...currentSelected, optionId] };
        }
      }
    });
  };

  const finalPrice = useMemo(() => {
    let unitPrice = item.price;
    item.modifiers.forEach(mod => {
      const selectedIds = selectedOptions[mod.id] || [];
      selectedIds.forEach(optId => {
        const opt = mod.options.find(o => o.id === optId);
        if (opt) unitPrice += opt.price;
      });
    });
    return unitPrice * quantity;
  }, [item, selectedOptions, quantity]);

  const isReadyToAdd = useMemo(() => {
    return item.modifiers.every(mod => {
      if (!mod.required) return true;
      const selected = selectedOptions[mod.id] || [];
      return selected.length > 0;
    });
  }, [item, selectedOptions]);

  const handleAddToCart = () => {
    if (!isReadyToAdd || isAdding) return;
    setIsAdding(true);
    setTimeout(() => {
      setIsAdding(false);
      setAddedSuccess(true);
      setTimeout(() => navigate(-1), 900);
    }, 600);
  };

  // --- RENDER MODIFIER GROUPS ---
  const renderModifier = (mod) => {
    const selectedIds = selectedOptions[mod.id] || [];

    // SEGMENTED SIZE CARDS
    if (mod.display === 'segmented') {
      return (
        <div className="grid grid-cols-3 gap-3">
          {mod.options.map((opt) => {
            const isSelected = selectedIds.includes(opt.id);
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => toggleOption(mod, opt.id)}
                className={`relative py-3.5 px-3 rounded-2xl flex flex-col items-center justify-center text-center transition-all duration-200 border ${isSelected
                    ? 'border-forest bg-forest/5 shadow-sm ring-1 ring-forest/20'
                    : 'border-hairline bg-white/60 hover:bg-white hover:border-ink-soft/40'
                  }`}
              >
                <div className={`w-4 h-4 rounded-full mb-2 flex items-center justify-center border transition-colors ${isSelected ? 'border-forest bg-forest' : 'border-hairline bg-white'
                  }`}>
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-paper" />}
                </div>
                <span className="font-serif font-semibold text-sm leading-tight text-ink">{opt.name}</span>
                <span className="text-[11px] mt-1 font-medium text-ink-soft">
                  {opt.price > 0 ? `+$${opt.price.toFixed(2)}` : 'Included'}
                </span>
              </button>
            );
          })}
        </div>
      );
    }

    // GRID ADD-ONS
    if (mod.display === 'grid') {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {mod.options.map((opt) => {
            const isSelected = selectedIds.includes(opt.id);
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => toggleOption(mod, opt.id)}
                className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-200 text-left ${isSelected
                    ? 'border-forest bg-forest/5 shadow-sm'
                    : 'border-hairline bg-white/80 hover:bg-white'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border transition-all ${isSelected ? 'border-forest bg-forest' : 'border-hairline bg-white'
                    }`}>
                    {isSelected && <Check className="w-3.5 h-3.5 text-paper" strokeWidth={3} />}
                  </div>
                  <span className="font-serif font-medium text-sm text-ink">{opt.name}</span>
                </div>
                <span className={`text-xs font-semibold ${isSelected ? 'text-forest' : 'text-brass'}`}>
                  +${opt.price.toFixed(2)}
                </span>
              </button>
            );
          })}
        </div>
      );
    }

    // LIST PREFERENCES
    return (
      <div className="space-y-2">
        {mod.options.map((opt) => {
          const isSelected = selectedIds.includes(opt.id);
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => toggleOption(mod, opt.id)}
              className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border transition-all duration-200 text-left ${isSelected
                  ? 'border-forest bg-forest/5'
                  : 'border-hairline bg-white/80 hover:bg-white'
                }`}
            >
              <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border transition-all ${isSelected ? 'border-forest bg-forest' : 'border-hairline bg-white'
                }`}>
                {isSelected && <Check className="w-3.5 h-3.5 text-paper" strokeWidth={3} />}
              </div>
              <span className="text-sm font-medium text-ink">{opt.name}</span>
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="menu-root min-h-screen pb-36 bg-paper text-ink relative">

      {/* FLOATING GLASS HEADER */}
      <div className="fixed top-0 left-0 right-0 z-40 px-5 py-4 flex items-center justify-between pointer-events-none">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Go Back"
          className="pointer-events-auto w-10 h-10 rounded-full flex items-center justify-center shadow-md bg-white/80 backdrop-blur-md text-[var(--ink)] hover:scale-105 active:scale-95 transition-all duration-200 border border-white/40 cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      {/* HERO IMAGE CONTAINER */}
      <div className="relative w-full h-[40vh] sm:h-[46vh] shrink-0 overflow-hidden bg-forest/10">
        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/60" />
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="px-5 pt-6 relative z-10 max-w-2xl mx-auto animate-fade-up">

        {/* HEADER & PRICE */}
        <div className="flex items-start justify-between gap-4 mb-2">
          <div>
            {item.popular && (
              <span className="inline-flex items-center gap-1 text-[10px] font-sans font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rust/10 text-rust mb-2">
                Popular Item
              </span>
            )}
            <h1 className="font-serif text-3xl sm:text-4xl font-semibold leading-tight text-ink">{item.name}</h1>
          </div>
          <span className="font-serif font-bold text-2xl sm:text-3xl shrink-0 text-brass pt-1">
            ${item.price.toFixed(2)}
          </span>
        </div>

        {/* DESCRIPTION */}
        <p className="text-[15px] leading-relaxed pb-6 text-ink-soft font-normal">
          {item.description}
        </p>

        {/* IN-PAGE QUANTITY SELECTOR BAR */}
        <div className="flex items-center justify-between py-4 px-5 mb-6 rounded-2xl bg-white border border-hairline shadow-sm">
          <span className="font-serif font-semibold text-base text-ink">Quantity</span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all active:scale-90 ${quantity <= 1
                  ? 'border-hairline text-hairline cursor-not-allowed'
                  : 'border-hairline text-ink hover:bg-paper cursor-pointer'
                }`}
            >
              <Minus className="w-4 h-4" />
            </button>

            <span className="font-serif font-bold text-lg w-6 text-center tabular-nums text-ink">
              {quantity}
            </span>

            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="w-9 h-9 rounded-full flex items-center justify-center bg-forest text-paper transition-all active:scale-90 shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="border-t border-hairline my-6" />

        {/* MODIFIERS LIST */}
        <div className="space-y-8 mt-6">
          {item.modifiers.length === 0 ? (
            <div className="text-center py-10 rounded-3xl border border-hairline">
              <Utensils className="w-7 h-7 mx-auto mb-2 text-sage/60" />
              <p className="font-serif italic text-ink-soft">This item is crafted as described with no standard add-ons.</p>
            </div>
          ) : (
            item.modifiers.map((mod, idx) => (
              <div key={mod.id} className="animate-fade-up" style={{ animationDelay: `${0.1 + idx * 0.08}s` }}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-serif text-xl font-semibold flex items-center gap-2 text-ink">
                    {mod.title}
                    {mod.required ? (
                      <span className="text-[10px] font-sans font-bold uppercase tracking-wider px-2 py-0.5 rounded-md text-rust bg-rust/10 border border-rust/20">
                        Required
                      </span>
                    ) : (
                      <span className="text-xs font-normal text-sage font-sans">(Optional)</span>
                    )}
                  </h3>
                </div>
                {renderModifier(mod)}
              </div>
            ))
          )}

          {/* SPECIAL INSTRUCTIONS */}
          <div className="animate-fade-up" style={{ animationDelay: '0.35s' }}>
            <h3 className="font-serif text-xl font-semibold mb-3 flex items-center gap-2 text-[var(--ink)]">
              Special Requests
              <Info className="w-4 h-4 text-[var(--ink-soft)]" />
            </h3>

            <div className="relative">
              <textarea
                value={specialNotes}
                onChange={(e) => setSpecialNotes(e.target.value)}
                placeholder="E.g. allergies, extra crispy fries, dressing on the side..."
                maxLength={200}
                className="w-full p-4 text-[15px] rounded-2xl outline-none resize-none h-28 border border-[var(--hairline)] bg-[var(--paper)]/60 text-[var(--ink)] placeholder-[var(--ink-soft)]/60 focus:bg-white focus:border-[var(--forest)] focus:ring-1 focus:ring-[var(--forest)]/20 transition-all duration-200 custom-scrollbar shadow-inner"
              />
              <div className="text-right text-xs mt-1 font-medium text-[var(--ink-soft)]">
                {specialNotes.length}/200
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* STICKY BOTTOM BAR */}
      <StickyBottomBar
        type="item"
        visible={true}
        count={quantity}
        amount={finalPrice}
        isDisabled={!isReadyToAdd}
        isLoading={isAdding}
        isSuccess={addedSuccess}
        onAction={handleAddToCart}
        actionLabel="Add to Order"
        disabledLabel="Select Size"
        successMessage="Added to Order"
        loadingMessage="Adding..."
      />
    </div>
  );
}