import React, { useState, useEffect, useCallback } from 'react';
import {
  Trash2, Layers, AlertCircle,
  PlusCircle, Search,
  Edit, CheckCircle2, XCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Toolbar from '../../../components/Toolbar';
import Pagination from '../../../components/common/Pagination';
import ConfirmationModal from '../../../components/common/ConfirmationModal';
import EmptyState from '../../../components/common/EmptyState';
import StatusBadge from '../../../components/StatusBadge';
import api from '../../../services/api';
import toast from 'react-hot-toast';
import { formatPrice } from '../../../utils/formatters';

export default function ModifierGroups() {
  const [groups, setGroups] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    total: 0,
    from: 0,
    to: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch Modifier Groups from Backend API
  const fetchModifierGroups = useCallback(async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/modifier-groups', {
        params: {
          search: searchQuery || undefined,
          page: page,
          per_page: 12,
        },
      });

      const responseData = response.data?.data || {};

      if (Array.isArray(responseData)) {
        setGroups(responseData);
        setPagination({
          currentPage: 1,
          lastPage: 1,
          total: responseData.length,
          from: 1,
          to: responseData.length
        });
      } else {
        setGroups(responseData.data || []);
        setPagination({
          currentPage: responseData.current_page || 1,
          lastPage: responseData.last_page || 1,
          total: responseData.total || 0,
          from: responseData.from || 0,
          to: responseData.to || 0,
        });
      }
    } catch (err) {
      setError(err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchModifierGroups(currentPage);
    }, 300);

    return () => clearTimeout(timer);
  }, [fetchModifierGroups, currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.lastPage && newPage !== currentPage) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Open Confirmation Modal
  const handleOpenDeleteModal = (group) => {
    setGroupToDelete(group);
    setIsDeleteModalOpen(true);
  };

  // Perform Delete Action
  const handleConfirmDelete = async () => {
    if (!groupToDelete) return;
    setIsDeleting(true);
    try {
      const response = await api.delete(`/modifier-groups/${groupToDelete.id}`);
      toast.success(response?.data?.message);
      setIsDeleteModalOpen(false);
      setGroupToDelete(null);
      fetchModifierGroups(currentPage);
    } catch (err) {
      toast.error(err.response?.data?.message);
    } finally {
      setIsDeleting(false);
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

      {/* Search Toolbar */}
      <Toolbar
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search groups or options..."
        showSearch={true}
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
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center">
          <EmptyState icon={AlertCircle} title={error} />
        </div>
      ) : groups.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center">
          <EmptyState
            icon={searchQuery ? Search : Layers}
            title={searchQuery ? 'No results found' : 'No modifier groups yet'}
            description={searchQuery ? 'Try adjusting your search terms.' : 'Create your first group to start adding options to menu items.'}
            action={!searchQuery && (
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
              return (
                <div
                  key={group.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden"
                >
                  {/* Card Header */}
                  <div className="p-4 space-y-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                    <div className="flex justify-between items-start gap-2 ">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm text-slate-400">Name:</span>
                        <h2 className="font-bold text-base text-slate-900 dark:text-white truncate pr-2">
                          {group.name}
                        </h2>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-slate-400">Description:</span>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 min-h-[1.25rem]">
                        {group.description}
                      </p>
                    </div>

                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] uppercase font-semibold text-slate-400">Modifier Group:</span>
                        <StatusBadge status={group.is_active ? 'active' : 'inactive'} />
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] uppercase font-semibold text-slate-400">Status:</span>
                        <StatusBadge status={group.is_required ? 'Required' : 'Optional'} />
                      </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-medium px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md">
                        Min: {group.min_select ?? 0}
                      </span>
                      <span className="text-xs font-medium px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md">
                        Max: {group.max_select ?? 1}
                      </span>
                    </div>
                  </div>

                  {/* Options List with Numbering */}
                  <div className="p-4 flex-grow">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Options
                      </span>
                    </div>

                    <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
                      {group.options && group.options.length > 0 ? (
                        group.options.map((option, index) => {
                          return (
                            <div
                              key={option.id}
                              className="flex justify-between items-center p-1.5 bg-slate-50/60 dark:bg-slate-800/40 rounded-lg"
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
                          );
                        })
                      ) : (
                        <div className="text-center py-3 text-sm text-slate-400 italic">
                          No options added yet.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-1.5">
                    <Link
                      to={`/modifier-groups/edit/${group.id}`}
                     className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg text-gray-500 hover:text-blue-600 transition-colors inline-block"
              title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleOpenDeleteModal(group)}
                     className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-gray-500 hover:text-red-600 transition-colors cursor-pointer"
              title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-center">

            <Pagination
              currentPage={currentPage}
              totalPages={pagination.lastPage}
              totalRecords={pagination.total}
              onPageChange={handlePageChange}
              maxVisible={5}
            />
          </div>
        </>
      )}

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          if (!isDeleting) {
            setIsDeleteModalOpen(false);
            setGroupToDelete(null);
          }
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Modifier Group"
        message={
          <>
            Are you sure you want to delete <span className="font-bold text-slate-900 dark:text-white">"{groupToDelete?.name}"</span>?
            <br />
            <span className="text-sm text-slate-500 mt-2 block">
              This action cannot be undone and will remove these options from all linked menu items.
            </span>
          </>
        }
        isLoading={isDeleting}
        confirmText="Delete Group"
        confirmClassName="bg-rose-600 hover:bg-rose-700 text-white"
      />
    </div>
  );
}