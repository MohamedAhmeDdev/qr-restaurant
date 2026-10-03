import React, { useState, useEffect } from 'react';
import { AlertTriangle, Trash2, Loader2 } from 'lucide-react';
import { useAuth } from '../../../../contexts/AuthContext';
import OrganizationService from '../../../../services/OrganizationService';
import DeletingOrganizationModal from '../../../../components/modal/DeletingOrganizationModal';

export default function DeleteOrgTab() {
  const { logout } = useAuth();
  const [organization, setOrganization] = useState(null);
  const [orgName, setOrgName] = useState('');
  const [isLoadingOrg, setIsLoadingOrg] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchMyOrganization = async () => {
      try {
        setIsLoadingOrg(true);
        const resData = await OrganizationService.getOrganizations();
        setOrganization(resData);
        setOrgName(resData?.name || '');
      } catch (error) {
        console.error(error.response?.data?.message);
      } finally {
        setIsLoadingOrg(false);
      }
    };

    fetchMyOrganization();
  }, []);

  const handleDeleteSuccess = () => {
    if (logout) logout();
  };

  return (
    <div className="max-w-7xl space-y-6"> {/* Standardized spacing */}
      {/* Header Section */}
      <div className="flex items-start justify-between border-b border-gray-200 dark:border-slate-800 pb-5">
        <div>
          <h2 className="text-md md:text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2.5">
            <div className="p-2 bg-orange-500/10 dark:bg-orange-500/20 rounded-md text-orange-500">
              <Trash2 className="w-5 h-5" />
            </div>
            Delete Organization
          </h2>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
            Permanently remove your organization and all associated data. This action is irreversible.
          </p>
        </div>
      </div>



      {/* Standard Info/Warning Card */}
      <div className="rounded-xl border border-red-200/80 bg-red-50/40 p-4 sm:p-5 dark:border-red-900/40 dark:bg-red-950/20">
  <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
    {/* Warning Icon Badge */}
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400">
      <AlertTriangle className="h-5 w-5" aria-hidden="true" />
    </div>

    {/* Content Container */}
    <div className="flex-1 space-y-3">
      <div>
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
          Warning: This action cannot be undone
        </h3>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
          Deleting <span className="font-semibold text-gray-900 dark:text-white">{orgName || 'this organization'}</span> will permanently erase:
        </p>
      </div>

      {/* Responsive List with Flex Markers */}
      <ul className="space-y-1.5 text-sm text-gray-600 dark:text-gray-400">
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500/70" />
          <span>All associated restaurants and settings</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500/70" />
          <span>Categories, menu items, and modifier groups</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500/70" />
          <span>Active table configurations and staff access</span>
        </li>
      </ul>

      {/* Full-width on mobile, auto-width on desktop */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          disabled={!organization}
          className="flex w-full items-center justify-center gap-2 rounded-sm bg-red-600 px-4 py-2.5 text-sm font-medium text-white  transition-colors hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto dark:bg-red-600 dark:hover:bg-red-700"
        >
          <Trash2 className="h-4 w-4" />
          <span>Delete organization</span>
        </button>
      </div>
    </div>
  </div>
</div>
      {/* Confirmation Modal */}
      <DeletingOrganizationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        organization={organization}
        orgName={orgName}
        onDeleteSuccess={handleDeleteSuccess}
      />
    </div>
  );
}