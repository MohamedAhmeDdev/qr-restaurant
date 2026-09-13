import React from 'react';
import { Activity, MoreHorizontal, Clock } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const KPI_STATS = [
  { 
    label: "Today's Revenue", 
    value: '$4,285.50', 
    color: 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20' 
  },
  { 
    label: 'Total Orders', 
    value: '142', 
    color: 'text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20' 
  },
];

const WEEKLY_REVENUE = [
  { day: 'Mon', value: 3200 },
  { day: 'Tue', value: 2800 },
  { day: 'Wed', value: 3500 },
  { day: 'Thu', value: 4100 },
  { day: 'Fri', value: 5200 },
  { day: 'Sat', value: 6800 },
  { day: 'Sun', value: 4285 },
];

const CustomChartTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/90 dark:bg-slate-100/95 backdrop-blur-md text-white dark:text-slate-900 text-xs font-semibold px-3 py-2 rounded-xl shadow-xl border border-slate-700/50 dark:border-slate-300/50">
        <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">{label}</p>
        <p className="text-amber-400 dark:text-amber-600 font-bold text-sm mt-0.5">
          ${payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 sm:p-8 text-slate-800 dark:text-slate-100 font-sans antialiased">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2 border-b border-slate-200/60 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Restaurant Dashboard
              </h1>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Cafe Bella
            </p>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <div className="flex items-center gap-2 px-3.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full text-xs font-medium text-slate-600 dark:text-slate-400 shadow-sm">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Today, Sep 5, 2026</span>
            </div>
          </div>
        </header>

        {/* KPI Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {KPI_STATS.map((stat) => (
            <div 
              key={stat.label} 
              className="bg-white dark:bg-slate-900/80 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs hover:shadow-md transition-all duration-200"
            >
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5 tracking-tight">{stat.value}</h2>
            </div>
          ))}
        </section>

        {/* Revenue Chart */}
        <section className="bg-white dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs p-6 flex flex-col justify-between min-h-[380px]">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Weekly Revenue Trend</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Continuous earnings overview across the week</p>
            </div>
            <button className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>

          <div className="w-full h-72 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={WEEKLY_REVENUE} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.15)" />
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
                  dataKey="value" 
                  stroke="#f59e0b" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#revenueGradient)" 
                  activeDot={{ r: 6, fill: '#f59e0b', stroke: '#fff', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

      </div>
    </div>
  );
}