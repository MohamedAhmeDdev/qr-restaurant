import React, { useRef, useState, useEffect } from 'react';
import { LayoutGrid, Image, Check, ChevronDown, X, Search } from 'lucide-react';
import api from '../../services/api';

export default function MenuForm({
  formData,
  setFormData,
  imagePreview,
  setImagePreview,
  errors,
  setErrors,
  onSubmit,
  onCancel,
  isSubmitting,
  submitButtonText = 'Create Menu Item',
  isEdit = false,
}) {
  const fileInputRef = useRef(null);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [modifierQuery, setModifierQuery] = useState('');

  // Dynamic Categories State
  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [categoryError, setCategoryError] = useState('');

  // Dynamic Modifier Groups State
  const [modifierGroups, setModifierGroups] = useState([]);
  const [isLoadingModifiers, setIsLoadingModifiers] = useState(false);
  const [modifierError, setModifierError] = useState('');

  // 1. Fetch Categories
  useEffect(() => {
    const loadCategories = async () => {
      setIsLoadingCategories(true);
      setCategoryError('');
      try {
        const response = await api.get('/option/categories');
        const data = response.data?.data || response.data || [];
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        setCategoryError('Could not load categories');
      } finally {
        setIsLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  // 2. Fetch Modifier Groups
  useEffect(() => {
    const loadModifierGroups = async () => {
      setIsLoadingModifiers(true);
      setModifierError('');
      try {
        const response = await api.get('/option/modifier-groups');
        const data = response.data?.data;
        setModifierGroups(Array.isArray(data) ? data : []);
      } catch (err) {
        setModifierError(err.response?.data?.message);
      } finally {
        setIsLoadingModifiers(false);
      }
    };

    loadModifierGroups();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
        setModifierQuery('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus filter input when dropdown opens
  useEffect(() => {
    if (isDropdownOpen) {
      const t = setTimeout(() => searchInputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [isDropdownOpen]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleModifierToggle = (modifierId) => {
    const numericId = Number(modifierId);
    setFormData((prev) => {
      const current = (prev.modifier_groups || []).map(Number);
      const updated = current.includes(numericId)
        ? current.filter((id) => id !== numericId)
        : [...current, numericId];

      return { ...prev, modifier_groups: updated };
    });

    if (errors.modifier_groups) {
      setErrors((prev) => ({ ...prev, modifier_groups: undefined }));
    }
  };

  const removeModifier = (modifierId) => {
    const numericId = Number(modifierId);
    setFormData((prev) => ({
      ...prev,
      modifier_groups: (prev.modifier_groups || []).map(Number).filter((id) => id !== numericId),
    }));
  };

  const clearAllModifiers = () => {
    setFormData((prev) => ({ ...prev, modifier_groups: [] }));
  };



  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, image: 'Image size must be less than 2MB' }));
        return;
      }
      if (!file.type.startsWith('image/')) {
        setErrors((prev) => ({ ...prev, image: 'Please upload a valid image file' }));
        return;
      }

      // Set the preview using the prop instead of formData
      setImagePreview(URL.createObjectURL(file)); // Use URL.createObjectURL like in RestaurantForm
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
      if (errors.image) setErrors((prev) => ({ ...prev, image: undefined }));
    }
  };

  const removeImage = () => {
    setImagePreview(null); // Clear the prop instead of formData
    setFormData((prev) => ({
      ...prev,
      image: null,
    }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const selectedModifierGroups = (formData.modifier_groups || []).map(Number);

  const filteredModifiers = modifierGroups.filter((group) =>
    group.name.toLowerCase().includes(modifierQuery.trim().toLowerCase())
  );

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-gray-200/80 dark:border-slate-800 shadow-xl shadow-gray-100/50 dark:shadow-none overflow-hidden transition-all"
    >
      <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800 bg-gradient-to-r from-gray-50/80 to-transparent dark:from-slate-900/50 flex items-center gap-2.5">
        <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500 dark:bg-orange-500/20">
          <LayoutGrid className="w-4 h-4" />
        </div>
        <h2 className="font-semibold text-gray-900 dark:text-white">Menu Item Details</h2>
      </div>

      <div className="p-6 md:p-8 space-y-6">
        {/* Basic Information */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 dark:text-slate-200 mb-2">
            Basic Information
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-slate-300">
                Item Name <span className="text-orange-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="e.g. Margherita Pizza"
                className={`w-full px-4 py-2.5 rounded-xl border ${errors.name ? 'border-red-500' : 'border-gray-300/80 dark:border-slate-700'
                  } bg-white dark:bg-slate-800/80 focus:ring-4 focus:ring-orange-500/15 focus:border-orange-500 outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 transition-all text-sm shadow-sm`}
              />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1">
                  {Array.isArray(errors.name) ? errors.name[0] : errors.name}
                </p>
              )}
            </div>

            {/* Dynamic Category Select Input */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-slate-300 flex items-center justify-between">
                <span>
                  Category <span className="text-orange-500">*</span>
                </span>
              </label>
              <select
                value={formData.category_id || ''}
                onChange={(e) => handleChange('category_id', e.target.value)}
                disabled={isLoadingCategories}
                className={`w-full px-4 py-2.5 rounded-xl border ${errors.category_id ? 'border-red-500' : 'border-gray-300/80 dark:border-slate-700'
                  } bg-white dark:bg-slate-800/80 focus:ring-4 focus:ring-orange-500/15 focus:border-orange-500 outline-none text-gray-900 dark:text-white transition-all text-sm shadow-sm disabled:opacity-50`}
              >
                <option value="">
                  {isLoadingCategories ? 'Loading categories...' : 'Select a category'}
                </option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {categoryError && <p className="text-xs text-red-500 mt-1">{categoryError}</p>}
              {errors.category_id && (
                <p className="text-xs text-red-500 mt-1">
                  {Array.isArray(errors.category_id) ? errors.category_id[0] : errors.category_id}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Price and Dynamic Modifier Group Multi-Select */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-slate-300">
              Price <span className="text-orange-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.price || ''}
              onChange={(e) => handleChange('price', e.target.value)}
              placeholder="0.00"
              className={`w-full px-4 py-2.5 rounded-xl border ${errors.price ? 'border-red-500' : 'border-gray-300/80 dark:border-slate-700'
                } bg-white dark:bg-slate-800/80 focus:ring-4 focus:ring-orange-500/15 focus:border-orange-500 outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 transition-all text-sm shadow-sm`}
            />
            {errors.price && (
              <p className="text-xs text-red-500 mt-1">
                {Array.isArray(errors.price) ? errors.price[0] : errors.price}
              </p>
            )}
          </div>

          {/* Dynamic Multi-Select Dropdown for Modifier Groups */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 dark:text-slate-300">
                Modifier Groups
              </label>
              {selectedModifierGroups.length > 0 && (
                <button
                  type="button"
                  onClick={clearAllModifiers}
                  className="text-xs font-medium text-gray-400 hover:text-orange-500 dark:text-slate-500 dark:hover:text-orange-400 transition-colors"
                >
                  Clear all
                </button>
              )}
            </div>

            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                disabled={isLoadingModifiers}
                className={`w-full px-4 py-2.5 rounded-xl border text-left flex items-center justify-between ${errors.modifier_groups ? 'border-red-500' : 'border-gray-300/80 dark:border-slate-700'
                  } ${isDropdownOpen ? 'ring-4 ring-orange-500/15 border-orange-500' : ''} bg-white dark:bg-slate-800/80 outline-none text-gray-900 dark:text-white transition-all text-sm shadow-sm disabled:opacity-50`}
              >
                <span className={selectedModifierGroups.length === 0 ? 'text-gray-400 dark:text-slate-500' : 'font-medium'}>
                  {isLoadingModifiers
                    ? 'Loading modifier groups...'
                    : selectedModifierGroups.length === 0
                      ? 'Select modifier groups...'
                      : `${selectedModifierGroups.length} group${selectedModifierGroups.length > 1 ? 's' : ''} selected`}
                </span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute z-20 mt-2 w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-lg shadow-gray-200/60 dark:shadow-black/30 overflow-hidden origin-top animate-[dropdownIn_120ms_ease-out]">
                  <div className="p-2 border-b border-gray-100 dark:border-slate-700">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 dark:text-slate-500" />
                      <input
                        ref={searchInputRef}
                        type="text"
                        value={modifierQuery}
                        onChange={(e) => setModifierQuery(e.target.value)}
                        placeholder="Filter groups..."
                        className="w-full pl-8 pr-2 py-1.5 rounded-lg bg-gray-50 dark:bg-slate-900/60 text-xs text-gray-700 dark:text-slate-200 placeholder-gray-400 dark:placeholder-slate-500 outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
                      />
                    </div>
                  </div>

                  <div className="max-h-56 overflow-y-auto p-1.5 space-y-0.5">
                    {filteredModifiers.length === 0 ? (
                      <p className="px-3 py-4 text-center text-xs text-gray-400 dark:text-slate-500">
                        {modifierQuery ? `No groups match "${modifierQuery}"` : 'No modifier groups found'}
                      </p>
                    ) : (
                      filteredModifiers.map((group) => {
                        const isSelected = selectedModifierGroups.includes(group.id);
                        const optionsSummary = group.options?.map((o) => o.name).join(', ');

                        return (
                          <div
                            key={group.id}
                            onClick={() => handleModifierToggle(group.id)}
                            className={`group flex items-center gap-3 px-2.5 py-2 rounded-lg cursor-pointer text-sm transition-colors ${isSelected
                                ? 'bg-orange-50 dark:bg-orange-500/10'
                                : 'hover:bg-gray-50 dark:hover:bg-slate-700/40'
                              }`}
                          >
                            <span
                              className={`flex items-center justify-center w-[18px] h-[18px] rounded-md border-2 shrink-0 transition-colors ${isSelected
                                  ? 'bg-orange-500 border-orange-500'
                                  : 'border-gray-300 dark:border-slate-600 group-hover:border-orange-400'
                                }`}
                            >
                              {isSelected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                            </span>
                            <span className="flex-1 min-w-0">
                              <span className={`block truncate ${isSelected ? 'text-orange-700 dark:text-orange-300 font-medium' : 'text-gray-700 dark:text-slate-300'}`}>
                                {group.name}
                              </span>
                              {optionsSummary && (
                                <span className="block text-xs text-gray-400 dark:text-slate-500 truncate">
                                  {optionsSummary}
                                </span>
                              )}
                            </span>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

            {modifierError && <p className="text-xs text-red-500 mt-1">{modifierError}</p>}

            {/* Selected Chips */}
            {selectedModifierGroups.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {selectedModifierGroups.map((id) => {
                  const group = modifierGroups.find((g) => g.id === id);
                  return (
                    <span
                      key={id}
                      className="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-1 rounded-full text-xs font-medium bg-orange-50 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300 border border-orange-200/70 dark:border-orange-500/25 transition-colors"
                    >
                      {group ? group.name : `Group #${id}`}
                      <button
                        type="button"
                        onClick={() => removeModifier(id)}
                        className="p-0.5 hover:bg-orange-200/70 dark:hover:bg-orange-500/30 rounded-full transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  );
                })}
              </div>
            )}

            {errors.modifier_groups && (
              <p className="text-xs text-red-500 mt-1">
                {Array.isArray(errors.modifier_groups) ? errors.modifier_groups[0] : errors.modifier_groups}
              </p>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700 dark:text-slate-300">
            Description
          </label>
          <textarea
            value={formData.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Enter item description"
            rows="3"
            className={`w-full px-4 py-2.5 rounded-xl border ${errors.description ? 'border-red-500' : 'border-gray-300/80 dark:border-slate-700'
              } bg-white dark:bg-slate-800/80 focus:ring-4 focus:ring-orange-500/15 focus:border-orange-500 outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 transition-all text-sm shadow-sm resize-y`}
          />
          {errors.description && (
            <p className="text-xs text-red-500 mt-1">
              {Array.isArray(errors.description) ? errors.description[0] : errors.description}
            </p>
          )}
        </div>

        <hr className="border-gray-100 dark:border-slate-800" />

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 dark:text-slate-200 mb-2">
            Item Image
          </label>

          {imagePreview ? (
            <div className="flex items-center gap-4">
              <img
                src={imagePreview}
                alt="Menu item preview"
                className="w-20 h-20 object-cover rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm"
              />
              <div className="flex flex-col gap-2">
                <span className="text-sm text-gray-600 dark:text-slate-300 truncate max-w-[220px]">
                  {formData.image?.name || 'Current image'}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-slate-300 text-xs font-medium hover:bg-gray-50 dark:hover:bg-slate-800 transition-all"
                  >
                    Replace
                  </button>
                  <button
                    type="button"
                    onClick={removeImage}
                    className="px-3 py-1.5 rounded-lg border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-xs font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center gap-3 px-4 py-4 rounded-xl border-2 border-dashed border-gray-300 dark:border-slate-700 hover:border-orange-400 dark:hover:border-orange-500 bg-gray-50/60 dark:bg-slate-800/40 hover:bg-orange-50/40 dark:hover:bg-slate-800 text-left transition-all"
            >
              <span className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-400">
                <Image className="w-4 h-4" />
              </span>
              <span>
                <span className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                  Click to upload an image
                </span>
                <span className="block text-xs text-gray-400 dark:text-slate-500">
                  JPG, PNG or WebP — up to 2MB
                </span>
              </span>
            </button>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          {errors.image && (
            <p className="text-xs text-red-500 mt-1.5">
              {Array.isArray(errors.image) ? errors.image[0] : errors.image}
            </p>
          )}
        </div>

        <hr className="border-gray-100 dark:border-slate-800" />

        {/* Status */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 dark:text-slate-200 mb-2">
            Status
          </label>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-slate-300">
              Availability <span className="text-orange-500">*</span>
            </label>
            <div className="flex items-center gap-6 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="availability"
                  checked={formData.is_available === true || formData.is_available === 'true' || formData.is_available === 1}
                  onChange={() => handleChange('is_available', true)}
                  className="w-4 h-4 text-orange-500 border-gray-300 dark:border-slate-600 focus:ring-orange-500 focus:ring-2"
                />
                <span className="text-sm text-gray-700 dark:text-slate-300">Available</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="availability"
                  checked={formData.is_available === false || formData.is_available === 'false' || formData.is_available === 0}
                  onChange={() => handleChange('is_available', false)}
                  className="w-4 h-4 text-gray-500 border-gray-300 dark:border-slate-600 focus:ring-gray-400 focus:ring-2"
                />
                <span className="text-sm text-gray-700 dark:text-slate-300">Unavailable</span>
              </label>
            </div>
            {errors.is_available && (
              <p className="text-xs text-red-500 mt-1">
                {Array.isArray(errors.is_available) ? errors.is_available[0] : errors.is_available}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="px-6 md:px-8 py-4 border-t border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50 flex flex-wrap items-center justify-end gap-3">
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
              <LayoutGrid className="w-4 h-4" />
              <span>{submitButtonText}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}