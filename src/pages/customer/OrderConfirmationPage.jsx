import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { 
  CheckCircle2, Utensils, Bike, Sparkles, Home, AlertCircle, 
} from 'lucide-react';
import '../../Customer.css';
import OrderSummaryCard from '../../components/cards/CollapseItemSummaryCard';

export default function OrderConfirmationPage() {
  const navigate = useNavigate();
  const { orderId = '4092' } = useParams();

  // Mock Confirmed Order Details
  const orderDetails = {
    id: orderId,
    type: 'dine-in', // 'dine-in' | 'takeout'
    tableNumber: 'Table 04',
    customerName: 'Alex Rivera',
    timePlaced: '2:34 PM',
    paymentMethod: 'Credit Card (•••• 4242)',
    heroImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    items: [
      { cartItemId: '1', name: 'Gourmet Chicken Burger', quantity: 2, details: 'Large, Aged Cheddar', price: 39.00 },
      { cartItemId: '2', name: 'Bruschetta al Pomodoro', quantity: 1, details: '', price: 8.50 },
    ],
    subtotal: 47.50,
    total: 47.80
  };

  return (
    <div className="menu-root min-h-screen pb-36 relative bg-[var(--paper)]">
      
      {/* FLOATING GLASS HEADER OVERLAY (Share button removed) */}
      <div className="fixed top-0 left-0 right-0 z-40 px-5 py-4 flex items-center justify-between pointer-events-none">
        <button
          type="button"
          onClick={() => navigate('/')}
          aria-label="Go to Home"
          className="pointer-events-auto w-10 h-10 rounded-full flex items-center justify-center shadow-md bg-white/80 backdrop-blur-md text-[var(--ink)] hover:scale-105 active:scale-95 transition-all border border-white/40"
        >
          <Home className="w-5 h-5" />
        </button>
      </div>

      {/* HERO HEADER IMAGE */}
      <div className="relative w-full h-[36vh] sm:h-[42vh] shrink-0 overflow-hidden bg-[var(--forest)]/10">
        <img 
          src={orderDetails.heroImage} 
          alt="Payment Confirmed" 
          className="w-full h-full object-cover" 
        />
        {/* Soft dark overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/70" />
        
        {/* Hero Title & Success Badge */}
        <div className="absolute bottom-6 left-5 right-5 max-w-2xl mx-auto text-white">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-sans font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-emerald-500/20 backdrop-blur-md text-emerald-200 border border-emerald-400/30 mb-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" /> Payment Successful
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold leading-tight drop-shadow-sm">
            Order Confirmed!
          </h1>
          <p className="text-xs sm:text-sm text-white/80 font-medium mt-1">
            Receipt Sent • Reference {orderDetails.id}
          </p>
        </div>
      </div>

      {/* MAIN CONTENT CONTAINER */}
      <div className="px-5 pt-6 max-w-2xl mx-auto space-y-6 relative z-10">

        {/* STATUS CARD (Prep time removed) */}
        <div className="bg-white rounded-3xl p-6 border border-[var(--hairline)] shadow-sm text-center animate-fade-up">

          <h2 className="font-serif font-bold text-xl text-[var(--ink)] mb-1">
            We're preparing your order
          </h2>
          <p className="text-sm text-[var(--ink-soft)] mb-4">
            Your payment has been authorized and forwarded to our kitchen team.
          </p>

          {/* DINING LOCATION DETAILS */}
          <div className="pt-4 border-t border-[var(--hairline)]/60 text-left">
            <div className="bg-[var(--paper)] p-3.5 rounded-2xl border border-[var(--hairline)] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[var(--ink-soft)] block mb-0.5">
                  Dining Option
                </span>
                <div className="font-serif font-bold text-base text-[var(--ink)] flex items-center gap-2">
                  {orderDetails.type === 'dine-in' ? (
                    <>
                      <Utensils className="w-4 h-4 text-[var(--forest)]" />
                      <span>{orderDetails.tableNumber}</span>
                    </>
                  ) : (
                    <>
                      <Bike className="w-4 h-4 text-[var(--forest)]" />
                      <span>Takeout Pickup</span>
                    </>
                  )}
                </div>
              </div>

              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[var(--forest)]/10 text-[var(--forest)]">
                Confirmed
              </span>
            </div>
          </div>
        </div>

        {/* REUSABLE ORDER SUMMARY CARD */}
        <OrderSummaryCard
          title="Payment Summary"
          items={orderDetails.items}
          subtotal={orderDetails.subtotal}
          total={orderDetails.total}
          isCollapsible={true}
          defaultExpanded={true}
          totalLabel="Total Paid"
        />


      </div>

      {/* STICKY BOTTOM ACTION BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] bg-[var(--paper)]/80 backdrop-blur-xl border-t border-[var(--hairline)] shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
        <div className="max-w-2xl mx-auto flex gap-3">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex-1 h-14 rounded-2xl border border-[var(--hairline)] bg-white text-[var(--ink)] hover:bg-[var(--paper)] font-serif font-semibold text-base transition-all active:scale-[0.98]"
          >
            Back to Menu
          </button>

          <Link to={`/order-tracking/${orderDetails.id}`}
  
            className="ticket-edge-top flex-1 h-14 rounded-2xl bg-[var(--forest)] text-[var(--paper)] hover:bg-[var(--forest-light)] font-serif font-semibold text-base flex items-center justify-center gap-2 transition-all shadow-xl active:scale-[0.98]"
          >
            <span>Track Order Status</span>
          </Link>
        </div>
      </div>

    </div>
  );
}