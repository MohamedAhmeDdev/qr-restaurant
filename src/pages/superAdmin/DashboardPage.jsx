import React from 'react';
import { Building2, Users, Utensils, Activity, TrendingUp, MoreHorizontal } from 'lucide-react';

export default function DashboardPage() {
  const stats = [
    { name: 'Total Tenants', value: '12', icon: Building2, change: '+2 this month', color: 'text-blue-600 bg-blue-50' },
    { name: 'Active Restaurants', value: '48', icon: Utensils, change: '+5 this week', color: 'text-orange-600 bg-orange-50' },
    { name: 'Admin Users', value: '156', icon: Users, change: '+12 today', color: 'text-purple-600 bg-purple-50' },
    { name: 'System Health', value: '99.9%', icon: Activity, change: 'Operational', color: 'text-green-600 bg-green-50' },
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-slate-950 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Super Admin Dashboard</h1>
          <p className="text-gray-500 dark:text-slate-400">Welcome back, manage your platform ecosystem.</p>
        </div>
        <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors shadow-sm">
          Generate Report
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <MoreHorizontal className="w-5 h-5 text-gray-400" />
            </div>
            <h3 className="text-gray-500 dark:text-slate-400 text-sm font-medium">{stat.name}</h3>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</span>
              <span className="text-xs text-green-600 font-medium flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" /> {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity / Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Platform Growth</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-slate-800/50 rounded-lg border border-dashed border-gray-300 dark:border-slate-700">
            <span className="text-gray-400 text-sm">Analytics Chart Component Goes Here</span>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Tenants</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-3 pb-3 border-b border-gray-100 dark:border-slate-800 last:border-0">
                <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                  T{i}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Tenant Corp {i}</p>
                  <p className="text-xs text-gray-500">Joined 2 days ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}