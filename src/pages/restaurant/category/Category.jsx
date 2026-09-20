import React, { useState, useEffect, useCallback } from 'react';
import { 
  Trash2, AlertCircle, Folder, Hash, Search, 
  Power, PlusCircle, Edit, Tag, RefreshCw 
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';

import Toolbar from '../../../components/common/Toolbar';
import StatusBadge from '../../../components/common/StatusBadge';
import StatsCard from '../../../components/cards/StatsCard';
import Table from '../../../components/common/Table';
import ConfirmationModal from '../../../components/common/ConfirmationModal';
import api from '../../../services/api';
import Pagination from '../../../components/common/Pagination';
import { useRoleBasePath } from '../../../utils/useRoleBasePath';
import { useAuth } from '../../../contexts/AuthContext';

export default function CategoryPage() {
  const { user } = useAuth();
   const basePath = useRoleBasePath();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL-driven state
  const currentPage = Number(searchParams.get('page')) || 1;
  const searchQuery = searchParams.get('search') || '';
  const statusFilter = searchParams.get('status') || 'all';

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    trash: 0
  });

  // Pagination State
  const [lastPage, setLastPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Unified Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    category: null,
    action: null, // 'trash' | 'restore' | 'forceDelete'
    isProcessing: false
  });

  // URL update helper
  const updateUrlParams = useCallback((newPage, newSearch, newStatus) => {
    const params = new URLSearchParams();
    if (newPage > 1) params.set('page', String(newPage));
    if (newSearch) params.set('search', newSearch);
    if (newStatus && newStatus !== 'all') params.set('status', newStatus);
    setSearchParams(params, { replace: true });
  }, [setSearchParams]);

  // Table Column Definitions
  const columns = [
    { label: 'ID', align: 'left' },
    { label: 'Category Name' },
    { label: 'Slug' },
    { label: 'Description', className: 'hidden md:table-cell' },
    { label: 'Status' },
    { label: 'Actions', align: 'right' },
  ];

  // Fetch Categories from Backend
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);

    const params = {
      page: currentPage,
      per_page: 15,
    };

    if (searchQuery) params.search = searchQuery;
    if (statusFilter === 'active') params.only_active = 1;
    if (statusFilter === 'trash') params.only_trashed = 1;

    try {
      const response = await api.get('/categories', { params });
      

      const paginatedData = response.data?.data;
      const items = paginatedData.data;

      // Keep your frontend inactive filter
      const finalItems = statusFilter === 'inactive'
        ? items.filter(c => !c.is_active && !c.deleted_at)
        : items;

      setCategories(finalItems);
      setStats(response.data?.stats);

      setLastPage(paginatedData?.last_page || 1);
      setTotalItems(paginatedData?.total || 0);

    } catch (err) {
      setError(err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCategories();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchCategories]);


  // Quick Toggle Active/Inactive
