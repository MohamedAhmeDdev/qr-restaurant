import React, { useState } from 'react';
import { AlertTriangle, Trash2, Loader2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

function DeletingOrganizationModal({
  isOpen,
  onClose,
  organization,
  orgName,
  onDeleteSuccess,
  isLoading = false,
}) {
  const [confirmInput, setConfirmInput] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e) => {
    e.preventDefault();
    
    if (!organization) return;

    setIsDeleting(true);
    
    try {
      const response = await api.delete(`/organization/${organization.id}`, {
        data: { name: confirmInput }
      });
      toast.success(response.data?.message);

      setConfirmInput('');
      onClose();

      if (onDeleteSuccess) {
        setTimeout(() => onDeleteSuccess(), 2000);
      }
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={() => {
          if (!isDeleting && !isLoading) {
            onClose();
            setConfirmInput('');
          }
        }}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Confirm deletion
          </h3>
          <button
            type="button"
            disabled={isDeleting || isLoading}
            onClick={() => {
              onClose();
              setConfirmInput('');
            }}
            className="rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-200"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleDelete} className="space-y-5 p-6">
          <div className="space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              This action is permanent. To confirm, please type the organization name exactly as it appears below:{' '}
              <span className="font-bold text-gray-900 dark:text-white">{orgName}</span>
            </p>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="confirm-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Organization name
            </label>
            <input
              id="confirm-input"
              type="text"
              value={confirmInput}
              onChange={(e) => setConfirmInput(e.target.value)}
              placeholder="Type the organization name"
              disabled={isDeleting || isLoading}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 shadow-sm transition-all focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:placeholder-gray-500 dark:focus:border-red-500 dark:focus:ring-red-500/20"
              autoComplete="off"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              disabled={isDeleting || isLoading}
              onClick={() => {
                onClose();
                setConfirmInput('');
              }}
              className="rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus:ring-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isDeleting || isLoading || confirmInput !== orgName}
              className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-red-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-offset-gray-900"
            >
              {isDeleting || isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {isDeleting ? 'Deleting...' : 'Loading...'}
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  Confirm deletion
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DeletingOrganizationModal;