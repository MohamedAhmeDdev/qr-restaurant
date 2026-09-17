import React, { useState, useEffect, useCallback } from 'react';
import {
  Trash2, Layers, AlertCircle,
  PlusCircle, Search,
  Edit, RefreshCw
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import Toolbar from '../../../components/common/Toolbar';
import Pagination from '../../../components/common/Pagination';
import ConfirmationModal from '../../../components/common/ConfirmationModal';
import EmptyState from '../../../components/common/EmptyState';
import StatusBadge from '../../../components/common/StatusBadge';
import api from '../../../services/api';
import toast from 'react-hot-toast';
import { useFormatPrice } from '../../../contexts/useFormatPrice';
import StatsCard from '../../../components/cards/StatsCard';

export default function ModifierGroups() {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL-driven state
  const currentPage = Number(searchParams.get('page')) || 1;
  const searchQuery = searchParams.get('search') || '';
  const statusFilter = searchParams.get('status') || 'all';

  const [groups, setGroups] = useState([]);

     const [stats, setStats] = useState({
        total: 0,
        active: 0,
        inactive: 0,
        trash: 0
      });
  
  // Pagination State
  const [lastPage, setLastPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  
  const {formatPrice} = useFormatPrice();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Unified Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    group: null,
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

  // Fetch Modifier Groups from Backend API
  const fetchModifierGroups = useCallback(async () => {
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

    if (searchQuery.trim() !== '') {
      params.search = searchQuery.trim();
    }

    try {
      const response = await api.get('/modifier-groups', { params });
      const responseData = response.data;

      setGroups(responseData.data.data);
      setStats(responseData.stats);

      const pagination = responseData.data;
      setLastPage(pagination?.last_page || 1);
      setTotalItems(pagination?.total || 0);

    } catch (err) {
      setError(err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, statusFilter]);

  useEffect(() => {
    fetchModifierGroups();
  }, [fetchModifierGroups]);

  const handleSearchChange = (query) => {
    updateUrlParams(1, query, statusFilter);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= lastPage) {
      updateUrlParams(newPage, searchQuery, statusFilter);
    }
  };

  const handleStatusFilterChange = (selectedStatus) => {
    const statusMap = {
      'All Statuses': 'all',
      'All': 'all',
      'Active': 'active',
      'Inactive': 'inactive',
      'Trash': 'trash',
    };
    const mappedStatus = statusMap[selectedStatus] || selectedStatus || 'all';
    updateUrlParams(1, searchQuery, mappedStatus);
  };

  const currentActiveFilterLabel = {
    'all': 'All',
    'active': 'Active',
    'inactive': 'Inactive',
    'trash': 'Trash',
  }[statusFilter] || 'All';

  const isFiltered = Boolean(searchQuery || statusFilter !== 'all');

  // --- UNIFIED CONFIRMATION MODAL HANDLERS ---
  const openConfirmModal = (group, action) => {
    setConfirmModal({ isOpen: true, group, action, isProcessing: false });
  };

  const closeConfirmModal = () => {
    if (!confirmModal.isProcessing) {
      setConfirmModal({ isOpen: false, group: null, action: null, isProcessing: false });
    }
  };

  const handleConfirmAction = async () => {
    const { group, action } = confirmModal;
    if (!group || !action) return;

    setConfirmModal(prev => ({ ...prev, isProcessing: true }));

    try {
      if (action === 'trash') {
        const response = await api.delete(`/modifier-groups/${group.id}`);
        toast.success(response?.data?.message);
      } else if (action === 'restore') {
        const response = await api.patch(`/modifier-groups/${group.id}/restore`);
        toast.success(response?.data?.message);
      } else if (action === 'forceDelete') {
        const response = await api.delete(`/modifier-groups/${group.id}/force`);
        toast.success(response?.data?.message);
      }
      closeConfirmModal();
      fetchModifierGroups();
    } catch (err) {
      toast.error(err.response?.data?.message);
      setConfirmModal(prev => ({ ...prev, isProcessing: false }));
    }
  };

  return (
    <div className="p-1 sm:p-4 space-y-6 bg-gray-50 dark:bg-slate-950 min-h-screen text-gray-900 dark:text-slate-100 transition-colors duration-200">

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">
            Modifier Groups
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-0.5 text-sm">
            Organize menu customizations like sizes, toppings, and preferences.
          </p>
        </div>

        <Link
          to="/modifier-groups/create"
          className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create Group</span>
        </Link>
      </div>

        {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatsCard label="Total Groups" value={loading && stats.total === 0 ? '...' : stats.total} />
        <StatsCard label="Active Groups" value={loading && stats.active === 0 ? '...' : stats.active} />
        <StatsCard label="Inactive Groups" value={loading && stats.inactive === 0 ? '...' : stats.inactive} />
        <StatsCard label="Trash" value={loading && stats.trash === 0 ? '...' : stats.trash} />
      </div>

      {/* Search Toolbar */}
      <Toolbar
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search groups or options..."
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
        ]}
        activeFilter={currentActiveFilterLabel}
        onFilterChange={handleStatusFilterChange}
      />

      {/* Content Area */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3 animate-pulse">
              <div className="flex justify-between">
                <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
                <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-14" />
              </div>
              <div className="h-3.5 bg-slate-100 dark:bg-slate-800/50 rounded w-3/4" />
              <div className="space-y-1.5 pt-3">
                <div className="h-7 bg-slate-100 dark:bg-slate-800/40 rounded-lg" />
                <div className="h-7 bg-slate-100 dark:bg-slate-800/40 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="p-8 text-center">
          <EmptyState icon={AlertCircle} title={error} />
        </div>
      ) : groups.length === 0 ? (
        <div className="p-8 text-center">
          <EmptyState
            icon={isFiltered ? Search : Layers}
            title={isFiltered ? 'No results found' : 'No modifier groups yet'}
            description={isFiltered ? 'Try adjusting your search terms.' : 'Create your first group to start adding options to menu items.'}
            action={!isFiltered && (
              <Link
                to="/modifier-groups/create"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors"
              >
                <PlusCircle className="w-4 h-4" /> Create Group
              </Link>
            )}
          />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {groups.map((group) => {
              const isTrashed = Boolean(group.deleted_at);
              return (
                <div
                  key={group.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden"
                >
                  {/* Card Header */}
                  <div className="p-4 space-y-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                    <div className="flex justify-between items-start gap-2">
                      <h2 className="font-bold text-lg text-slate-900 dark:text-white truncate">
                        {group.name}
                      </h2>
                      <span className="text-xs font-mono text-slate-400">ID: {group.id}</span>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 min-h-[1.25rem]">
                      {group.description || 'No description provided.'}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] uppercase font-semibold text-slate-400">Modifier Group:</span>
                      <StatusBadge status={group.is_active ? 'active' : 'inactive'} />
                    </div>

                   <div className="flex items-center gap-1">
                      <span className="text-[10px] uppercase font-semibold text-slate-400">Selection:</span>
                      <StatusBadge status={group.is_required ? 'Required' : 'Optional'} />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-xs font-medium px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md">
                        Min: {group.min_select ?? 0}
                      </span>
                      <span className="text-xs font-medium px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md">
                        Max: {group.max_select ?? 1}
                      </span>
                    </div>
                  </div>

                  {/* Options List */}
                  <div className="p-4 flex-grow">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Options ({group.options?.length})
                      </span>
                    </div>

                    <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
                      {group.options && group.options.length > 0 ? (
                       group.options.map((option, index) => (
                            <div
                              key={option.id}
                              className="flex justify-between items-center p-2 bg-slate-50/60 dark:bg-slate-800/40 rounded-lg"
                            >
                              <div className="flex items-center gap-2.5 min-w-0 mr-2">
                                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-[10px] font-semibold flex items-center justify-center">
                                  {index + 1}
                                </span>
                                <div className="flex flex-col min-w-0">
                                  <span className="text-sm font-medium truncate text-slate-700 dark:text-slate-200">
                                    {option.name}
                                  </span>
                                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                                    {formatPrice(option.price)}
                                  </span>
                                </div>
                              </div>

                              <StatusBadge status={option.is_available ? 'Available' : 'Unavailable'} />
                            </div>
                          )
                        )
                      ) : (
                        <div className="text-center py-3 text-sm text-slate-400 italic">
                          No options added yet.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-1.5">
                    {isTrashed ? (
                      <>
                        <button
                          type="button"
                          onClick={() => openConfirmModal(group, 'restore')}
                          className="p-2 rounded-lg text-emerald-600 hover:bg-emerald-100 dark:hover:bg-emerald-950/30 transition-colors"
                          title="Restore"
                        >
                         <RefreshCw className="w-4 h-4" />
                        </button>
                        {/* <button
                          type="button"
                          onClick={() => openConfirmModal(group, 'forceDelete')}
                          className="p-2 rounded-lg text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
                          title="Permanently Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button> */}
                      </>
                    ) : (
                      <>
                        <Link
                          to={`/modifier-groups/edit/${group.id}`}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg text-gray-500 hover:text-blue-600 transition-colors inline-block"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => openConfirmModal(group, 'trash')}
                          className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-gray-500 hover:text-red-600 transition-colors cursor-pointer"
                          title="Remove"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-center">
            {!loading && !error && groups.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={lastPage}
                totalRecords={totalItems}
                onPageChange={handlePageChange}
                maxVisible={5}
              />
            )}
          </div>
        </>
      )}

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={closeConfirmModal}
        onConfirm={handleConfirmAction}
        title={
          confirmModal.action === 'trash' ? 'Move Modifier Group to Trash' :
          confirmModal.action === 'restore' ? 'Restore Modifier Group' :
          'Permanently Delete Modifier Group'
        }
        message={
          confirmModal.action === 'trash' ? (
            <>Are you sure you want to move <span className="font-bold text-slate-900 dark:text-white">"{confirmModal.group?.name}"</span> to the trash?<br /><span className="text-sm text-slate-500 mt-2 block">This will remove these options from all linked menu items, but it can be restored later.</span></>
          ) : confirmModal.action === 'restore' ? (
            <>Are you sure you want to restore <span className="font-bold text-slate-900 dark:text-white">"{confirmModal.group?.name}"</span>? It will be available again.</>
          ) : (
            <>Are you sure you want to <span className="font-bold text-rose-600">permanently delete</span> <span className="font-bold text-slate-900 dark:text-white">"{confirmModal.group?.name}"</span>?<br /><span className="text-sm text-slate-500 mt-2 block">This action cannot be undone and will permanently destroy it from the database.</span></>
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