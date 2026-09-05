import React from 'react';
import { Plus, Trash2, DollarSign, Save, Layers, AlertCircle, Power, PowerOff } from 'lucide-react';

export default function ModifierGroupForm({
  formData,
  setFormData,
  errors,
  setErrors,
  onSubmit,
  onCancel,
  isSubmitting,
  submitButtonText = 'Create Modifier Group',
  isEdit = false
}) {
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const handleOptionChange = (index, field, value) => {
    const updatedOptions = [...formData.options];
    updatedOptions[index][field] = value;
    setFormData(prev => ({ ...prev, options: updatedOptions }));
    if (errors.options) setErrors(prev => ({ ...prev, options: undefined }));
  };

const addOptionRow = () => {
  setFormData(prev => ({
    ...prev,
    options: [...prev.options, { name: '', price: '0.00', is_available: false }],
  }));
};

  const removeOptionRow = (index) => {
    if (formData.options.length <= 1) return;
    const updatedOptions = formData.options.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, options: updatedOptions }));
  };

  return (
    <form onSubmit={onSubmit} className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200/80 dark:border-slate-800/80 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden transition-all">
      {/* Form Header Accent */}
      <div className="px-6 py-5 border-b border-gray-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-500 dark:bg-orange-500/20 ring-1 ring-orange-500/20">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-semibold text-base text-gray-900 dark:text-white">Modifier Group Configuration</h2>
            <p className="text-xs text-gray-500 dark:text-slate-400">Configure customer selection limits and pricing choices</p>
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8 space-y-8">
        {/* Basic Info Section */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {/* Group Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-800 dark:text-slate-200 flex items-center justify-between">
                <span>Group Name</span>
              </label>
          <input
  type="text"
  value={formData.name}
  onChange={(e) => handleChange('name', e.target.value)}
  placeholder="e.g., Pizza Toppings, Dressing Choice, Spice Level, Portion Size"
  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700/80 hover:border-gray-300 dark:hover:border-slate-600 focus:border-orange-500 focus:ring-orange-500/20 bg-white dark:bg-slate-800/50 focus:ring-4 outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 transition-all text-sm shadow-sm"
/>
              {errors.name && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {Array.isArray(errors.name) ? errors.name[0] : errors.name}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-800 dark:text-slate-200">
                Description <span className="text-xs text-gray-400 font-normal">(Optional)</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="e.g., Select up to 3 extra toppings. Additional charges apply per extra topping."
                rows="3"
                className={`w-full px-4 py-2.5 rounded-xl border ${
                  errors.description ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-200 dark:border-slate-700/80 hover:border-gray-300 dark:hover:border-slate-600 focus:border-orange-500 focus:ring-orange-500/20'
                } bg-white dark:bg-slate-800/50 focus:ring-4 outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 transition-all text-sm shadow-sm resize-y`}
              />
              {errors.description && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {Array.isArray(errors.description) ? errors.description[0] : errors.description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Rules & Constraints Card */}
        <div className="p-5 rounded-xl bg-slate-50/70 dark:bg-slate-800/30 border border-gray-200/60 dark:border-slate-800 space-y-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-slate-500">Selection Rules</span>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-700 dark:text-slate-300">
                Minimum Selections
              </label>
              <input
                type="number"
                min="0"
                value={formData.min_select ?? 0}
                onChange={(e) => handleChange('min_select', parseInt(e.target.value) || 0)}
                className={`w-full px-3.5 py-2 rounded-lg border ${
                  errors.min_select ? 'border-red-500' : 'border-gray-200 dark:border-slate-700'
                } bg-white dark:bg-slate-800 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-gray-900 dark:text-white transition-all text-sm shadow-sm`}
              />
              {errors.min_select && (
                <p className="text-xs text-red-500 mt-1">{Array.isArray(errors.min_select) ? errors.min_select[0] : errors.min_select}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-700 dark:text-slate-300">
                Maximum Selections
              </label>
              <input
                type="number"
                min="1"
                value={formData.max_select ?? 1}
                onChange={(e) => handleChange('max_select', parseInt(e.target.value) || 1)}
                className={`w-full px-3.5 py-2 rounded-lg border ${
                  errors.max_select ? 'border-red-500' : 'border-gray-200 dark:border-slate-700'
                } bg-white dark:bg-slate-800 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-gray-900 dark:text-white transition-all text-sm shadow-sm`}
              />
              {errors.max_select && (
                <p className="text-xs text-red-500 mt-1">{Array.isArray(errors.max_select) ? errors.max_select[0] : errors.max_select}</p>
              )}
            </div>
          </div>
        </div>

{/* Status & Options Toggles */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
  {/* Required Selection Toggle */}
  <div className="relative p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer bg-white dark:bg-slate-800/40 border-gray-200 dark:border-slate-700/80">
    <label htmlFor="is_required" className="flex items-start gap-4 cursor-pointer">
      <div className="relative flex items-center justify-center mt-0.5">
        <input
          type="checkbox"
          id="is_required"
          className="w-5 h-5 text-orange-500 rounded-md border-2 border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-orange-500/30 focus:ring-offset-2 dark:focus:ring-offset-slate-900 cursor-pointer transition-all checked:border-orange-500"
          checked={Boolean(formData.is_required)}
          onChange={(e) => handleChange('is_required', e.target.checked)}
        />
        {formData.is_required && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-800 dark:text-slate-200 transition-colors">
            Required Selection
          </span>
        </div>
        <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5 leading-relaxed">
          Customer must select at least one option before adding to cart
        </p>
      </div>
    </label>
  </div>

  {/* Active Status Toggle */}
  <div className="relative p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer bg-white dark:bg-slate-800/40 border-gray-200 dark:border-slate-700/80">
    <label htmlFor="is_active" className="flex items-start gap-4 cursor-pointer">
      <div className="relative flex items-center justify-center mt-0.5">
        <input
          type="checkbox"
          id="is_active"
          className="w-5 h-5 text-orange-500 rounded-md border-2 border-gray-300 dark:border-slate-600 cursor-pointer transition-all checked:border-orange-500 checked:bg-orange-500 hover:border-orange-400"
          checked={Boolean(formData.is_active)}
          onChange={(e) => handleChange('is_active', e.target.checked)}
        />
        {formData.is_active && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-800 dark:text-slate-200 transition-colors">
            Active Group
          </span>
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium transition-colors ${
            formData.is_active
              ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
              : 'bg-gray-100 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400'
          }`}>
           {formData.is_active ? 'Active' : 'Inactive'}
          </span>
        </div>
        <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5 leading-relaxed">
          {formData.is_active 
            ? 'Available for selection across all menus' 
            : 'Hidden from all menus until activated'}
        </p>
      </div>
    </label>
  </div>
</div>
        <hr className="border-gray-200/60 dark:border-slate-800" />

        {/* Dynamic Options List */}
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-slate-800">
            <div>
              <label className="text-base font-semibold text-gray-900 dark:text-white">
                Modifier Options
              </label>
              <p className="text-xs text-gray-500 dark:text-slate-400">Add choices available within this group</p>
            </div>
            <button
              type="button"
              onClick={addOptionRow}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10 hover:bg-orange-100 dark:hover:bg-orange-500/20 border border-orange-200/60 dark:border-orange-500/20 transition-all shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" /> Add Option
            </button>
          </div>

          {errors.options && (
            <p className="text-xs text-red-500 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              {Array.isArray(errors.options) ? errors.options[0] : errors.options}
            </p>
          )}

          <div className="space-y-3">
            {formData.options?.map((option, index) => (
              <div 
                key={index} 
                className="group relative flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white dark:bg-slate-800/40 p-3 rounded-xl border border-gray-200/80 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700 shadow-sm transition-all"
              >
                <div className="hidden sm:flex items-center justify-center w-6 h-6 rounded-md bg-gray-100 dark:bg-slate-800 text-xs text-gray-400 font-mono">
                  {index + 1}
                </div>

                <div className="flex-1">
                  <input
                    type="text"
                    placeholder={
                      index === 0 ? "e.g., Extra Cheese" :
                      index === 1 ? "e.g., Crispy Bacon" :
                      index === 2 ? "e.g., Sliced Mushrooms" :
                      "e.g., Truffle Oil"
                    }
                    className="w-full border border-gray-200 dark:border-slate-700/80 rounded-lg px-3 py-2 text-sm bg-gray-50/50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-gray-900 dark:text-white transition-all"
                    value={option.name}
                    onChange={(e) => handleOptionChange(index, 'name', e.target.value)}
                  />
                </div>

                <div className="relative w-full sm:w-32">
                  <DollarSign className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    className="w-full border border-gray-200 dark:border-slate-700/80 rounded-lg py-2 pl-8 pr-3 text-sm bg-gray-50/50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-gray-900 dark:text-white transition-all font-mono"
                    value={option.price}
                    onChange={(e) => handleOptionChange(index, 'price', e.target.value)}
                  />
                </div>
<div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100 dark:border-slate-800">
  <label htmlFor={`available-${index}`} className="inline-flex items-center gap-2 cursor-pointer">
    <input
      type="checkbox"
      id={`available-${index}`}
      checked={Boolean(option.is_available)} 
      onChange={(e) => handleOptionChange(index, 'is_available', e.target.checked)}
      className="w-4 h-4 text-orange-500 rounded border-gray-300 dark:border-slate-600 focus:ring-orange-500/20 focus:ring-2 cursor-pointer"
    />
    <span className="text-xs font-medium text-gray-600 dark:text-slate-300 select-none">
      Available
    </span>
  </label>

  <button
    type="button"
    onClick={() => removeOptionRow(index)}
    disabled={formData.options.length <= 1}
    className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-gray-400 transition-all"
    title="Remove option"
  >
    <Trash2 className="w-4 h-4" />
  </button>
</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="px-6 md:px-8 py-4 border-t border-gray-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 flex items-center justify-end gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-slate-700/80 transition-all shadow-sm active:scale-[0.98]"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white text-sm font-semibold flex items-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-md shadow-orange-500/20 hover:shadow-lg hover:shadow-orange-500/30 active:scale-[0.98]"
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