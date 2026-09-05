import React, { useRef } from 'react';
import {
  ChefHat,
  Image as ImageIcon,
  Save,
  DollarSign,
  Image as BgImageIcon,
  Upload,
  X,
  CheckCircle2,
  AlertCircle,
  Type,
  Palette,
  Power,
  PowerOff
} from 'lucide-react';
import cc from 'currency-codes';

export default function RestaurantForm({
  formData,
  setFormData,
  errors,
  setErrors,
  imagePreview,
  setImagePreview,
  bgImagePreview,
  setBgImagePreview,
  onSubmit,
  onCancel,
  isSubmitting,
  submitButtonText = 'Create Restaurant',
  isEdit = false,
}) {
  const fileInputRef = useRef(null);
  const bgFileInputRef = useRef(null);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateAndSetImage = (file, type) => {
    const maxSize = type === 'logo' ? 2 * 1024 * 1024 : 5 * 1024 * 1024;
    const errorKey = type === 'logo' ? 'logo' : 'background_image';

    if (file.size > maxSize) {
      setErrors((prev) => ({ ...prev, [errorKey]: `Image size must be less than ${maxSize / 1024 / 1024}MB` }));
      return false;
    }
    if (!file.type.startsWith('image/')) {
      setErrors((prev) => ({ ...prev, [errorKey]: 'Please upload a valid image file' }));
      return false;
    }
    return true;
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && validateAndSetImage(file, 'logo')) {
      setImagePreview(URL.createObjectURL(file));
      setFormData((prev) => ({ ...prev, logo: file, removeLogo: false }));
      if (errors.logo) setErrors((prev) => ({ ...prev, logo: undefined }));
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setFormData((prev) => ({ ...prev, logo: null, removeLogo: true }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleBgImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && validateAndSetImage(file, 'bg')) {
      setBgImagePreview(URL.createObjectURL(file));
      setFormData((prev) => ({ ...prev, background_image: file, removeBackgroundImage: false }));
      if (errors.background_image) setErrors((prev) => ({ ...prev, background_image: undefined }));
    }
  };

  const removeBgImage = () => {
    setBgImagePreview(null);
    setFormData((prev) => ({ ...prev, background_image: null, removeBackgroundImage: true }));
    if (bgFileInputRef.current) bgFileInputRef.current.value = '';
  };

  // Reusable Section Header
  const SectionHeader = ({ icon: Icon, title, description }) => (
    <div className="flex items-center gap-3 pb-4 border-b border-gray-100 dark:border-slate-800 mb-6">
      <div className="p-2.5 rounded-xl bg-orange-500/10 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">{title}</h3>
        {description && <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">{description}</p>}
      </div>
    </div>
  );

  // Reusable Image Uploader Component
  const ImageUploader = ({
    preview,
    file,
    onUpload,
    onRemove,
    inputRef,
    label,
    subLabel,
    error,
    icon: Icon,
    aspectClass = "aspect-square"
  }) => {
    const getFileName = () => {
      if (file && file.name) return file.name;
      if (typeof file === 'string') return file.split('/').pop();
      return 'Uploaded Image';
    };

    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
          {label} <span className="text-orange-500">*</span>
        </label>

        {preview ? (
          <div className="space-y-2">
            <div className={`relative group w-full ${aspectClass} max-h-64 rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-700 bg-gray-900 shadow-sm`}>
              <img src={preview} alt="Preview" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3 backdrop-blur-[2px]">
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="px-4 py-2 rounded-xl bg-white text-gray-900 text-xs font-semibold hover:bg-gray-100 transition-colors shadow-lg transform translate-y-2 group-hover:translate-y-0 duration-200"
                >
                  Replace
                </button>
                <button
                  type="button"
                  onClick={onRemove}
                  className="p-2.5 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors shadow-lg transform translate-y-2 group-hover:translate-y-0 duration-200 delay-75"
                  aria-label="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-medium text-gray-600 dark:text-slate-300 truncate max-w-[200px]" title={getFileName()}>
                {getFileName()}
              </span>
              <div className="flex items-center gap-3 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="text-orange-600 dark:text-orange-400 hover:underline"
                >
                  Replace
                </button>
                <span className="text-gray-300 dark:text-slate-700">|</span>
                <button
                  type="button"
                  onClick={onRemove}
                  className="text-red-500 hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className={`w-full ${aspectClass} max-h-64 flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 border-dashed transition-all duration-200 group relative overflow-hidden border-gray-200 dark:border-slate-700 hover:border-orange-400 dark:hover:border-orange-500 bg-gray-50/50 dark:bg-slate-800/50 hover:bg-orange-50/30 dark:hover:bg-slate-800`}
          >
            <div className="p-3.5 rounded-2xl transition-all duration-200 bg-white dark:bg-slate-700 text-gray-400 group-hover:text-orange-500 group-hover:scale-110 shadow-sm">
              <Icon className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <span className="block text-sm font-semibold text-gray-700 dark:text-slate-200 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                Click to upload {label.toLowerCase()}
              </span>
              <span className="block text-xs text-gray-400 dark:text-slate-500">
                {subLabel}
              </span>
            </div>
          </button>
        )}

        <input ref={inputRef} type="file" accept="image/*" onChange={onUpload} className="hidden" />
        {error && (
          <div className="flex items-center gap-1.5 text-xs text-red-500 mt-1 animate-in fade-in slide-in-from-top-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{Array.isArray(error) ? error[0] : error}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Main Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200/80 dark:border-slate-800 shadow-xl shadow-gray-200/40 dark:shadow-none overflow-hidden">

        {/* Header Banner */}
        <div className="px-6 md:px-8 py-6 border-b border-gray-100 dark:border-slate-800 bg-gradient-to-r from-orange-500/[0.03] via-transparent to-transparent flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-orange-500 text-white shadow-lg shadow-orange-500/25">
              <ChefHat className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-xl text-gray-900 dark:text-white tracking-tight">
                {isEdit ? 'Edit Restaurant Profile' : 'New Restaurant Profile'}
              </h2>
              <p className="text-xs md:text-sm text-gray-500 dark:text-slate-400 mt-0.5">
                Manage your restaurant's core identity and branding details
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8 space-y-8">

          {/* SECTION 1: BASIC INFO */}
          <section>
            <SectionHeader
              icon={Type}
              title="Basic Information"
              description="Core details that identify your restaurant"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name Field - Prominent */}
              <div className="space-y-2">
                <label htmlFor="restaurant-name" className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                  Restaurant Name <span className="text-orange-500">*</span>
                </label>
                <input
                  id="restaurant-name"
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g., Bella Italia Downtown"
                  className="w-full px-4.5 py-3.5 rounded-2xl border border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50 text-gray-900 dark:text-white placeholder-gray-400 outline-none transition-all text-sm font-medium focus:border-orange-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-orange-500/10"
                />
                {errors.name && (
                  <p className="text-xs text-red-500 flex items-center gap-1.5 mt-1">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Currency Field */}
              <div className="space-y-2">
                <label htmlFor="currency" className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                  Currency <span className="text-orange-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="currency"
                    required
                    value={formData.currency || 'select'}
                    onChange={(e) => handleInputChange('currency', e.target.value)}
                    className="w-full px-4.5 pr-10 py-3.5 rounded-2xl border border-gray-200 dark:border-slate-700 appearance-none bg-gray-50/50 dark:bg-slate-800/50 text-gray-900 dark:text-white outline-none transition-all text-sm font-medium cursor-pointer focus:border-orange-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-orange-500/10"
                  >
                    <option value="select" disabled>Select Currency</option>
                    {cc.data.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.code} - {c.currency}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                {errors.currency && (
                  <p className="text-xs text-red-500 flex items-center gap-1.5 mt-1">
                    {errors.currency}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* SECTION 2: BRANDING */}
          <section className="pt-2">
            <SectionHeader
              icon={Palette}
              title="Branding & Visuals"
              description="Logo and background imagery for your storefront"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ImageUploader
                preview={imagePreview}
                file={formData.logo}
                onUpload={handleImageUpload}
                onRemove={removeImage}
                inputRef={fileInputRef}
                label="Restaurant Logo"
                subLabel="Square format recommended (Max 2MB)"
                error={errors.logo}
                icon={ImageIcon}
                aspectClass="aspect-square"
              />

              <ImageUploader
                preview={bgImagePreview}
                file={formData.background_image}
                onUpload={handleBgImageUpload}
                onRemove={removeBgImage}
                inputRef={bgFileInputRef}
                label="Cover Background"
                subLabel="Square format recommended (Max 5MB)"
                error={errors.background_image}
                icon={BgImageIcon}
                aspectClass="aspect-square"
              />
            </div>
          </section>

          {/* SECTION 3: STATUS - NEW TOGGLE DESIGN */}
          <section className="pt-2">
            <SectionHeader
              icon={Power}
              title="Restaurant Status"
              description="Control your restaurant's visibility and availability"
            />

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                  Visibility Status <span className="text-orange-500">*</span>
                </label>
                
                {/* Status Toggle Card */}
                <div className="relative p-4 rounded-xl border-2 transition-all duration-200 group hover:border-orange-200 dark:hover:border-orange-800/40 cursor-pointer bg-white dark:bg-slate-800/40 border-gray-200 dark:border-slate-700/80 hover:bg-orange-50/30 dark:hover:bg-orange-500/5">
                  <label htmlFor="is_active" className="flex items-start gap-4 cursor-pointer">
                    <div className="relative flex items-center justify-center mt-0.5">
                      <input
                        type="checkbox"
                        id="is_active"
                        className="w-5 h-5 text-orange-500 rounded-md border-2 border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-orange-500/30 focus:ring-offset-2 dark:focus:ring-offset-slate-900 cursor-pointer transition-all checked:border-orange-500 checked:bg-orange-500 hover:border-orange-400"
                        checked={formData.status === 'active' || formData.status === true}
                        onChange={(e) => handleInputChange('status', e.target.checked ? 'active' : 'suspended')}
                      />
                      {formData.status === 'active' && (
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
                          Active Restaurant
                        </span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium transition-colors ${
                          formData.status === 'active'
                            ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                            : 'bg-gray-100 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400'
                        }`}>
                          {formData.status === 'active' ? 'Active' : 'Suspended'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                        {formData.status === 'active'
                          ? 'Restaurant is visible to customers and fully operational'
                          : 'Restaurant is suspended and hidden from all customers'}
                      </p>
                    </div>
                  </label>
                </div>

                {errors.status && (
                  <p className="text-xs text-red-500 flex items-center gap-1.5 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.status}
                  </p>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Action Footer Bar */}
      <div className="flex items-center justify-end gap-3 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3.5 rounded-2xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-700 dark:text-slate-300 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-slate-800 transition-all shadow-sm active:scale-[0.98]"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-8 py-3.5 rounded-2xl bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white text-sm font-semibold flex items-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 active:scale-[0.98] min-w-[160px] justify-center"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>{isEdit ? 'Saving...' : 'Creating...'}</span>
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