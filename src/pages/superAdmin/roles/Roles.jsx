import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Shield, PlusCircle, Trash2, Edit, AlertCircle
} from 'lucide-react';
import StatsCard from '../../../components/cards/StatsCard';
import Toolbar from '../../../components/Toolbar';
import ConfirmationModal from '../../../components/common/ConfirmationModal';
import EmptyState from '../../../components/common/EmptyState';
import api from '../../../services/api';
import toast from 'react-hot-toast';

export default function RolesPage() {
  const navigate = useNavigate();

  // Data States
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // UI & Filter Control States
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');

  // Deletion Modal State
  const [roleToDelete, setRoleToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Helper to safely identify System Default roles across different backend payloads
  const isSystemRole = (role) => {
    if (!role) return false;
    return role.is_system === true;
  };

  // Helper to normalize the display type string
  const getRoleTypeLabel = (role) => {
    return isSystemRole(role) ? 'System Default' : 'Custom';
  };

  // Fetch Roles
  const fetchRoles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/roles');
      const data = response.data?.data;
      setRoles(data);
    } catch (err) {
      const errorMessage = err.response?.data?.message;
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  // Delete Action Handlers
  const handleDeleteClick = (role) => {
    if (isSystemRole(role)) return;
    setRoleToDelete(role);
  };

  const handleConfirmDelete = async () => {
    if (!roleToDelete) return;

    try {
      setIsDeleting(true);
      const response = await api.delete(`/roles/${roleToDelete.id}`);
      setRoles(prev => prev.filter(r => r.id !== roleToDelete.id));
      setRoleToDelete(null);
      toast.success(response.data.message );
    } catch (err) {
      toast.error(err.response?.data?.message);
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter Computation
  const filteredRoles = useMemo(() => {
    return roles.filter(role => {
      const roleType = getRoleTypeLabel(role);
      const matchesType = typeFilter === 'All' || roleType === typeFilter;
      const matchesSearch = 
        role.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        role.description?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesType && matchesSearch;
    });
  }, [roles, typeFilter, searchQuery]);

  return (
    <div className="p-2 sm:p-4 space-y-6 bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-900 dark:text-slate-100 transition-colors duration-200">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white transition-colors duration-200">Roles</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 transition-colors duration-200">
            Manage user access roles and inspect granted permission sets.
          </p>
        </div>

        <Link to="/roles/create">
          <button 
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white rounded-lg text-sm font-medium transition-colors duration-200 shadow-sm hover:shadow-md"
          >
            <PlusCircle className="w-4 h-4" /> Create Role
          </button>
        </Link>
      </div>

      {/* METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard 
          label="Total Roles" 
          value={loading ? '...' : roles.length}
        />
        <StatsCard 
          label="System Default" 
          value={loading ? '...' : roles.filter(r => isSystemRole(r)).length}
          valueColor="text-blue-600 dark:text-blue-400"
        />
        <StatsCard 
          label="Custom Roles" 
          value={loading ? '...' : roles.filter(r => !isSystemRole(r)).length}
          valueColor="text-purple-600 dark:text-purple-400"
        />
      </div>

      {/* TOOLBAR */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors duration-200">
        <Toolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search roles by name or description..."
          filters={['All', 'System Default', 'Custom']}
          activeFilter={typeFilter}
          onFilterChange={setTypeFilter}
        />
      </div>

      {/* CONTENT AREA STATE PRIORITY: LOADING -> ERROR -> EMPTY -> GRID */}
      {loading ? (
        /* 1. LOADING SKELETON GRID */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, idx) => (
            <div 
              key={idx} 
              className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm animate-pulse space-y-4 transition-colors duration-200"
            >
              <div className="flex justify-between items-center">
                <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/3 transition-colors duration-200" />
                <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-1/6 transition-colors duration-200" />
              </div>
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/3 transition-colors duration-200" />
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between transition-colors duration-200">
                <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-28 transition-colors duration-200" />
                <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-20 transition-colors duration-200" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        /* 2. ERROR STATE */
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 transition-colors duration-200">
          <EmptyState
            icon={AlertCircle}
            title="Unable to load roles"
            description={error}
            action={
              <button
                onClick={fetchRoles}
                className="px-3.5 py-1.5 text-xs font-medium rounded-lg bg-rose-600 hover:bg-rose-700 text-white transition-colors duration-200 shadow-sm"
              >
                Try Again
              </button>
            }
          />
        </div>
      ) : filteredRoles.length === 0 ? (
        /* 3. EMPTY STATE */
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 transition-colors duration-200">
          <EmptyState
            icon={Shield}
            title="No roles found"
            description={
              searchQuery || typeFilter !== 'All'
                ? 'Try adjusting your search query or filter settings.'
                : 'There are no active roles in the system yet.'
            }
          />
        </div>
      ) : (
        /* 4. ROLES GRID DATA */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRoles.map((role) => {
            const systemRole = isSystemRole(role);
            return (
              <div 
                key={role.id}
                className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between transition-colors duration-200"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-orange-50 dark:bg-orange-950 text-orange-600 dark:text-orange-400 transition-colors duration-200">
                        <Shield className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-base text-slate-900 dark:text-white transition-colors duration-200">{role.name}</h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border transition-colors duration-200 ${
                        systemRole 
                          ? 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900' 
                          : 'bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-900'
                      }`}>
                        {getRoleTypeLabel(role)}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 transition-colors duration-200">
                    {role.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between transition-colors duration-200">
                  <Link to={`/roles/${role.id}/permissions`}>
                    <button
                      className="px-3 py-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 dark:bg-orange-950 dark:hover:bg-orange-900 text-orange-600 dark:text-orange-400 text-xs font-semibold transition-colors duration-200"
                    >
                      Manage Permissions
                    </button>
                  </Link>
                  <div className="flex items-center gap-2">
                    <Link to={`/roles/edit/${role.id}`}>
                      <button
                        title="Edit Role Details"
                        className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors duration-200"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </Link>

                    <button
                      onClick={() => handleDeleteClick(role)}
                      disabled={systemRole}
                      title={systemRole ? 'System default roles cannot be deleted' : 'Delete Role'}
                      className={`p-1.5 rounded-lg transition-colors duration-200 ${
                        systemRole
                          ? 'opacity-30 cursor-not-allowed text-slate-400'
                          : 'hover:bg-rose-50 dark:hover:bg-rose-950 text-rose-600 dark:text-rose-400'
                      }`}
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

      {/* CONFIRMATION MODAL */}
      <ConfirmationModal
        isOpen={!!roleToDelete}
        onClose={() => setRoleToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Role"
        description={
          <>
            Are you sure you want to delete the{' '}
            <span className="font-bold text-slate-900 dark:text-slate-200">
              ${roleToDelete?.name}"
            </span>{' '}
            role? This action cannot be undone.
          </>
        }
        itemName={roleToDelete?.name}
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isDeleting}
      />

    </div>
  );
}