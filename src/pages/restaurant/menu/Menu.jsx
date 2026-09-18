import React, { useState, useEffect, useCallback } from 'react';
import {
  Trash2,
  Image as ImageIcon,
  UtensilsCrossed,
  Edit,
  Power,
  Eye,
  RefreshCw,
  Search
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';

import Toolbar from '../../../components/common/Toolbar';
import Pagination from '../../../components/common/Pagination';
import ConfirmationModal from '../../../components/common/ConfirmationModal';
import StatusBadge from '../../../components/common/StatusBadge';
import api from '../../../services/api';
import { getImageUrl } from '../../../utils/getImageUrl';
import Table from '../../../components/common/Table';
import CategoriesService from '../../../services/categories';
import { useFormatPrice } from '../../../contexts/useFormatPrice';
import StatsCard from '../../../components/cards/StatsCard';

export default function MenuTable() {
  const [searchParams, setSearchParams] = useSearchParams();
  const {formatPrice} = useFormatPrice();

  // URL-driven state
  const currentPage = Number(searchParams.get('page')) || 1;
  const searchQuery = searchParams.get('search') || '';
  const statusFilter = searchParams.get('status') || 'all';
  const selectedCategory = searchParams.get('category') || 'all';

  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);

    const [stats, setStats] = useState({
      total: 0,
      active: 0,
      inactive: 0,
      trash: 0
    });
  
  // Pagination State
  const [lastPage, setLastPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // UI & Action States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Unified Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    item: null,
    action: null, // 'trash' | 'restore' | 'forceDelete'
    isProcessing: false
  });

  // URL update helper
  const updateUrlParams = useCallback((newPage, newSearch, newStatus, newCategory) => {
    const params = new URLSearchParams();
    if (newPage > 1) params.set('page', String(newPage));
    if (newSearch) params.set('search', newSearch);
    if (newStatus && newStatus !== 'all') params.set('status', newStatus);
    if (newCategory && newCategory !== 'all') params.set('category', newCategory);
    setSearchParams(params, { replace: true });
  }, [setSearchParams]);

  // Table Column Definitions
  const columns = [
    { label: 'ID', align: 'left' },
    { label: 'Item Details' },
    { label: 'Description' },
    { label: 'Category' },
    { label: 'Price' },
    { label: 'Availability' },
    { label: 'Status' },
    { label: 'Actions', align: 'right' },
  ];

  useEffect(() => {
    CategoriesService.getCategories()
      .then((data) => setCategories(data || []))
      .catch((err) => {
        setError(err.response?.data?.message);
      });
  }, []);

  const fetchMenuItems = useCallback(async () => {
    setLoading(true);
    setError(null);

    const params = {
      page: currentPage,
      per_page: 15,
    };

    if (statusFilter === 'trash') {
      params.only_trashed = 1;
    } else if (statusFilter !== 'all') {
      params.status = statusFilter;
    }

    if (selectedCategory !== 'all') {
      params.category_id = selectedCategory;
    }

    if (searchQuery && searchQuery.trim() !== '') {
      params.search = searchQuery.trim();
    }

    try {
      const response = await api.get('/menu-items', { params });
      const responseData = response.data;

      setItems(responseData.data.data);
      setStats(responseData.stats);

      const pagination = responseData.data;
      setLastPage(pagination?.last_page || 1);
      setTotalItems(pagination?.total || 0);
    } catch (err) {
      setError(err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  }, [currentPage, selectedCategory, searchQuery, statusFilter]);

  useEffect(() => {
    fetchMenuItems();
  }, [fetchMenuItems]);

  const handleStatusFilterChange = (selectedStatus) => {
    const statusMap = {
      'All Statuses': 'all',
      'All': 'all',
      'Active': 'active',
      'Inactive': 'inactive',
      'Trash': 'trash',
    };
    const mappedStatus = statusMap[selectedStatus] || selectedStatus || 'all';
    updateUrlParams(1, searchQuery, mappedStatus, selectedCategory);
  };

  const handleCategoryFilterChange = (categoryId) => {
    updateUrlParams(1, searchQuery, statusFilter, categoryId || 'all');
  };

  const handleSearchChange = (query) => {
    updateUrlParams(1, query, statusFilter, selectedCategory);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= lastPage) {
      updateUrlParams(newPage, searchQuery, statusFilter, selectedCategory);
    }
  };

  const isFiltered = Boolean(searchQuery || statusFilter !== 'all' || selectedCategory !== 'all');

  // Toggle Item Availability Optimistically
  const handleToggleAvailability = async (id, currentStatus) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, is_available: !currentStatus } : item))
    );

    try {
      const response = await api.patch(`/menu-items/${id}/toggle-availability`);
      toast.success(response?.data?.message);
    } catch (err) {
      toast.error(err.response?.data?.message);
      // Rollback on error
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, is_available: currentStatus } : item))
      );
    }
  };

  // Toggle Active/Inactive Status Optimistically
