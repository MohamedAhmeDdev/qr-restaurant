import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';
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
    <div className="mx-5 my-1.5 max-w-2xl mx-auto animate-fade-up">
      <div className="bg-forest text-paper border border-forest/30 rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-9 h-9 rounded-full bg-paper/20 flex items-center justify-center shrink-0">
            <ShoppingBag className="w-4 h-4 text-paper" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-paper truncate">
              Active Order #{activeOrder.order_number}
            </p>
            <p className="text-[11px] text-paper/80 truncate">
              Tap to track live kitchen progress
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 shrink-0">
          <Link
            to={`/${restaurantSlug}/${tableSlug}/track`}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-paper text-forest text-xs font-bold rounded-xl hover:bg-paper/90 transition-colors whitespace-nowrap shadow-sm"
          >
            Track <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}