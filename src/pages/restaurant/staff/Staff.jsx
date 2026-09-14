import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  UserPlus, Trash2, CheckCircle, 
  Users, AlertCircle, Mail, Search,
  Edit, Calendar
} from 'lucide-react';
import toast from 'react-hot-toast';

import StatsCard from '../../../components/cards/StatsCard';
import Toolbar from '../../../components/Toolbar';
import StatusBadge from '../../../components/StatusBadge';
import Table from '../../../components/Table';
import Pagination from '../../../components/common/Pagination';
import ConfirmationModal from '../../../components/common/ConfirmationModal';

import api from '../../../services/api';
import RoleService from '../../../services/Roles';
import { formatDate } from '../../../utils/formatDate';

export default function StaffPage() {
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [roles, setRoles] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Statistics State
  const [stats, setStats] = useState({ total: 0, active: 0 });

  // Modal Delete State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

    try {
      const res = await api.get('/staff', { params });
      const paginatedData = res.data;

      setStaffList(paginatedData.data);
      setCurrentPage(paginatedData.current_page || 1);
      setLastPage(paginatedData.last_page || 1);
      setTotalItems(paginatedData.total || 0);
      setStats({
        total: res.data.stats?.total ?? 0,
        active: res.data.stats?.active ?? 0,
      });
    } catch (err) {
      setError(err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, roleFilter]);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleRoleFilterChange = (selectedRoleName) => {
    if (selectedRoleName === 'All Roles') {
      setRoleFilter('all');
    } else {
      const selected = roles.find((r) => r.name === selectedRoleName);
      setRoleFilter(selected ? selected.id : 'all');
    }
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= lastPage) {
      setCurrentPage(newPage);
    }
  };

  // Open delete confirmation modal
  const handleOpenDeleteModal = (staff) => {
    setStaffToDelete(staff);
    setIsDeleteModalOpen(true);
  };

  // Confirm delete handler
  const handleConfirmDelete = async () => {
    if (!staffToDelete) return;
    setIsDeleting(true);
    try {
      await api.delete(`/staff/${staffToDelete.id}`);
      toast.success('Staff member removed successfully');
      setIsDeleteModalOpen(false);
      setStaffToDelete(null);
      await fetchStaff();
    } catch (err) {
      console.error('Failed to delete staff member:', err);
      toast.error('Failed to delete staff member');
    } finally {
      setIsDeleting(false);
    }
  };

  const formatShiftType = (shift) => {
    if (!shift) return 'N/A';
    return shift.replace('_', ' ').replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const currentActiveFilterLabel =
    roleFilter === 'all'
      ? 'All Roles'
      : roles.find((r) => r.id === roleFilter)?.name || 'All Roles';

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
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-white flex items-center justify-center font-bold text-sm shadow-sm shrink-0">
              {staff.name ? staff.name.split(' ').map((n) => n[0]).join('') : 'U'}
            </div>
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
          {formatShiftType(staff.shift_type)}
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
          {staff.role?.name !== 'manager' && (
            <div className="flex items-center justify-end gap-1">
              <Link
                to={`/staff/edit/${staff.id}`}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg text-gray-500 hover:text-blue-600 transition-colors inline-block"
                title="Edit"
              >
                <Edit className="w-4 h-4" />
              </Link>
              <button
                onClick={() => handleOpenDeleteModal(staff)}
                className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-gray-500 hover:text-red-600 transition-colors cursor-pointer"
                title="Remove"
              >
              <Trash2 className="w-4 h-4" />
              </button>
          </div>
          )}
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard
          label="Total Staff"
          value={loading ? '...' : stats.total}
        />
        <StatsCard
          label="Active Staff"
          value={loading ? '...' : stats.active}
        />
        <StatsCard
          label="Inactive Staff"
          value={loading ? '...' : stats.total - stats.active}
        />
      </div>

      {/* Toolbar */}
      <Toolbar
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search by name or email..."
        filters={['All Roles', ...roles.map((r) => r.name)]}
        activeFilter={currentActiveFilterLabel}
        onFilterChange={handleRoleFilterChange}
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
          emptyIcon={searchQuery || roleFilter !== 'all' ? Search : Users}
          emptyTitle={
            searchQuery || roleFilter !== 'all'
              ? 'No matching staff members'
              : 'No staff members registered'
          }
          emptyDescription={
            searchQuery || roleFilter !== 'all'
              ? 'No employees found matching standard search query or selected role.'
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

      {/* Reusable Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          if (!isDeleting) {
            setIsDeleteModalOpen(false);
            setStaffToDelete(null);
          }
        }}
        onConfirm={handleConfirmDelete}
        title="Remove Staff Member"
        message={
          <>
            Are you sure you want to delete the{' '}
            <span className="font-bold text-slate-900 dark:text-slate-200">
              {staffToDelete?.name}
            </span>{' '}
            staff member? This action cannot be undone.
          </>
        }
        isLoading={isDeleting}
        confirmText="Remove"
      />
    </div>
  );
}