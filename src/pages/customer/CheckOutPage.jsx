import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Smartphone, Phone } from 'lucide-react';
import '../../Customer.css';
import StickyBottomBar from '../../components/StickyBottomBar';
import OrderSummaryCard from '../../components/cards/CollapseItemSummaryCard';


const SUMMARY_ITEMS = [
  {
    cartItemId: 'c1',
    name: 'Gourmet Chicken Burger',
    quantity: 2,
    totalPrice: 39.00,
    details: 'Large, Aged Cheddar'
  },
  {
    cartItemId: 'c2',
    name: 'Bruschetta al Pomodoro',
    quantity: 1,
    totalPrice: 8.50,
    details: ''
  }
];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [mpesaPhone, setMpesaPhone] = useState('0712345678');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const subtotal = 47.50;
  const grandTotal = subtotal;

  const handlePlaceOrder = (e) => {
    e?.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setOrderSuccess(true);
      setTimeout(() => {
        navigate('/order-tracking/4092');
      }, 2000);
    }, 1500);
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
        <h1 className="font-serif text-xl font-bold text-[var(--ink)]">Checkout</h1>
        <div className="w-10" />
      </div>

      <div className="px-5 pt-6 max-w-2xl mx-auto space-y-6">

        {/* M-PESA PAYMENT METHOD */}
        <div className="bg-white rounded-2xl p-5 animate-fade-up">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif font-bold text-lg text-[var(--ink)] flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-[var(--forest)]" />
              Pay via M-Pesa
            </h2>
            <span className="text-[10px] font-sans font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[var(--forest)]/10 text-[var(--forest)]">
              STK Push
            </span>
          </div>

          <p className="text-xs text-[var(--ink-soft)] mb-4">
            An M-Pesa prompt will be sent directly to your phone. Enter your PIN to authorize payment.
          </p>

          <div className="space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--ink-soft)]">
              M-Pesa Registered Number
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-[var(--ink-soft)] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                required
                value={mpesaPhone}
                onChange={(e) => setMpesaPhone(e.target.value)}
                placeholder="07XX XXX XXX or 01XX XXX XXX"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--hairline)] bg-[var(--paper)]/50 text-sm font-semibold text-[var(--ink)] outline-none focus:border-[var(--forest)]"
              />
            </div>
          </div>
        </div>

        {/* REUSABLE ORDER BREAKDOWN */}
     <OrderSummaryCard
  title="Order Details"
  items={SUMMARY_ITEMS}
  subtotal={subtotal}
  total={grandTotal}
  totalLabel="Total Amount"
  isCollapsible={true}
  defaultExpanded={true}
/>

        {/* SECURITY FOOTER BADGE */}
        <div className="flex items-center justify-center gap-2 text-xs text-[var(--sage)] pt-1">
          <ShieldCheck className="w-4 h-4" />
          <span>Encrypted & 256-Bit Secure M-Pesa Transaction</span>
        </div>

      </div>

      <StickyBottomBar
        type="checkout"
        visible={true}
        amount={grandTotal}
        isDisabled={!mpesaPhone}
        isLoading={isSubmitting}
        isSuccess={orderSuccess}
        onAction={handlePlaceOrder}
        actionLabel="Pay via M-Pesa"
        successMessage="Prompt Sent! Check Your Phone"
        loadingMessage="Requesting PIN..."
      />
    </div>
  );
}