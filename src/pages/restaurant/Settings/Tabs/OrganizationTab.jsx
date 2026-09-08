import React, { useState, useEffect } from 'react';
import { 
  Loader2, 
  Building2, 
  Globe, 
  User, 
  Mail, 
  Save, 
  ShieldCheck 
} from 'lucide-react';
import api from '../../../../services/api';
import toast from 'react-hot-toast';
import OrganizationService from '../../../../services/OrganizationService';

export default function OrganizationTab() {
  const [orgData, setOrgData] = useState({
    name: '',
    slug: '',
    ownerName: '',
    ownerEmail: '',
  });

  const [initialData, setInitialData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // ✅ Added loading state

  useEffect(() => {
    let isMounted = true;

    const fetchOrganization = async () => {
      try {
        const response = await OrganizationService.getOrganizations();
        const org = response;
        
        if (isMounted && org) {
          const loadedData = {
            name: org.name || '',
            slug: org.slug || '',
            ownerName: org.owner?.name || '',
            ownerEmail: org.owner?.email || '',
          };
          setOrgData(loadedData);
          setInitialData(loadedData);
        }
      } catch (err) {
        if (isMounted) {
          toast.error(err.response?.data?.message || 'Failed to load organization');
        }
      } finally {
        if (isMounted) setIsLoading(false); // ✅ Stop loading when done
      }
    };

    fetchOrganization();

    return () => {
      isMounted = false;
    };
  }, []);

  const hasChanges =
    initialData &&
    (orgData.name !== initialData.name || orgData.slug !== initialData.slug);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!hasChanges) return;

    try {
      setSaving(true);
      const response = await api.put('/organization/me', {
        name: orgData.name,
      });
      const updatedOrg = response.data?.data;

      if (updatedOrg) {
        const refreshedData = {
          name: updatedOrg.name,
          slug: updatedOrg.slug,
          ownerName: updatedOrg.owner?.name || orgData.ownerName,
          ownerEmail: updatedOrg.owner?.email || orgData.ownerEmail,
        };

        setOrgData(refreshedData);
        setInitialData(refreshedData);
      }

      toast.success(response?.data?.message || 'Organization updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update organization');
    } finally {
      setSaving(false);
    }
  };


  return (
    <div className="max-w-3xl space-y-6"> {/* Standardized spacing */}
      {/* Header Section */}
      <div className="flex items-start justify-between border-b border-gray-200 dark:border-slate-800 pb-5">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2.5">
            <div className="p-2 bg-orange-500/10 dark:bg-orange-500/20 rounded-lg text-orange-500">
              <Building2 className="w-5 h-5" />
            </div>
            Organization Profile
          </h2>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
            Manage your workspace details, and ownership information.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Workspace Identity Card */}
        <div className="p-6 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-xs space-y-6">
          <div className="grid grid-cols-1 gap-5">
            {/* Organization Name */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-slate-400 mb-2">
                Organization Name
              </label>
              <input
                type="text"
                value={orgData.name}
                onChange={(e) => setOrgData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="e.g. Acme Corp"
                className="w-full px-3.5 py-2 bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 border border-gray-300 dark:border-slate-800 rounded-lg text-sm transition-all focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>

            {/* Organization Slug */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-slate-400 mb-2">
                Organization Slug
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-gray-400 dark:text-slate-500 pointer-events-none">
                  <Globe className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={orgData.slug}
                  onChange={(e) => setOrgData((prev) => ({ ...prev, slug: e.target.value }))}
                  placeholder="acme-corp"
                  className="w-full pl-10 pr-3.5 py-2 bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 border border-gray-300 dark:border-slate-800 rounded-lg text-sm transition-all focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Ownership Details Section */}
        <div className="p-6 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-slate-200">
                Organization Ownership
              </h3>
              <p className="text-xs text-gray-500 dark:text-slate-400">
                Primary contact details for administrative controls.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-orange-500" /> Managed Account
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            {/* Owner Name */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-slate-400 mb-2">
                Owner Name
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-gray-400 dark:text-slate-500 pointer-events-none">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  readOnly
                  value={orgData.ownerName}
                  className="w-full pl-10 pr-3.5 py-2 bg-gray-100/70 dark:bg-slate-950/60 text-gray-600 dark:text-slate-400 border border-gray-200 dark:border-slate-800/80 rounded-lg text-sm outline-none cursor-not-allowed"
                />
              </div>
            </div>

            {/* Owner Email */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-slate-400 mb-2">
                Owner Email
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-gray-400 dark:text-slate-500 pointer-events-none">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  readOnly
                  value={orgData.ownerEmail}
                  className="w-full pl-10 pr-3.5 py-2 bg-gray-100/70 dark:bg-slate-950/60 text-gray-600 dark:text-slate-400 border border-gray-200 dark:border-slate-800/80 rounded-lg text-sm outline-none cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-end pt-2">
          <button
            type="submit"
            disabled={!hasChanges || saving}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white shadow-xs transition-all ${
              hasChanges && !saving
                ? 'bg-orange-500 hover:bg-orange-600 active:bg-orange-700 cursor-pointer'
                : 'bg-gray-300 dark:bg-slate-800 text-gray-500 dark:text-slate-500 cursor-not-allowed'
            }`}
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving Changes...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}