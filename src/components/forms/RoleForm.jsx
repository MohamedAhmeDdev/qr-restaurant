import React from 'react';
import { Shield, Save, ArrowLeft } from 'lucide-react';

export default function RoleForm({
  formData,
  setFormData,
  errors,
  setErrors,
  onSubmit,
  onCancel,
  isSubmitting,
  title,
  subtitle,
  submitButtonText = 'Save Role'
}) {
  return (
      <form onSubmit={onSubmit} className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm p-6 space-y-6 transition-colors duration-200">
        
        {/* BASIC INFORMATION SECTION */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400 pb-2 border-b border-gray-100 dark:border-slate-800 transition-colors duration-200 flex items-center gap-2">
            <Shield className="w-4 h-4 text-orange-500" />
            Role Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Role Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1 transition-colors duration-200">
                Role Name <span className="text-red-500">*</span>
              </label>
              <input 
                type="text"
                placeholder="e.g. Regional Store Director"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                }}
                className={`w-full px-3 py-2 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 border ${
                  errors.name ? 'border-red-500' : 'border-gray-200 dark:border-slate-700'
                } rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500/20 transition-colors duration-200`}
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>

            {/* Slug */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1 transition-colors duration-200">
                Slug <span className="text-red-500">*</span>
              </label>
              <input 
                type="text"
                placeholder="e.g. regional_store_director"
                value={formData.slug}
                onChange={(e) => {
                  setFormData({ ...formData, slug: e.target.value });
                  if (errors.slug) setErrors((prev) => ({ ...prev, slug: '' }));
                }}
                className={`w-full px-3 py-2 font-mono text-xs bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 border ${
                  errors.slug ? 'border-red-500' : 'border-gray-200 dark:border-slate-700'
                } rounded-lg outline-none focus:ring-2 focus:ring-orange-500/20 transition-colors duration-200`}
              />
              {errors.slug && <p className="text-xs text-red-500 mt-1">{errors.slug}</p>}
            </div>

          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1 transition-colors duration-200">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea 
              rows={3}
              placeholder="Provide a clear description of the responsibilities associated with this role..."
              value={formData.description}
              onChange={(e) => {
                setFormData({ ...formData, description: e.target.value });
                if (errors.description) setErrors((prev) => ({ ...prev, description: '' }));
              }}
              className={`w-full px-3 py-2 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 border ${
                errors.description ? 'border-red-500' : 'border-gray-200 dark:border-slate-700'
              } rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500/20 transition-colors duration-200`}
            />
            {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
          </div>

        </div>

        {/* ACTIONS */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-slate-800 transition-colors duration-200">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-xs font-medium text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white rounded-lg text-xs font-medium transition-colors duration-200 shadow-sm flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> 
            {isSubmitting ? 'Saving...' : submitButtonText}
          </button>
        </div>

      </form>
  );
}