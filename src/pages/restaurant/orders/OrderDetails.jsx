import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Printer, Clock, CheckCircle2, ChefHat,
  PackageCheck, XCircle, RefreshCw, Copy, Info, UtensilsCrossed,
  AlertCircle, RotateCcw, ClipboardList
} from 'lucide-react';
import { formatTime } from '../../../utils/formatTime';
import StatusBadge from '../../../components/StatusBadge';
import EmptyState from '../../../components/common/EmptyState';
import api from '../../../services/api';
import toast from 'react-hot-toast';
import { useFormatPrice } from '../../../contexts/useFormatPrice';

const STATUS_STEPS = [
  { key: 'pending', label: 'Pending', icon: Clock },
  { key: 'preparing', label: 'Preparing', icon: ChefHat },
  { key: 'ready', label: 'Ready', icon: PackageCheck },
  { key: 'served', label: 'Served', icon: UtensilsCrossed },
];

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
   const { formatPrice } = useFormatPrice();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Fetch Order Details
  const fetchOrder = useCallback(async () => {
    if (!id) {
      setError("Invalid Order ID.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await api.get(`/orders/${id}`);
      const orderData = response.data?.data;

      if (!orderData) {
        throw new Error("No data returned from server.");
      }

      setOrder({
        ...orderData,
        items: orderData.items || [],
        timeline: orderData.timeline || []
      });
    } catch (err) {
      setError(err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  // Helper mappings
  const getNextStatus = (current) => ({
    pending: 'preparing',
    preparing: 'ready',
    ready: 'served'
  })[current];

  const getActionLabel = (current) => ({
    pending: 'Start Prep',
    preparing: 'Mark Ready',
    ready: 'Mark Served'
  })[current];

  const currentStepIndex = order ? STATUS_STEPS.findIndex(s => s.key === order.status) : -1;
  const nextStatus = order ? getNextStatus(order.status) : null;
  const actionLabel = order ? getActionLabel(order.status) : null;

  // Status Handlers
  const handleAdvanceStatus = async () => {
    if (!nextStatus || !order) return;

    const previousOrder = { ...order };
    const now = new Date().toISOString();

    setIsUpdatingStatus(true);
    setOrder(prev => ({
      ...prev,
      status: nextStatus,
      updated_at: now,
    }));

    try {
     const response = await api.patch(`/orders/${id}`, { status: nextStatus });
      toast.success(response?.data?.message);
    } catch (err) {
      toast.error(err.response?.data?.message);
      setOrder(previousOrder);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    if (!order) return;

    const previousOrder = { ...order };
    const now = new Date().toISOString();

    setIsUpdatingStatus(true);
    setOrder(prev => ({
      ...prev,
      status: 'cancelled',
      updated_at: now,
    }));

    try {
      const response =  await api.patch(`/orders/${id}`, { status: 'cancelled' });
      toast.success(response?.data?.message);
    } catch (err) {
     toast.error(err.response?.data?.message);
      setOrder(previousOrder);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 300);
  };

  const copyOrderNumber = () => {
    if (order?.order_number) {
      navigator.clipboard.writeText(order.order_number);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isTerminalState = order && (order.status === 'served' || order.status === 'cancelled');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 p-4 sm:p-6 text-gray-900 dark:text-slate-100 transition-colors duration-200 print:bg-white print:p-0">
      <div className="max-w-5xl mx-auto space-y-6 print:max-w-[80mm] print:mx-auto print:space-y-4">

        {/* Top Navigation Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <div className="p-1.5 rounded-full bg-gray-100 dark:bg-slate-800 group-hover:bg-gray-200 dark:group-hover:bg-slate-700 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </div>
            Back to Orders
          </button>

          {!loading && !error && order && (
            <button
              onClick={handlePrint}
              disabled={isPrinting}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg text-sm font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all disabled:opacity-50 shadow-sm"
            >
              <Printer className="w-4 h-4" /> {isPrinting ? 'Printing...' : 'Print Receipt'}
            </button>
          )}
        </div>

        {/* 1. LOADING SKELETON STATE */}
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse">
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-6 space-y-6">
              <div className="flex justify-between items-center pb-6 border-b border-gray-100 dark:border-slate-800">
                <div className="space-y-2">
                  <div className="h-7 bg-slate-200 dark:bg-slate-800 rounded w-40" />
                  <div className="h-4 bg-slate-100 dark:bg-slate-800/60 rounded w-28" />
                </div>
                <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-full w-20" />
              </div>
              <div className="space-y-4">
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-24 mb-4" />
                {Array.from({ length: 3 }).map((_, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2">
                    <div className="flex gap-3 items-center w-1/2">
                      <div className="w-6 h-6 rounded bg-slate-200 dark:bg-slate-800" />
                      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full" />
                    </div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-16" />
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-6 space-y-6 h-fit">
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-28" />
              <div className="space-y-6">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800" />
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-24" />
                  </div>
                ))}
              </div>
              <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded-xl w-full" />
            </div>
          </div>
        ) : error ? (
          /* 2. ERROR STATE */
          <div className=" p-12">
            <EmptyState
              icon={AlertCircle}
              title="Failed to load order details"
              description={error}
              action={
                <button
                  onClick={fetchOrder}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/30 rounded-lg transition-colors duration-200"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Try again
                </button>
              }
            />
          </div>
        ) : !order || (order.items && order.items.length === 0) ? (
          /* 3. EMPTY STATE */
          <div className=" p-12">
            <EmptyState
              icon={ClipboardList}
              title="Order details unavailable"
              description="This order contains no itemized records or could not be located in the workspace database."
              action={
                <button
                  onClick={() => navigate(-1)}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-800 rounded-lg transition-colors duration-200"
                >
                  Return to Order List
                </button>
              }
            />
          </div>
        ) : (
          /* 4. LIST / CONTENT DISPLAY STATE */
          <>
            {/* Terminal State Banner */}
            {isTerminalState && (
              <div className={`rounded-xl p-4 flex items-center gap-3 border print:hidden ${order.status === 'served'
                  ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                  : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300'
                }`}>
                {order.status === 'served' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                <span className="font-semibold">This order has been {order.status}.</span>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:block">

              {/* Order Items Column */}
              <div className="lg:col-span-2 space-y-6 print:space-y-4">
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm p-6 print:border-none print:shadow-none print:p-0">

                  <div className="flex flex-wrap justify-between items-start gap-4 mb-6 pb-6 border-b border-gray-100 dark:border-slate-800 print:border-b-2 print:border-black print:mb-4 print:pb-2">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-mono tracking-tight">{order.order_number}</h1>
                        <button onClick={copyOrderNumber} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors print:hidden" title="Copy Order Number">
                          {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                        <StatusBadge status={order.status} />
                      </div>
                   <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-slate-400">
                                           <span className="font-medium text-gray-700 dark:text-slate-300 flex items-center gap-1">
                                             <span className="text-xs font-bold uppercase text-gray-400 dark:text-slate-500">Table:</span>
                                             {order.table?.id}
                                           </span>
                                           <span>•</span>
                                           <div className="flex items-center gap-1 font-mono text-md">
                                             <Clock className="w-3 h-3 text-gray-400" />
                                             <span>{formatTime(order.created_at)}</span>
                                           </div>
                                         </div>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="space-y-5">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-slate-500 print:text-black print:mb-2">Order Items</h3>
                    {order.items.map(item => (
                      <div key={item.id} className="group">
                        <div className="flex justify-between items-start mb-1.5">
                          <div className="flex gap-3">
                            <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white text-xs font-bold rounded print:bg-transparent print:w-auto print:h-auto print:p-0">
                              {item.quantity}x
                            </span>
                            <span className="font-semibold text-gray-900 dark:text-white print:font-bold">{item.item_name}</span>
                          </div>
                          <span className="font-mono font-medium text-gray-900 dark:text-white print:font-bold">{formatPrice(item.subtotal)}</span>
                        </div>

                          {item.modifiers && item.modifiers.length > 0 && (
                            <div className="mt-1 ml-4 space-y-0.5">
                              <span className="text-sm font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500 block">
                                Modifiers:
                              </span>
                              {item.modifiers.map((mod, i) => (
                                <div key={i} className="text-[12px] text-gray-500 dark:text-slate-500 flex justify-between">
                                  <span>
                                    <span className="text-gray-400 dark:text-slate-600 font-medium">{mod.modifier_group_name}:
                                  </span> {mod.modifier_option_name}
                                  </span>
                                  <span className="font-mono">{formatPrice(mod.unit_price)}</span>
                                </div>
                              ))}
                            </div>
                          )}

                        {item.special_instructions && (
                          <div className="ml-9 mt-2 flex items-start gap-2 text-xs  print:hidden">
                            <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                            <span className="italic leading-relaxed">{item.special_instructions}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Totals Summary */}
                  <div className="mt-8 pt-6 border-t border-dashed border-gray-200 dark:border-slate-700 space-y-2.5 print:mt-4 print:pt-2 print:border-t-2 print:border-black">
                    <div className="flex justify-between text-sm text-gray-600 dark:text-slate-400 print:text-black">
                      <span>Subtotal</span>
                      <span className="font-mono">{formatPrice(order.subtotal)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-4 mt-2 border-t border-dashed border-gray-200 dark:border-slate-700 print:pt-2 print:mt-2 print:border-t-2 print:border-black">
                      <span className="text-base font-bold text-gray-900 dark:text-white print:text-xl">Total</span>
                      <span className="text-2xl font-bold text-gray-900 dark:text-white font-mono print:text-3xl">{formatPrice(order.total_amount)}</span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Stepper & Action Controls Column */}
              <div className="space-y-6 print:hidden">
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm p-6 sticky top-6">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-slate-500 mb-6">Order Status</h3>

                  <div className="relative space-y-8 before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100 dark:before:bg-slate-800">
                    {STATUS_STEPS.map((step, index) => {
                      const isCompleted = index < currentStepIndex || order.status === 'served';
                      const isCurrent = index === currentStepIndex;
                      const Icon = step.icon;

                      return (
                        <div key={step.key} className="relative flex items-center gap-4">
                          <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${isCompleted
                              ? 'bg-orange-500 border-orange-500 text-white shadow-md shadow-orange-500/20'
                              : isCurrent
                                ? 'bg-white dark:bg-slate-900 border-orange-500 text-orange-500 ring-4 ring-orange-500/10'
                                : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-gray-300 dark:text-slate-600'
                            }`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className={`transition-all duration-300 ${isCompleted || isCurrent ? 'opacity-100' : 'opacity-50'}`}>
                            <p className={`text-sm font-bold ${isCurrent ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-slate-400'}`}>
                              {step.label}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Actions */}
                  <div className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-800 space-y-3">
                    {!isTerminalState ? (
                      <>
                        {nextStatus && actionLabel && (
                          <button
                            onClick={handleAdvanceStatus}
                            disabled={isUpdatingStatus}
                            className="w-full flex items-center justify-center gap-2 py-3.5 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold rounded-xl shadow-lg shadow-orange-500/20 transition-all active:scale-[0.98] disabled:opacity-50"
                          >
                            {actionLabel}
                            <RefreshCw className={`w-4 h-4 ${isUpdatingStatus ? 'animate-spin' : ''}`} />
                          </button>
                        )}

                        <button
                          onClick={handleCancelOrder}
                          disabled={isUpdatingStatus}
                          className="w-full flex items-center justify-center gap-2 py-3 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 font-semibold rounded-xl transition-all active:scale-[0.98] disabled:opacity-50"
                        >
                          Cancel Order
                          <XCircle className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => navigate(-1)}
                        className="w-full flex items-center justify-center gap-2 py-3.5 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 font-bold rounded-xl transition-all"
                      >
                        Back to Orders
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </>
        )}

      </div>
    </div>
  );
}