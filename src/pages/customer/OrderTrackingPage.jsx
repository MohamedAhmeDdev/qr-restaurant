import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Utensils, Bike, Check, ChefHat, Sparkles } from 'lucide-react';
import '../../customer.css';
import OrderSummaryCard from '../../components/cards/CollapseItemSummaryCard';


const STAGES = [
  { id: 'received', label: 'Received', icon: Sparkles, desc: 'Sent to the kitchen' },
  { id: 'preparing', label: 'Preparing', icon: ChefHat, desc: 'Chef is crafting your meal' },
  { id: 'ready', label: 'Ready', icon: Utensils, desc: 'Ready for table delivery / pickup' },
  { id: 'completed', label: 'Served', icon: Check, desc: 'Enjoy your meal!' },
];

export default function OrderTrackingPage() {
  const navigate = useNavigate();
  const { orderId = '#4092' } = useParams();
  const [currentStageIdx] = useState(1);

  const orderDetails = {
    id: orderId,
    type: 'dine-in',
    tableNumber: 'Table 04',
    customerName: 'Alex Rivera',
    heroImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    items: [
      { name: 'Gourmet Chicken Burger', quantity: 2, details: 'Large, Aged Cheddar', price: 39.00 },
      { name: 'Bruschetta al Pomodoro', quantity: 1, details: '', price: 8.50 },
    ],
    total: 47.50
  };

  return (
    <div className="menu-root min-h-screen pb-20 relative bg-[var(--paper)]">
      
      {/* FLOATING HEADER */}
      <div className="fixed top-0 left-0 right-0 z-40 px-5 py-4 flex items-center justify-between pointer-events-none">
        <button
          type="button"
          onClick={() => navigate('/')}
          aria-label="Go to Menu"
          className="pointer-events-auto w-10 h-10 rounded-full flex items-center justify-center shadow-md bg-white/80 backdrop-blur-md text-[var(--ink)] hover:scale-105 active:scale-95 transition-all border border-white/40"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      {/* HERO HEADER */}
      <div className="relative w-full h-[36vh] sm:h-[42vh] shrink-0 overflow-hidden bg-[var(--forest)]/10">
        <img 
          src={orderDetails.heroImage} 
          alt="Restaurant Atmosphere" 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/70" />
        
        <div className="absolute bottom-6 left-5 right-5 max-w-2xl mx-auto text-white">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-sans font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/20 mb-2">
            Live Status
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold leading-tight drop-shadow-sm">
            Track Order {orderDetails.id}
          </h1>
          <p className="text-xs sm:text-sm text-white/80 font-medium mt-1">
            Real-time updates directly from our kitchen
          </p>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="px-5 pt-6 max-w-2xl mx-auto space-y-6 relative z-10">

        {/* STEPPER TRACKER */}
        <div className="bg-white rounded-3xl p-6 animate-fade-up border border-[var(--hairline)]/60 shadow-sm">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--hairline)]/60">
            <h2 className="font-serif font-bold text-lg text-[var(--ink)]">Order Progress</h2>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--sage)]">
              {orderDetails.type === 'dine-in' ? (
                <>
                  <Utensils className="w-3.5 h-3.5 text-[var(--forest)]" />
                  <span className="text-[var(--ink)]">{orderDetails.tableNumber}</span>
                </>
              ) : (
                <>
                  <Bike className="w-3.5 h-3.5 text-[var(--forest)]" />
                  <span className="text-[var(--ink)]">{orderDetails.customerName}</span>
                </>
              )}
            </div>
          </div>

          <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[var(--hairline)]">
            {STAGES.map((stage, idx) => {
              const isDone = idx < currentStageIdx;
              const isCurrent = idx === currentStageIdx;

              return (
                <div key={stage.id} className="relative flex items-start gap-4 group">
                  <div 
                    className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center border transition-all duration-300 z-10 ${
                      isDone 
                        ? 'bg-[var(--forest)] border-[var(--forest)] text-[var(--paper)]' 
                        : isCurrent
                        ? 'bg-white border-2 border-[var(--forest)] text-[var(--forest)] ring-4 ring-[var(--forest)]/10 scale-110'
                        : 'bg-white border-[var(--hairline)] text-[var(--ink-soft)]'
                    }`}
                  >
                    {isDone ? (
                      <Check className="w-3 h-3 stroke-[3]" />
                    ) : (
                      <span className={`w-1.5 h-1.5 rounded-full ${isCurrent ? 'bg-[var(--forest)]' : 'bg-transparent'}`} />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className={`font-serif font-semibold text-base leading-none ${
                        isCurrent ? 'text-[var(--forest)] font-bold' : isDone ? 'text-[var(--ink)]' : 'text-[var(--ink-soft)]'
                      }`}>
                        {stage.label}
                      </h3>
                      {isCurrent && (
                        <span className="text-[10px] font-sans font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[var(--forest)]/10 text-[var(--forest)] animate-pulse">
                          In Progress
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[var(--ink-soft)] mt-1">{stage.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* REUSABLE RECEIPT SUMMARY */}
<OrderSummaryCard
  title="Receipt & Items"
  items={orderDetails.items}
  total={orderDetails.total}
  totalLabel="Total Paid"
  isCollapsible={true}
  defaultExpanded={true}
/>

      </div>
    </div>
  );
}