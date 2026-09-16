import React, { useState, useEffect, useCallback, forwardRef } from 'react';
import { 
  UtensilsCrossed, Search, Eye, Clock, AlertCircle, 
  RotateCcw, Loader2, RefreshCw, XCircle,
  Calendar as CalendarIcon, ChevronLeft, ChevronRight
} from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, subDays, getYear, getMonth, parse } from 'date-fns';
import { Link, useSearchParams } from 'react-router-dom';
import Toolbar from '../../../components/Toolbar';
import StatusBadge from '../../../components/StatusBadge';
import EmptyState from '../../../components/common/EmptyState';
import Pagination from '../../../components/common/Pagination';
import StatsCard from '../../../components/cards/StatsCard';
import { formatTime } from '../../../utils/formatTime';
import api from '../../../services/api';
import toast from 'react-hot-toast';
import { useFormatPrice } from '../../../contexts/useFormatPrice';

const DateInputButton = forwardRef(({ value, onClick, label }, ref) => (
  <button
    type="button"
    ref={ref}
    onClick={onClick}
    className="flex items-center gap-2 bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-gray-900 dark:text-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer shadow-sm"
  >
    <CalendarIcon className="w-3.5 h-3.5 text-orange-500" />
    <span className="text-gray-500 dark:text-slate-400 font-sans font-medium">{label}:</span>
    <span className="text-gray-900 dark:text-white font-semibold">{value || 'Select Date'}</span>
  </button>
));

