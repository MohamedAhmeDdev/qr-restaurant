import React, { useState, useMemo, forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { 
  DollarSign, ShoppingCart, TrendingUp, Download, ArrowUpRight, 
  ArrowDownRight, Sparkles, ChefHat, Search, AlertTriangle, 
  Calendar as CalendarIcon, RotateCcw, ChevronLeft, ChevronRight
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { 
  format, 
  subDays, 
  isWithinInterval, 
  startOfDay, 
  endOfDay, 
  parseISO,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  eachDayOfInterval,
  getYear,
  getMonth
} from 'date-fns';
import StatsCard from '../../components/cards/StatsCard';

// ==========================================
// 1. DATA MODEL
// ==========================================

const MENU_CATALOG = [
  { id: 'm1', name: 'Truffle Wagyu Burger', category: 'Mains', price: 18.50 },
  { id: 'm2', name: 'Classic Margherita Pizza', category: 'Mains', price: 14.00 },
  { id: 'm3', name: 'Grilled Salmon Bowl', category: 'Mains', price: 22.00 },
  { id: 'm4', name: 'Vegan Cauliflower Steak', category: 'Mains', price: 16.00 },
  { id: 'b1', name: 'Iced Caramel Macchiato', category: 'Beverages', price: 5.50 },
  { id: 'b2', name: 'Matcha Green Tea Latte', category: 'Beverages', price: 6.00 },
  { id: 's1', name: 'Truffle Parmesan Fries', category: 'Sides', price: 7.50 },
  { id: 'd1', name: 'Artisan Espresso Tiramisu', category: 'Desserts', price: 8.50 },
  { id: 'd2', name: 'Seasonal Fruit Tart', category: 'Desserts', price: 7.00 },
  { id: 'sp1', name: 'Spicy Lobster Bisque', category: 'Soup', price: 15.00 },
];

const CURRENT_DATE = new Date();

const TRANSACTION_LOGS = [
  { id: 'tx-101', date: format(CURRENT_DATE, 'yyyy-MM-dd'), itemId: 'm1', quantity: 18, total: 333.00 },
  { id: 'tx-102', date: format(CURRENT_DATE, 'yyyy-MM-dd'), itemId: 'b1', quantity: 42, total: 231.00 },
  { id: 'tx-103', date: format(CURRENT_DATE, 'yyyy-MM-dd'), itemId: 's1', quantity: 20, total: 150.00 },
  { id: 'tx-104', date: format(CURRENT_DATE, 'yyyy-MM-dd'), itemId: 'm2', quantity: 14, total: 196.00 },
  { id: 'tx-099', date: format(subDays(CURRENT_DATE, 1), 'yyyy-MM-dd'), itemId: 'm1', quantity: 24, total: 444.00 },
  { id: 'tx-100', date: format(subDays(CURRENT_DATE, 1), 'yyyy-MM-dd'), itemId: 'm3', quantity: 12, total: 264.00 },
  { id: 'tx-105', date: format(subDays(CURRENT_DATE, 1), 'yyyy-MM-dd'), itemId: 'b1', quantity: 38, total: 209.00 },
  { id: 'tx-106', date: format(subDays(CURRENT_DATE, 1), 'yyyy-MM-dd'), itemId: 'b2', quantity: 15, total: 90.00 },
  { id: 'tx-095', date: format(subDays(CURRENT_DATE, 2), 'yyyy-MM-dd'), itemId: 'm1', quantity: 30, total: 555.00 },
  { id: 'tx-096', date: format(subDays(CURRENT_DATE, 2), 'yyyy-MM-dd'), itemId: 'm2', quantity: 22, total: 308.00 },
  { id: 'tx-097', date: format(subDays(CURRENT_DATE, 2), 'yyyy-MM-dd'), itemId: 's1', quantity: 35, total: 262.50 },
  { id: 'tx-090', date: format(subDays(CURRENT_DATE, 3), 'yyyy-MM-dd'), itemId: 'm1', quantity: 28, total: 518.00 },
  { id: 'tx-091', date: format(subDays(CURRENT_DATE, 3), 'yyyy-MM-dd'), itemId: 'm3', quantity: 19, total: 418.00 },
  { id: 'tx-092', date: format(subDays(CURRENT_DATE, 3), 'yyyy-MM-dd'), itemId: 'b1', quantity: 50, total: 275.00 },
  { id: 'tx-085', date: format(subDays(CURRENT_DATE, 4), 'yyyy-MM-dd'), itemId: 'm2', quantity: 31, total: 434.00 },
  { id: 'tx-086', date: format(subDays(CURRENT_DATE, 4), 'yyyy-MM-dd'), itemId: 's1', quantity: 28, total: 210.00 },
  { id: 'tx-080', date: format(subDays(CURRENT_DATE, 5), 'yyyy-MM-dd'), itemId: 'm1', quantity: 35, total: 647.50 },
  { id: 'tx-081', date: format(subDays(CURRENT_DATE, 5), 'yyyy-MM-dd'), itemId: 'b1', quantity: 60, total: 330.00 },
  { id: 'tx-082', date: format(subDays(CURRENT_DATE, 5), 'yyyy-MM-dd'), itemId: 'd1', quantity: 8, total: 68.00 },
  { id: 'tx-075', date: format(subDays(CURRENT_DATE, 6), 'yyyy-MM-dd'), itemId: 'm1', quantity: 22, total: 407.00 },
  { id: 'tx-076', date: format(subDays(CURRENT_DATE, 6), 'yyyy-MM-dd'), itemId: 'm4', quantity: 4, total: 64.00 },
  { id: 'tx-050', date: format(subDays(CURRENT_DATE, 12), 'yyyy-MM-dd'), itemId: 'm1', quantity: 40, total: 740.00 },
  { id: 'tx-051', date: format(subDays(CURRENT_DATE, 18), 'yyyy-MM-dd'), itemId: 'm2', quantity: 50, total: 700.00 },
  { id: 'tx-052', date: format(subDays(CURRENT_DATE, 25), 'yyyy-MM-dd'), itemId: 'b1', quantity: 80, total: 440.00 },
];

const STATUS_BADGES = {
  bestseller: { label: 'Best Seller' },
  popular: { label: 'Popular' },
  steady: { label: 'Steady'  },
  low: { label: 'Low Demand' },
  unsold: { label: 'Unsold (0)'},
};

// ==========================================
// 2. AUXILIARY COMPONENTS
// ==========================================

const CustomChartTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900/95 backdrop-blur-md text-white text-xs font-semibold px-3 py-2.5 rounded-xl shadow-2xl border border-slate-700/60">
        <p className="text-[11px] text-slate-400 font-medium mb-1">{label}</p>
        <p className="text-amber-400 font-bold text-sm">
          ${payload[0].value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </p>
        <p className="text-[10px] text-slate-400 font-normal mt-0.5">
          {data.orders} total items sold
        </p>
      </div>
    );
  }
  return null;
};

