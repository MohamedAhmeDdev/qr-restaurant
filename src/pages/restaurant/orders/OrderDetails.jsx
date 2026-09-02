import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Printer, Share2, MoreVertical, Clock, MapPin, 
  User, CreditCard, CheckCircle2, AlertTriangle, ChefHat, 
  UtensilsCrossed, Truck, PackageCheck, XCircle, RefreshCw
} from 'lucide-react';

// Mock Data - In production, fetch via GET /api/orders/:id
const MOCK_ORDER = {
  id: 1,
  order_number: 'ORD-9KJT7I',
  table_name: 'Table 1',
  customer_name: 'Sarah Chen',
  phone: '+1 (555) 012-3456',
  status: 'preparing',
  payment_status: 'paid',
  type: 'dine_in',
  total_amount: 32.00,
  subtotal: 28.50,
  tax: 2.28,
  service_fee: 1.22,
  created_at: '2026-09-02T14:10:38',
  updated_at: '2026-09-02T14:12:15',
  notes: 'Extra napkins requested. Allergy: No peanuts.',
  items: [
    {
      id: 101,
      item_name: 'Classic Cheeseburger',
      quantity: 2,
      unit_price: 12.50,
      subtotal: 25.00,
      special_instructions: 'Medium rare, extra crispy bacon.',
      modifiers: [
        { name: 'Extra Toppings: Bacon', price: 2.00 },
        { name: 'Extra Toppings: Extra Cheese', price: 1.50 }
      ]
    },
    {
      id: 102,
      item_name: 'French Fries',
      quantity: 1,
      unit_price: 5.00,
      subtotal: 5.00,
      special_instructions: null,
      modifiers: []
    }
  ],
  timeline: [
    { status: 'pending', time: '14:10:38', label: 'Order Placed' },
    { status: 'preparing', time: '14:12:15', label: 'Kitchen Started' },
  ]
};

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(MOCK_ORDER);
  const [isPrinting, setIsPrinting] = useState(false);

  // Status Workflow Configuration
  const STATUS_STEPS = [
    { key: 'pending', label: 'Pending', icon: Clock },
    { key: 'preparing', label: 'Preparing', icon: ChefHat },
    { key: 'ready', label: 'Ready', icon: PackageCheck },
    { key: 'completed', label: 'Completed', icon: CheckCircle2 },
  ];

  const currentStepIndex = STATUS_STEPS.findIndex(s => s.key === order.status);
  const nextStatus = STATUS_STEPS[currentStepIndex + 1]?.key;
  const nextLabel = STATUS_STEPS[currentStepIndex + 1]?.label;

  const handleAdvanceStatus = () => {
    if (!nextStatus) return;
    const now = new Date().toISOString();
    setOrder(prev => ({
      ...prev,
      status: nextStatus,
      updated_at: now,
      timeline: [...prev.timeline, { status: nextStatus, time: new Date(now).toLocaleTimeString(), label: `Marked ${nextLabel}` }]
    }));
  };

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 300);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400';
      case 'preparing': return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400';
      case 'ready': return 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400';
      case 'completed': return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-slate-800 dark:text-slate-400';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 p-6 print:bg-white print:p-0">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Orders
          </button>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={handlePrint}
              disabled={isPrinting}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg text-sm font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              <Printer className="w-4 h-4" /> {isPrinting ? 'Printing...' : 'Print Receipt'}
            </button>
            <button className="p-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg text-gray-500 hover:text-gray-700 dark:hover:text-slate-300 transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
            <button className="p-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg text-gray-500 hover:text-gray-700 dark:hover:text-slate-300 transition-colors">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Order Details & Items */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Order Info Card */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm p-6 print:border-none print:shadow-none">
              <div className="flex flex-wrap justify-between items-start gap-4 mb-6 pb-6 border-b border-gray-100 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-mono">{order.order_number}</h1>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide border ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-slate-400">
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {new Date(order.created_at).toLocaleString()}</span>
                    <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {order.table_name}</span>
                    <span className="flex items-center gap-1.5"><UtensilsCrossed className="w-3.5 h-3.5" /> {order.type === 'dine_in' ? 'Dine In' : 'Takeaway'}</span>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">Customer</p>
                  <p className="font-bold text-gray-900 dark:text-white">{order.customer_name}</p>
                  <p className="text-sm text-gray-500 dark:text-slate-400">{order.phone}</p>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500">Order Items</h3>
                {order.items.map(item => (
                  <div key={item.id} className="pb-4 border-b border-gray-50 dark:border-slate-800 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex gap-2">
                        <span className="font-bold text-gray-900 dark:text-white">{item.quantity}x</span>
                        <span className="font-medium text-gray-900 dark:text-white">{item.item_name}</span>
                      </div>
                      <span className="font-mono font-medium text-gray-900 dark:text-white">${item.subtotal.toFixed(2)}</span>
                    </div>
                    
                    {/* Modifiers */}
                    {item.modifiers.length > 0 && (
                      <div className="ml-7 space-y-0.5 mb-2">
                        {item.modifiers.map((mod, i) => (
                          <div key={i} className="text-xs text-gray-500 dark:text-slate-400 flex justify-between max-w-xs ml-auto">
                            <span>+ {mod.name}</span>
                            <span className="font-mono">${mod.price.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Special Instructions */}
                    {item.special_instructions && (
                      <div className="ml-7 mt-2 flex items-start gap-2 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/10 p-2 rounded border border-amber-100 dark:border-amber-900/30 print:hidden">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <span className="italic">{item.special_instructions}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Financial Breakdown */}
              <div className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-800 space-y-2">
                <div className="flex justify-between text-sm text-gray-600 dark:text-slate-400">
                  <span>Subtotal</span>
                  <span className="font-mono">${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-slate-400">
                  <span>Tax (8%)</span>
                  <span className="font-mono">${order.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-slate-400">
                  <span>Service Fee</span>
                  <span className="font-mono">${order.service_fee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-slate-800">
                  <span className="text-base font-bold text-gray-900 dark:text-white">Total</span>
                  <span className="text-xl font-bold text-gray-900 dark:text-white font-mono">${order.total_amount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Order Notes */}
            {order.notes && (
              <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl p-4 print:hidden">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-amber-800 dark:text-amber-300 mb-1">Special Order Notes</h4>
                    <p className="text-sm text-amber-700 dark:text-amber-400">{order.notes}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Status & Timeline */}
          <div className="space-y-6 print:hidden">
            
            {/* Status Stepper */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm p-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500 mb-6">Order Status</h3>
              
              <div className="relative space-y-6 before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200 dark:before:bg-slate-800">
                {STATUS_STEPS.map((step, index) => {
                  const isCompleted = index <= currentStepIndex;
                  const isCurrent = index === currentStepIndex;
                  const Icon = step.icon;

                  return (
                    <div key={step.key} className="relative flex items-center gap-4">
                      <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                        isCompleted 
                          ? 'bg-orange-500 border-orange-500 text-white' 
                          : 'bg-white dark:bg-slate-900 border-gray-300 dark:border-slate-700 text-gray-400'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className={`transition-opacity duration-300 ${isCompleted ? 'opacity-100' : 'opacity-40'}`}>
                        <p className={`text-sm font-bold ${isCurrent ? 'text-orange-600 dark:text-orange-400' : 'text-gray-900 dark:text-white'}`}>
                          {step.label}
                        </p>
                        {isCompleted && (
                          <p className="text-xs text-gray-500 dark:text-slate-400">
                            {order.timeline.find(t => t.status === step.key)?.time || 'Completed'}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-800 space-y-3">
                {nextStatus && order.status !== 'cancelled' && order.status !== 'completed' ? (
                  <button
                    onClick={handleAdvanceStatus}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg shadow-sm shadow-orange-500/20 transition-all active:scale-[0.98]"
                  >
                    Mark as {nextLabel}
                    <RefreshCw className="w-4 h-4" />
                  </button>
                ) : order.status !== 'completed' && order.status !== 'cancelled' ? (
                  <button
                    onClick={() => setOrder(prev => ({ ...prev, status: 'completed' }))}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-sm transition-all active:scale-[0.98]"
                  >
                    Complete Order
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                ) : null}

                {order.status !== 'cancelled' && order.status !== 'completed' && (
                  <button
                    onClick={() => setOrder(prev => ({ ...prev, status: 'cancelled' }))}
                    className="w-full flex items-center justify-center gap-2 py-3 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 font-bold rounded-lg transition-all active:scale-[0.98]"
                  >
                    Cancel Order
                    <XCircle className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm p-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500 mb-4">Payment Details</h3>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800/50 rounded-lg border border-gray-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    order.payment_status === 'paid' 
                      ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' 
                      : 'bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400'
                  }`}>
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white capitalize">{order.payment_status}</p>
                    <p className="text-xs text-gray-500 dark:text-slate-400">Paid via Card •••• 4242</p>
                  </div>
                </div>
                <span className="font-mono font-bold text-gray-900 dark:text-white">${order.total_amount.toFixed(2)}</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}