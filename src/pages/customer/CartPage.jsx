import React, { useState, useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Trash2, ShoppingBag, Pencil, Image } from 'lucide-react';
import '../../Customer.css';
import StickyBottomBar from '../../components/StickyBottomBar';
import { useCart } from '../../contexts/CartContext';
import guestApi from '../../services/guestApi';
import { getImageUrl } from '../../utils/getImageUrl';
import HeroHeader from '../../components/HeroHeader';
import { useFormatPrice } from '../../contexts/useFormatPrice';

export default function CartPage() {
  const navigate = useNavigate();
  const { cartItems, removeItem, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { restaurantSlug, tableSlug } = useParams();
      const { formatPrice, currency } = useFormatPrice();

  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  }, [cartItems]);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0 || isSubmitting) return;
    setIsSubmitting(true);

    try {
      const payload = {
        type: 'dine_in',
        notes: '',
        subtotal: subtotal,
        total_amount: subtotal,
        items: cartItems.map((item) => ({
          menu_item_id: item.menu_item_id,
          quantity: item.quantity,
          special_instructions: item.special_instructions || null,
          modifiers: item.modifiers.map((m) => ({
            modifier_option_id: m.option_id,
          })),
        })),
      };

      const response = await guestApi.post('/guest/orders', payload);
      const orderId = response.data?.data?.id;

      clearCart();
      navigate(`/${restaurantSlug}/${tableSlug}/track`);
    } catch (err) {
      console.error('Order failed:', err);
      alert(err.response?.data?.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="menu-root min-h-screen pb-36 relative bg-paper text-ink">
      {/* 1. HERO HEADER */}
      <HeroHeader />

      {/* 2. PAGE TITLE - Only shown when cart has items */}
      {cartItems.length > 0 && (
        <div className="px-5 pt-4 max-w-2xl mx-auto flex items-center justify-between">
          <h1 className="font-serif text-2xl font-bold text-ink">Your Order</h1>
          {cartCount > 0 && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-forest/10 text-forest border border-forest/20">
              {cartCount} {cartCount === 1 ? 'Item' : 'Items'}
            </span>
          )}
        </div>
      )}

      {/* 3. MAIN CONTENT */}
      <div className="px-5 pt-4 max-w-2xl mx-auto">
        {cartItems.length === 0 ? (
          <div className="text-center py-16 animate-fade-up flex flex-col items-center">
            {/* Custom Illustration: Empty Shopping Bag */}
            <svg
              viewBox="0 0 240 240"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-40 h-40 sm:w-48 sm:h-48 mb-6 text-ink-soft/40"
            >
              {/* Bag Body */}
              <path 
                d="M60 80 L60 190 Q60 210 80 210 L160 210 Q180 210 180 190 L180 80 L60 80" 
                fill="currentColor" 
                className="text-ink-soft/10" 
              />
              <path 
                d="M60 80 L60 190 Q60 210 80 210 L160 210 Q180 210 180 190 L180 80 L60 80" 
                stroke="currentColor" 
                strokeWidth="4" 
              />
              
              {/* Bag Handles */}
              <path 
                d="M90 80 V60 Q90 40 120 40 Q150 40 150 60 V80" 
                stroke="currentColor" 
                strokeWidth="4" 
                strokeLinecap="round"
              />
              
              {/* Decorative "Empty" lines inside bag */}
              <path 
                d="M90 140 L150 140" 
                stroke="currentColor" 
                strokeWidth="3" 
                strokeLinecap="round" 
                className="text-ink-soft/20" 
              />
              <path 
                d="M90 170 L150 170" 
                stroke="currentColor" 
                strokeWidth="3" 
                strokeLinecap="round" 
                className="text-ink-soft/20" 
              />
            </svg>

            <h2 className="font-serif text-2xl font-bold text-ink mb-2">Your cart is empty</h2>
            <p className="text-sm text-ink-soft mb-6 max-w-xs mx-auto">
              Looks like you haven't added any delicious items to your order yet.
            </p>
            <button
            onClick={() => navigate(-1)}
              className="px-6 py-3 rounded-2xl bg-forest text-paper font-serif font-semibold text-sm hover:bg-forest/90 active:scale-95 transition-all shadow-md"
            >
              Browse Menu
            </button>
          </div>
        ) : (
          <div className="space-y-4 mb-8">
            {cartItems.map((item, idx) => (
              <div
                key={item.cartItemId}
                className="bg-paper/85 backdrop-blur-sm border border-hairline/80 rounded-2xl p-4 animate-fade-up flex flex-col gap-3 shadow-sm"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <div className="flex gap-3.5">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 overflow-hidden relative rounded-xl shrink-0 border border-hairline/80 flex items-center justify-center bg-forest/5">
                    {item.image_url ? (
                      <img
                        src={getImageUrl(item.image_url)}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Image className="w-6 h-6 text-forest/30" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-serif font-semibold text-base text-ink leading-tight truncate">
                          {item.name}
                        </h3>
                        <span className="text-xs font-semibold text-ink-soft">Qty: {item.quantity}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.cartItemId)}
                        aria-label="Remove item"
                        className="text-ink-soft/70 hover:text-rust p-1 transition-colors active:scale-90"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {item.modifiers && item.modifiers.length > 0 && (
                      <div className="mt-1.5 space-y-0.5">
                        {item.modifiers.map((mod, i) => (
                          <p key={i} className="text-xs text-ink-soft flex items-center gap-1">
                            <span className="text-sage">•</span> {mod.modifier_option_name}
                              <span className="text-brass font-medium">{formatPrice(mod.price)}</span>
                          </p>
                        ))}
                      </div>
                    )}

                    {item.special_instructions && (
                      <p className="mt-2 text-xs italic text-sage bg-hairline/30 p-2 rounded-xl border border-hairline/60">
                        "{item.special_instructions}"
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2.5 border-t border-hairline/60">
                  <Link
                    to={`/${restaurantSlug}/${tableSlug}/item/${item.menu_item_id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-paper border border-hairline/80 text-xs font-semibold text-ink hover:border-forest hover:text-forest active:scale-95 transition-all"
                  >
                    <Pencil className="w-3.5 h-3.5 text-brass" /> Edit
                  </Link>
                  <span className="font-serif font-bold text-base text-brass tabular-nums">
                    {formatPrice(item.unitPrice * item.quantity)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {cartItems.length > 0 && (
          <div className="bg-paper/85 backdrop-blur-sm rounded-2xl border border-hairline/80 p-5 space-y-3 mb-8 shadow-sm">
            <h3 className="font-serif font-bold text-lg text-ink mb-2">Order Summary</h3>
            <div className="flex items-center justify-between text-sm text-ink-soft">
              <span>Subtotal</span>
              <span className="font-medium text-ink tabular-nums">{formatPrice(subtotal)}</span>
            </div>
            <div className="pt-3 border-t border-hairline/80 flex items-center justify-between text-base font-bold text-ink">
              <span className="font-serif text-lg">Total</span>
              <span className="font-serif text-xl text-brass tabular-nums">{formatPrice(subtotal)}</span>
            </div>
          </div>
        )}
      </div>

      {/* 4. BOTTOM BAR */}
      <StickyBottomBar
        type="checkout"
        visible={cartCount > 0}
        count={cartCount}
        amount={subtotal}
        isLoading={isSubmitting}
        isDisabled={cartItems.length === 0}
        onAction={handlePlaceOrder}
        actionLabel="Place Order"
        loadingMessage="Sending to Kitchen..."
        successMessage="Order Placed!"
      />
    </div>
  );
}