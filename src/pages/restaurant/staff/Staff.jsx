import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  UserPlus, Trash2, CheckCircle, 
  Users, AlertCircle, Mail, Search,
  Edit, Calendar, RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';

import StatsCard from '../../../components/cards/StatsCard';
import Toolbar from '../../../components/Toolbar';
import StatusBadge from '../../../components/common/StatusBadge'';
import Table from '../../../components/common/Table';
import Pagination from '../../../components/common/Pagination';
import ConfirmationModal from '../../../components/common/ConfirmationModal';

import api from '../../../services/api';
import RoleService from '../../../services/Roles';
import { formatDate } from '../../../utils/formatDate';

export default function StaffPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL-driven state
  const currentPage = Number(searchParams.get('page')) || 1;
  const searchQuery = searchParams.get('search') || '';
  const statusFilter = searchParams.get('status') || 'all';
  const roleFilter = searchParams.get('role') || 'all';
  const shiftTypeFilter = searchParams.get('shift_type') || 'all';

  // Local UI State
  const [roles, setRoles] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination State
  const [lastPage, setLastPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Statistics State
    const [stats, setStats] = useState({
       total: 0,
       active: 0,
      suspended: 0,
      on_leave: 0,
       inactive: 0,
       trash: 0
     });

  // Unified Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    staff: null,
    action: null, // 'trash' | 'restore' | 'forceDelete'
    isProcessing: false
  });

  // URL update helper
  const updateUrlParams = useCallback((newPage, newSearch, newStatus, newRole, newShift) => {
    const params = new URLSearchParams();
    if (newPage > 1) params.set('page', String(newPage));
    if (newSearch) params.set('search', newSearch);
    if (newStatus && newStatus !== 'all') params.set('status', newStatus);
    if (newRole && newRole !== 'all') params.set('role', newRole);
    if (newShift && newShift !== 'all') params.set('shift_type', newShift);
    setSearchParams(params, { replace: true });
  }, [setSearchParams]);

  // Fetch dynamic roles
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const fetchedRoles = await RoleService.getRoles();
        setRoles(fetchedRoles);
      } catch (err) {
        console.error('Failed to load roles for toolbar filter:', err);
      }
    };
    fetchRoles();
  }, []);

  // Fetch Staff Data
  const fetchStaff = useCallback(async () => {
    setLoading(true);
    setError(null);

    const params = {
      page: currentPage,
      per_page: 15,
    };

    if (searchQuery.trim() !== '') {
      params.search = searchQuery.trim();
    }
    if (roleFilter !== 'all') {
      params.role_id = roleFilter;
    }
    if (shiftTypeFilter !== 'all') {
      params.shift_type = shiftTypeFilter;
    }

    // Standardized Status Filter Alignment
    if (statusFilter === 'trash') {
      params.only_trashed = 1;
    } else if (statusFilter === 'all') {
      params.with_trashed = 1;
    } else {
      params.status = statusFilter;
    }

    try {
      const response = await api.get('/staff', { params });
      const responseData = response.data;

      setStaffList(responseData.data);
      
      const pagination = responseData.pagination;
      setLastPage(pagination?.last_page || 1);
      setTotalItems(pagination?.total || 0);
      setStats(responseData.stats);
    } catch (err) {
      setError(err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, roleFilter, statusFilter, shiftTypeFilter]);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  const handleSearchChange = (query) => {
    updateUrlParams(1, query, statusFilter, roleFilter, shiftTypeFilter);
  };

  const handleRoleFilterChange = (selectedRoleId) => {
    updateUrlParams(1, searchQuery, statusFilter, selectedRoleId || 'all', shiftTypeFilter);
  };

  const handleStatusFilterChange = (selectedStatus) => {
    updateUrlParams(1, searchQuery, selectedStatus || 'all', roleFilter, shiftTypeFilter);
  };

  const handleShiftTypeFilterChange = (selectedShift) => {
    updateUrlParams(1, searchQuery, statusFilter, roleFilter, selectedShift || 'all');
  };

  const isFiltered = Boolean(searchQuery || statusFilter !== 'all' || roleFilter !== 'all' || shiftTypeFilter !== 'all');

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= lastPage) {
      updateUrlParams(newPage, searchQuery, statusFilter, roleFilter, shiftTypeFilter);
    }
  };

  // --- UNIFIED CONFIRMATION MODAL HANDLERS ---
  const openConfirmModal = (staff, action) => {
    setConfirmModal({ isOpen: true, staff, action, isProcessing: false });
  };

  const closeConfirmModal = () => {
    if (!confirmModal.isProcessing) {
      setConfirmModal({ isOpen: false, staff: null, action: null, isProcessing: false });
    }
  };

  const handleConfirmAction = async () => {
    const { staff, action } = confirmModal;
    if (!staff || !action) return;

    setConfirmModal(prev => ({ ...prev, isProcessing: true }));

    try {
      if (action === 'trash') {
        const response = await api.delete(`/staff/${staff.id}`);
        toast.success(response?.data?.message || 'Staff member removed successfully');
      } else if (action === 'restore') {
        const response = await api.patch(`/staff/${staff.id}/restore`);
        toast.success(response?.data?.message || 'Staff member restored successfully');
      } else if (action === 'forceDelete') {
        const response = await api.delete(`/staff/${staff.id}/force`);
        toast.success(response?.data?.message || 'Staff member permanently deleted');
      }
      closeConfirmModal();
      fetchStaff();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
      setConfirmModal(prev => ({ ...prev, isProcessing: false }));
    }
  };

  const columns = [
    { label: 'ID', align: 'left' },
    { label: 'Employee', align: 'left' },
    { label: 'Roles', align: 'left' },
    { label: 'Shift Type', align: 'left' },
    { label: 'Started At', align: 'left' },
    { label: 'Status', align: 'left' },
    { label: 'Actions', align: 'right' },
  ];

  const renderRow = (staff) => {
    const isTrashed = Boolean(staff.deleted_at);
    return (
      <tr
        key={staff.id}
        className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors group border-b border-gray-100 dark:border-slate-800/60 last:border-none"
      >
        <td className="px-6 py-4 font-mono text-xs font-semibold text-gray-500 dark:text-slate-400">
          #{staff.id}
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 dark:text-white truncate">{staff.name}</p>
              <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                <span className="flex items-center gap-1 truncate">
                  <Mail className="w-3 h-3 shrink-0" /> {staff.email}
                </span>
              </div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 text-gray-700 dark:text-slate-300 font-medium">
          {staff.role?.name}
        </td>
        <td className="px-6 py-4 text-gray-700 dark:text-slate-300">
          {staff.shift_type}
        </td>
        <td className="px-6 py-4 text-gray-700 dark:text-slate-300">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-gray-700 dark:text-slate-300 text-xs font-medium">
            <Calendar className="w-3 h-3" /> {formatDate(staff.started_at)}
          </span>
        </td>
        <td className="px-6 py-4">
          <StatusBadge status={staff.status} />
        </td>
        <td className="px-6 py-4 text-right">
          <div className="flex items-center justify-end gap-1">
            {isTrashed ? (
              <>
                <button
                  onClick={() => openConfirmModal(staff, 'restore')}
                  className="p-2 rounded-lg text-emerald-600 hover:bg-emerald-100 dark:hover:bg-emerald-950/30 transition-colors"
                  title="Restore"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                {/* <button
                onClick={() => openConfirmModal(staff, 'forceDelete')}
                className="p-2 rounded-lg text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
                title="Permanently Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button> */}
              </>
            ) : (
              staff.role?.name !== 'manager' && (
                <>
                  <Link
                    to={`/staff/edit/${staff.id}`}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg text-gray-500 hover:text-blue-600 transition-colors inline-block"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => openConfirmModal(staff, 'trash')}
                    className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-gray-500 hover:text-red-600 transition-colors cursor-pointer"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )
            )}
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="p-1 sm:p-4 space-y-6 bg-gray-50 dark:bg-slate-950 min-h-screen text-gray-900 dark:text-slate-100 transition-colors duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent leading-tight">
            Staff Management
          </h1>
          <p className="text-md text-gray-500 dark:text-slate-400 mt-1">
            Manage your team members, roles, and operational shift statuses.
          </p>
        </div>
        <Link
          to="/staff/create"
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg text-sm font-medium transition-all shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 active:scale-[0.98]"
        >
          <UserPlus className="w-4 h-4" /> Add Staff
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatsCard label="Total Staff" value={loading && stats.total === 0 ? '...' : stats.total} />
        <StatsCard label="Active Staff" value={loading && stats.active === 0 ? '...' : stats.active} />
        <StatsCard label="Suspended" value={loading && stats.suspended === 0 ? '...' : (stats.suspended || 0)} />
        <StatsCard label="On Leave" value={loading && stats.on_leave === 0 ? '...' : (stats.on_leave || 0)} />
        <StatsCard label="Inactive" value={loading && stats.inactive === 0 ? '...' : stats.inactive} />
        <StatsCard label="Trash" value={loading && stats.trash === 0 ? '...' : stats.trash} />
      </div>

      {/* Toolbar */}
      <Toolbar
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search by name or email..."
        dropdowns={[
          {
            id: 'role-filter',
            placeholder: 'Role...',
            value: roleFilter,
            onChange: handleRoleFilterChange,
            options: [
              { label: 'All Roles', value: 'all' },
              ...roles.map((r) => ({ label: r.name, value: r.id })),
            ],
          },
          {
            id: 'shift-filter',
            placeholder: 'Shift...',
            value: shiftTypeFilter,
            onChange: handleShiftTypeFilterChange,
            options: [
              { label: 'All Shifts', value: 'all' },
              { label: 'Day Shift', value: 'day' },
              { label: 'Night Shift', value: 'night' },
            ],
          },
          {
            id: 'status-filter',
            placeholder: 'Status...',
            value: statusFilter,
            onChange: handleStatusFilterChange,
            options: [
              { label: 'All Statuses', value: 'all' },
              { label: 'Active', value: 'active' },
              { label: 'Suspended', value: 'suspended' },
              { label: 'On Leave', value: 'on_leave' },
              { label: 'Inactive', value: 'inactive' },
              { label: 'Trash', value: 'trash' },
            ],
          },
        ]}
      />

      {/* Staff Table & Reusable Pagination */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <Table
          columns={columns}
          data={staffList}
          renderRow={renderRow}
          loading={loading}
          error={error}
          onRetry={fetchStaff}
          emptyIcon={isFiltered ? Search : Users}
          emptyTitle={isFiltered ? 'No matching staff members' : 'No staff members registered'}
          emptyDescription={
            isFiltered
              ? 'No employees found matching standard search query or selected filter.'
              : 'Get started by onboarding team members to your workspace.'
          }
        />

        {!loading && !error && staffList.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={lastPage}
            totalRecords={totalItems}
            onPageChange={handlePageChange}
            maxVisible={5}
          />
        )}
      </div>

      {/* Unified Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={closeConfirmModal}
        onConfirm={handleConfirmAction}
        title={
          confirmModal.action === 'trash' ? 'Move Staff to Trash' :
          confirmModal.action === 'restore' ? 'Restore Staff Member' :
          'Permanently Delete Staff'
        }
        message={
          confirmModal.action === 'trash' ? (
            <>Are you sure you want to move <span className="font-bold text-slate-900 dark:text-slate-200">{confirmModal.staff?.name}</span> to the trash? They will lose access immediately, but can be restored later.</>
          ) : confirmModal.action === 'restore' ? (
            <>Are you sure you want to restore <span className="font-bold text-slate-900 dark:text-slate-200">{confirmModal.staff?.name}</span>? They will regain their previous access.</>
          ) : (
            <>Are you sure you want to <span className="font-bold text-rose-600">permanently delete</span> <span className="font-bold text-slate-900 dark:text-slate-200">{confirmModal.staff?.name}</span>? This action cannot be undone and will permanently destroy their record.</>
          )
        }
        isLoading={confirmModal.isProcessing}
        confirmText={
          confirmModal.action === 'trash' ? 'Move to Trash' :
          confirmModal.action === 'restore' ? 'Restore' :
          'Permanently Delete'
        }
        confirmClassName={
          confirmModal.action === 'forceDelete' 
            ? 'bg-rose-600 hover:bg-rose-700 text-white' 
            : 'bg-orange-600 hover:bg-orange-700 text-white'
        }
      />
    </div>
  );
}