import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  KeyRound,
  Trash2,
  Edit,
  PlusCircle,
  Loader2,
  AlertCircle,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import StatsCard from '../../../components/cards/StatsCard';
import Toolbar from '../../../components/Toolbar';
import EmptyState from '../../../components/common/EmptyState';

import api from '../../../services/api';
import permissionService from '../../../services/permissionService';
import toast from 'react-hot-toast';
import ConfirmationModal from '../../../components/common/ConfirmationModal';

export default function PermissionsPage() {
  const [groupedPermissions, setGroupedPermissions] = useState({});
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  
  // Debounced search query to avoid firing on every keystroke
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  // Groups from API (for the filter dropdown)
  const [groups, setGroups] = useState([]);
  const [groupsLoading, setGroupsLoading] = useState(true);
  
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch permissions from backend with search + group filter
  const fetchPermissions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = { grouped: true };
      if (debouncedSearch.trim()) {
        params.search = debouncedSearch.trim();
      }
      if (categoryFilter !== 'All') {
        params.group = categoryFilter;
      }
      
      const response = await api.get('/permissions', { params });
      const data = response.data?.data || {};
      setGroupedPermissions(data);
      
      const total = Object.values(data).reduce(
        (sum, arr) => sum + (Array.isArray(arr) ? arr.length : 0),
        0
      );
      setTotalCount(total);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load permissions.');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, categoryFilter]);

  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  // Fetch distinct groups for the category filter
  const fetchGroups = useCallback(async () => {
    try {
      setGroupsLoading(true);
      const data = await permissionService.getGroups();
      setGroups(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch categories.');
    } finally {
      setGroupsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  // Open delete confirmation modal
  const handleDeleteClick = (perm) => {
    setSelectedPermission(perm);
    setModalOpen(true);
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    if (!selectedPermission) return;
    
    try {
      setDeletingId(selectedPermission.id);
      const response = await api.delete(`/permissions/${selectedPermission.id}`);
      toast.success(response.data.message);
      fetchPermissions();
      setModalOpen(false);
      setSelectedPermission(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete permission.');
    } finally {
      setDeletingId(null);
    }
  };

  // Close modal
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedPermission(null);
  };

  // Build filter categories from API groups
  const filterCategories = useMemo(() => {
    return ['All', ...groups];
  }, [groups]);

  // Render permission rows grouped by category
  const renderPermissionGroup = (category, perms) => (
    <div key={category} className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors duration-200">
      <div className="px-6 py-3.5 bg-gray-200 dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between transition-colors duration-200">
        <div className="flex items-center gap-2 font-bold text-sm text-gray-800 dark:text-slate-200">
          <span>{category.charAt(0).toUpperCase() + category.slice(1)} Scope Capabilities</span>
        </div>
        <span className="text-xs text-gray-500 dark:text-slate-400 font-medium transition-colors duration-200">
          {perms.length} Permissions
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-gray-500 dark:text-slate-400 font-medium text-xs bg-gray-100 dark:bg-slate-800 border-b border-gray-100 dark:border-slate-800 transition-colors duration-200">
            <tr>
              <th className="px-6 py-3">Permission</th>
              <th className="px-6 py-3">Key Identifier</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-slate-800 transition-colors duration-200">
            {perms.map((perm) => {
              const permId = perm.id;
              const isDeletingThis = deletingId === permId;

              return (
                <tr key={permId} className="hover:bg-gray-50 dark:hover:bg-slate-800/60 transition-colors duration-200">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-900 dark:text-white transition-colors duration-200">
                      {perm.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5 transition-colors duration-200">
                      {perm.description || 'No description available.'}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <code className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 font-mono border border-gray-200 dark:border-slate-700 transition-colors duration-200">
                      {perm.slug}
                    </code>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        to={`/permissions/edit/${permId}`}
                        title="Edit permission"
                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        disabled={isDeletingThis}
                        onClick={() => handleDeleteClick(perm)}
                        title="Delete permission"
                        className="p-1.5 rounded-lg transition-colors duration-200 hover:bg-red-100 text-red-600 dark:hover:bg-red-900/40 dark:text-red-400"
                      >
                        {isDeletingThis ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="p-2 sm:p-4 space-y-6 bg-gray-50 dark:bg-slate-950 min-h-screen text-gray-900 dark:text-slate-100 transition-colors duration-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-200">Permissions Directory</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1 transition-colors duration-200">
            View and define system capabilities and security scopes across the application.
          </p>
        </div>
        <Link
          to="/permissions/create"
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors duration-200 shadow-sm"
        >
          <PlusCircle className="w-4 h-4" /> Create Permission
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatsCard
          label="Total Scopes"
          value={loading ? '...' : totalCount}
          icon={<KeyRound className="w-4 h-4 text-gray-400" />}
        />
        <StatsCard
          label="Active Categories"
          value={loading || groupsLoading ? '...' : groups.length}
          valueColor="text-emerald-600 dark:text-emerald-400"
          icon={<ShieldCheck className="w-4 h-4 text-emerald-400" />}
        />
      </div>

      <Toolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search key, label, or description..."
        filters={filterCategories}
        activeFilter={categoryFilter}
        onFilterChange={setCategoryFilter}
      />

  {/* CONTENT AREA: LOADING, ERROR, EMPTY, AND LIST STATES */}
      {loading ? (
        /* SKELETON LOADING STATE */
        <div className="space-y-6">
          {[...Array(2)].map((_, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden animate-pulse">
              <div className="px-6 py-3.5 bg-gray-200 dark:bg-slate-900 flex justify-between items-center">
                <div className="h-4 bg-gray-300 dark:bg-slate-800 rounded w-48" />
                <div className="h-4 bg-gray-300 dark:bg-slate-800 rounded w-20" />
              </div>
              <div className="p-6 space-y-4">
                {[...Array(3)].map((_, itemIdx) => (
                  <div key={itemIdx} className="flex justify-between items-center pt-2">
                    <div className="space-y-2 w-1/3">
                      <div className="h-4 bg-gray-200 dark:bg-slate-800 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 dark:bg-slate-800 rounded w-1/2" />
                    </div>
                    <div className="h-6 bg-gray-200 dark:bg-slate-800 rounded w-28" />
                    <div className="h-6 bg-gray-200 dark:bg-slate-800 rounded w-16" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden p-6">
          <EmptyState
            icon={AlertCircle}
            title="Failed to load permissions"
            description={error}
            action={
              <button
                onClick={fetchPermissions}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/30 rounded-lg transition-colors duration-200"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Retry
              </button>
            }
          />
        </div>
      ) : Object.keys(groupedPermissions).length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden p-6">
          <EmptyState
            icon={KeyRound}
            title="No permissions found"
            description={
              debouncedSearch || categoryFilter !== 'All'
                ? 'No permissions match your search or filter parameters.'
                : 'There are no permissions registered yet.'
            }
          />
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedPermissions).map(([category, perms]) =>
            renderPermissionGroup(category, perms)
          )}
        </div>
      )}

      <ConfirmationModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        title="Delete Permission"
        message={`Are you sure you want to delete this "${selectedPermission?.name}" permission? This action cannot be undone.`}
        isLoading={deletingId === selectedPermission?.id}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
}