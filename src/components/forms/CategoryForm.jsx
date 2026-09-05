import React from 'react';
import { LayoutGrid, Save } from 'lucide-react';

export default function CategoryForm({
  formData,
  setFormData,
  errors,
  setErrors,
  onSubmit,
  onCancel,
  isSubmitting,
  submitButtonText = 'Create Category',
  isEdit = false
}) {
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  return (
    <form onSubmit={onSubmit} className="bg-white dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-gray-200/80 dark:border-slate-800 shadow-xl shadow-gray-100/50 dark:shadow-none overflow-hidden transition-all">
      <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800 bg-gradient-to-r from-gray-50/80 to-transparent dark:from-slate-900/50 flex items-center gap-2.5">
        <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500 dark:bg-orange-500/20">
          <LayoutGrid className="w-4 h-4" />
        </div>
        <h2 className="font-semibold text-gray-900 dark:text-white">Category Details</h2>
      </div>
      
      <div className="p-6 md:p-8 space-y-6">
        {/* Category Information */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 dark:text-slate-200 mb-2">
            Category Information
          </label>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-slate-300">
                Category Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="e.g. Electronics, Clothing, Books"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300/80 dark:border-slate-700 bg-white dark:bg-slate-800/80 focus:ring-4 focus:ring-orange-500/15 focus:border-orange-500 outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 transition-all text-sm shadow-sm"
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{Array.isArray(errors.name) ? errors.name[0] : errors.name}</p>}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700 dark:text-slate-300">
            Description <span className="text-xs text-gray-400 font-normal">(Optional)</span>
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Enter category description"
            rows="3"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300/80 dark:border-slate-700 bg-white dark:bg-slate-800/80 focus:ring-4 focus:ring-orange-500/15 focus:border-orange-500 outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 transition-all text-sm shadow-sm resize-y"
          />
          {errors.description && <p className="text-xs text-red-500 mt-1">{Array.isArray(errors.description) ? errors.description[0] : errors.description}</p>}
        </div>

        {/* Divider */}
        <hr className="border-gray-100 dark:border-slate-800" />

        {/* Status & Settings - Improved Toggle */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 dark:text-slate-200 mb-2">
            Status & Settings
          </label>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5 mb-4">
            Control how this category appears across your store
          </p>
          
          <div className="grid grid-cols-1 gap-4">
            {/* Active Status - Toggle Card */}
            <div className="relative p-4 rounded-xl border-2 transition-all duration-200    cursor-pointer bg-white dark:bg-slate-800/40 border-gray-200 dark:border-slate-700/80">
              <label htmlFor="is_active" className="flex items-start gap-4 cursor-pointer">
                <div className="relative flex items-center justify-center mt-0.5">
                  <input
                    type="checkbox"
                    id="is_active"
                    className="w-5 h-5 text-orange-500 rounded-md border-2 border-gray-300 dark:border-slate-600 cursor-pointer transition-all checked:border-orange-500 checked:bg-orange-500 hover:border-orange-400"
                    checked={formData.is_active === 'true' || formData.is_active === true}
                    onChange={(e) => handleChange('is_active', e.target.checked ? 'true' : 'false')}
                  />
                  {formData.is_active === 'true' && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-800 dark:text-slate-200 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                      Active Category
                    </span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium transition-colors ${
                      formData.is_active === 'true'
                        ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                        : 'bg-gray-100 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400'
                    }`}>
                      {formData.is_active === 'true' ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                    {formData.is_active === 'true'
                      ? 'Visible to customers and available for product assignment'
                      : 'Hidden from customers and unavailable for product assignment'}
                  </p>
                </div>
              </label>
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