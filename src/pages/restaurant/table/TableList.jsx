import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search, Users, Trash2,
  AlertCircle, QrCode, RefreshCw, Download,
  Edit, Hash, Calendar, Activity
} from 'lucide-react';
import StatsCard from '../../../components/cards/StatsCard';
import Toolbar from '../../../components/Toolbar';
import Pagination from '../../../components/common/Pagination';
import EmptyState from '../../../components/common/EmptyState';
import StatusBadge from '../../../components/StatusBadge';
import ConfirmationModal from '../../../components/common/ConfirmationModal';
import api from '../../../services/api';
import toast from 'react-hot-toast';

export default function TableList() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL-driven state
  const currentPage = Number(searchParams.get('page')) || 1;
  const searchQuery = searchParams.get('search') || '';
  const statusFilter = searchParams.get('status') || 'all';

  // Primary Data & UI States
  const [tables, setTables] = useState([]);
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

  // Confirmation Modal State
  const [deleteModalState, setDeleteModalState] = useState({
    isOpen: false,
    tableId: null,
    tableName: '',
    isDeleting: false
  });

  // Force Delete Modal State
  const [isForceDeleteModalOpen, setIsForceDeleteModalOpen] = useState(false);
  const [tableToForceDelete, setTableToForceDelete] = useState(null);
  const [isForceDeleting, setIsForceDeleting] = useState(false);

  // URL update helper
  const updateUrlParams = useCallback((newPage, newSearch, newStatus) => {
    const params = new URLSearchParams();
    if (newPage > 1) params.set('page', String(newPage));
    if (newSearch) params.set('search', newSearch);
    if (newStatus && newStatus !== 'all') params.set('status', newStatus);
    setSearchParams(params, { replace: true });
  }, [setSearchParams]);

  // Fetch Tables Data from API
  const fetchTables = useCallback(async () => {
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
      const response = await api.get('/tables', { params });
     const responseData = response.data;

      setTables(responseData.data.data);
      setStats(responseData.stats); 

      const pagination = responseData.data

      setLastPage(pagination?.last_page || 1);
      setTotalItems(pagination?.total || 0);

    } catch (err) {
      setError(err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, statusFilter]);

  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  const handleSearchChange = (query) => {
    updateUrlParams(1, query, statusFilter);
  };

  const handleStatusFilterChange = (selectedStatus) => {
    updateUrlParams(1, searchQuery, selectedStatus || 'all');
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= lastPage) {
      updateUrlParams(newPage, searchQuery, statusFilter);
    }
  };

  // Direct client-side download without extra API request
  const handleDownloadQr = (e, table) => {
    e.stopPropagation();

    if (!table.qr_code) {
      toast.error('No QR code available to download.');
      return;
    }

    const blob = new Blob([table.qr_code], { type: 'image/svg+xml;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `table-${table.slug}-qr.svg`);
    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);
  };

  // Regenerate QR with Toast feedback
  const handleRegenerateQr = async (e, tableId) => {
    e.stopPropagation();

    try {
      const response = await api.post(`/tables/${tableId}/regenerate-qr`);

      setTables(prev => prev.map(table =>
        table.id === tableId ? response.data.data : table
      ));

      toast.success(response.data.message);
    } catch (err) {
      toast.error(err.response?.data?.message);
    }
  };

  // Open Modal
  const openDeleteModal = (e, table) => {
    e.stopPropagation();
    setDeleteModalState({
      isOpen: true,
      tableId: table.id,
      tableName: table.name,
      isDeleting: false
    });
  };

  // Close Modal
  const closeDeleteModal = () => {
    if (deleteModalState.isDeleting) return;
    setDeleteModalState({
      isOpen: false,
      tableId: null,
      tableName: '',
      isDeleting: false
    });
  };

  // Confirm Delete Handler
  const handleConfirmDelete = async () => {
    const { tableId } = deleteModalState;
    if (!tableId) return;

    setDeleteModalState(prev => ({ ...prev, isDeleting: true }));

    try {
      const response = await api.delete(`/tables/${tableId}`);
      toast.success(response.data?.message);
      closeDeleteModal();
      await fetchTables();
    } catch (err) {
      toast.error(err.response?.data?.message);
      setDeleteModalState(prev => ({ ...prev, isDeleting: false }));
    }
  };

  // Restore Handler
  const handleRestore = async (e, table) => {
    e.stopPropagation();
    try {
      const response = await api.patch(`/tables/${table.id}/restore`);
      toast.success(response.data?.message);
      await fetchTables();
    } catch (err) {
      toast.error(err.response?.data?.message);
    }
  };

  // Force Delete Handlers
  const openForceDeleteModal = (e, table) => {
    e.stopPropagation();
    setTableToForceDelete(table);
    setIsForceDeleteModalOpen(true);
  };

  const handleConfirmForceDelete = async () => {
    if (!tableToForceDelete) return;
    setIsForceDeleting(true);
    try {
      const response = await api.delete(`/tables/${tableToForceDelete.id}/force`);
      toast.success(response.data?.message);
      setIsForceDeleteModalOpen(false);
      setTableToForceDelete(null);
      await fetchTables();
    } catch (err) {
      toast.error(err.response?.data?.message);
    } finally {
      setIsForceDeleting(false);
    }
  };
  const isFiltered = Boolean(searchQuery || statusFilter !== 'all');

  return (
    <div className="p-1 sm:p-4 space-y-6 bg-gray-50 dark:bg-slate-950 min-h-screen text-gray-900 dark:text-slate-100 transition-colors duration-200">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent leading-tight">
              Floor Plan & Tables
            </h1>
            <p className="text-md text-slate-500 dark:text-slate-400 mt-0.5">
              Manage seating arrangements, QR codes, and table statuses in real-time.
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate('/table/create')}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl text-sm font-medium transition-all duration-200 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 active:scale-[0.98]"
        >
          <QrCode className="w-4 h-4" /> Add New Table
        </button>
      </div>

        {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard label="Total Tables" value={loading && stats.total === 0 ? '...' : stats.total} />
        <StatsCard label="Active Tables" value={loading && stats.active === 0 ? '...' : stats.active} />
        <StatsCard label="Inactive Tables" value={loading && stats.inactive === 0 ? '...' : stats.inactive}/>
        <StatsCard label="Trash" value={loading && stats.trash === 0 ? '...' : stats.trash}/>
      </div>


     
      {/* Search & Filter Toolbar*/}
      <Toolbar
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search by name or slug..."
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
      />

      {/* 1. LOADING SKELETON STATE */}
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 flex gap-4 animate-pulse"
            >
              <div className="w-40 h-40 rounded-xl bg-slate-200 dark:bg-slate-800 shrink-0" />
              <div className="flex-1 space-y-3 py-1">
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
                <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-2/3" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
                <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-lg w-full mt-4" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        /* 2. ERROR STATE */
        <div className="p-12">
          <EmptyState
            icon={AlertCircle}
            title={error}
          />
        </div>
      ) : tables.length === 0 ? (
        /* 3. EMPTY STATE */
        <div className="p-12">
          <EmptyState
            icon={isFiltered ? Search : QrCode}
            title={isFiltered ? 'No matching tables found' : 'No floor plan tables configured'}
            description={
              isFiltered
                ? 'No table records match your current search criteria or status filter.'
                : 'Start designing your layout by registering dining and seating tables.'
            }
          />
        </div>
      ) : (
        /* 4. LIST/GRID DISPLAY STATE - IMPROVED CARD UI */
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-5">
          {tables.map((table) => {
            const isTrashed = Boolean(table.deleted_at);

            return (
              <div
                key={table.id}
                className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-orange-500/30 dark:hover:border-orange-500/30 transition-all duration-300 overflow-hidden" >
                <div className="flex flex-col sm:flex-row h-full">

                  {/* QR CODE SECTION - Left Side */}
                  <div className="sm:w-48 shrink-0 bg-slate-50 dark:bg-slate-800/30 border-b sm:border-b-0 sm:border-r border-slate-100 dark:border-slate-800 p-4 flex flex-col items-center justify-center gap-3 relative">
                    {table.qr_code ? (
                      <>
                        <div
                          className="w-32 h-32 rounded-lg bg-white p-2 shadow-sm flex items-center justify-center overflow-hidden [&>svg]:w-full [&>svg]:h-full"
                          dangerouslySetInnerHTML={{ __html: table.qr_code }}
                        />
                        <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">QR code</span>
                      </>
                    ) : (
                      <div className="w-32 h-32 rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex flex-col items-center justify-center gap-2">
                        <QrCode className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                        <span className="text-[10px] text-slate-400 font-medium">No QR</span>
                      </div>
                    )}
                  </div>

                  {/* CONTENT SECTION - Right Side */}
                  <div className="flex-1 p-4 flex flex-col justify-between min-w-0">

                    {/* Header: Title & Actions */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="min-w-0">

                         <div className="flex items-center gap-1.5">
                          <span className="text-sm text-slate-400">ID:</span>
                          <h3 className="font-bold text-md text-slate-900 dark:text-slate-100 truncate pr-2">
                            {table.id}
                          </h3>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm text-slate-400">Name:</span>
                          <h3 className="font-bold text-md text-slate-900 dark:text-slate-100 truncate pr-2">
                            {table.name}
                          </h3>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-slate-400">Slug:</span>
                          <p className="text-xs text-slate-400 dark:text-slate-500 font-mono truncate flex items-center gap-1">
                            {table.slug}
                          </p>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="flex items-center gap-1 shrink-0">
                        {isTrashed ? (
                          <>
                            <button
                              onClick={(e) => handleRestore(e, table)}
                              className="p-2 rounded-lg text-emerald-600 hover:bg-emerald-100 dark:hover:bg-emerald-950/30 transition-colors"
                              title="Restore"
                            >
                              <RefreshCw className="w-4 h-4" />
                            </button>
                            {/* <button
                              onClick={(e) => openForceDeleteModal(e, table)}
                              className="p-2 rounded-lg text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
                              title="Permanently Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button> */}
                          </>
                        ) : (
                          <>
                            <Link to={`/table/edit/${table.id}`} onClick={(e) => e.stopPropagation()}>
                              <button
                                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg text-gray-500 hover:text-blue-600 transition-colors inline-block"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                            </Link>
                            <button
                              onClick={(e) => openDeleteModal(e, table)}
                              className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-gray-500 hover:text-red-600 transition-colors cursor-pointer"
                              title="Remove"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>


                    {/* Metadata Grid */}
                    <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-4">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                          <Activity className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] text-slate-400 uppercase font-medium">Table</span>
                          <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                             <StatusBadge status={table.is_active ? 'active' : 'inactive'} />
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                          <Users className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] text-slate-400 uppercase font-medium">Capacity</span>
                          <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">{table.capacity} Seats</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-md bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400">
                          <Hash className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] text-slate-400 uppercase font-medium">Table No.</span>
                          <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">{table.table_number}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                        <div className="p-1.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                          <Calendar className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] text-slate-400 uppercase font-medium">Last Updated</span>
                          <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                            {new Date(table.updated_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 mt-auto">
                      <button
                        onClick={(e) => handleRegenerateQr(e, table.id)}
                        className="flex-1 py-2 px-3 text-xs font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <RefreshCw  className="w-3.5 h-3.5" />
                        Regenerate QR
                      </button>

                      <button
                        onClick={(e) => handleDownloadQr(e, table)}
                        className="flex-1 py-2 px-3 text-xs font-medium bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm shadow-orange-500/20"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && tables.length > 0 && (
        <div className="flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={lastPage}
            totalRecords={totalItems}
            onPageChange={handlePageChange}
            maxVisible={5}
          />
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModalState.isOpen}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Delete Table"
        message={`Are you sure you want to delete "${deleteModalState.tableName}"? This action cannot be undone.`}
        isLoading={deleteModalState.isDeleting}
        confirmText="Delete Table"
        cancelText="Cancel"
      />

      {/* Force Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isForceDeleteModalOpen}
        onClose={() => {
          if (!isForceDeleting) {
            setIsForceDeleteModalOpen(false);
            setTableToForceDelete(null);
          }
        }}
        onConfirm={handleConfirmForceDelete}
        title="Permanently Delete Table"
        message={
          <>
            Are you sure you want to <span className="font-bold text-red-600">permanently delete</span>{' '}
            <span className="font-bold text-slate-900 dark:text-slate-200">"{tableToForceDelete?.name}"</span>?
            <br />
            <span className="text-sm text-slate-500 mt-2 block">
              This action cannot be undone and will permanently destroy it from the database.
            </span>
          </>
        }
        isLoading={isForceDeleting}
        confirmText="Permanently Delete"
        confirmClassName="bg-rose-600 hover:bg-rose-700 text-white"
      />
    </div>
  );
}