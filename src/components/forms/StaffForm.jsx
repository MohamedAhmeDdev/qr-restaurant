import React, { useState, useEffect } from 'react';
import { UserPlus, Mail, Save } from 'lucide-react';
import RoleService from '../../services/Roles';

export default function StaffForm({
  formData,
  setFormData,
  errors,
  setErrors,
  onSubmit,
  onCancel,
  isSubmitting,
  submitButtonText = 'Create Staff Member',
  isEdit = false
}) {
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    RoleService.getRoles()
      .then(fetchedRoles => setRoles(fetchedRoles))
      .catch(err => console.error('Error loading roles into form:', err));
  }, []);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  return (
    <form onSubmit={onSubmit} className="bg-white dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-gray-200/80 dark:border-slate-800 shadow-xl shadow-gray-100/50 dark:shadow-none overflow-hidden transition-all">
      <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800 bg-gradient-to-r from-gray-50/80 to-transparent dark:from-slate-900/50 flex items-center gap-2.5">
        <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500 dark:bg-orange-500/20">
          <UserPlus className="w-4 h-4" />
        </div>
        <h2 className="font-semibold text-gray-900 dark:text-white">Staff Member Details</h2>
      </div>
      
      <div className="p-6 md:p-8 space-y-6">
        
        {/* Personal Information */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 dark:text-slate-200 mb-2">
            Personal Information
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-slate-300">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="e.g. Jane Doe"
             className="w-full px-4 py-2.5 rounded-xl border border-gray-300/80 dark:border-slate-700 bg-white dark:bg-slate-800/80 focus:ring-4 focus:ring-orange-500/15 focus:border-orange-500 outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 transition-all text-sm shadow-sm"
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{Array.isArray(errors.name) ? errors.name[0] : errors.name}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-slate-300">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-500 pointer-events-none" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="jane@restopos.com"
                 className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300/80 dark:border-slate-700 bg-white dark:bg-slate-800/80 focus:ring-4 focus:ring-orange-500/15 focus:border-orange-500 outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 transition-all text-sm shadow-sm"
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1">{Array.isArray(errors.email) ? errors.email[0] : errors.email}</p>}
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-gray-100 dark:border-slate-800" />

        {/* Account & Access */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 dark:text-slate-200 mb-2">
            Account & Access
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-slate-300">Role Assignment</label>
            {/* In StaffForm component */}
<select
  value={formData.role}
  onChange={(e) => handleChange('role', e.target.value)}
  className="w-full px-4 py-2.5 rounded-xl border border-gray-300/80 dark:border-slate-700 bg-white dark:bg-slate-800/80 focus:ring-4 focus:ring-orange-500/15 focus:border-orange-500 outline-none text-gray-900 dark:text-white appearance-none cursor-pointer transition-all text-sm shadow-sm"
>
  <option value="">Select Role</option>
  {roles.map(r => (
    <option key={r.id} value={r.id}>{r.name}</option>
  ))}
</select>
              {errors.role && <p className="text-xs text-red-500 mt-1">{Array.isArray(errors.role) ? errors.role[0] : errors.role}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-slate-300">Account Status</label>
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300/80 dark:border-slate-700 bg-white dark:bg-slate-800/80 focus:ring-4 focus:ring-orange-500/15 focus:border-orange-500 outline-none text-gray-900 dark:text-white appearance-none cursor-pointer transition-all text-sm shadow-sm"
              >
                <option value="">Select Status</option>
                <option value="active">Active</option>
                <option value="on_leave">On leave</option>
                <option value="suspended">Suspended</option>
              </select>
              {errors.status && <p className="text-xs text-red-500 mt-1">{Array.isArray(errors.status) ? errors.status[0] : errors.status}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-slate-300">Shift Type</label>
              <select
                value={formData.shift_type}
                onChange={(e) => handleChange('shift_type', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300/80 dark:border-slate-700 bg-white dark:bg-slate-800/80 focus:ring-4 focus:ring-orange-500/15 focus:border-orange-500 outline-none text-gray-900 dark:text-white appearance-none cursor-pointer transition-all text-sm shadow-sm"
              >
                <option value="">Select Shift</option>
                <option value="day">Day</option>
                <option value="night">Night</option>
              </select>
              {errors.shift_type && <p className="text-xs text-red-500 mt-1">{Array.isArray(errors.shift_type) ? errors.shift_type[0] : errors.shift_type}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-6 md:px-8 py-4 border-t border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50 flex items-center justify-end gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-700 dark:text-slate-300 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-slate-800 transition-all shadow-sm active:scale-[0.98]"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white text-sm font-semibold flex items-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 active:scale-[0.98]"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>{isEdit ? 'Updating...' : 'Creating...'}</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>{submitButtonText}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}