// Toggle Active/Inactive Status Optimistically
const toggleStatus = async (item) => {
  const updatedStatus = !item.is_active;

  // Option 1: Remove from array if current filter doesn't match the updated status
  setItems((prev) => {
    const statusMatchesFilter =
      statusFilter === 'all' ||
      (statusFilter === 'active' && updatedStatus) ||
      (statusFilter === 'inactive' && !updatedStatus);

    if (!statusMatchesFilter) {
      return prev.filter((i) => i.id !== item.id);
    }

    return prev.map((i) => (i.id === item.id ? { ...i, is_active: updatedStatus } : i));
  });

  setStats((prev) => ({
    ...prev,
    active: updatedStatus ? prev.active + 1 : Math.max(0, prev.active - 1),
    inactive: updatedStatus ? Math.max(0, prev.inactive - 1) : prev.inactive + 1
  }));

  try {
    const response = await api.patch(`/menu-items/${item.id}/toggle-active`);
    toast.success(response?.data?.message);
  } catch (err) {
    toast.error(err.response?.data?.message);
    // Rollback by refetching items to restore exact filter state
    fetchMenuItems();
  }
};

  // --- UNIFIED CONFIRMATION MODAL HANDLERS ---
  const openConfirmModal = (item, action) => {
    setConfirmModal({ isOpen: true, item, action, isProcessing: false });
  };

  const closeConfirmModal = () => {
    if (!confirmModal.isProcessing) {
      setConfirmModal({ isOpen: false, item: null, action: null, isProcessing: false });
    }
  };

  const handleConfirmAction = async () => {
    const { item, action } = confirmModal;
    if (!item || !action) return;

    setConfirmModal(prev => ({ ...prev, isProcessing: true }));

    try {
      if (action === 'trash') {
        const response = await api.delete(`/menu-items/${item.id}`);
        toast.success(response?.data?.message);

        // Optimistic state updates
        setItems(prevList => {
          if (statusFilter === 'all') {
            return prevList.map(i =>
              i.id === item.id ? { ...i, deleted_at: new Date().toISOString() } : i
            );
          }
          return prevList.filter(i => i.id !== item.id);
        });

        setStats(prevStats => ({
          ...prevStats,
          trash: (prevStats.trash || 0) + 1,
          active: item.is_active ? Math.max(0, (prevStats.active || 0) - 1) : prevStats.active,
          inactive: !item.is_active ? Math.max(0, (prevStats.inactive || 0) - 1) : prevStats.inactive
        }));

      } else if (action === 'restore') {
        const response = await api.patch(`/menu-items/${item.id}/restore`);
        toast.success(response?.data?.message);

        // Optimistic state updates
        setItems(prevList => {
          if (statusFilter === 'trash') {
            return prevList.filter(i => i.id !== item.id);
          }
          return prevList.map(i =>
            i.id === item.id ? { ...i, deleted_at: null } : i
          );
        });

        setStats(prevStats => ({
          ...prevStats,
          trash: Math.max(0, (prevStats.trash || 0) - 1),
          active: item.is_active ? (prevStats.active || 0) + 1 : prevStats.active,
          inactive: !item.is_active ? (prevStats.inactive || 0) + 1 : prevStats.inactive
        }));

      } else if (action === 'forceDelete') {
        const response = await api.delete(`/menu-items/${item.id}/force`);
        toast.success(response?.data?.message);

        // Optimistic state updates
        setItems(prevList => prevList.filter(i => i.id !== item.id));
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

  const renderRow = (item) => {
    const isTrashed = Boolean(item.deleted_at);
    const category = item.category || categories.find((c) => c.id === item.category_id);

    return (
      <tr
        key={item.id}
        className="transition-colors border-b border-slate-100 dark:border-slate-800 hover:bg-gray-50/50 dark:hover:bg-slate-800/50"
      >
          <td className="px-6 py-4 font-mono text-xs font-semibold text-gray-500 dark:text-slate-400">
          #{item.id}
        </td>
        
        <td className="py-3.5 px-6">
          <div className="flex items-center gap-3">
            {item.image ? (
              <img
                src={getImageUrl(item.image)}
                alt={item.name}
                className="w-11 h-11 rounded-lg object-cover border border-gray-100 dark:border-slate-700 shrink-0"
              />
            ) : (
              <div className="w-11 h-11 rounded-lg bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-gray-400 shrink-0">
                <ImageIcon className="w-5 h-5" />
              </div>
            )}
            <div className="min-w-0">
              <div className="font-semibold text-gray-900 dark:text-white truncate">{item.name}</div>
              {item.slug && (
                <div className="text-xs text-gray-400 dark:text-slate-500 font-mono truncate">
                  {item.slug}
                </div>
              )}
            </div>
          </div>
        </td>

        <td className="py-3.5 px-6">
          <div className="text-xs text-gray-500 dark:text-slate-400 max-w-[200px] truncate">
            {item.description}
          </div>
        </td>

        <td className="py-3.5 px-6 text-xs">
          {category?.name}
        </td>

        <td className="py-3.5 px-6 font-semibold text-gray-900 dark:text-white tabular-nums">
          {formatPrice(item.price)}
        </td>

        <td className="py-3.5 px-6 whitespace-nowrap">
          <StatusBadge
            status={item.is_available ? 'available' : 'sold_out'}
          />
        </td>

        <td className="py-3.5 px-6">
          <StatusBadge
            status={item.is_active ? 'active' : 'inactive'}
          />
        </td>

        <td className="py-3.5 px-2 text-right">
          <div className="flex items-center justify-end gap-1">
            {isTrashed ? (
              <>
            <button
                type="button"
                onClick={() => openConfirmModal(item, 'restore')}
                className="p-2 rounded-lg text-emerald-600 hover:bg-emerald-100 dark:hover:bg-emerald-950/30 transition-colors"
                title="Restore"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
                {/* <button
                type="button"
                onClick={() => openConfirmModal(item, 'forceDelete')}
                className="p-2 rounded-lg text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
                title="Permanently Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button> */}
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => handleToggleAvailability(item.id, item.is_available)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${item.is_available
                    ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-400 dark:hover:bg-amber-900/40 border border-amber-200 dark:border-amber-800/50'
                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400 dark:hover:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-800/50'
                    }`}
                >
                  {item.is_available ? 'Mark as Sold Out' : 'Mark Available'}
                </button>

                <button
                  type="button"
                  onClick={() => toggleStatus(item)}
                  className={`p-2 rounded-lg transition-colors ${item.is_active
                    ? 'text-red-500 hover:bg-red-100/50 dark:text-red-400 dark:hover:bg-red-950/30'
                    : 'text-emerald-600 hover:bg-emerald-100/50 dark:text-emerald-400 dark:hover:bg-emerald-950/30'
                    }`}
                  title={item.is_active ? 'Deactivate' : 'Activate'}
                >
                  <Power className="w-4 h-4" />
                </button>
                <Link
                  to={`/menu-items-details/${item.id}`}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg text-gray-500 hover:text-green-600 transition-colors inline-block"
                  title="View"
                >
                  <Eye className="w-4 h-4" />
                </Link>
                <Link
                  to={`/menu-items/edit/${item.id}`}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg text-gray-500 hover:text-blue-600 transition-colors inline-block"
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
                </Link>

                <button
                  type="button"
                  onClick={() => openConfirmModal(item, 'trash')}
                  className="p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-gray-500 hover:text-red-600 transition-colors cursor-pointer"
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent leading-tight">
            Menu Inventory
          </h1>
          <p className="text-md text-gray-500 dark:text-slate-400 mt-1">
            Manage items, prices, and availability status.
          </p>
        </div>

        <Link
          to="/menu-items/create"
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/35 active:scale-[0.98]"
        >
          <UtensilsCrossed className="w-4 h-4" />
          <span>Add Menu Item</span>
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatsCard label="Total Items" value={loading && stats.total === 0 ? '...' : stats.total} />
        <StatsCard label="Active Items" value={loading && stats.active === 0 ? '...' : stats.active} />
        <StatsCard label="Inactive Items" value={loading && stats.inactive === 0 ? '...' : stats.inactive} />
        <StatsCard label="Trash" value={loading && stats.trash === 0 ? '...' : stats.trash} />
      </div>

      <Toolbar
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search menu items..."
        showSearch={true}
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
          {
            id: 'category-filter',
            placeholder: 'Category...',
            value: selectedCategory,
            onChange: handleCategoryFilterChange,
            options: [
              { label: 'All Categories', value: 'all' },
              ...categories.map((cat) => ({
                label: cat.name,
                value: cat.id.toString(),
              })),
            ],
          },
        ]}
      />

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <Table
          columns={columns}
          data={items}
          renderRow={renderRow}
          loading={loading}
          error={error}
          onRetry={fetchMenuItems}
          emptyIcon={isFiltered ? Search : UtensilsCrossed}
          emptyTitle={isFiltered ? 'No menu items found' : 'No items added yet'}
          emptyDescription={
            isFiltered
              ? 'No menu items matched your current filter or search criteria.'
              : 'Get started by adding your first menu item to the inventory.'
          }
        />

        {!loading && !error && items.length > 0 && (
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
          confirmModal.action === 'trash' ? 'Move Menu Item to Trash' :
          confirmModal.action === 'restore' ? 'Restore Menu Item' :
          'Permanently Delete Menu Item'
        }
        message={
          confirmModal.action === 'trash' ? (
            <>Are you sure you want to move <span className="font-bold text-slate-900 dark:text-slate-200">"{confirmModal.item?.name}"</span> to the trash? This may affect order history or reports.</>
          ) : confirmModal.action === 'restore' ? (
            <>Are you sure you want to restore <span className="font-bold text-slate-900 dark:text-slate-200">"{confirmModal.item?.name}"</span>? It will be available again.</>
          ) : (
            <>Are you sure you want to <span className="font-bold text-rose-600">permanently delete</span> <span className="font-bold text-slate-900 dark:text-slate-200">"{confirmModal.item?.name}"</span>? This action cannot be undone and will permanently destroy it from the database.</>
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