import React, { useState, useEffect, useCallback } from 'react';
import {
  Plus, Trash2, GripVertical,
  CheckCircle2, AlertCircle, Folder, Hash, Search,
  Power, RotateCcw, PlusCircle,
  Edit
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Toolbar from '../../../components/Toolbar';
import StatusBadge from '../../../components/StatusBadge';
import StatsCard from '../../../components/cards/StatsCard';
import ConfirmationModal from '../../../components/common/ConfirmationModal';
import EmptyState from '../../../components/common/EmptyState';
import api from '../../../services/api';
import toast from 'react-hot-toast';

export default function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Drag & Drop state
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  // Modal Delete State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch Categories from Backend
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (searchQuery) params.search = searchQuery;
      if (statusFilter === 'active') params.only_active = 1;

      const response = await api.get('/categories', { params });
      const items = response.data?.data?.data || response.data?.data || [];

      const finalItems = statusFilter === 'inactive'
        ? items.filter(c => !c.is_active)
        : items;

      setCategories(finalItems);
    } catch (err) {
      setError(err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCategories();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchCategories]);

  // Derived Stats
  const stats = {
    total: categories.length,
    active: categories.filter(c => c.is_active).length,
    inactive: categories.filter(c => !c.is_active).length,
  };

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
      setCategories(prev => prev.filter(c => c.id !== categoryToDelete.id));
    } catch (err) {
      toast.error(err.response?.data?.message);
    } finally {
      setIsDeleting(false);
    }
  };

  // Drag & Drop Handlers with API Syncing
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = async (e, dropIndex) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const reordered = [...categories];
    const [moved] = reordered.splice(draggedIndex, 1);
    reordered.splice(dropIndex, 0, moved);

    const updatedWithOrders = reordered.map((cat, idx) => ({
      ...cat,
      sort_order: idx + 1
    }));

    setCategories(updatedWithOrders);
    setDraggedIndex(null);
    setDragOverIndex(null);

    try {
      const payload = {
        orders: updatedWithOrders.map(item => ({
          id: item.id,
          sort_order: item.sort_order
        }))
      };
      const response = await api.post('/categories/reorder', payload);
      toast.success(response.data?.message);
    } catch (err) {
      toast.error(err.response?.data?.message);
      fetchCategories();
    }
  };

  const handleStatusFilterChange = (selectedStatus) => {
    const statusMap = {
      'All Statuses': 'all',
      'Active': 'active',
      'Inactive': 'inactive',
    };
    setStatusFilter(statusMap[selectedStatus] || 'all');
  };

  const currentActiveFilterLabel = {
    'all': 'All Statuses',
    'active': 'Active',
    'inactive': 'Inactive',
  }[statusFilter] || 'All Statuses';

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 bg-gray-50/50 dark:bg-slate-950 min-h-screen text-gray-900 dark:text-slate-100 transition-colors duration-200">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2 border-b border-gray-200/60 dark:border-slate-800/60">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-600 via-amber-500 to-orange-400 bg-clip-text text-transparent">
            Menu Categories
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-1">
            Organize your menu structure. Drag cards to reorder display priority.
          </p>
        </div>
        <Link
          to="/category/create"
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/35 active:scale-[0.98]"
        >
          <PlusCircle className="w-4 h-4 stroke-[2.5]" />
          <span>New Category</span>
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard
          label="Total Categories"
          value={loading ? '...' : stats.total}
          valueColor="text-blue-600 dark:text-blue-400"
          icon={<Folder className="w-4 h-4 text-blue-500 dark:text-blue-400" />}
        />
        <StatsCard
          label="Active Categories"
          value={loading ? '...' : stats.active}
          valueColor="text-emerald-600 dark:text-emerald-400"
          icon={<CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />}
        />
        <StatsCard
          label="Inactive Categories"
          value={loading ? '...' : stats.inactive}
          valueColor="text-amber-600 dark:text-amber-400"
          icon={<AlertCircle className="w-4 h-4 text-amber-500 dark:text-amber-400" />}
        />
      </div>

      {/* Toolbar */}
      <Toolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search categories..."
        filters={['All Statuses', 'Active', 'Inactive']}
        activeFilter={currentActiveFilterLabel}
        onFilterChange={handleStatusFilterChange}
      />

      {/* 1. LOADING SKELETON STATE */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-gray-200/80 dark:border-slate-800 flex items-center gap-4 animate-pulse"
            >
              <div className="w-5 h-5 bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
                  <div className="h-4 bg-slate-100 dark:bg-slate-800/60 rounded-full w-16" />
                </div>
                <div className="h-3 bg-slate-100 dark:bg-slate-800/60 rounded w-1/6" />
                <div className="h-3 bg-slate-100 dark:bg-slate-800/40 rounded w-1/2" />
              </div>
              <div className="w-24 h-8 bg-slate-100 dark:bg-slate-800 rounded-xl" />
            </div>
          ))}
        </div>
      ) : error ? (
        /* 2. ERROR STATE */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-12">
          <EmptyState
            icon={AlertCircle}
            title="Unable to load categories"
            description={error}
            action={
              <button
                onClick={fetchCategories}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/30 rounded-lg transition-colors duration-200"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Try again
              </button>
            }
          />
        </div>
      ) : categories.length === 0 ? (
        /* 3. EMPTY STATE */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-12">
          <EmptyState
            icon={searchQuery || statusFilter !== 'all' ? Search : Folder}
            title={
              searchQuery || statusFilter !== 'all'
                ? 'No matching categories found'
                : 'No categories created yet'
            }
            description={
              searchQuery || statusFilter !== 'all'
                ? 'No category records match your current search query or status filter.'
                : 'Start organizing your restaurant menu by setting up your first food or beverage category.'
            }
            action={
              searchQuery || statusFilter !== 'all' ? (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors duration-200"
                >
                  Clear search filters
                </button>
              ) : (
                <Link
                  to="/category/create"
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 rounded-lg transition-colors duration-200"
                >
                  <PlusCircle className="w-3.5 h-3.5" /> Create First Category
                </Link>
              )
            }
          />
        </div>
      ) : (
        /* 4. LIST DISPLAY STATE */
        <div className="space-y-3">
          {categories.map((cat, index) => {
            const isDragging = draggedIndex === index;
            const isDragOver = dragOverIndex === index;

            return (
              <div
                key={cat.id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={() => { setDraggedIndex(null); setDragOverIndex(null); }}
                className={`
                  relative group rounded-2xl border transition-all duration-200 bg-white dark:bg-slate-900
                  border-gray-200/80 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700 shadow-sm hover:shadow-md
                  ${isDragging ? 'opacity-30 scale-[0.99]' : 'opacity-100'}
                  ${isDragOver ? 'border-t-2 border-t-orange-500' : ''}
                `}
              >
                {/* Left Accent Indicator */}
                <div
                  className={`absolute left-0 top-3 bottom-3 w-1 rounded-r-full transition-colors ${cat.is_active ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-slate-700'
                    }`}
                />

                <div className="p-4 pl-5 sm:pl-6 flex items-start sm:items-center gap-3 sm:gap-4">

                  {/* Drag Handle */}
                  <div
                    className="flex-shrink-0 mt-1 sm:mt-0 text-gray-300 dark:text-slate-600 hover:text-orange-500 transition-colors cursor-grab active:cursor-grabbing"
                    title="Drag to reorder"
                  >
                    <GripVertical className="w-5 h-5" />
                  </div>

                  {/* Main Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <h3 className="font-bold text-base text-gray-900 dark:text-white tracking-tight">
                            {cat.name}
                          </h3>
                          <StatusBadge
                            status={cat.is_active ? 'active' : 'inactive'}
                            activeLabel="Active"
                            inactiveLabel="Inactive"
                            showIcon={true}
                            size="sm"
                          />
                        </div>

                        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-slate-400 font-mono">
                          <span className="flex items-center gap-1 text-gray-400 dark:text-slate-500">
                            <Hash className="w-3 h-3" />
                            {cat.slug}
                          </span>
                        </div>

                        {cat.description && (
                          <p className="text-xs text-gray-600 dark:text-slate-400 line-clamp-1">
                            {cat.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions Toolbar */}
                  <div className="flex items-center gap-1 bg-gray-50 dark:bg-slate-800/80 p-1 rounded-xl border border-gray-100 dark:border-slate-700/50">
                    <button
                      onClick={() => toggleStatus(cat)}
                      className={`p-2 rounded-lg transition-colors ${cat.is_active
                          ? 'text-emerald-600 hover:bg-emerald-100/50 dark:text-emerald-400 dark:hover:bg-emerald-950/30'
                          : 'text-red-400 hover:bg-red-200/60 dark:hover:bg-slate-700'
                        }`}
                      title={cat.is_active ? 'Deactivate' : 'Activate'}
                    >
                      <Power className="w-4 h-4" />
                    </button>

                    <Link
                      to={`/category/edit/${cat.id}`}
                      className="p-2 rounded-lg text-gray-500 hover:text-orange-600 hover:bg-orange-100/50 dark:text-slate-400 dark:hover:text-orange-400 dark:hover:bg-orange-950/30 transition-colors"
                      title="Edit Category"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>

                    <button
                      onClick={() => handleOpenDeleteModal(cat)}
                      className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-100/50 dark:text-slate-400 dark:hover:text-red-400 dark:hover:bg-red-950/30 transition-colors"
                      title="Delete Category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
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
    </div>
  );
}