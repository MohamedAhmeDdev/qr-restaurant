// AdminList.jsx
import React, { useState, useMemo } from 'react';
import {
  UserPlus,
  Mail,
  Shield,
  Building2,
  CheckCircle,
  XCircle,
  Power,
  Trash2
} from 'lucide-react';
import RestaurantInviteModal from '../../components/modal/RestaurantInviteModal';
import StatsCard from '../../components/cards/StatsCard';
import Toolbar from '../../components/Toolbar';
import Tables from '../../components/ui/Table';
import StatusBadge from '../../components/ui/StatusBadge';

export default function AdminList() {
  const [admins, setAdmins] = useState([
    { id: 1, name: 'Sarah Jenkins', email: 'sarah.j@platform.com', role: 'Super Admin', status: 'Active', organization: 'Platform HQ', initials: 'SJ' },
    { id: 2, name: 'Michael Chen', email: 'm.chen@foodiegroup.com', role: 'Organization Admin', status: 'Active', organization: 'Foodie Group LLC', initials: 'MC' },
    { id: 3, name: 'Elena Rostova', email: 'elena@bistroholdings.com', role: 'Organization Admin', status: 'Active', organization: 'Bistro Holdings', initials: 'ER' },
    { id: 4, name: 'David Vance', email: 'd.vance@quickeats.com', role: 'Support Admin', status: 'Suspended', organization: 'Quick Eats Inc', initials: 'DV' },
    { id: 5, name: 'Amara Patel', email: 'amara@platform.com', role: 'Super Admin', status: 'Active', organization: 'Platform HQ', initials: 'AP' },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const handleToggleStatus = (id) => {
    setAdmins((prev) =>
      prev.map((admin) =>
        admin.id === id ? { ...admin, status: admin.status === 'Active' ? 'Suspended' : 'Active' } : admin
      )
    );
  };

  const handleDeleteAdmin = (id) => {
    if (window.confirm('Are you sure you want to remove this administrator?')) {
      setAdmins((prev) => prev.filter((admin) => admin.id !== id));
    }
  };

  const filteredAdmins = useMemo(() => {
    return admins.filter((admin) => {
      const matchesSearch =
        admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        admin.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        admin.organization.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === 'All' || admin.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [admins, searchQuery, roleFilter]);

  // Table columns configuration
  const columns = [
    { label: 'User' },
    { label: 'Role' },
    { label: 'Organization' },
    { label: 'Status' },
    { label: 'Actions', align: 'right' }
  ];

  // Render function for each admin row
  const renderAdminRow = (admin) => {
    const getRoleStyles = (role) => {
      switch (role) {
        case 'Super Admin':
          return 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border border-purple-200 dark:border-purple-900';
        case 'Organization Admin':
          return 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-900';
        case 'Support Admin':
          return 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-900';
        default:
          return '';
      }
    };

    return (
      <tr key={admin.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/60 transition-colors duration-200">
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-sm">
              {admin.initials}
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-slate-100 transition-colors duration-200">{admin.name}</p>
              <p className="text-xs text-gray-500 dark:text-slate-400 flex items-center gap-1 transition-colors duration-200">
                <Mail className="w-3 h-3" /> {admin.email}
              </p>
            </div>
          </div>
        </td>

        <td className="px-6 py-4">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${getRoleStyles(admin.role)}`}
          >
            <Shield className="w-3 h-3" />
            {admin.role}
          </span>
        </td>

        <td className="px-6 py-4 text-xs font-medium text-gray-600 dark:text-slate-300 transition-colors duration-200">
          <div className="flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-gray-400 dark:text-slate-500 transition-colors duration-200" />
            {admin.organization}
          </div>
        </td>

       <td className="px-6 py-4">
  <StatusBadge
    status={admin.status} 
    activeLabel="Active"
    inactiveLabel="Suspended"
  />
</td>

        <td className="px-6 py-4 text-right">
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => handleToggleStatus(admin.id)}
              title={admin.status === 'Active' ? 'Suspend Admin' : 'Activate Admin'}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                admin.status === 'Active'
                  ? 'text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-950'
                  : 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-950'
              }`}
            >
              <Power className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleDeleteAdmin(admin.id)}
              title="Remove Admin"
              className="p-2 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-950 rounded-lg transition-colors duration-200"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="p-2 sm:p-4 space-y-6 bg-gray-50 dark:bg-slate-950 min-h-screen text-gray-900 dark:text-slate-100 transition-colors duration-200">
      
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-200">Admin Users</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 transition-colors duration-200">
            Manage administrator privileges and platform access.
          </p>
        </div>

        <button
          onClick={() => setIsInviteModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors duration-200 shadow-sm"
        >
          <UserPlus className="w-4 h-4" /> Invite Restaurant
        </button>
      </div>

      {/* SUMMARY METRICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard label="Total Administrators" value={admins.length} />
        <StatsCard 
          label="Super Admins" 
          value={admins.filter((a) => a.role === 'Super Admin').length} 
          valueColor="text-blue-600 dark:text-blue-400"
        />
        <StatsCard 
          label="Active Admins" 
          value={admins.filter((a) => a.status === 'Active').length} 
          valueColor="text-green-600 dark:text-green-400"
        />
      </div>

      {/* TABLE CONTAINER */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors duration-200">
        
        <Toolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search admins or emails..."
          filters={['All', 'Super Admin', 'Organization Admin', 'Support Admin']}
          activeFilter={roleFilter}
          onFilterChange={setRoleFilter}
        />

        <Tables
          columns={columns}
          data={filteredAdmins}
          renderRow={renderAdminRow}
          emptyMessage="No administrators match your search/filters."
        />

      </div>

      {/* RENDER MODAL OVERLAY */}
      <RestaurantInviteModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
      />
    </div>
  );
}