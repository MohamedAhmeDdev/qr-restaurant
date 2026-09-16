import React, { useState, useEffect, useMemo, useCallback, forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  Download, ChefHat, Search, AlertCircle,
  Calendar as CalendarIcon, RotateCcw, ChevronLeft, ChevronRight,
  Utensils
} from 'lucide-react';
import {
  format, subDays, startOfMonth, endOfMonth, startOfYear, 
  endOfYear, getYear, getMonth
} from 'date-fns';
import { useSearchParams } from 'react-router-dom';
import StatsCard from '../../../components/cards/StatsCard';
import Toolbar from '../../../components/Toolbar';
import Table from '../../../components/Table';
import Pagination from '../../../components/common/Pagination';
import api from '../../../services/api';
import CategoriesService from '../../../services/categories';
import { useFormatPrice } from '../../../contexts/useFormatPrice';


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

export default function SalesPage() {
  const { formatPrice, currency } = useFormatPrice();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isExporting, setIsExporting] = useState(false);
  const [categories, setCategories] = useState([]);

  // ✅ 1. URL-driven state including page
  const currentPage = Number(searchParams.get('page')) || 1;
  const searchTerm = searchParams.get('search') || '';
  const categoryFilter = searchParams.get('category') || 'all';
  const urlStartDate = searchParams.get('start_date');
  const urlEndDate = searchParams.get('end_date');

  const startDate = useMemo(() => urlStartDate ? new Date(urlStartDate) : subDays(new Date(), 6), [urlStartDate]);
  const endDate = useMemo(() => urlEndDate ? new Date(urlEndDate) : new Date(), [urlEndDate]);

  // Data & State Flags
  const [salesStats, setSalesStats] = useState({ total_revenue: 0, total_orders: 0, average_order_value: 0 });
  const [menuItems, setMenuItems] = useState([]);
  const [lastPage, setLastPage] = useState(1);       
  const [totalItems, setTotalItems] = useState(0); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const years = Array.from({ length: 20 }, (_, i) => getYear(new Date()) - 10 + i);
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // ✅ 2. Updated URL helper to include page
  const updateUrlParams = useCallback((newPage, newSearch, newCategory, newStartDate, newEndDate) => {
    const params = new URLSearchParams();
    if (newPage > 1) params.set('page', String(newPage));
    if (newSearch) params.set('search', newSearch);
    if (newCategory && newCategory !== 'all') params.set('category', newCategory);
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
    else if (type === 'month') { newStart = startOfMonth(now); newEnd = endOfMonth(now); } 
    else if (type === 'year') { newStart = startOfYear(now); newEnd = endOfYear(now); }

    updateUrlParams(1, searchTerm, categoryFilter, newStart, newEnd);
  };

  useEffect(() => {
    CategoriesService.getCategories()
      .then((data) => setCategories(data || []))
      .catch((err) => console.error("Failed to load categories", err));
  }, []);
    

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: currentPage,
        per_page: 15,
        start_date: urlStartDate || format(subDays(new Date(), 6), 'yyyy-MM-dd'),
        end_date: urlEndDate || format(new Date(), 'yyyy-MM-dd'),
      };

      // Send search and category to backend so pagination totals are accurate
      if (searchTerm) params.search = searchTerm;
      if (categoryFilter && categoryFilter !== 'all') params.category = categoryFilter;

      const [statsRes, itemsRes] = await Promise.all([
        api.get('/sales/stats', { params }),
        api.get('/sales/menu-items', { params })
      ]);

      setSalesStats(statsRes.data?.data?.stats);
      
      const itemsData = itemsRes.data;
      setMenuItems(itemsData.data);
      setLastPage(itemsData.pagination?.last_page);
      setTotalItems(itemsData.pagination?.total);

    } catch (err) {
      console.error("Failed to fetch sales data", err);
      setError(err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  }, [currentPage, urlStartDate, urlEndDate, searchTerm, categoryFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ✅ 4. Handlers reset page to 1 when filters change
  const handleSearchChange = (query) => {
    updateUrlParams(1, query, categoryFilter, startDate, endDate);
  };

  const handleCategoryFilterChange = (category) => {
    updateUrlParams(1, searchTerm, category || 'all', startDate, endDate);
  };

  const handlePageChange = (newPage) => {
    updateUrlParams(newPage, searchTerm, categoryFilter, startDate, endDate);
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
        <select value={months[getMonth(date)]} onChange={({ target: { value } }) => changeMonth(months.indexOf(value))} className="font-semibold text-xs bg-white text-slate-800 border border-slate-300 rounded px-2 py-1 outline-none cursor-pointer focus:ring-1 focus:ring-amber-500">
          {months.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
        <select value={getYear(date)} onChange={({ target: { value } }) => changeYear(Number(value))} className="font-semibold text-xs bg-white text-slate-800 border border-slate-300 rounded px-2 py-1 outline-none cursor-pointer focus:ring-1 focus:ring-amber-500">
          {years.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
      </div>
      <button type="button" onClick={increaseMonth} disabled={nextMonthButtonDisabled} className="p-1 rounded bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition-colors cursor-pointer">
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );

  const columns = [
    { label: 'Menu Item' },
    { label: 'Category' },
    { label: 'Unit Price' },
    { label: 'Units Sold', align: 'right' },
    { label: 'Gross Revenue', align: 'right' },
    { label: 'Calculated Status' },
  ];


  const renderRow = (item) => {
    const isUnsold = item.sold === 0;
    return (
      <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 border-b border-gray-100 dark:border-slate-800 transition-colors">
        <td className="px-6 py-4 font-semibold text-gray-800 dark:text-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-orange-50 dark:bg-slate-800 text-orange-500 dark:text-orange-400">
              <ChefHat className="w-4 h-4" />
            </div>
            <span>{item.name}</span>
          </div>
        </td>
        <td className="px-6 py-4 text-gray-500 dark:text-slate-400 font-medium capitalize">{item.category}</td>
        <td className="px-6 py-4 text-gray-700 dark:text-slate-300 font-mono">{formatPrice(item.price)}</td>
        <td className="px-6 py-4 text-right font-bold font-mono">
          <span className={isUnsold ? 'text-rose-600 dark:text-rose-400' : 'text-gray-800 dark:text-slate-200'}>{item.sold}</span>
        </td>
        <td className="px-6 py-4 text-right font-bold font-mono text-gray-900 dark:text-slate-100">
          {currency} {item.revenue?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </td>
        <td className="px-6 py-4">{item.status}</td>
      </tr>
    );
  };

  const isFiltered = Boolean(searchTerm || categoryFilter !== 'all');

    const handleExport = async () => {
    setIsExporting(true);
    try {
      // 1. Prepare parameters to fetch ALL filtered data (bypassing pagination)
      const exportParams = {
        per_page: 10000, // Adjust this number based on your API's maximum limit, or use a dedicated export endpoint if available
        start_date: urlStartDate || format(subDays(new Date(), 6), 'yyyy-MM-dd'),
        end_date: urlEndDate || format(new Date(), 'yyyy-MM-dd'),
      };

      if (searchTerm) exportParams.search = searchTerm;
      if (categoryFilter && categoryFilter !== 'all') exportParams.category = categoryFilter;

      // 2. Fetch the data
      const response = await api.get('/sales/menu-items', { params: exportParams });
      const dataToExport = response.data?.data || [];

      if (dataToExport.length === 0) {
        alert("No data available to export for the selected filters.");
        return;
      }

      // 3. Define CSV headers
      const headers = ['Menu Item', 'Category', 'Unit Price', 'Units Sold', 'Gross Revenue', 'Calculated Status'];
      
      // 4. Map data to CSV rows with proper escaping for commas/quotes
      const rows = dataToExport.map(item => [
        `"${(item.name || '').replace(/"/g, '""')}"`,
        `"${(item.category || '').replace(/"/g, '""')}"`,
        item.price || 0,
        item.sold || 0,
        item.revenue || 0,
        `"${(item.status || '').replace(/"/g, '""')}"`
      ]);

      // 5. Combine headers and rows into a single CSV string
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');

      // 6. Create Blob and trigger download
      const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' }); // \uFEFF adds BOM for Excel compatibility
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Generate a descriptive filename
      const fileName = `sales_report_${exportParams.start_date}_to_${exportParams.end_date}.csv`;
      link.setAttribute('download', fileName);
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (err) {
      console.error("Failed to export sales data", err);
      alert("Failed to export report. Please check your connection and try again.");
    } finally {
      setIsExporting(false);
    }
  };
  return (
    <div className="p-2 sm:p-4 space-y-6 bg-gray-50 dark:bg-slate-950 min-h-screen text-gray-900 dark:text-slate-100 transition-colors duration-200">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">Menu Sales Breakdown</h1>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Dishes and drinks revenue computed dynamically from your selected date window.</p>
        </div>
        <button onClick={handleExport} disabled={isExporting} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-orange-500/30 active:scale-[0.98] disabled:opacity-70 cursor-pointer">
          {isExporting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Download className="w-4 h-4" />}
          <span>Export Report</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatsCard label="Total Revenue" value={loading ? '...' : `${currency} ${salesStats.total_revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} />
      <StatsCard label="Avg Order Value" value={loading ? '...' : `${currency} ${salesStats.average_order_value.toFixed(2)}`} />
        <StatsCard label="Total Orders" value={loading ? '...' : salesStats.total_orders} />
      </div>

      {/* Toolbar */}
      <Toolbar
        searchQuery={searchTerm}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search menu items or categories..."
        dropdowns={[
          {
            id: 'category-filter',
            placeholder: 'Category...',
            value: categoryFilter,
            onChange: handleCategoryFilterChange,
            options: [
              { label: 'All Categories', value: 'all' },
              { label: 'Unsold', value: 'unsold' },
              ...categories.map((cat) => ({ label: cat.name, value: cat.name })),
            ],
          },
        ]}
      />

      {/* Date Range Picker Controls */}
      <div className="relative z-50 flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
          <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 flex items-center gap-1.5 mr-1">
            <CalendarIcon className="w-3.5 h-3.5 text-orange-500" /> Preset:
          </span>
          <button onClick={() => applyPreset('today')} className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-medium text-gray-700 dark:text-slate-300 transition-colors cursor-pointer">Today</button>
          <button onClick={() => applyPreset('7days')} className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-medium text-gray-700 dark:text-slate-300 transition-colors cursor-pointer">Last 7 Days</button>
          <button onClick={() => applyPreset('month')} className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-medium text-gray-700 dark:text-slate-300 transition-colors cursor-pointer">This Month</button>
          <button onClick={() => applyPreset('year')} className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-medium text-gray-700 dark:text-slate-300 transition-colors cursor-pointer">This Year</button>
        </div>

        <div className="flex items-center gap-2">
          <DatePicker selected={startDate} onChange={(date) => updateUrlParams(1, searchTerm, categoryFilter, date, endDate)} dateFormat="yyyy-MM-dd" renderCustomHeader={renderCustomHeader} customInput={<DateInputButton label="From" />} />
          <span className="text-gray-400 font-bold text-xs">–</span>
          <DatePicker selected={endDate} onChange={(date) => updateUrlParams(1, searchTerm, categoryFilter, startDate, date)} minDate={startDate} dateFormat="yyyy-MM-dd" renderCustomHeader={renderCustomHeader} customInput={<DateInputButton label="To" />} />
          <button onClick={() => applyPreset('7days')} className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-500 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors cursor-pointer shadow-sm" title="Reset range">
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <Table
          columns={columns}
          data={menuItems} 
          renderRow={renderRow}
          loading={loading}
          error={error}
          onRetry={fetchData}
          emptyIcon={isFiltered ? Search : Utensils}
          emptyTitle={isFiltered ? "No matching menu items" : "No sales data found"}
          emptyDescription={isFiltered ? "No menu items match your search term or category filter." : "No sales recorded during this date window."}
        />
        
        {/* ✅ 5. Pagination Component */}
        {!loading && !error && menuItems.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={lastPage}
              totalRecords={totalItems}
              onPageChange={handlePageChange}
              maxVisible={5}
            />
        )}
      </div>
    </div>
  );
}