export default function Orders() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { formatPrice } = useFormatPrice();

  // URL-driven state
  const currentPage = Number(searchParams.get('page')) || 1;
  const searchQuery = searchParams.get('search') || '';
  const selectedStatus = searchParams.get('status') || 'all';
  
  const startDateStr = searchParams.get('start_date');
  const endDateStr = searchParams.get('end_date');
  

  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  
  // Pagination & Stats State
  const [lastPage, setLastPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [stats, setStats] = useState({
    total: 0, pending: 0, preparing: 0, ready: 0, served: 0, cancelled: 0
  });

  const years = Array.from({ length: 20 }, (_, i) => getYear(new Date()) - 10 + i);
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // URL update helper
  const updateUrlParams = useCallback((newPage, newSearch, newStatus, newStartDate, newEndDate) => {
    const params = new URLSearchParams();
    if (newPage > 1) params.set('page', String(newPage));
    if (newSearch) params.set('search', newSearch);
    if (newStatus && newStatus !== 'all') params.set('status', newStatus);
    if (newStartDate) params.set('start_date', format(newStartDate, 'yyyy-MM-dd'));
    if (newEndDate) params.set('end_date', format(newEndDate, 'yyyy-MM-dd'));
    setSearchParams(params, { replace: true });
  }, [setSearchParams]);

  const applyPreset = (type) => {
    const now = new Date();
    let newStart = subDays(now, 6);
    let newEnd = now;

    if (type === 'today') { newStart = now; newEnd = now; }
    else if (type === '7days') { newStart = subDays(now, 6); newEnd = now; }
    else if (type === 'month') {
      newStart = new Date(now.getFullYear(), now.getMonth(), 1);
      newEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    }
    else if (type === 'year') {
      newStart = new Date(now.getFullYear(), 0, 1);
      newEnd = new Date(now.getFullYear(), 11, 31);
    }

    updateUrlParams(1, searchQuery, selectedStatus, newStart, newEnd);
  };

// 1. Stable Date References
const startDate = React.useMemo(
  () => (startDateStr ? parse(startDateStr, 'yyyy-MM-dd', new Date()) : subDays(new Date(), 6)),
  [startDateStr]
);

const endDate = React.useMemo(
  () => (endDateStr ? parse(endDateStr, 'yyyy-MM-dd', new Date()) : new Date()),
  [endDateStr]
);

// 2. Safe Fetch Hook
const fetchOrders = useCallback(async () => {
  setIsLoading(true);
  setError(null);
  try {
    const params = {
      page: currentPage,
      per_page: 15,
      start_date: format(startDate, 'yyyy-MM-dd'),
      end_date: format(endDate, 'yyyy-MM-dd'),
    };
    if (selectedStatus !== 'all') params.status = selectedStatus;
    if (searchQuery) params.search = searchQuery;

    const response = await api.get('/orders', { params });
    const payload = response.data;
    
    // Fallback checks for array vs paginated envelope
    const orderList = Array.isArray(payload) ? payload : (payload?.data || []);
    setOrders(orderList);
    
    setStats(payload?.stats);
    setLastPage(payload?.pagination?.last_page || payload?.last_page || 1);
    setTotalItems(payload?.pagination?.total || payload?.total || orderList.length);
  } catch (err) {
    console.error("Error fetching orders:", err);
    setError(err.response?.data?.message);
  } finally {
    setIsLoading(false);
  }
}, [currentPage, startDate, endDate, selectedStatus, searchQuery]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Handlers
  const handleSearchChange = (query) => {
    updateUrlParams(1, query, selectedStatus, startDate, endDate);
  };

  const handleStatusChange = (status) => {
    updateUrlParams(1, searchQuery, status || 'all', startDate, endDate);
  };

  const handlePageChange = (newPage) => {
    updateUrlParams(newPage, searchQuery, selectedStatus, startDate, endDate);
  };

  const handleDateChange = (newStart, newEnd) => {
    updateUrlParams(1, searchQuery, selectedStatus, newStart, newEnd);
  };

  const getNextStatus = (current) => ({ pending: 'preparing', preparing: 'ready', ready: 'served' })[current];
  const getActionLabel = (current) => ({ pending: 'Start Prep', preparing: 'Mark Ready', ready: 'Mark Served' })[current];

  const updateOrderStatus = async (orderId, newStatus) => {
    const previousOrders = [...orders]; 
    setUpdatingOrderId(orderId);

    // Optimistic update
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));

    try {
      const response = await api.patch(`/orders/${orderId}`, { status: newStatus });
      toast.success(response?.data?.message);
      // Refetch to ensure stats and pagination stay perfectly in sync
      fetchOrders(); 
    } catch (err) {
      toast.error(err.response?.data?.message);
      setOrders(previousOrders); // Rollback on error
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const renderCustomHeader = ({
    date, changeYear, changeMonth, decreaseMonth, increaseMonth,
    prevMonthButtonDisabled, nextMonthButtonDisabled,
  }) => (
    <div className="flex items-center justify-between px-3 py-2 bg-slate-100 border-b border-slate-200 rounded-t-lg">
      <button type="button" onClick={decreaseMonth} disabled={prevMonthButtonDisabled} className="p-1 rounded bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition-colors cursor-pointer">
        <ChevronLeft className="w-4 h-4" />
      </button>
      <div className="flex items-center gap-1.5">
        <select value={months[getMonth(date)]} onChange={({ target: { value } }) => changeMonth(months.indexOf(value))} className="font-semibold text-xs bg-white text-slate-800 border border-slate-300 rounded px-2 py-1 outline-none cursor-pointer focus:ring-1 focus:ring-orange-500">
          {months.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
        <select value={getYear(date)} onChange={({ target: { value } }) => changeYear(Number(value))} className="font-semibold text-xs bg-white text-slate-800 border border-slate-300 rounded px-2 py-1 outline-none cursor-pointer focus:ring-1 focus:ring-orange-500">
          {years.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
      </div>
      <button type="button" onClick={increaseMonth} disabled={nextMonthButtonDisabled} className="p-1 rounded bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition-colors cursor-pointer">
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );

  const isFiltered = Boolean(searchQuery || selectedStatus !== 'all');

  return (
    <div className="p-2 sm:p-4 space-y-6 bg-gray-50 dark:bg-slate-950 min-h-screen text-gray-900 dark:text-slate-100 transition-colors duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent leading-tight">
            <UtensilsCrossed className="w-6 h-6 text-orange-500" />
            Live Orders
          </h1>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
            Track kitchen workflow and table service in real-time.
          </p>
        </div>
        <button 
          onClick={fetchOrders} 
          disabled={isLoading}
          className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg text-xs font-semibold text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatsCard label="Total Orders" value={isLoading && stats.total === 0 ? '...' : stats.total} />
        <StatsCard label="Pending" value={isLoading && stats.pending === 0 ? '...' : stats.pending} />
        <StatsCard label="Preparing" value={isLoading && stats.preparing === 0 ? '...' : stats.preparing} />
        <StatsCard label="Ready" value={isLoading && stats.ready === 0 ? '...' : stats.ready} />
        <StatsCard label="Served" value={isLoading && stats.served === 0 ? '...' : stats.served} />
        <StatsCard label="Cancelled" value={isLoading && stats.cancelled === 0 ? '...' : stats.cancelled} />
      </div>

      {/* Toolbar Component */}
      <Toolbar
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search order or table..."
        dropdowns={[
          {
            id: 'status-filter',
            placeholder: 'Status...',
            value: selectedStatus,
            onChange: handleStatusChange,
            options: [
              { label: 'All Statuses', value: 'all' },
              { label: 'Pending', value: 'pending' },
              { label: 'Preparing', value: 'preparing' },
              { label: 'Ready', value: 'ready' },
              { label: 'Served', value: 'served' },
              { label: 'Cancelled', value: 'cancelled' },
            ],
          },
        ]}
      />

      {/* Date Filter */}
      <div className="relative z-50 flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-sm">
        <div className="flex items-center gap-2">
          <DatePicker
            selected={startDate}
            onChange={(date) => handleDateChange(date, endDate)}
            dateFormat="yyyy-MM-dd"
            renderCustomHeader={renderCustomHeader}
            customInput={<DateInputButton label="From" />}
          />
          <span className="text-gray-400 font-bold text-xs">–</span>
          <DatePicker
            selected={endDate}
            onChange={(date) => handleDateChange(startDate, date)}
            minDate={startDate}
            dateFormat="yyyy-MM-dd"
            renderCustomHeader={renderCustomHeader}
            customInput={<DateInputButton label="To" />}
          />
          <button
            onClick={() => applyPreset('7days')}
            className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-500 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors cursor-pointer shadow-sm"
            title="Reset range"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 1. LOADING SKELETON STATE */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-4 space-y-4 shadow-sm animate-pulse">
              <div className="flex justify-between items-start">
                <div className="space-y-2 w-1/2">
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                  <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
                </div>
                <div className="h-6 bg-slate-100 dark:bg-slate-800/60 rounded w-16" />
              </div>
              <div className="space-y-2 pt-2">
                <div className="h-3 bg-slate-100 dark:bg-slate-800/60 rounded w-1/4" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/3" />
              </div>
              <div className="pt-4 border-t border-gray-100 dark:border-slate-800 flex justify-between items-center">
                <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-20" />
                <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-xl w-24" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        /* 2. ERROR STATE */
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm p-12">
          <EmptyState
            icon={AlertCircle}
            title="Failed to load orders"
            description={error}
            action={
              <button
                onClick={fetchOrders}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/30 rounded-lg transition-colors duration-200"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Try again
              </button>
            }
          />
        </div>
      ) : orders.length === 0 ? (
        /* 3. EMPTY STATE */
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm p-12">
          <EmptyState
            icon={isFiltered ? Search : UtensilsCrossed}
            title={isFiltered ? 'No matching orders found' : 'No active orders'}
            description={
              isFiltered
                ? 'Try adjusting your search criteria or filter configuration.'
                : 'There are currently no orders placed in the system.'
            }
            action={
              isFiltered ? (
                <button
                  onClick={() => updateUrlParams(1, '', 'all', subDays(new Date(), 6), new Date())}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors duration-200"
                >
                  Clear filters
                </button>
              ) : null
            }
          />
        </div>
      ) : (
        /* 4. LIST DISPLAY STATE */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {orders.map(order => {
            const nextStatus = getNextStatus(order.status);
            const isUpdating = updatingOrderId === order.id;

            return (
              <div 
                key={order.id} 
                className={`bg-white dark:bg-slate-900 rounded-2xl border border-gray-200/80 dark:border-slate-800 shadow-sm hover:shadow-md flex flex-col overflow-hidden transition-all ${
                  isUpdating ? 'opacity-60 pointer-events-none' : ''
                }`}
              >
                <div className="p-4 flex-1 flex flex-col gap-4">
                  
                  {/* Header Section */}
                  <div className="flex justify-between items-start gap-3 border-b border-gray-100 dark:border-slate-800 pb-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold tracking-wider text-gray-400 dark:text-slate-500 uppercase">Order ID:</span>
                        <span className="font-mono font-bold text-gray-900 dark:text-white text-base">
                          #{order.order_number}
                        </span>
                        <StatusBadge status={order.status} />
                      </div>
                      
                      <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-slate-400">
                        <span className="font-medium text-gray-700 dark:text-slate-300 flex items-center gap-1">
                          <span className="text-xs font-bold uppercase text-gray-400 dark:text-slate-500">Table:</span>
                          {order.table?.id}
                        </span>
                        <span>•</span>
                        <div className="flex items-center gap-1 font-mono text-[11px]">
                          <Clock className="w-3 h-3 text-gray-400" />
                          <span>{formatTime(order.created_at)}</span>
                        </div>
                      </div>
                    </div>

                    <Link 
                      to={`/orders-details/${order.id}`}
                      className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors shrink-0"
                      title="View Order Details"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </div>

                  {/* Items Section */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold tracking-wider text-gray-400 dark:text-slate-500 uppercase">
                        Items Ordered
                      </span>
                      <span className="text-[11px] font-medium text-gray-400">
                        {order.items?.length} item(s)
                      </span>
                    </div>
                    
                    <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                      {order.items?.map(item => (
                        <div key={item.id} className="border-b border-gray-50 dark:border-slate-800 last:border-0 pb-2 last:pb-0">
                          <div className="flex justify-between items-start text-sm">
                            <span className="font-medium text-gray-900 dark:text-white">
                              {item.quantity}x {item.item_name}
                            </span>
                            <span className="font-mono text-gray-600 dark:text-slate-400">
                              {formatPrice(item.subtotal)}
                            </span>
                          </div>
                          
                          {item.modifiers && item.modifiers.length > 0 && (
                            <div className="mt-1 ml-4 space-y-0.5">
                              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500 block">
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

                          {/* Special Instructions Section */}
                          {item.special_instructions && (
                            <div className="mt-1.5 flex flex-col gap-0.5 text-[11px]">
                              <span className="text-[9px] font-bold uppercase tracking-wider text-amber-700/70 dark:text-amber-400/70">
                                Instruction:
                              </span>
                              <span className="text-xs">{item.special_instructions}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Note Section */}
                  {order.notes && (
                    <div className="text-xs text-gray-600 dark:text-slate-300 p-2.5 bg-blue-50/50 dark:bg-blue-950/20 rounded-lg border border-blue-100 dark:border-blue-900/30">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block mb-0.5">
                        Order Note
                      </span>
                      <span>{order.notes}</span>
                    </div>
                  )}
                </div>

                {/* Bottom Bar: Total & Actions */}
                <div className="p-3.5 bg-gray-50/80 dark:bg-slate-900/80 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold tracking-wider text-gray-400 dark:text-slate-500 uppercase">
                      Total
                    </span>
                    <span className="text-sm font-black text-gray-900 dark:text-white font-mono leading-tight">
                      {formatPrice(order.total_amount)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* Cancel Button - Only displays if status is pending */}
                    {order.status === 'pending' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'cancelled')}
                        disabled={isUpdating}
                        className="flex items-center gap-1 px-3 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/60 text-red-600 dark:text-red-400 text-xs font-semibold rounded-xl border border-red-200/60 dark:border-red-900/40 transition-all active:scale-95 disabled:opacity-50"
                        title="Cancel Order"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Cancel</span>
                      </button>
                    )}

                    {/* Next Workflow Action Button */}
                    {nextStatus && (
                      <button
                        onClick={() => updateOrderStatus(order.id, nextStatus)}
                        disabled={isUpdating}
                        className="flex items-center gap-1.5 px-3.5 py-2 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 disabled:bg-orange-400 text-white text-xs font-bold rounded-xl shadow-sm transition-all active:scale-95 min-w-[90px] justify-center"
                      >
                        {isUpdating ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <span>{getActionLabel(order.status)}</span>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && !error && orders.length > 0 && (
        <div className="flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={lastPage}
            totalRecords={totalItems}
            onPageChange={handlePageChange}
            maxVisible={5}
          />
        </div>
      )}
    </div>
  );
}