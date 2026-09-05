import React from 'react';
import { 
  DollarSign, ShoppingCart, Users, Clock, TrendingUp, TrendingDown, 
  UtensilsCrossed, AlertCircle, ChefHat, MoreHorizontal, 
  ArrowUpRight, ArrowDownRight, Flame, Star, Activity
} from 'lucide-react';

// --- MOCK DATA ---
const KPI_STATS = [
  { 
    label: 'Today\'s Revenue', 
    value: '$4,285.50', 
    change: '+12.5%', 
    trend: 'up', 
    icon: DollarSign, 
    color: 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/20' 
  },
  { 
    label: 'Total Orders', 
    value: '142', 
    change: '+8.2%', 
    trend: 'up', 
    icon: ShoppingCart, 
    color: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20' 
  },
  { 
    label: 'Active Tables', 
    value: '18/24', 
    change: '-2.4%', 
    trend: 'down', 
    icon: Users, 
    color: 'text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/20' 
  },
  { 
    label: 'Pending Kitchen', 
    value: '7', 
    change: '+3', 
    trend: 'up', 
    icon: ChefHat, 
    color: 'text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/20' 
  },
];

const WEEKLY_REVENUE = [
  { day: 'Mon', value: 3200 },
  { day: 'Tue', value: 2800 },
  { day: 'Wed', value: 3500 },
  { day: 'Thu', value: 4100 },
  { day: 'Fri', value: 5200 },
  { day: 'Sat', value: 6800 },
  { day: 'Sun', value: 4285 }, // Today
];

const TOP_SELLING_ITEMS = [
  { id: 1, name: 'Truffle Mushroom Burger', category: 'Mains', sold: 48, revenue: 792, trend: 12 },
  { id: 2, name: 'Margherita Pizza', category: 'Mains', sold: 42, revenue: 588, trend: 5 },
  { id: 3, name: 'Iced Caramel Latte', category: 'Drinks', sold: 35, revenue: 175, trend: -2 },
  { id: 4, name: 'Caesar Salad', category: 'Starters', sold: 28, revenue: 336, trend: 8 },
];

const RECENT_ORDERS = [
  { id: 'ORD-9KJT7I', table: 'Table 1', time: '2 mins ago', status: 'pending', amount: 32.00 },
  { id: 'ORD-X48A1B', table: 'Table 3', time: '15 mins ago', status: 'preparing', amount: 24.50 },
  { id: 'ORD-L92C3D', table: 'Table 1', time: '45 mins ago', status: 'ready', amount: 15.00 },
  { id: 'ORD-M44E5F', table: 'Table 8', time: '1 hr ago', status: 'completed', amount: 86.50 },
];

const TABLE_STATUS = [
  { id: 1, status: 'occupied', time: '45m' },
  { id: 2, status: 'available', time: '' },
  { id: 3, status: 'occupied', time: '12m' },
  { id: 4, status: 'reserved', time: '7:00 PM' },
  { id: 5, status: 'available', time: '' },
  { id: 6, status: 'occupied', time: '1h 20m' },
  { id: 7, status: 'available', time: '' },
  { id: 8, status: 'occupied', time: '30m' },
];

const LOW_STOCK_ALERTS = [
  { item: 'Truffle Oil', remaining: '2 bottles', urgency: 'high' },
  { item: 'Brioche Buns', remaining: '12 units', urgency: 'medium' },
  { item: 'Oat Milk', remaining: '4 cartons', urgency: 'medium' },
];

