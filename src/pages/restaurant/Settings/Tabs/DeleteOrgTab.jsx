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
    <div className="max-w-3xl space-y-6"> {/* Standardized spacing */}
      {/* Header Section */}
      <div className="border-b border-gray-200 pb-5 dark:border-gray-800">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Delete Organization
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Permanently remove your organization and all associated data. This action is irreversible.
        </p>
      </div>

      {/* Standard Info/Warning Card */}
      <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-6 dark:border-gray-800 dark:bg-gray-900/50">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-200/60 dark:bg-gray-800">
            <AlertTriangle className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          </div>
          <div className="space-y-3">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              Warning: This action cannot be undone
            </h3>
            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
              Deleting <span className="font-semibold text-gray-900 dark:text-white">{orgName || 'this organization'}</span> will permanently erase:
            </p>
            <ul className="list-inside list-disc space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <li>All associated restaurants and settings</li>
              <li>Categories, menu items, and modifier groups</li>
              <li>Active table configurations and staff access</li>
            </ul>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              disabled={!organization}
              className="mt-2 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-red-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
              Delete organization
            </button>
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