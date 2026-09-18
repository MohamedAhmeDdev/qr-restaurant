import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Utensils, Check, ChefHat, Sparkles, AlertCircle, ShoppingBag } from 'lucide-react';
import '../../Customer.css';
import guestApi from '../../services/guestApi';
import HeroHeader from '../../components/HeroHeader';
import GuestAccessError from '../../components/common/GuestAccessError';

const STAGES = [
  { id: 'pending', label: 'Received', icon: Sparkles, desc: 'Sent to the kitchen' },
  { id: 'preparing', label: 'Preparing', icon: ChefHat, desc: 'Chef is crafting your meal' },
  { id: 'ready', label: 'Ready', icon: Utensils, desc: 'Ready for table delivery' },
  { id: 'served', label: 'Served', icon: Check, desc: 'Enjoy your meal!' },
];

export default function OrderTrackingPage() {
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrder = async (isInitialCall = false) => {
    if (isInitialCall) setLoading(true);

    try {
      setError(null);
      const res = await guestApi.get('/guest/orders/current');
      const data = res.data?.data;

      if (data && data.id) {
        setOrder(data);
      } else {
        setOrder(null);
      }
    } catch (err) {
      console.error('Failed to fetch order:', err);
      setError(err.response?.data?.message);
    } fontFinally: {
      if (isInitialCall) setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const runFetch = async () => {
      if (!isMounted) return;
      await fetchOrder(true);
    };

    runFetch();

    // Poll for updates every 10 seconds
    const interval = setInterval(() => {
      if (isMounted) fetchOrder(false);
    }, 10000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Map known middleware errors to the GuestAccessError state
  const isMiddlewareError =
    error &&
    [
      'Restaurant is currently unavailable for guest ordering.',
      'Table not found or no longer active.',
      'Table is currently unavailable.',
      'Invalid or missing table scan token.',
    ].includes(error);

  // 1. LOADING SKELETON STATE
  if (loading) {
    return (
      <div className="menu-root min-h-screen pb-20 relative bg-paper animate-pulse">
        <HeroHeader />

        <div className="px-5 pt-4 pb-2 max-w-2xl mx-auto space-y-2">
          <div className="h-5 bg-hairline/60 rounded-full w-24" />
          <div className="h-8 bg-hairline/60 rounded-xl w-3/4" />
          <div className="h-4 bg-hairline/60 rounded-md w-1/2" />
        </div>

        <div className="px-5 pt-4 max-w-2xl mx-auto space-y-6">
          <div className="bg-paper/80 rounded-3xl p-6 border border-hairline/80 shadow-sm space-y-6">
            <div className="h-6 bg-hairline/60 rounded w-1/3" />
            <div className="space-y-6 pt-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-5 h-5 rounded-full bg-hairline/60" />
                  <div className="space-y-1.5 flex-1">
                    <div className="h-4 bg-hairline/60 rounded w-1/4" />
                    <div className="h-3 bg-hairline/60 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-paper/80 rounded-2xl p-5 space-y-3 border border-hairline/80">
            <div className="h-6 bg-hairline/60 rounded w-1/3 mb-4" />
            <div className="h-4 bg-hairline/60 rounded w-full" />
            <div className="h-4 bg-hairline/60 rounded w-full" />
            <div className="h-6 bg-hairline/60 rounded w-full pt-2" />
          </div>
        </div>
      </div>
    );
  }

  // 2A. MIDDLEWARE ACCESS ERROR STATE
  if (isMiddlewareError) {
    return <GuestAccessError message={error} onRetry={() => fetchOrder(true)} />;
  }

  // 2B. GENERAL ERROR STATE
  if (error) {
    return (
      <div className="menu-root min-h-screen bg-paper flex flex-col items-center justify-center p-6 text-center text-ink">
        <div className="w-12 h-12 rounded-full bg-rust/10 text-rust flex items-center justify-center mb-3">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="font-serif text-2xl font-bold mb-2 text-ink">Tracking Unavailable</h2>
        <p className="text-sm text-ink-soft mb-6 max-w-xs">{error}</p>
        <button
          type="button"
          onClick={() => fetchOrder(true)}
          className="px-6 py-2.5 rounded-full bg-forest text-paper font-semibold text-sm active:scale-95 transition-all shadow-md hover:bg-forest/90"
        >
          Try Again
        </button>
      </div>
    );
  }

  // 3. NO ACTIVE ORDER STATE
  if (!order) {
    return (
      <div className="menu-root min-h-screen bg-paper flex flex-col items-center justify-center p-6 text-center text-ink">
        <div className="w-12 h-12 rounded-full bg-hairline/60 text-ink-soft flex items-center justify-center mb-3">
          <ShoppingBag className="w-6 h-6 text-ink-soft/60" />
        </div>
        <h2 className="font-serif text-2xl font-bold mb-2 text-ink">No Active Order</h2>
        <p className="text-sm text-ink-soft mb-6 max-w-xs">
          You don't have an active order being prepared at this table right now.
        </p>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="px-6 py-2.5 rounded-full bg-forest text-paper font-semibold text-sm active:scale-95 transition-all shadow-md hover:bg-forest/90"
        >
          View Menu
        </button>
      </div>
    );
  }

  // 4. ACTIVE ORDER TRACKING DISPLAY STATE
  const stageIndex = STAGES.findIndex((s) => s.id === order.status);
  const currentStageIdx = stageIndex !== -1 ? stageIndex : 0;

  return (
    <div className="menu-root min-h-screen pb-20 relative bg-paper text-ink">
      <HeroHeader />

      <div className="px-5 pt-4 pb-2 max-w-2xl mx-auto">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-sans font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-forest/10 text-forest border border-forest/20 mb-2">
          Live Status
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold leading-tight text-ink">
          Track Order #{order.order_number}
        </h1>
        <p className="text-xs sm:text-sm text-ink-soft font-medium mt-1">
          Real-time updates directly from our kitchen
        </p>
      </div>

      <div className="px-5 pt-4 max-w-2xl mx-auto space-y-6 relative z-10">
        {/* Progress Tracker Card */}
        <div className="bg-paper/80 backdrop-blur-sm rounded-3xl p-6 animate-fade-up border border-hairline/80 shadow-sm">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-hairline/80">
            <h2 className="font-serif font-bold text-lg text-ink">Order Progress</h2>
            {order.table?.name && (
              <div className="flex items-center gap-1.5 text-xs font-semibold text-sage">
                <Utensils className="w-3.5 h-3.5 text-forest" />
                <span className="text-ink">{order.table.name}</span>
              </div>
            )}
          </div>

          <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-hairline/80">
            {STAGES.map((stage, idx) => {
              const isDone = idx < currentStageIdx;
              const isCurrent = idx === currentStageIdx;
              return (
                <div key={stage.id} className="relative flex items-start gap-4 group">
                  <div
                    className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center border transition-all duration-300 z-10 ${
                      isDone
                        ? 'bg-forest border-forest text-paper shadow-sm'
                        : isCurrent
                        ? 'bg-paper border-2 border-forest text-forest ring-4 ring-forest/15 scale-110'
                        : 'bg-paper border-hairline/80 text-ink-soft/60'
                    }`}
                  >
                    {isDone ? (
                      <Check className="w-3 h-3 stroke-[3]" />
                    ) : (
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isCurrent ? 'bg-forest' : 'bg-transparent'
                        }`}
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3
                        className={`font-serif font-semibold text-base leading-none ${
                          isCurrent ? 'text-forest font-bold' : isDone ? 'text-ink' : 'text-ink-soft'
                        }`}
                      >
                        {stage.label}
                      </h3>
                      {isCurrent && (
                        <span className="text-[10px] font-sans font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-forest/10 text-forest border border-forest/20 animate-pulse">
                          In Progress
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-ink-soft mt-1">{stage.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Receipt Summary Card */}
        <div className="bg-paper/80 backdrop-blur-sm rounded-2xl p-5 space-y-3 border border-hairline/80 shadow-sm">
          <h3 className="font-serif font-bold text-lg text-ink mb-2">Receipt & Items</h3>
          {Array.isArray(order.items) &&
            order.items.map((item) => (
              <div key={item.id || item.item_name} className="flex justify-between text-sm text-ink-soft">
                <span>
                  {item.quantity}x {item.item_name}
                </span>
                <span className="font-medium text-ink tabular-nums">
                  ${parseFloat(item.subtotal || 0).toFixed(2)}
                </span>
              </div>
            ))}
          <div className="pt-3 border-t border-hairline/80 flex items-center justify-between text-base font-bold text-ink">
            <span className="font-serif text-lg">Total Paid</span>
            <span className="font-serif text-xl text-brass tabular-nums">
              ${parseFloat(order.total_amount || 0).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}