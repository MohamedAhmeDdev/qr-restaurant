import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ShoppingBag, X, ArrowRight } from 'lucide-react';
import guestApi from '../services/guestApi';

export default function ActiveOrderBanner() {
  const { restaurantSlug, tableSlug } = useParams();
  const [activeOrder, setActiveOrder] = useState(null);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const checkOrder = async () => {
      try {
        const res = await guestApi.get('/guest/orders/current');
        if (res.data?.data) {
          setActiveOrder(res.data.data);
        }
      } catch (err) {
        // No active order or error, silently ignore
      }
    };
    checkOrder();
  }, []);

  if (isDismissed || !activeOrder) return null;

  return (
    <div className="sticky top-0 z-30 px-4 pt-4 max-w-2xl mx-auto w-full animate-fade-down">
      <div className="bg-forest/10 border border-forest/20 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-sm backdrop-blur-md">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-full bg-forest/20 flex items-center justify-center shrink-0">
            <ShoppingBag className="w-5 h-5 text-forest" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-forest truncate">
              You have an active order!
            </p>
            <p className="text-xs text-forest/80 truncate">
              Order #{activeOrder.order_number} is currently being prepared.
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 shrink-0">
          <Link
            to={`/${restaurantSlug}/${tableSlug}/track`}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-forest text-paper text-xs font-semibold rounded-xl hover:bg-forest/90 transition-colors whitespace-nowrap"
          >
            Track <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}