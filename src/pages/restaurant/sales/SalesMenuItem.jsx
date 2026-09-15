import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Download, Search, ChefHat, ArrowLeft 
} from 'lucide-react';

// ==========================================
// 1. DATA MODEL (copied from parent)
// ==========================================

const CURRENT_DATE = new Date();

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

const TRANSACTION_LOGS = [
  { id: 'tx-101', date: '2024-01-15', itemId: 'm1', quantity: 18, total: 333.00 },
  { id: 'tx-102', date: '2024-01-15', itemId: 'b1', quantity: 42, total: 231.00 },
  { id: 'tx-103', date: '2024-01-15', itemId: 's1', quantity: 20, total: 150.00 },
  { id: 'tx-104', date: '2024-01-15', itemId: 'm2', quantity: 14, total: 196.00 },
  { id: 'tx-099', date: '2024-01-14', itemId: 'm1', quantity: 24, total: 444.00 },
  { id: 'tx-100', date: '2024-01-14', itemId: 'm3', quantity: 12, total: 264.00 },
  { id: 'tx-105', date: '2024-01-14', itemId: 'b1', quantity: 38, total: 209.00 },
  { id: 'tx-106', date: '2024-01-14', itemId: 'b2', quantity: 15, total: 90.00 },
  { id: 'tx-095', date: '2024-01-13', itemId: 'm1', quantity: 30, total: 555.00 },
  { id: 'tx-096', date: '2024-01-13', itemId: 'm2', quantity: 22, total: 308.00 },
  { id: 'tx-097', date: '2024-01-13', itemId: 's1', quantity: 35, total: 262.50 },
  { id: 'tx-090', date: '2024-01-12', itemId: 'm1', quantity: 28, total: 518.00 },
  { id: 'tx-091', date: '2024-01-12', itemId: 'm3', quantity: 19, total: 418.00 },
  { id: 'tx-092', date: '2024-01-12', itemId: 'b1', quantity: 50, total: 275.00 },
  { id: 'tx-085', date: '2024-01-11', itemId: 'm2', quantity: 31, total: 434.00 },
  { id: 'tx-086', date: '2024-01-11', itemId: 's1', quantity: 28, total: 210.00 },
  { id: 'tx-080', date: '2024-01-10', itemId: 'm1', quantity: 35, total: 647.50 },
  { id: 'tx-081', date: '2024-01-10', itemId: 'b1', quantity: 60, total: 330.00 },
  { id: 'tx-082', date: '2024-01-10', itemId: 'd1', quantity: 8, total: 68.00 },
  { id: 'tx-075', date: '2024-01-09', itemId: 'm1', quantity: 22, total: 407.00 },
  { id: 'tx-076', date: '2024-01-09', itemId: 'm4', quantity: 4, total: 64.00 },
  { id: 'tx-050', date: '2024-01-03', itemId: 'm1', quantity: 40, total: 740.00 },
  { id: 'tx-051', date: '2023-12-28', itemId: 'm2', quantity: 50, total: 700.00 },
  { id: 'tx-052', date: '2023-12-21', itemId: 'b1', quantity: 80, total: 440.00 },
];

const STATUS_BADGES = {
  bestseller: { label: 'Best Seller' },
  popular: { label: 'Popular' },
  steady: { label: 'Steady'  },
  low: { label: 'Low Demand' },
  unsold: { label: 'Unsold (0)'},
};

// ==========================================
// 2. MAIN COMPONENT
// ==========================================

export default function SalesMenuItem() {
  const [isExporting, setIsExporting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // In a real app, these would come from props, context, or URL params
  const startDate = new Date('2024-01-09');
  const endDate = new Date('2024-01-15');

  const activeTransactions = useMemo(() => {
    return TRANSACTION_LOGS.filter((tx) => {
      const txDate = new Date(tx.date);
      return txDate >= startDate && txDate <= endDate;
    });
  }, [startDate, endDate]);

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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 font-sans antialiased selection:bg-amber-500 selection:text-slate-950">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Back Link */}
        <Link 
          to="/sales" 
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-amber-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Sales Dashboard
        </Link>

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

              {/* Export Button moved here */}
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-all duration-200 disabled:opacity-70 shadow-sm cursor-pointer"
              >
                {isExporting ? (
                  <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Download className="w-4 h-4 text-amber-400" />
                )}
                <span>Export</span>
              </button>
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
                        <td className="py-3.5 px-4 text-center font-bold font-mono">
                          ${item.revenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          {badge.label}
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