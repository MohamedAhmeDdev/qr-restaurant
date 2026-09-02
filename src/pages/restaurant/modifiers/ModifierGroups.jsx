import React, { useState, useEffect, useCallback } from 'react';
import { 
  Plus, Edit2, Trash2, Layers, AlertCircle, 
  PlusCircle, RotateCcw, Search, 
  Edit
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Toolbar from '../../../components/Toolbar';
import Pagination from '../../../components/common/Pagination';
import ConfirmationModal from '../../../components/common/ConfirmationModal';
import EmptyState from '../../../components/common/EmptyState';
import api from '../../../services/api';
import toast from 'react-hot-toast';

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

  // Toggle option status with Toast feedback
  const toggleOptionStatus = async (groupId, option) => {
    const isCurrentlyAvailable = option.is_available ?? (option.status === 'active');
    const newStatus = !isCurrentlyAvailable;

    setGroups(prev => prev.map(group => {
      if (group.id !== groupId) return group;
      return {
        ...group,
        options: group.options.map(opt => 
          opt.id === option.id 
            ? { ...opt, is_available: newStatus, status: newStatus ? 'active' : 'inactive' }
            : opt
        )
      };
    }));

    try {
      const parentGroup = groups.find(g => g.id === groupId);
      if (!parentGroup) return;

      const updatedOptions = parentGroup.options.map(opt => ({
        id: opt.id,
        name: opt.name,
        price: opt.price,
        is_available: opt.id === option.id ? newStatus : (opt.is_available ?? (opt.status === 'active')),
      }));

     const response = await api.put(`/modifier-groups/${groupId}`, { options: updatedOptions });
     toast.success(response.data?.message);
    } catch (err) {
      toast.error(err.response?.data?.message);
      fetchModifierGroups(currentPage);
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
     const response =  await api.delete(`/modifier-groups/${groupToDelete.id}`);
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
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 bg-gray-50/50 dark:bg-slate-950 min-h-screen text-gray-900 dark:text-slate-100 transition-colors duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2 border-b border-gray-200/60 dark:border-slate-800/60">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-600 via-amber-500 to-orange-400 bg-clip-text text-transparent flex items-center gap-2.5">
            <div className="p-2 bg-orange-500/10 dark:bg-orange-500/20 rounded-xl text-orange-600 dark:text-orange-400">
              <Layers className="w-5 h-5 stroke-[2.5]" />
            </div>
            Modifier Groups
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-1">
            Manage reusable customer choice categories like sizes, toppings, and sides.
          </p>
        </div>
        
        <Link 
          to="/modifier-groups/create"
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/35 active:scale-[0.98]"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Modifier Group</span>
        </Link>
      </div>

      {/* Toolbar */}
      <Toolbar
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search modifier groups or options..."
        showSearch={true}
      />

      {/* 1. LOADING SKELETON STATE */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div 
              key={idx}
              className="bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 rounded-2xl p-5 space-y-4 animate-pulse"
            >
              <div className="flex justify-between items-center">
                <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
                <div className="h-4 bg-slate-100 dark:bg-slate-800/60 rounded-full w-16" />
              </div>
              <div className="h-3 bg-slate-100 dark:bg-slate-800/50 rounded w-3/4" />
              <div className="h-6 bg-slate-100 dark:bg-slate-800/60 rounded-lg w-1/3" />
              <div className="space-y-2 pt-2">
                <div className="h-8 bg-slate-100 dark:bg-slate-800/40 rounded-xl" />
                <div className="h-8 bg-slate-100 dark:bg-slate-800/40 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        /* 2. ERROR STATE */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-12">
          <EmptyState
            icon={AlertCircle}
            title="Unable to load modifier groups"
            description={error}
            action={
              <button
                onClick={() => fetchModifierGroups(currentPage)}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/30 rounded-lg transition-colors duration-200"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Try again
              </button>
            }
          />
        </div>
      ) : groups.length === 0 ? (
        /* 3. EMPTY STATE */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-12">
          <EmptyState
            icon={searchQuery ? Search : Layers}
            title={searchQuery ? 'No matching modifier groups' : 'No modifier groups created yet'}
            description={
              searchQuery 
                ? 'No modifier groups or associated options matched your query.' 
                : 'Start creating modifier groups like "Size", "Toppings", or "Spice Level" to attach options to menu items.'
            }
            action={
              searchQuery ? (
                <button
                  onClick={() => handleSearchChange('')}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors duration-200"
                >
                  Clear search
                </button>
              ) : (
                <Link
                  to="/modifier-groups/create"
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 rounded-lg transition-colors duration-200"
                >
                  <PlusCircle className="w-3.5 h-3.5" /> Add First Modifier Group
                </Link>
              )
            }
          />
        </div>
      ) : (
        /* 4. LIST DISPLAY STATE */
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {groups.map((group) => (
              <div
                key={group.id}
                className="bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group"
              >
                <div className="p-5">
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <h2 className="font-bold text-base text-gray-900 dark:text-white truncate">
                      {group.name}
                    </h2>
                    
                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border shrink-0 ${
                      group.is_required
                        ? 'bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20'
                        : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                    }`}>
                      {group.is_required ? 'Required' : 'Optional'}
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 dark:text-slate-400 mb-3 line-clamp-2 min-h-[32px]">
                    {group.description || 'No description provided.'}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 px-2.5 py-1 rounded-lg">
                      Selection: {group.min_select ?? 0} min / {group.max_select ?? 1} max
                    </span>
                  </div>

                  {/* Options List */}
                  <div className="border-t border-gray-100 dark:border-slate-800/80 pt-3 space-y-2">
                    <div className="flex justify-between items-center px-1">
                      <span className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">
                        Options ({group.options?.length || 0})
                      </span>
                    </div>

                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                      {group.options && group.options.length > 0 ? (
                        group.options.map((option) => {
                          const isActive = option.is_available ?? (option.status === 'active');
                          return (
                            <div
                              key={option.id}
                              className="flex justify-between items-center text-xs bg-gray-50/80 dark:bg-slate-800/40 px-3 py-2 rounded-xl border border-gray-100 dark:border-slate-800"
                            >
                              <div className="flex items-center gap-2 truncate">
                                <span className="text-gray-700 dark:text-slate-300 font-medium truncate">
                                  {option.name}
                                </span>

                                <button
                                  type="button"
                                  onClick={() => toggleOptionStatus(group.id, option)}
                                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full transition-colors cursor-pointer ${
                                    isActive
                                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-950/40'
                                      : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                                  }`}
                                >
                                  {isActive ? 'Active' : 'Inactive'}
                                </button>
                              </div>

                              <span className="text-gray-500 dark:text-slate-400 font-mono text-[11px] shrink-0 ml-2">
                                {parseFloat(option.price) > 0 ? `+$${parseFloat(option.price).toFixed(2)}` : 'Free'}
                              </span>
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-xs text-gray-400 dark:text-slate-500 italic px-1 py-1">
                          No options attached to this group.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="border-t border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50 px-5 py-2.5 flex justify-end items-center">
                  <div className="flex items-center gap-1">
                    <Link
                      to={`/modifier-groups/edit/${group.id}`}
                      className="p-1.5 text-gray-500 hover:text-orange-600 dark:text-slate-400 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/30 rounded-lg transition-colors"
                      title="Edit Group"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleOpenDeleteModal(group)}
                      className="p-1.5 text-gray-400 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors"
                      title="Delete Group"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Reusable Pagination Component */}
          <Pagination
            currentPage={currentPage}
            totalPages={pagination.lastPage}
            totalRecords={pagination.total}
            onPageChange={handlePageChange}
            maxVisible={5}
          />
        </>
      )}

      {/* Confirmation Modal for Group Deletion */}
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
            Are you sure you want to delete the modifier group{' '}
            <span className="font-bold text-slate-900 dark:text-slate-100">
              "{groupToDelete?.name}"
            </span>
            ? This will remove all associated modifier options from attached menu items.
          </>
        }
        isLoading={isDeleting}
        confirmText="Delete"
      />
    </div>
  );
}