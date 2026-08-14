import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Trash2, ShoppingBag, 
  Pencil, ArrowRight
} from 'lucide-react';
import '../../Customer.css';
import StickyBottomBar from '../../components/StickyBottomBar';

// --- MOCK INITIAL CART DATA ---
const INITIAL_CART = [
  {
    cartItemId: 'c1',
    id: '2',
    name: 'Gourmet Chicken Burger',
    price: 14.00,
    quantity: 2,
    image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    selectedOptions: [
      { name: 'Large (+ Extra Patty)', price: 4.00 },
      { name: 'Aged Cheddar', price: 1.50 }
    ],
    specialNotes: 'Extra crispy fries please!'
  },
  {
    cartItemId: 'c2',
    id: '1',
    name: 'Bruschetta al Pomodoro',
    price: 8.50,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    selectedOptions: [],
    specialNotes: ''
  }
];

export default function CartPage() {
  const navigate = useNavigate();
  
  // --- STATE ---
  const [cartItems, setCartItems] = useState(INITIAL_CART);

  // --- CALCULATIONS ---
  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      const optionsCost = item.selectedOptions.reduce((oAcc, opt) => oAcc + opt.price, 0);
      return acc + (item.price + optionsCost) * item.quantity;
    }, 0);
  }, [cartItems]);

  // Grand total equals subtotal directly (Tax & Service Fee removed)
  const grandTotal = Math.max(0, subtotal);

  // --- HANDLERS ---
  const removeItem = (cartItemId) => {
    setCartItems(prev => prev.filter(item => item.cartItemId !== cartItemId));
  };

  return (
    <div className="menu-root min-h-screen pb-36 relative bg-[var(--paper)]">
      
      {/* FLOATING HEADER */}
      <div className="sticky top-0 z-40 px-5 py-4 flex items-center justify-between bg-[var(--paper)]/85 backdrop-blur-md border-b border-[var(--hairline)]">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Go Back"
          className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm bg-white text-[var(--ink)] hover:scale-105 active:scale-95 transition-all border border-[var(--hairline)]"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <h1 className="font-serif text-xl font-bold text-[var(--ink)]">Your Order</h1>

        <div className="w-10" /> {/* Spacer for symmetry */}
      </div>

      <div className="px-5 pt-6 max-w-2xl mx-auto">

        {/* CART ITEMS LIST */}
        {cartItems.length === 0 ? (
          <div className="text-center py-16 animate-fade-up">
            <div className="w-16 h-16 rounded-full bg-[var(--hairline)]/40 flex items-center justify-center mx-auto mb-4 text-[var(--sage)]">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-[var(--ink)] mb-1">Your cart is empty</h2>
            <p className="text-sm text-[var(--ink-soft)] mb-6">Looks like you haven't added anything yet.</p>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-6 py-3 rounded-2xl bg-[var(--forest)] text-[var(--paper)] font-serif font-semibold text-sm hover:bg-[var(--forest-light)] transition-all shadow-md"
            >
              Browse Menu
            </button>
          </div>
        ) : (
          <div className="space-y-4 mb-8">
            {cartItems.map((item, idx) => {
              const itemOptionsPrice = item.selectedOptions.reduce((acc, o) => acc + o.price, 0);
              const singleUnitPrice = item.price + itemOptionsPrice;

              return (
                <div 
                  key={item.cartItemId} 
                  className="bg-white rounded-2xl p-4 animate-fade-up flex flex-col gap-3"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  <div className="flex gap-3">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-20 h-20 rounded-xl object-cover shrink-0 border border-[var(--hairline)]"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-serif font-semibold text-base text-[var(--ink)] leading-tight truncate">
                            {item.name}
                          </h3>
                          <span className="text-xs font-semibold text-[var(--ink-soft)]">
                            Qty: {item.quantity}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.cartItemId)}
                          className="text-[var(--ink-soft)] hover:text-[var(--rust)] p-1 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* SELECTED OPTIONS & MODIFIERS */}
                      {item.selectedOptions.length > 0 && (
                        <div className="mt-1 space-y-0.5">
                          {item.selectedOptions.map((opt, i) => (
                            <p key={i} className="text-xs text-[var(--ink-soft)] flex items-center gap-1">
                              <span>•</span>
                              <span>{opt.name}</span>
                              {opt.price > 0 && <span className="text-[var(--brass)] font-medium">(+${opt.price.toFixed(2)})</span>}
                            </p>
                          ))}
                        </div>
                      )}

                      {/* SPECIAL INSTRUCTIONS */}
                      {item.specialNotes && (
                        <p className="mt-1 text-xs italic text-[var(--sage)] bg-[var(--paper)] p-1.5 rounded-lg border border-[var(--hairline)]/60">
                          "{item.specialNotes}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* BOTTOM ROW: EDIT ACTION & PRICE */}
                  <div className="flex items-center justify-between pt-2 border-t border-[var(--hairline)]/60">
                    <button
                      type="button"
                      onClick={() => navigate(`/item/${item.id}`)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--paper)] border border-[var(--hairline)] text-xs font-semibold text-[var(--ink)] hover:border-[var(--forest)] hover:text-[var(--forest)] active:scale-95 transition-all"
                    >
                      <Pencil className="w-3.5 h-3.5 text-[var(--brass)]" />
                      Edit Item
                    </button>

                    <span className="font-serif font-bold text-base text-[var(--brass)] tabular-nums">
                      ${(singleUnitPrice * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {cartItems.length > 0 && (
          /* BILL SUMMARY */
          <div className="bg-white rounded-2xl p-5 space-y-3 mb-8">
            <h3 className="font-serif font-bold text-lg text-[var(--ink)] mb-2">
              Order Summary
            </h3>

            <div className="flex items-center text-sm text-[var(--ink-soft)]">
              <span>Subtotal</span>
              <span className="leader" />
              <span className="font-medium text-[var(--ink)] tabular-nums">${subtotal.toFixed(2)}</span>
            </div>

            <div className="pt-3 border-t border-[var(--hairline)] flex items-center justify-between text-base font-bold text-[var(--ink)]">
              <span className="font-serif text-lg">Total</span>
              <span className="font-serif text-xl text-[var(--brass)] tabular-nums">${grandTotal.toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>

      {/* STICKY BOTTOM CHECKOUT BAR — Ticket Stub */}
   <StickyBottomBar
  type="cart"
  visible={cartItems.length > 0}
  count={cartItems.reduce((acc, i) => acc + i.quantity, 0)}
  amount={grandTotal}
/>
    </div>
  );
}