import React, { useState, useEffect, useCallback } from 'react';
import { 
  Trash2, AlertCircle, Folder, Hash, Search, 
  Power, PlusCircle, Edit, Tag, ArrowUpDown, RefreshCw 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

import Toolbar from '../../../components/Toolbar';
import StatusBadge from '../../../components/StatusBadge';
import StatsCard from '../../../components/cards/StatsCard';
import Table from '../../../components/Table';
import ConfirmationModal from '../../../components/common/ConfirmationModal';
import api from '../../../services/api';
import Pagination from '../../../components/common/Pagination';

export default function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    trash: 0
  });

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal Delete State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);


  // Force Delete Modal State
  const [isForceDeleteModalOpen, setIsForceDeleteModalOpen] = useState(false);
  const [categoryToForceDelete, setCategoryToForceDelete] = useState(null);
  const [isForceDeleting, setIsForceDeleting] = useState(false);

  // Table Column Definitions
  const columns = [
     { label: 'ID', align: 'left' },
    // { 
    //   label: (
    //     <div className="flex items-center gap-1">
    //       <ArrowUpDown className="w-3 h-3" />
    //       <span>Order</span>
    //     </div>
    //   ) 
    // },
    { label: 'Category Name' },
    { label: 'Slug' },
    { label: 'Description', className: 'hidden md:table-cell' },
        { label: 'Status' },
    { label: 'Actions', align: 'right' },
  ];

  // Fetch Categories from Backend
  // Fetch Categories from Backend
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);

    // ✅ FIX: Build params object ONCE, including pagination
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
      const items = paginatedData.data

      // Keep your frontend inactive filter
      const finalItems = statusFilter === 'inactive'
        ? items.filter(c => !c.is_active && !c.deleted_at)
        : items;

      setCategories(finalItems);
      setStats(response.data?.stats);

      setCurrentPage(paginatedData.current_page || 1);
      setLastPage(paginatedData.last_page || 1);
      setTotalItems(paginatedData.total || 0);

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

    setCategories(prev => prev.map(c => c.id === category.id ? { ...c, is_active: updatedStatus } : c));

    try {
      const response = await api.put(`/categories/${category.id}`, { is_active: updatedStatus });
      toast.success(response.data?.message);
    } catch (err) {
      console.error('Failed to toggle status:', err);
      toast.error(err.response?.data?.message);
      setCategories(prev => prev.map(c => c.id === category.id ? { ...c, is_active: category.is_active } : c));
    }
  };

  // Open delete confirmation modal
  const handleOpenDeleteModal = (category) => {
    setCategoryToDelete(category);
    setIsDeleteModalOpen(true);
  };

  // Confirm delete handler
  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;
    setIsDeleting(true);
    try {
      const response = await api.delete(`/categories/${categoryToDelete.id}`);
      toast.success(response.data?.message);
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message);
    } finally {
      setIsDeleting(false);
    }
  };

   const handleSearchChange = (query) => {
    setSearchQuery(query);
    setCurrentPage(1); // ✅ Reset to page 1
  };


  const handleStatusFilterChange = (selectedStatus) => {
    const statusMap = {
      'All Statuses': 'all',
      'Active': 'active',
      'Inactive': 'inactive',
      'All': 'all',
      'Trash': 'trash',
    };
    setStatusFilter(statusMap[selectedStatus] || selectedStatus || 'all');
      setCurrentPage(1);
  };

   const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= lastPage) {
      setCurrentPage(newPage);
    }
  };

  const currentActiveFilterLabel = {
    'all': 'All',
    'active': 'Active',
    'inactive': 'Inactive',
    'trash': 'Trash',
  }[statusFilter] || 'All';

  const isFiltered = Boolean(searchQuery || statusFilter !== 'all');

  // Restore Handler
  const handleRestore = async (category) => {
    try {
      const response = await api.patch(`/categories/${category.id}/restore`);
      toast.success(response.data?.message);
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message);
    }
  };

  // Force Delete Handlers
  const handleOpenForceDeleteModal = (category) => {
    setCategoryToForceDelete(category);
    setIsForceDeleteModalOpen(true);
  };

  const handleConfirmForceDelete = async () => {
    if (!categoryToForceDelete) return;
    setIsForceDeleting(true);
    try {
      const response = await api.delete(`/categories/${categoryToForceDelete.id}/force`);
      toast.success(response.data?.message);
      setIsForceDeleteModalOpen(false);
      setCategoryToForceDelete(null);
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message);
    } finally {
      setIsForceDeleting(false);
    }
  };

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
      {/* <td className="py-4 px-4 sm:px-6 font-mono text-xs font-semibold text-gray-500 dark:text-slate-400">
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300">
          {cat.sort_order}
        </span>
      </td> */}
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
                  onClick={() => handleRestore(cat)}
                  className="p-2 rounded-lg text-emerald-600 hover:bg-emerald-100 dark:hover:bg-emerald-950/30 transition-colors"
                  title="Restore"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                {/* <button
              onClick={() => handleOpenForceDeleteModal(cat)}
              className="p-2 rounded-lg text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
              title="Permanently Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button> */}
              </>
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
                  to={`/category/edit/${cat.id}`}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg text-gray-500 hover:text-blue-600 transition-colors inline-block"
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
                </Link>

                <button
                  onClick={() => handleOpenDeleteModal(cat)}
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
          to="/category/create"
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

      {/* Reusable Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          if (!isDeleting) {
            setIsDeleteModalOpen(false);
            setCategoryToDelete(null);
          }
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Category"
        message={
          <>
            Are you sure you want to delete the{' '}
            <span className="font-bold text-slate-900 dark:text-slate-200">
              {categoryToDelete?.name}
            </span>{' '}
            category? This action cannot be undone and associated menu items may become uncategorized.
          </>
        }
        isLoading={isDeleting}
        confirmText="Delete"
      />

      {/* Force Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isForceDeleteModalOpen}
        onClose={() => {
          if (!isForceDeleting) {
            setIsForceDeleteModalOpen(false);
            setCategoryToForceDelete(null);
          }
        }}
        onConfirm={handleConfirmForceDelete}
        title="Permanently Delete Category"
        message={
          <>
            Are you sure you want to <span className="font-bold text-red-600">permanently delete</span> the{' '}
            <span className="font-bold text-slate-900 dark:text-slate-200">
              {categoryToForceDelete?.name}
            </span>{' '}
            category? This action cannot be undone and will permanently destroy all associated menu items.
          </>
        }
        isLoading={isForceDeleting}
        confirmText="Permanently Delete"
        confirmClassName="bg-rose-600 hover:bg-rose-700 text-white"
      />
    </div>
  );
}