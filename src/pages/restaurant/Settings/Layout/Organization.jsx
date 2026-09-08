import React, { useState } from 'react';
import { Building2, Users, Shield, CreditCard, Trash2 } from 'lucide-react';
import { useAuth } from '../../../../contexts/AuthContext';
import OrganizationSidebar from './OrganizationsSidebar';

// Import your tab components
import OrganizationTab from '../Tabs/OrganizationTab'; 
import DeleteOrgTab from '../Tabs/DeleteOrgTab'; // Import the new Delete tab
import MembersTab from '../Tabs/MembersTab';

const TABS = [
  { id: 'profile', label: 'Organization profile', icon: Building2, category: 'Organization' },
  { id: 'members', label: 'Members & Teams', icon: Users, category: 'Organization' },
  // { id: 'billing', label: 'Billing & Plans', icon: CreditCard, category: 'Access & Security' },
  { id: 'delete', label: 'Delete organization', icon: Trash2, category: 'Danger Zone', isDanger: true },
];

// ... imports remain the same

export default function Organization() {
  const [activeTab, setActiveTab] = useState('profile');
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-gray-900 dark:text-slate-100 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* TOP ORGANIZATION HEADER */}
        <div className="flex items-center gap-3 pb-6 mb-6 border-b border-gray-200 dark:border-slate-800">
          <div className="w-10 h-10 rounded-lg bg-orange-500 text-white font-bold flex items-center justify-center text-lg shadow-sm shrink-0">
            {user?.organization_name?.[0]?.toUpperCase() || <Building2 className="w-5 h-5" />}
          </div>
          <div>
            <h1 className="text-lg font-semibold leading-tight text-gray-900 dark:text-white">
              {user?.organization_name || 'Organization Settings'}
            </h1>
            <p className="text-xs text-gray-500 dark:text-slate-400">
              Manage workspace details, members, security, and administrative actions
            </p>
          </div>
        </div>

        {/* MOBILE HORIZONTAL TABS */}
        <div className="flex lg:hidden border-b border-gray-200 dark:border-slate-800 space-x-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium transition-colors whitespace-nowrap rounded-md ${
                  isActive
                    ? tab.isDanger
                      ? 'bg-red-500/10 text-red-600 dark:text-red-400'
                      : 'bg-orange-500/10 text-orange-600 dark:text-orange-400'
                    : tab.isDanger
                      ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30'
                      : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* MAIN LAYOUT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* SIDEBAR */}
          <div className="hidden lg:block">
            <OrganizationSidebar tabs={TABS} activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>

          {/* MAIN CONTENT AREA: Added min-h-[600px] to prevent vertical jumping */}
          <main className="lg:col-span-3 min-h-[600px]">
            {activeTab === 'profile' && <OrganizationTab />}
              {activeTab === 'members' && <MembersTab />}
            {activeTab === 'delete' && <DeleteOrgTab />}
            
    
            {activeTab === 'billing' && (
              <div className="space-y-4 max-w-3xl">
                <h2 className="text-xl font-semibold border-b border-gray-200 dark:border-slate-800 pb-3">Billing & Plans</h2>
                <p className="text-sm text-gray-500 dark:text-slate-400">View current subscription plan and payment methods.</p>
              </div>
            )}
          </main>
        </div>

      </div>
    </div>
  );
}