import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Plus, Search, Users, Trash2, 
  Coffee, AlertCircle,
  QrCode, PlusCircle, RefreshCw, Download, 
  RotateCcw, LayoutGrid, Edit
} from 'lucide-react';
import StatsCard from '../../../components/cards/StatsCard';
import Toolbar from '../../../components/Toolbar';
import Pagination from '../../../components/common/Pagination';
import EmptyState from '../../../components/common/EmptyState';
import StatusBadge from '../../../components/ui/StatusBadge';
import ConfirmationModal from '../../../components/common/ConfirmationModal';
import api from '../../../services/api';
import toast from 'react-hot-toast';

export default function TableList() {
  const navigate = useNavigate();

  // Primary Data & UI States
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Pagination State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationMeta, setPaginationMeta] = useState({ total: 0, lastPage: 1 });
  
  // Per-item Action Loading State
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Confirmation Modal State
  const [deleteModalState, setDeleteModalState] = useState({
    isOpen: false,
    tableId: null,
    tableName: '',
    isDeleting: false
  });

  // Fetch Tables Data from API
  const fetchTables = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: currentPage,
        per_page: 6,
      };

      if (searchQuery) params.search = searchQuery;
      if (statusFilter !== 'all') params.status = statusFilter;

      const response = await api.get('/tables', { params });
      
      const paginatedData = response.data.data;
      setTables(paginatedData.data || []);
      setPaginationMeta({
        total: paginatedData.total || 0,
        lastPage: paginatedData.last_page || 1
      });
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch tables.');
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, statusFilter]);

  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleFilterChange = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
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
    setActionLoadingId(tableId);

    try {
      const response = await api.post(`/${tableId}/regenerate-qr`);

      setTables(prev => prev.map(table => 
        table.id === tableId ? response.data.data : table
      ));
      
      toast.success(response.data.message);
    } catch (err) {
      const errorMsg = err.response?.data?.message;
      toast.error(errorMsg);
    } finally {
      setActionLoadingId(null);
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
    setActionLoadingId(tableId);

    try {
      const response = await api.delete(`/tables/${tableId}`);
      toast.success(response.data?.message);
      closeDeleteModal();
      await fetchTables();
    } catch (err) {
      toast.error(err.response?.data?.message);
      setDeleteModalState(prev => ({ ...prev, isDeleting: false }));
    } finally {
      setActionLoadingId(null);
    }
  };

  const statusFilters = ['all', 'available', 'occupied', 'reserved', 'cleaning'];

  return (
    <div className="p-2 sm:p-6 space-y-6 bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-900 dark:text-slate-100 transition-colors duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-md shadow-orange-500/20">
            <LayoutGrid className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent leading-tight">
              Floor Plan & Tables
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Manage seating arrangements, QR codes, and table statuses in real-time.
            </p>
          </div>
        </div>
        <button 
          onClick={() => navigate('/table/create')}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl text-sm font-medium transition-all duration-200 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 active:scale-[0.98]"
        >
          <PlusCircle className="w-4 h-4" /> Add New Table
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
        <StatsCard 
          label="Total" 
          value={loading ? '...' : paginationMeta.total} 
          valueColor="text-orange-600 dark:text-orange-400"
        />
        <StatsCard 
          label="Active" 
          value={loading ? '...' : tables.filter(t => t.is_active).length} 
          valueColor="text-blue-600 dark:text-blue-400"
        />
      </div>

      {/* Search & Filter Toolbar */}
      <Toolbar
        filters={statusFilters}
        activeFilter={statusFilter}
        onFilterChange={handleFilterChange}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search by name or slug..."
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
                <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-2/3" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
                <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-lg w-full mt-4" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        /* 2. ERROR STATE */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12">
          <EmptyState
            icon={AlertCircle}
            title="Unable to load tables"
            description={error}
            action={
              <button
                onClick={fetchTables}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/30 rounded-lg transition-colors duration-200"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Try again
              </button>
            }
          />
        </div>
      ) : tables.length === 0 ? (
        /* 3. EMPTY STATE */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12">
          <EmptyState
            icon={searchQuery || statusFilter !== 'all' ? Search : Coffee}
            title={
              searchQuery || statusFilter !== 'all'
                ? 'No matching tables found'
                : 'No floor plan tables configured'
            }
            description={
              searchQuery || statusFilter !== 'all'
                ? 'No table records match your current search criteria or status filter.'
                : 'Start designing your layout by registering dining and seating tables.'
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
                <button
                  onClick={() => navigate('/table/create')}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors duration-200"
                >
                  <Plus className="w-3.5 h-3.5" /> Create First Table
                </button>
              )
            }
          />
        </div>
      ) : (
        /* 4. LIST/GRID DISPLAY STATE */
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-5">
          {tables.map((table) => {
            const isActionBusy = actionLoadingId === table.id;

            return (
              <div 
                key={table.id}
                className={`group relative bg-white dark:bg-slate-900 rounded-2xl p-4 transition-all duration-300 border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-black/40 hover:border-orange-500/30 dark:hover:border-orange-500/30 flex flex-col sm:flex-row gap-4 items-center sm:items-stretch ${
                  isActionBusy ? 'opacity-60 pointer-events-none' : ''
                }`}
              >
                {/* QR CODE SECTION (Full size preserved) */}
                <div className="relative shrink-0 flex items-center justify-center p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 group-hover:border-slate-200 dark:group-hover:border-slate-700 transition-colors">
                  {table.qr_code ? (
                    <div 
                      className="w-40 h-40 rounded-lg bg-white p-2 shadow-sm flex items-center justify-center overflow-hidden [&>svg]:w-full [&>svg]:h-full [&>svg]:max-w-full [&>svg]:max-h-full"
                      dangerouslySetInnerHTML={{ __html: table.qr_code }}
                    />
                  ) : (
                    <div className="w-40 h-40 rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-700 p-3 bg-white dark:bg-slate-900 flex flex-col items-center justify-center gap-2">
                      <QrCode className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                      <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">No QR Code</span>
                    </div>
                  )}
                </div>

                {/* CONTENT SECTION */}
                <div className="flex-1 flex flex-col justify-between w-full min-w-0">
                  {/* Top Header: Title + Edit/Delete */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 truncate group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                        {table.name}
                      </h3>

                      <div className="flex items-center gap-1 shrink-0 bg-slate-50 dark:bg-slate-800/60 p-1 rounded-lg border border-slate-100 dark:border-slate-800"> 
                        <Link 
                          to={`/table/edit/${table.id}`} 
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button 
                            className="p-1 rounded text-slate-400 hover:text-orange-600 hover:bg-white dark:hover:bg-slate-700 dark:text-slate-400 dark:hover:text-orange-400 transition-all shadow-none hover:shadow-xs"
                            title="Edit table"
                            aria-label="Edit table"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                        </Link>
                        <button 
                          onClick={(e) => openDeleteModal(e, table)}
                          className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-white dark:hover:bg-slate-700 dark:text-slate-400 dark:hover:text-rose-400 transition-all shadow-none hover:shadow-xs"
                          title="Delete table"
                          aria-label="Delete table"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 dark:text-slate-500 font-mono truncate">
                      /{table.slug}
                    </p>
                  </div>

                  {/* Metadata Chips: Occupancy & Statuses */}
                  <div className="py-2 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge
                        status={table.is_active ? 'active' : 'inactive'}
                        activeLabel="Active"
                        inactiveLabel="Inactive"
                        activeColor="emerald"
                        inactiveColor="rose"
                        showIcon={true}
                        size="xs"
                      />

                      <StatusBadge
                        status={table.status}
                        activeLabel="Available"
                        inactiveLabel={table.status ? table.status.charAt(0).toUpperCase() + table.status.slice(1) : ''}
                        activeColor="emerald"
                        inactiveColor={
                          table.status === 'occupied' ? 'rose' :
                          table.status === 'reserved' ? 'blue' :
                          table.status === 'cleaning' ? 'amber' :
                          'gray'
                        }
                        showIcon={false}
                        size="xs"
                      />
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>{table.capacity} Capacity Seats</span>
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                    <button 
                      onClick={(e) => handleRegenerateQr(e, table.id)}
                      disabled={isActionBusy}
                      className="flex-1 py-1.5 px-3 text-xs font-medium bg-slate-100 hover:bg-orange-50 dark:bg-slate-800 dark:hover:bg-orange-950/40 text-slate-700 hover:text-orange-600 dark:text-slate-300 dark:hover:text-orange-400 rounded-lg transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Regenerate QR Code"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isActionBusy ? 'animate-spin' : ''}`} />
                      Regenerate
                    </button>

                    <button 
                      onClick={(e) => handleDownloadQr(e, table)}
                      className="flex-1 py-1.5 px-3 text-xs font-medium bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm shadow-orange-500/20"
                      title="Download QR Code"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && tables.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={paginationMeta.lastPage}
          totalRecords={paginationMeta.total}
          onPageChange={setCurrentPage}
          maxVisible={5}
        />
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
    </div>
  );
}