export default function DashboardPage() {
  const maxRevenue = Math.max(...WEEKLY_REVENUE.map(d => d.value));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 p-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Activity className="w-6 h-6 text-orange-500" />
            Restaurant Dashboard
          </h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
            Welcome back! Here's what's happening at <span className="font-semibold text-gray-700 dark:text-slate-300">Cafe Bella</span> today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg text-sm text-gray-600 dark:text-slate-400 shadow-sm">
            <Clock className="w-4 h-4" />
            <span>Today, Sep 5, 2026</span>
          </div>
          <button className="p-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg text-gray-500 hover:text-orange-500 hover:border-orange-200 dark:hover:border-orange-900/50 transition-colors shadow-sm relative">
            <AlertCircle className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {KPI_STATS.map((stat) => (
          <div 
            key={stat.label} 
            className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2.5 rounded-lg ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-semibold ${
                stat.trend === 'up' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.change}
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-slate-400 mb-1">{stat.label}</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Revenue Chart */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Weekly Revenue</h3>
                <p className="text-sm text-gray-500 dark:text-slate-400">Total sales over the last 7 days</p>
              </div>
              <button className="text-gray-400 hover:text-gray-600 dark:hover:text-slate-300">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>

            {/* CSS Bar Chart */}
            <div className="flex items-end justify-between gap-2 sm:gap-4 h-48 pt-4 border-b border-gray-100 dark:border-slate-800">
              {WEEKLY_REVENUE.map((day) => {
                const heightPercent = (day.value / maxRevenue) * 100;
                const isToday = day.day === 'Sun';
                return (
                  <div key={day.day} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="relative w-full flex justify-center h-full items-end">
                      {/* Tooltip */}
                      <div className="absolute -top-8 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                        ${day.value}
                      </div>
                      {/* Bar */}
                      <div 
                        className={`w-full max-w-[40px] rounded-t-md transition-all duration-500 ${
                          isToday 
                            ? 'bg-orange-500 group-hover:bg-orange-600' 
                            : 'bg-gray-200 dark:bg-slate-700 group-hover:bg-orange-300 dark:group-hover:bg-orange-900/50'
                        }`}
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>
                    <span className={`text-xs font-medium ${isToday ? 'text-orange-600 dark:text-orange-400' : 'text-gray-500 dark:text-slate-400'}`}>
                      {day.day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Selling Items */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-500" /> Top Selling Items
                </h3>
                <p className="text-sm text-gray-500 dark:text-slate-400">Best performers today</p>
              </div>
            </div>

            <div className="space-y-4">
              {TOP_SELLING_ITEMS.map((item, index) => {
                const maxSold = TOP_SELLING_ITEMS[0].sold;
                const widthPercent = (item.sold / maxSold) * 100;
                
                return (
                  <div key={item.id} className="group">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 text-xs font-bold flex items-center justify-center">
                          {index + 1}
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-slate-400">{item.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900 dark:text-white">{item.sold} sold</p>
                        <p className="text-xs text-gray-500 dark:text-slate-400">${item.revenue}</p>
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="h-1.5 w-full bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-orange-500 rounded-full transition-all duration-1000"
                        style={{ width: `${widthPercent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (1/3) */}
        <div className="space-y-6">
          
          {/* Live Table Status */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Table Status</h3>
              <span className="text-xs font-medium text-gray-500 dark:text-slate-400">18/24 Occupied</span>
            </div>
            
            <div className="grid grid-cols-4 gap-2 mb-4">
              {TABLE_STATUS.map((table) => (
                <div 
                  key={table.id}
                  className={`aspect-square rounded-lg flex flex-col items-center justify-center text-xs font-bold border transition-all cursor-pointer hover:scale-105 ${
                    table.status === 'occupied' 
                      ? 'bg-orange-50 border-orange-200 text-orange-700 dark:bg-orange-900/20 dark:border-orange-800 dark:text-orange-400' 
                      : table.status === 'reserved'
                      ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400'
                      : 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400'
                  }`}
                >
                  <span>T{table.id}</span>
                  {table.time && <span className="text-[9px] font-normal opacity-75 mt-0.5">{table.time}</span>}
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-3 text-[11px] text-gray-500 dark:text-slate-400 pt-3 border-t border-gray-100 dark:border-slate-800">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-orange-500"></div> Occupied
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div> Available
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div> Reserved
              </div>
            </div>
          </div>

          {/* Recent Orders Feed */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Orders</h3>
              <button className="text-xs font-medium text-orange-600 dark:text-orange-400 hover:underline">View All</button>
            </div>

            <div className="space-y-3">
              {RECENT_ORDERS.map((order) => {
                const statusColors = {
                  pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400',
                  preparing: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
                  ready: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400',
                  completed: 'bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-slate-400',
                };

                return (
                  <div key={order.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-slate-800/50 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 flex items-center justify-center text-gray-500 dark:text-slate-400 group-hover:border-orange-200 dark:group-hover:border-orange-900/50 transition-colors">
                        <UtensilsCrossed className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white font-mono">{order.id}</p>
                        <p className="text-xs text-gray-500 dark:text-slate-400">{order.table} • {order.time}</p>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-1">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${statusColors[order.status]}`}>
                        {order.status}
                      </span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">${order.amount.toFixed(2)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Low Stock Alerts */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-red-200 dark:border-red-900/30 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Low Stock Alerts</h3>
            </div>
            <div className="space-y-3">
              {LOW_STOCK_ALERTS.map((alert, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20">
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{alert.item}</p>
                    <p className="text-xs text-red-600 dark:text-red-400">{alert.remaining} left</p>
                  </div>
                  <button className="text-xs font-medium text-red-700 dark:text-red-400 hover:underline px-2 py-1 rounded hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors">
                    Reorder
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}