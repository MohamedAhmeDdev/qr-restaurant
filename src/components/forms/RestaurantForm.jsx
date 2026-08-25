import React, { useRef } from 'react';
import { ChefHat, Image as ImageIcon, Save, X, ToggleLeft } from 'lucide-react';

export default function RestaurantForm({
  formData,
  setFormData,
  errors,
  setErrors,
  imagePreview,
  setImagePreview,
  onSubmit,
  onCancel,
  isSubmitting,
  submitButtonText = 'Create Restaurant',
  isEdit = false,
}) {
  const fileInputRef = useRef(null);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setFormData((prev) => ({
        ...prev,
        logo: file,
        removeLogo: false,
      }));
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setFormData((prev) => ({
      ...prev,
      logo: null,
      removeLogo: true,
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="bg-white dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-gray-200/80 dark:border-slate-800 shadow-xl shadow-gray-100/50 dark:shadow-none overflow-hidden transition-all">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800 bg-gradient-to-r from-gray-50/80 to-transparent dark:from-slate-900/50 flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500 dark:bg-orange-500/20">
            <ChefHat className="w-4 h-4" />
          </div>
          <h2 className="font-semibold text-gray-900 dark:text-white">Restaurant Profile</h2>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          {/* Logo Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 dark:text-slate-200 mb-2">
              Restaurant Logo
            </label>
            <div className="flex items-center gap-6">
              <div className="relative group shrink-0">
                <div
                  className={`w-28 h-28 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center overflow-hidden transition-all duration-300 ${
                    imagePreview
                      ? 'border-orange-500 bg-orange-50/10 shadow-md shadow-orange-500/10'
                      : 'border-gray-300 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50 hover:border-orange-400 dark:hover:border-orange-500/50'
                  }`}
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="Logo Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-1.5 text-gray-400 dark:text-slate-500 group-hover:text-orange-500 transition-colors">
                      <ImageIcon className="w-7 h-7" />
                      <span className="text-[11px] font-medium">Upload</span>
                    </div>
                  )}

                  {imagePreview && (
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-1 right-1 z-10 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all shadow-lg scale-90 hover:scale-100"
                      title="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  aria-label="Upload restaurant logo file"
                />
              </div>

              <div className="space-y-1.5">
                <p className="text-sm font-medium text-gray-700 dark:text-slate-300">Brand Identity</p>
                <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed">
                  Upload a high-resolution square logo. Recommended dimension is{' '}
                  <span className="font-semibold text-gray-700 dark:text-slate-300">200x200px</span> in PNG or JPG format.
                </p>
              </div>
            </div>
          </div>

          <hr className="border-gray-100 dark:border-slate-800" />

          {/* Name Field */}
          <div className="space-y-1.5">
            <label htmlFor="restaurant-name" className="block text-sm font-semibold text-gray-800 dark:text-slate-200">
              Restaurant Name <span className="text-orange-500">*</span>
            </label>
            <div className="relative">
              <input
                id="restaurant-name"
                type="text"
                value={formData.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g., Bella Italia Downtown"
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.name ? 'border-red-500' : 'border-gray-300/80 dark:border-slate-700'
                } bg-white dark:bg-slate-800/80 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:ring-4 focus:ring-orange-500/15 focus:border-orange-500 outline-none transition-all text-sm shadow-sm`}
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>
          </div>

{/* Status Field - Card Style */}
<div className="space-y-2">
  <label className="block text-sm font-semibold text-gray-800 dark:text-slate-200">
    Status <span className="text-orange-500">*</span>
  </label>
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
    <label
      className={`relative flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 select-none ${
        formData.status === 'active'
          ? 'border-orange-500 bg-orange-50/10 dark:bg-orange-500/10 shadow-sm'
          : 'border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 hover:border-gray-300 dark:hover:border-slate-700'
      }`}
    >
      <input
        type="radio"
        name="status"
        value="active"
        checked={formData.status === 'active'}
        onChange={(e) => handleInputChange('status', e.target.value)}
        className="sr-only"
      />
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          Active
        </span>
        <div
          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
            formData.status === 'active'
              ? 'border-orange-500 bg-orange-500'
              : 'border-gray-300 dark:border-slate-600'
          }`}
        >
          {formData.status === 'active' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
        </div>
      </div>
      <p className="text-xs text-gray-500 dark:text-slate-400">Visible to customers and ready to accept orders.</p>
    </label>

    <label
      className={`relative flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 select-none ${
        formData.status === 'suspended'
          ? 'border-orange-500 bg-orange-50/10 dark:bg-orange-500/10 shadow-sm'
          : 'border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 hover:border-gray-300 dark:hover:border-slate-700'
      }`}
    >
      <input
        type="radio"
        name="status"
        value="suspended"
        checked={formData.status === 'suspended'}
        onChange={(e) => handleInputChange('status', e.target.value)}
        className="sr-only"
      />
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          Suspended
        </span>
        <div
          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
            formData.status === 'suspended'
              ? 'border-orange-500 bg-orange-500'
              : 'border-gray-300 dark:border-slate-600'
          }`}
        >
          {formData.status === 'suspended' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
        </div>
      </div>
      <p className="text-xs text-gray-500 dark:text-slate-400">Temporarily unavailable or under maintenance.</p>
    </label>
  </div>
  {errors.status && <p className="text-xs text-red-500 mt-1">{errors.status}</p>}
</div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
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