// Clean Custom Input Button
const DateInputButton = forwardRef(({ value, onClick, label }, ref) => (
  <button
    type="button"
    ref={ref}
    onClick={onClick}
    className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer shadow-sm"
  >
    <CalendarIcon className="w-3.5 h-3.5 text-amber-400" />
    <span className="text-slate-400 font-sans font-medium">{label}:</span>
    <span className="text-white font-semibold">{value || 'Select Date'}</span>
  </button>
));

// ==========================================
// 3. MAIN DASHBOARD PAGE
// ==========================================

export default function SalesPage() {
  const [isExporting, setIsExporting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  // Date State initialized to Last 7 Days
  const [startDate, setStartDate] = useState(subDays(CURRENT_DATE, 6));
  const [endDate, setEndDate] = useState(CURRENT_DATE);

  // Month & Year range config for Header Dropdowns
  const years = Array.from({ length: 20 }, (_, i) => getYear(new Date()) - 10 + i);
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const applyPreset = (type) => {
    const now = new Date();
    if (type === 'today') {
      setStartDate(now);
      setEndDate(now);
    } else if (type === '7days') {
      setStartDate(subDays(now, 6));
      setEndDate(now);
    } else if (type === 'month') {
      setStartDate(startOfMonth(now));
      setEndDate(endOfMonth(now));
    } else if (type === 'year') {
      setStartDate(startOfYear(now));
      setEndDate(endOfYear(now));
    }
  };

  const activeTransactions = useMemo(() => {
    const start = startOfDay(startDate);
    const end = endOfDay(endDate);

    return TRANSACTION_LOGS.filter((tx) => {
      const txDate = parseISO(tx.date);
      return isWithinInterval(txDate, { start, end });
    });
  }, [startDate, endDate]);

  const chartTimelineData = useMemo(() => {
    if (startDate > endDate) return [];

    const daysInterval = eachDayOfInterval({ start: startDate, end: endDate });

    return daysInterval.map((dayDate) => {
      const dateKey = format(dayDate, 'yyyy-MM-dd');
      const dayTransactions = activeTransactions.filter(tx => tx.date === dateKey);

      const dayRevenue = dayTransactions.reduce((acc, curr) => acc + curr.total, 0);
      const dayOrders = dayTransactions.reduce((acc, curr) => acc + curr.quantity, 0);

      return {
        dateKey,
        day: format(dayDate, 'MMM dd'),
        revenue: dayRevenue,
        orders: dayOrders
      };
    });
  }, [startDate, endDate, activeTransactions]);

  const menuPerformanceData = useMemo(() => {
    return MENU_CATALOG.map((item) => {
      const itemTxLogs = activeTransactions.filter(tx => tx.itemId === item.id);
      const totalUnitsSold = itemTxLogs.reduce((acc, curr) => acc + curr.quantity, 0);
      const totalRevenue = itemTxLogs.reduce((acc, curr) => acc + curr.total, 0);

      let status = 'steady';
      if (totalUnitsSold === 0) status = 'unsold';
      else if (totalUnitsSold >= 100) status = 'bestseller';
      else if (totalUnitsSold >= 30) status = 'popular';
      else if (totalUnitsSold < 10) status = 'low';

      return {
        ...item,
        sold: totalUnitsSold,
        revenue: totalRevenue,
        status
      };
    });
  }, [activeTransactions]);

  const totalRevenue = activeTransactions.reduce((acc, curr) => acc + curr.total, 0);
  const totalItemsSold = activeTransactions.reduce((acc, curr) => acc + curr.quantity, 0);
  const averageOrderValue = activeTransactions.length > 0 ? totalRevenue / activeTransactions.length : 0;
  const unsoldItemsCount = menuPerformanceData.filter(i => i.sold === 0).length;

  const filteredMenuItems = menuPerformanceData.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' 
      ? true 
      : categoryFilter === 'unsold' 
        ? item.sold === 0 
        : item.category.toLowerCase() === categoryFilter.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
    }, 1200);
  };

  // Standard Light Header Component for DatePicker
  const renderCustomHeader = ({
    date,
    changeYear,
    changeMonth,
    decreaseMonth,
    increaseMonth,
    prevMonthButtonDisabled,
    nextMonthButtonDisabled,
  }) => (
    <div className="flex items-center justify-between px-3 py-2 bg-slate-100 border-b border-slate-200 rounded-t-lg">
      <button
        type="button"
        onClick={decreaseMonth}
        disabled={prevMonthButtonDisabled}
        className="p-1 rounded bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition-colors cursor-pointer"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <div className="flex items-center gap-1.5">
        <select
          value={months[getMonth(date)]}
          onChange={({ target: { value } }) => changeMonth(months.indexOf(value))}
          className="font-semibold text-xs bg-white text-slate-800 border border-slate-300 rounded px-2 py-1 outline-none cursor-pointer focus:ring-1 focus:ring-amber-500"
        >
          {months.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <select
          value={getYear(date)}
          onChange={({ target: { value } }) => changeYear(Number(value))}
          className="font-semibold text-xs bg-white text-slate-800 border border-slate-300 rounded px-2 py-1 outline-none cursor-pointer focus:ring-1 focus:ring-amber-500"
        >
          {years.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        onClick={increaseMonth}
        disabled={nextMonthButtonDisabled}
        className="p-1 rounded bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition-colors cursor-pointer"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-8 font-sans antialiased selection:bg-amber-500 selection:text-slate-950">

      <div className="relative space-y-8 max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
              Sales & Revenue
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Real-time calculated metrics aggregated directly from transaction store.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-all duration-200 disabled:opacity-70 shadow-sm w-full sm:w-auto cursor-pointer"
            >
              {isExporting ? (
                <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Download className="w-4 h-4 text-amber-400" />
              )}
              <span>Export Report</span>
            </button>
          </div>
        </div>

        {/* Date Controls Toolbar (z-50 guarantees calendar popup stays on top) */}
        <div className="relative z-50 flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 bg-slate-900/40 border border-slate-800/80 rounded-2xl backdrop-blur-md">
          
          <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mr-1">
              <CalendarIcon className="w-3.5 h-3.5 text-amber-400" />
              Preset:
            </span>
            <button 
              onClick={() => applyPreset('today')} 
              className="px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-xs font-medium text-slate-300 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
            >
              Today
            </button>
            <button 
              onClick={() => applyPreset('7days')} 
              className="px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-xs font-medium text-slate-300 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
            >
              Last 7 Days
            </button>
            <button 
              onClick={() => applyPreset('month')} 
              className="px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-xs font-medium text-slate-300 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
            >
              This Month
            </button>
            <button 
              onClick={() => applyPreset('year')} 
              className="px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-xs font-medium text-slate-300 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
            >
              This Year
            </button>
          </div>

          {/* Clean Light-Themed DatePickers */}
          <div className="flex items-center gap-2">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="yyyy-MM-dd"
              renderCustomHeader={renderCustomHeader}
              customInput={<DateInputButton label="From" />}
            />
            <span className="text-slate-600 font-bold text-xs">–</span>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              minDate={startDate}
              dateFormat="yyyy-MM-dd"
              renderCustomHeader={renderCustomHeader}
              customInput={<DateInputButton label="To" />}
            />

            <button 
              onClick={() => applyPreset('7days')}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-amber-400 border border-slate-700 transition-colors cursor-pointer shadow-sm"
              title="Reset range"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Dynamic KPI Cards */}
        <div className="relative z-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard 
            label="Total Revenue" 
            value={`$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          />
          <StatsCard 
            label="Avg Order Value" 
            value={`$${averageOrderValue.toFixed(2)}`}
          />
        </div>

        {/* Revenue Trend Area Chart */}
        <div className="relative z-0 bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 shadow-xl overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Revenue Trajectory
                <span className="text-xs font-normal px-2.5 py-0.5 rounded-full bg-slate-800 text-amber-400 border border-slate-700/50 font-mono">
                  {format(startDate, 'MMM dd, yyyy')} - {format(endDate, 'MMM dd, yyyy')}
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Aggregated daily earnings calculated from transaction logs</p>
            </div>
          </div>

          <div className="w-full h-72 pt-2">
            {chartTimelineData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartTimelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="salesRevenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.12)" />
                  <XAxis 
                    dataKey="day" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                    tickFormatter={(val) => `$${val}`}
                  />
                  <Tooltip content={<CustomChartTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#f59e0b" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#salesRevenueGradient)" 
                    activeDot={{ r: 6, fill: '#f59e0b', stroke: '#0f172a', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 text-xs">
                <CalendarIcon className="w-8 h-8 mb-2 opacity-50" />
                <span>No sales records found for the selected date range.</span>
              </div>
            )}
          </div>
        </div>

        {/* Menu Item Sales Performance Table */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Menu Sales Breakdown
                <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Itemized
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Dishes and drinks computed dynamically from selected date window</p>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input 
                  type="text"
                  placeholder="Search item or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-colors"
                />
              </div>

              <div className="flex items-center gap-1.5 p-1 bg-slate-950 border border-slate-800 rounded-xl text-xs font-medium">
                {['all', 'mains', 'beverages', 'unsold'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-lg capitalize transition-colors cursor-pointer ${
                      categoryFilter === cat 
                        ? 'bg-slate-800 text-amber-400 font-semibold' 
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
                  <th className="py-3.5 px-4 font-semibold">Menu Item</th>
                  <th className="py-3.5 px-4 font-semibold">Category</th>
                  <th className="py-3.5 px-4 font-semibold">Unit Price</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Units Sold</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Gross Revenue</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Calculated Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {filteredMenuItems.length > 0 ? (
                  filteredMenuItems.map((item) => {
                    const badge = STATUS_BADGES[item.status] || STATUS_BADGES.steady;
                    const isUnsold = item.sold === 0;

                    return (
                      <tr 
                        key={item.id} 
                        className={`hover:bg-slate-800/40 transition-colors ${isUnsold ? 'bg-rose-500/[0.02]' : ''}`}
                      >
                        <td className="py-3.5 px-4 font-semibold text-slate-100 flex items-center gap-2.5">
                          <div className={`p-1.5 rounded-lg ${isUnsold ? 'bg-rose-500/10 text-rose-400' : 'bg-slate-800 text-slate-400'}`}>
                            <ChefHat className="w-4 h-4" />
                          </div>
                          <span>{item.name}</span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-400 font-medium">
                          {item.category}
                        </td>
                        <td className="py-3.5 px-4 text-slate-300 font-mono">
                          ${item.price.toFixed(2)}
                        </td>
                        <td className="py-3.5 px-4 text-center font-bold font-mono">
                          <span className={isUnsold ? 'text-rose-400' : 'text-slate-200'}>
                            {item.sold}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right font-bold text-amber-400 font-mono">
                          ${item.revenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badge.style}`}>
                            {badge.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500 text-xs">
                      No menu items found matching your search filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>

      </div>
    </div>
  );
}