const toggleStatus = async (category) => {
  const updatedStatus = !category.is_active;

  // Optimistically update list based on active filter view
  setCategories(prev => {
    if (statusFilter === 'active' && !updatedStatus) {
      return prev.filter(c => c.id !== category.id);
    }
    if (statusFilter === 'inactive' && updatedStatus) {
      return prev.filter(c => c.id !== category.id);
    }
    return prev.map(c => c.id === category.id ? { ...c, is_active: updatedStatus } : c);
  });

  // Optimistically update counts
  setStats(prev => ({
    ...prev,
    active: updatedStatus ? prev.active + 1 : Math.max(0, prev.active - 1),
    inactive: updatedStatus ? Math.max(0, prev.inactive - 1) : prev.inactive + 1
  }));

  try {
    const response = await api.put(`/categories/${category.id}`, { is_active: updatedStatus });
    toast.success(response.data?.message);
  } catch (err) {
    console.error('Failed to toggle status:', err);
    toast.error(err.response?.data?.message);
    
    // Refresh to restore accurate server state on failure
    fetchCategories();
  }
};

  // --- UNIFIED CONFIRMATION MODAL HANDLERS ---
  const openConfirmModal = (category, action) => {
    setConfirmModal({ isOpen: true, category, action, isProcessing: false });
  };

  const closeConfirmModal = () => {
    if (!confirmModal.isProcessing) {
      setConfirmModal({ isOpen: false, category: null, action: null, isProcessing: false });
    }
  };

  const handleConfirmAction = async () => {
    const { category, action } = confirmModal;
    if (!category || !action) return;

    setConfirmModal(prev => ({ ...prev, isProcessing: true }));

    try {
      if (action === 'trash') {
        const response = await api.delete(`/categories/${category.id}`);
        toast.success(response?.data?.message);

        // Optimistic state updates
        setCategories(prevList => {
          if (statusFilter === 'all') {
            return prevList.map(item =>
              item.id === category.id ? { ...item, deleted_at: new Date().toISOString() } : item
            );
          }
          return prevList.filter(item => item.id !== category.id);
        });

        setStats(prevStats => ({
          ...prevStats,
          trash: (prevStats.trash || 0) + 1,
          active: category.is_active ? Math.max(0, (prevStats.active || 0) - 1) : prevStats.active,
          inactive: !category.is_active ? Math.max(0, (prevStats.inactive || 0) - 1) : prevStats.inactive
        }));

      } else if (action === 'restore') {
        const response = await api.patch(`/categories/${category.id}/restore`);
        toast.success(response?.data?.message);

        // Optimistic state updates
        setCategories(prevList => {
          if (statusFilter === 'trash') {
            return prevList.filter(item => item.id !== category.id);
          }
          return prevList.map(item =>
            item.id === category.id ? { ...item, deleted_at: null } : item
          );
        });

        setStats(prevStats => ({
          ...prevStats,
          trash: Math.max(0, (prevStats.trash || 0) - 1),
          active: category.is_active ? (prevStats.active || 0) + 1 : prevStats.active,
          inactive: !category.is_active ? (prevStats.inactive || 0) + 1 : prevStats.inactive
        }));

      } else if (action === 'forceDelete') {
        const response = await api.delete(`/categories/${category.id}/force`);
        toast.success(response?.data?.message);

        // Optimistic state updates
        setCategories(prevList => prevList.filter(item => item.id !== category.id));
        setStats(prevStats => ({
          ...prevStats,
          total: Math.max(0, (prevStats.total || 0) - 1),
          trash: Math.max(0, (prevStats.trash || 0) - 1)
        }));
      }
      closeConfirmModal();
    } catch (err) {
      toast.error(err.response?.data?.message);
      setConfirmModal(prev => ({ ...prev, isProcessing: false }));
    }
  };

   const handleSearchChange = (query) => {
    updateUrlParams(1, query, statusFilter);
  };


  const handleStatusFilterChange = (selectedStatus) => {
    const statusMap = {
      'All Statuses': 'all',
      'Active': 'active',
      'Inactive': 'inactive',
      'All': 'all',
      'Trash': 'trash',
    };
    const mappedStatus = statusMap[selectedStatus] || selectedStatus || 'all';
    updateUrlParams(1, searchQuery, mappedStatus);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= lastPage) {
      updateUrlParams(newPage, searchQuery, statusFilter);
    }
  };

  const currentActiveFilterLabel = {
    'all': 'All',
    'active': 'Active',
    'inactive': 'Inactive',
    'trash': 'Trash',
  }[statusFilter] || 'All';

  const isFiltered = Boolean(searchQuery || statusFilter !== 'all');

  // Row Renderer for Generic Table Component
  const renderRow = (cat) => {
    const isTrashed = Boolean(cat.deleted_at);
    return (
      <tr
        key={cat.id}
        className="border-b border-gray-100 dark:border-slate-800/60 hover:bg-gray-50/50 dark:hover:bg-slate-800/50 transition-colors"
      >
        <td className="px-6 py-4 font-mono text-xs font-semibold text-gray-500 dark:text-slate-400">
          #{cat.id}
        </td>
      <td className="py-4 px-4 font-bold text-gray-900 dark:text-white">
        {cat.name}
      </td>
      <td className="py-4 px-4 font-mono text-xs text-gray-500 dark:text-slate-400">
        <span className="inline-flex items-center gap-1">
          <Hash className="w-3 h-3 text-gray-400 dark:text-slate-500" />
          {cat.slug}
        </span>
      </td>
      <td className="py-4 px-4 hidden md:table-cell text-xs text-gray-600 dark:text-slate-400 max-w-xs truncate">
        {cat.description?.trim() || "—"}
      </td>
      <td className="py-4 px-4">
        <StatusBadge status={cat.is_active ? 'active' : 'inactive'} />
      </td>
      <td className="py-4 px-4 sm:px-6 text-right">
          <div className="flex items-center justify-end gap-1">
            {isTrashed ? (
              <>
                <button
                  onClick={() => openConfirmModal(cat, 'restore')}
                  className="p-2 rounded-lg text-emerald-600 hover:bg-emerald-100 dark:hover:bg-emerald-950/30 transition-colors"
                  title="Restore"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                {/* <button
              onClick={() => openConfirmModal(cat, 'forceDelete')}
              className="p-2 rounded-lg text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
              title="Permanently Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button> */}
              </>
            ) : user?.role === 'cashier' || 'waiter' ? (
            <span className="text-xs text-gray-400 italic">No actions available</span>
            ) : (
              <>
                <button
                  onClick={() => toggleStatus(cat)}
                  className={`p-2 rounded-lg transition-colors ${cat.is_active
                      ? 'text-red-500 hover:bg-red-100/50 dark:text-red-400 dark:hover:bg-red-950/30'
                      : 'text-emerald-600 hover:bg-emerald-100/50 dark:text-emerald-400 dark:hover:bg-emerald-950/30'
                    }`}
                  title={cat.is_active ? 'Deactivate' : 'Activate'}
                >
                  <Power className="w-4 h-4" />
                </button>

                <Link
                  to={`${basePath}/category/edit/${cat.id}`}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg text-gray-500 hover:text-blue-600 transition-colors inline-block"
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
                </Link>

                <button
                  onClick={() => openConfirmModal(cat, 'trash')}
                  className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-gray-500 hover:text-red-600 transition-colors cursor-pointer"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
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
            Menu Categories
          </h1>
          <p className="text-md sm:text-sm text-gray-500 dark:text-slate-400 mt-1">
            Organize and manage your menu category structure.
          </p>
        </div>
        <Link
          to={`${basePath}/category/create`}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/35 active:scale-[0.98]"
        >
          <Tag className="w-4 h-4 stroke-[2.5]" />
          <span>New Category</span>
        </Link>
      </div>


      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatsCard label="Total Categories" value={loading && stats.total === 0 ? '...' : stats.total} />
        <StatsCard label="Active Categories" value={loading && stats.active === 0 ? '...' : stats.active} />
        <StatsCard label="Inactive Categories" value={loading && stats.inactive === 0 ? '...' : stats.inactive} />
        <StatsCard label="Trash" value={loading && stats.trash === 0 ? '...' : stats.trash} />
      </div>

          {/* Toolbar */}
      <Toolbar
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange} 
        searchPlaceholder="Search categories..."
        dropdowns={[
          {
            id: 'status-filter',
            placeholder: 'Status...',
            value: statusFilter,
            onChange: handleStatusFilterChange,
            options: [
              { label: 'All Statuses', value: 'all' },
              { label: 'Active', value: 'active' },
              { label: 'Inactive', value: 'inactive' },
              { label: 'Trash', value: 'trash' },
            ],
          },
        ]}
        activeFilter={currentActiveFilterLabel}
        onFilterChange={handleStatusFilterChange}
      />

      {/* Generic Table Component handling Loading, Error, Empty, and List States */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
      <Table
          columns={columns}
          data={categories}
          renderRow={renderRow}
          loading={loading}
          error={error}
          onRetry={fetchCategories}
          emptyIcon={isFiltered ? Search : Folder}
          emptyTitle={isFiltered ? 'No matching categories found' : 'No categories created yet'}
          emptyDescription={
            isFiltered
              ? 'No category records match your current search query or status filter.'
              : 'Start organizing your restaurant menu by setting up your first food or beverage category.'
          }
        />
      </div>

        {!loading && !error && categories.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={lastPage}
            totalRecords={totalItems}
            onPageChange={handlePageChange}
            maxVisible={5}
          />
        )}

      {/* Unified Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={closeConfirmModal}
        onConfirm={handleConfirmAction}
        title={
          confirmModal.action === 'trash' ? 'Move Category to Trash' :
          confirmModal.action === 'restore' ? 'Restore Category' :
          'Permanently Delete Category'
        }
        message={
          confirmModal.action === 'trash' ? (
            <>Are you sure you want to move <span className="font-bold text-slate-900 dark:text-slate-200">{confirmModal.category?.name}</span> to the trash? Associated menu items may become uncategorized.</>
          ) : confirmModal.action === 'restore' ? (
            <>Are you sure you want to restore <span className="font-bold text-slate-900 dark:text-slate-200">{confirmModal.category?.name}</span>? It will be available again.</>
          ) : (
            <>Are you sure you want to <span className="font-bold text-rose-600">permanently delete</span> <span className="font-bold text-slate-900 dark:text-slate-200">{confirmModal.category?.name}</span>? This action cannot be undone and will permanently destroy all associated menu items.</>
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