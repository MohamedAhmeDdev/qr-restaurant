import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Shield, Check, AlertCircle, Save, ArrowLeft 
} from 'lucide-react';
import EmptyState from '../../components/common/EmptyState';
import api from '../../services/api';
import permissionService from '../../services/permissionService';
import toast from 'react-hot-toast';

export default function AssignPermissions() {
  const { roleId } = useParams();

  // Role Metadata State
  const [roleInfo, setRoleInfo] = useState({ name: '', isSystem: false });
  
  // Permissions State
  const [allPermissions, setAllPermissions] = useState([]);
  const [assignedPermissionIds, setAssignedPermissionIds] = useState([]);
  const [initialPermissionIds, setInitialPermissionIds] = useState([]);
  
  // Groups State
  const [categories, setCategories] = useState(['All']);
  const [groupsLoading, setGroupsLoading] = useState(true);
  
  // UI States
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Fetch Role details & Platform Permissions from Backend
  const fetchData = useCallback(async () => {
    if (!roleId || roleId === 'undefined') {
      setApiError('Invalid or missing Role ID.');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setApiError(null);

      const [roleRes, permRes] = await Promise.all([
        api.get(`/roles/${roleId}`),
        api.get('/permissions')
      ]);

      const roleData = roleRes.data?.data;
      const permData = permRes.data?.data;

      // Extract assigned IDs safely
      const currentAssigned = Array.isArray(roleData.permissions)
        ? roleData.permissions.map(p => p.id)
        : [];

      setRoleInfo({
        name: roleData.name,
        isSystem: !!roleData.is_system
      });

      setAllPermissions(Array.isArray(permData) ? permData : []);
      setAssignedPermissionIds(currentAssigned);
      setInitialPermissionIds(currentAssigned);

    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to load role data.');
      toast.error(err.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  }, [roleId]);

  // Fetch groups separately from permission service
  const fetchGroups = useCallback(async () => {
    try {
      setGroupsLoading(true);
      const groupsData = await permissionService.getGroups();
      if (Array.isArray(groupsData) && groupsData.length > 0) {
        setCategories(['All', ...groupsData]);
      } else {
        setCategories(['All']);
      }
    } catch (err) {
      toast.error(err.response?.data?.message);
      setCategories(['All']);
    } finally {
      setGroupsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  // Check if dirty (unsaved changes pending)
  const isDirty = useMemo(() => {
    if (assignedPermissionIds.length !== initialPermissionIds.length) return true;
    return !initialPermissionIds.every(id => assignedPermissionIds.includes(id));
  }, [assignedPermissionIds, initialPermissionIds]);

  // Toggle single permission check
  const handleTogglePermission = (permId) => {
    setAssignedPermissionIds(prev => 
      prev.includes(permId) ? prev.filter(id => id !== permId) : [...prev, permId]
    );
  };

  // Save changes via API
  const handleSave = async () => {
    if (!roleId || roleId === 'undefined') return;

    try {
      setIsSaving(true);
      setApiError(null);

      const payload = {
        permission_ids: assignedPermissionIds,
        permissionIds: assignedPermissionIds
      };

      const response = await api.post(`/roles/${roleId}/sync-permissions`, payload);

      setInitialPermissionIds([...assignedPermissionIds]);
      toast.success(response?.data?.message);
    } catch (err) {
      toast.error(err.response?.data?.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Filter permissions list by selected category
  const filteredPermissions = useMemo(() => {
    return allPermissions.filter(perm => {
      if (selectedCategory === 'All') return true;
      return (perm.group || 'General') === selectedCategory;
    });
  }, [allPermissions, selectedCategory]);

  // Group filtered permissions by Category string
  const groupedPermissions = useMemo(() => {
    return filteredPermissions.reduce((acc, perm) => {
      const cat = perm.group || 'General';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(perm);
      return acc;
    }, {});
  }, [filteredPermissions]);

  const isPageLoading = isLoading || groupsLoading;

  return (
    <div className="p-4 sm:p-6 space-y-6 bg-gray-50 dark:bg-slate-950 min-h-screen text-gray-900 dark:text-slate-100 transition-colors duration-200">
      
      {/* HEADER SECTION */}
      <div className="border-b border-gray-200 dark:border-slate-800 pb-5 transition-colors duration-200">
        <Link
          to="/roles"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-white transition-colors duration-200 mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Roles
        </Link>

        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-200">Assign Permissions</h1>
          {!isPageLoading && (
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
              roleInfo.isSystem 
                ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300' 
                : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
            }`}>
              {roleInfo.isSystem ? 'System Role' : 'Custom Role'}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-1 transition-colors duration-200">
          Configuring capability privileges for <strong className="text-gray-900 dark:text-white transition-colors duration-200">{roleInfo.name || 'Role'}</strong>
        </p>
      </div>

      {/* ERROR ALERT */}
      {apiError && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-400 flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{apiError}</span>
          </div>
          <button onClick={fetchData} className="text-xs font-semibold underline hover:no-underline">
            Retry
          </button>
        </div>
      )}

      {/* SUMMARY BANNER */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm transition-colors duration-200">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400 transition-colors duration-200">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <p className="font-semibold text-sm text-gray-900 dark:text-white transition-colors duration-200">
              {isPageLoading ? '...' : `${assignedPermissionIds.length} of ${allPermissions.length} Permissions Active`}
            </p>
            <p className="text-xs text-gray-500 dark:text-slate-400 transition-colors duration-200">
              Users assigned to this role inherit all active system capabilities immediately upon saving.
            </p>
          </div>
        </div>

        {isDirty && !isPageLoading && (
          <div className="flex items-center gap-1.5 text-xs font-medium text-amber-600 dark:text-amber-300 bg-amber-50 dark:bg-amber-950 px-3 py-1.5 rounded-lg border border-amber-200 dark:border-amber-900 transition-colors duration-200">
            <AlertCircle className="w-4 h-4 shrink-0" /> Unsaved changes pending
          </div>
        )}
      </div>

      {/* CATEGORY FILTER TOOLBAR */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm transition-colors duration-200">
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-slate-800 p-1 rounded-lg text-xs font-medium overflow-x-auto w-full sm:w-auto transition-colors duration-200">
          {groupsLoading ? (
  <div className="flex items-center gap-1 px-3 py-1.5">
    {[...Array(4)].map((_, idx) => (
      <div 
        key={idx} 
        className="h-7 w-16 bg-gray-200 dark:bg-slate-700 rounded-md animate-pulse"
      />
    ))}
  </div>
) : (
  categories.map((cat) => (
    <button
      key={cat}
      type="button"
      onClick={() => setSelectedCategory(cat)}
      className={`px-3 py-1.5 rounded-md transition-all duration-200 whitespace-nowrap capitalize ${
        selectedCategory === cat 
          ? 'bg-white dark:bg-slate-900 text-gray-900 dark:text-white shadow-sm font-semibold' 
          : 'text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white'
      }`}
    >
      {cat}
    </button>
  ))
)}
        </div>
      </div>

      {/* CONTENT AREA */}
      {isPageLoading ? (
        <div className="space-y-6">
          {[...Array(2)].map((_, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden animate-pulse">
              <div className="px-6 py-3.5 bg-gray-50 dark:bg-slate-800 flex justify-between items-center">
                <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-32" />
                <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-16" />
              </div>
              <div className="divide-y divide-gray-100 dark:divide-slate-800 p-4 space-y-4">
                {[...Array(3)].map((_, itemIdx) => (
                  <div key={itemIdx} className="flex justify-between items-center pt-2">
                    <div className="space-y-2 w-1/2">
                      <div className="h-4 bg-gray-200 dark:bg-slate-800 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 dark:bg-slate-800 rounded w-1/2" />
                    </div>
                    <div className="h-6 bg-gray-200 dark:bg-slate-800 rounded w-16" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : apiError ? (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm p-6 transition-colors duration-200">
          <EmptyState
            icon={AlertCircle}
            title={apiError}
            description="An error occurred while retrieving permission records."
            action={
              <button
                onClick={fetchData}
                className="px-3.5 py-1.5 text-xs font-medium rounded-lg bg-rose-600 hover:bg-rose-700 text-white transition-colors duration-200"
              >
                Try Again
              </button>
            }
          />
        </div>
      ) : Object.keys(groupedPermissions).length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm p-6 transition-colors duration-200">
          <EmptyState
            icon={Shield}
            title="No permissions found"
            description={
              selectedCategory !== 'All'
                ? `No system permissions match the selected category "${selectedCategory}".`
                : 'There are no permissions registered in the system.'
            }
          />
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedPermissions).map(([category, perms]) => (
            <div key={category} className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors duration-200">
              
              {/* Category Sub-Header */}
              <div className="px-6 py-3.5 bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between transition-colors duration-200">
                <div className="flex items-center gap-2 text-gray-800 dark:text-slate-200 font-bold text-sm transition-colors duration-200 capitalize">
                  <span>{category} Permissions</span>
                </div>
                <span className="text-xs font-medium text-gray-500 dark:text-slate-400 transition-colors duration-200">
                  {perms.filter(p => assignedPermissionIds.includes(p.id)).length} / {perms.length} Enabled
                </span>
              </div>

              {/* Permission Items */}
              <div className="divide-y divide-gray-100 dark:divide-slate-800">
                {perms.map((perm) => {
                  const isChecked = assignedPermissionIds.includes(perm.id);

                  return (
                    <div 
                      key={perm.id}
                      onClick={() => handleTogglePermission(perm.id)}
                      className={`p-4 px-6 flex items-center justify-between gap-4 cursor-pointer transition-colors duration-200 ${
                        isChecked 
                          ? 'bg-orange-50/60 dark:bg-slate-800/80' 
                          : 'hover:bg-gray-50 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="flex items-start gap-3 flex-1">
                        <div 
                          className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center border transition-colors duration-200 ${
                            isChecked 
                              ? 'bg-orange-500 border-orange-500 text-white' 
                              : 'border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-orange-400'
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-gray-900 dark:text-white transition-colors duration-200">{perm.name}</p>
                          <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5 transition-colors duration-200">{perm.description || perm.slug}</p>
                        </div>
                      </div>

                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors duration-200 ${
                        isChecked 
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' 
                          : 'bg-gray-100 text-gray-500 dark:bg-slate-800 dark:text-slate-400'
                      }`}>
                        {isChecked ? 'Granted' : 'Off'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* BOTTOM ACTION BAR */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-4 shadow-sm transition-colors duration-200">
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleSave}
            disabled={!isDirty || isSaving || isPageLoading}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 shadow-sm ${
              isDirty && !isSaving && !isPageLoading
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'
                : 'bg-gray-200 dark:bg-slate-800 text-gray-400 dark:text-slate-600 cursor-not-allowed'
            }`}
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> Save Changes
              </>
            )}
          </button>
        </div>
      </div>

    </div>
  );
}