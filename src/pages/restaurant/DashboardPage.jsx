import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import StatsCard from '../../components/cards/StatsCard';
import api from '../../services/api';
import { useFormatPrice } from '../../contexts/useFormatPrice';

const CustomChartTooltip = ({ active, payload, label, currency }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/90 dark:bg-slate-100/95 backdrop-blur-md text-white dark:text-slate-900 text-xs font-semibold px-3 py-2 rounded-xl shadow-xl border border-slate-700/50 dark:border-slate-300/50">
        <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">{label}</p>
        <p className="text-amber-400 dark:text-amber-600 font-bold text-sm mt-0.5">
          {currency} {payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { currency } = useFormatPrice();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get('/dashboard');
        setDashboardData(response.data.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const chartData = dashboardData?.weekly_revenue || [
    { day: 'Mon', value: 0 }, { day: 'Tue', value: 0 }, { day: 'Wed', value: 0 },
    { day: 'Thu', value: 0 }, { day: 'Fri', value: 0 }, { day: 'Sat', value: 0 }, { day: 'Sun', value: 0 }
  ];

  return (
    <div className="p-1 sm:p-4 space-y-6 bg-gray-50 dark:bg-slate-950 min-h-screen text-gray-900 dark:text-slate-100 transition-colors duration-200">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent leading-tight">
            Restaurant Dashboard
          </h1>
          <p className="text-md text-gray-500 dark:text-slate-400 mt-1">
            Cafe Bella
          </p>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          <div className="flex items-center gap-2 px-3.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full text-xs font-medium text-slate-600 dark:text-slate-400 shadow-sm">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Today, {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>
      </div>

      {/* KPI Cards using StatsCard */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatsCard
          label="Today's Revenue"
          value={
            loading
              ? '...'
              : `${currency} ${(dashboardData?.today_revenue ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
          }
        />
        <StatsCard
          label="Total Orders"
          value={loading ? '...' : (dashboardData?.today_orders ?? 0).toString()}
        />
      </section>

      {/* Revenue Chart */}
      <section className="bg-white dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs p-6 flex flex-col justify-between min-h-[380px]">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Weekly Revenue Trend</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Continuous earnings overview across the week</p>
          </div>
        </div>

        <div className="w-full h-72 pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                tickFormatter={(val) => `${currency} ${val}`}
              />
              <Tooltip content={<CustomChartTooltip currency={currency} />} />
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
  );
}