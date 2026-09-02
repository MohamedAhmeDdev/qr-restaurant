import React, { useState } from 'react';
import { 
  Clock, UtensilsCrossed, ChevronRight, AlertTriangle, Search
} from 'lucide-react';
import Toolbar from '../../../components/Toolbar';


// Mock Data updated to separate modifier group and modifier option
const DUMMY_ORDERS = [
  {
    id: 1,
    order_number: 'ORD-9KJT7I',
    table_name: 'Table 1',
    status: 'pending',
    payment_status: 'pending',
    type: 'dine_in',
    total_amount: 32.00,
    created_at: '2026-09-02T14:10:38',
    notes: 'Extra napkins requested',
    items: [
      {
        id: 101,
        item_name: 'Classic Cheeseburger',
        quantity: 2,
        unit_price: 12.50,
        subtotal: 25.00,
        special_instructions: 'Medium rare, extra crispy bacon.',
        modifiers: [
          { group_name: 'Extra Toppings', option_name: 'Bacon', price: 2.00 },
          { group_name: 'Extra Toppings', option_name: 'Extra Cheese', price: 1.50 }
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
    ]
  },
  {
    id: 2,
    order_number: 'ORD-X48A1B',
    table_name: 'Table 3',
    status: 'preparing',
    payment_status: 'paid',
    type: 'dine_in',
    total_amount: 24.50,
    created_at: '2026-09-02T13:55:00',
    notes: null,
    items: [
      {
        id: 103,
        item_name: 'Margherita Pizza',
        quantity: 1,
        unit_price: 18.00,
        subtotal: 18.00,
        special_instructions: 'Well done crust',
        modifiers: [
          { group_name: 'Add-ons', option_name: 'Truffle Oil', price: 6.50 }
        ]
      }
    ]
  }
];

export default function Orders() {
  const [orders, setOrders] = useState(DUMMY_ORDERS);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const STATUS_CONFIG = {
    pending: { label: 'Pending', color: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400' },
    preparing: { label: 'Preparing', color: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400' },
    ready: { label: 'Ready', color: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400' },
    completed: { label: 'Completed', color: 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-slate-800 dark:text-slate-400' },
    cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400' }
  };

  const getNextStatus = (current) => ({ pending: 'preparing', preparing: 'ready', ready: 'completed' })[current];
  const getActionLabel = (current) => ({ pending: 'Start Prep', preparing: 'Mark Ready', ready: 'Complete' })[current];

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    const matchesSearch = order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          order.table_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="p-1 sm:p-4 space-y-6 bg-gray-50 dark:bg-slate-950 min-h-screen text-gray-900 dark:text-slate-100 transition-colors duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent leading-tight">
            <UtensilsCrossed className="w-6 h-6 text-orange-500" />
            Live Orders
          </h1>
          <p className="text-md text-gray-500 dark:text-slate-400 mt-1">
            Track kitchen workflow and table service in real-time.
          </p>
        </div>
      </div>

      {/* Toolbar Component */}
      <Toolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search order or table..."
        filters={['all', 'pending', 'preparing', 'ready', 'completed']}
        activeFilter={selectedStatus}
        onFilterChange={setSelectedStatus}
      />

      {filteredOrders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredOrders.map(order => {
            const statusInfo = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
            const nextStatus = getNextStatus(order.status);
            
            return (
              <div key={order.id} className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden">
                <div className="p-4 flex-1 flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono font-bold text-gray-900 dark:text-white">{order.order_number}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded border ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-slate-400">
                        <Clock className="w-3 h-3" />
                        {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        <span className="mx-1">•</span>
                        <span className="font-medium text-gray-700 dark:text-slate-300">{order.table_name}</span>
                      </div>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                    {order.items.map(item => (
                      <div key={item.id} className="border-b border-gray-50 dark:border-slate-800 last:border-0 pb-2 last:pb-0">
                        <div className="flex justify-between items-start text-sm">
                          <span className="font-medium text-gray-900 dark:text-white">
                            {item.quantity}x {item.item_name}
                          </span>
                          <span className="font-mono text-gray-600 dark:text-slate-400">
                            ${item.subtotal.toFixed(2)}
                          </span>
                        </div>
                        
                        {/* Display Group and Option explicitly */}
                        {item.modifiers.length > 0 && (
                          <div className="mt-1 ml-4 space-y-0.5">
                            {item.modifiers.map((mod, i) => (
                              <div key={i} className="text-[11px] text-gray-500 dark:text-slate-500 flex justify-between">
                                <span>
                                  <span className="text-gray-400 dark:text-slate-600 font-medium">{mod.group_name}:</span> {mod.option_name}
                                </span>
                                <span className="font-mono">${mod.price.toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {item.special_instructions && (
                          <div className="mt-1.5 flex items-start gap-1.5 text-[11px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/10 p-1.5 rounded border border-amber-100 dark:border-amber-900/30">
                            <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5" />
                            <span className="italic">{item.special_instructions}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {order.notes && (
                    <div className="text-xs text-gray-500 dark:text-slate-400 bg-gray-50 dark:bg-slate-800/50 p-2 rounded border border-gray-100 dark:border-slate-800 flex gap-2">
                      <span className="shrink-0">📝</span> {order.notes}
                    </div>
                  )}
                </div>

                {/* Bottom Bar / Action Section */}
                <div className="p-3.5 bg-gray-50/80 dark:bg-slate-900/80 border-t border-gray-100 dark:border-slate-800/80 flex items-center justify-between gap-3">
                  
                  {/* Left: Total Amount & Payment Status */}
                  <div className="flex items-center gap-4">
                    {/* Total Amount Card */}
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold tracking-wider text-gray-400 dark:text-slate-500 uppercase">
                        Total
                      </span>
                      <span className="text-base sm:text-lg font-black text-gray-900 dark:text-white font-mono leading-tight">
                        ${order.total_amount.toFixed(2)}
                      </span>
                    </div>

                    {/* Payment Status Card */}
                    <div className="pl-4 flex flex-col">
                      <span className="text-[10px] font-bold tracking-wider text-gray-400 dark:text-slate-500 uppercase">
                        Payment Status
                      </span>
                      <div className="mt-0.5">
                        <span className={`inline-flex items-center gap-1.5 text-[10px] font-extrabold px-2 py-0.5 rounded-md border tracking-wide uppercase ${
                          order.payment_status === 'paid' 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/60' 
                            : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/60'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            order.payment_status === 'paid' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                          }`} />
                          {order.payment_status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Next Action Button */}
                  {nextStatus && (
                    <button
                      onClick={() => updateOrderStatus(order.id, nextStatus)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-md shadow-orange-500/10 transition-all hover:shadow-orange-500/20 active:scale-95 shrink-0"
                    >
                      <span>{getActionLabel(order.status)}</span>
                      <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-xl border-2 border-dashed border-gray-200 dark:border-slate-800 text-center">
          <Search className="w-8 h-8 text-gray-400 mb-2" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">No orders found</h3>
        </div>
      )}
    </div>
  );
}