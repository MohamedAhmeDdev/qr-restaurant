import React, { useRef, useState, useEffect } from 'react';
import { LayoutGrid, Image as ImageIcon, Check, ChevronDown, X, Search, Upload, Power, PowerOff } from 'lucide-react';
import api from '../../services/api';
import CategoriesService from '../../services/categories';

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


  useEffect(() => {
  const loadCategories = async () => {
    setIsLoadingCategories(true);
    setCategoryError('');
    try {
      const data = await CategoriesService.getCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      setCategoryError(err.response?.data?.message);
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

      setImagePreview(URL.createObjectURL(file));
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
      if (errors.image) setErrors((prev) => ({ ...prev, image: undefined }));
    }
  };

  const removeImage = () => {
    setImagePreview(null);
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
      <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800 bg-gradient-to-r from-gray-50/80 to-transparent dark:from-slate-900/50 flex items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500 dark:bg-orange-500/20">
            <LayoutGrid className="w-4 h-4" />
          </div>
          <h2 className="font-semibold text-gray-900 dark:text-white">Menu Item Details</h2>
        </div>
      
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
                Item Name
              </label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="e.g. Margherita Pizza"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300/80 dark:border-slate-700 bg-white dark:bg-slate-800/80 focus:ring-4 focus:ring-orange-500/15 focus:border-orange-500 outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 transition-all text-sm shadow-sm"
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
                  Category
                </span>
              </label>
              <select
                value={formData.category_id || ''}
                onChange={(e) => handleChange('category_id', e.target.value)}
                disabled={isLoadingCategories}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300/80 dark:border-slate-700 bg-white dark:bg-slate-800/80 focus:ring-4 focus:ring-orange-500/15 focus:border-orange-500 outline-none text-gray-900 dark:text-white transition-all text-sm shadow-sm disabled:opacity-50"
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
              Price
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.price || ''}
              onChange={(e) => handleChange('price', e.target.value)}
              placeholder="0.00"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300/80 dark:border-slate-700 bg-white dark:bg-slate-800/80 focus:ring-4 focus:ring-orange-500/15 focus:border-orange-500 outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 transition-all text-sm shadow-sm"
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
                className={`w-full px-4 py-2.5 rounded-xl border text-left flex items-center justify-between border-gray-300/80 dark:border-slate-700 ${isDropdownOpen ? 'ring-4 ring-orange-500/15 border-orange-500' : ''} bg-white dark:bg-slate-800/80 outline-none text-gray-900 dark:text-white transition-all text-sm shadow-sm disabled:opacity-50`}
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
                            className={`group flex items-center gap-3 px-2.5 py-2 rounded-lg cursor-pointer text-sm transition-colors ${
                              isSelected
                                ? 'bg-orange-50 dark:bg-orange-500/10'
                                : 'hover:bg-gray-50 dark:hover:bg-slate-700/40'
                            }`}
                          >
                            <span
                              className={`flex items-center justify-center w-[18px] h-[18px] rounded-md border-2 shrink-0 transition-colors ${
                                isSelected
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
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300/80 dark:border-slate-700 bg-white dark:bg-slate-800/80 focus:ring-4 focus:ring-orange-500/15 focus:border-orange-500 outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 transition-all text-sm shadow-sm resize-y"
          />
          {errors.description && (
            <p className="text-xs text-red-500 mt-1">
              {Array.isArray(errors.description) ? errors.description[0] : errors.description}
            </p>
          )}
        </div>

        <hr className="border-gray-100 dark:border-slate-800" />

{/* Image Upload Area */}
<div>
  <label className="block text-sm font-semibold text-gray-800 dark:text-slate-200 mb-2">
    Item Image
  </label>

  {imagePreview ? (
    <div className="relative group w-full h-64 md:h-72 rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-800 bg-gray-900 shadow-md">
      <img
        src={imagePreview}
        alt="Menu item preview"
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 transition-opacity flex flex-col justify-end p-5">
        <p className="text-sm font-medium text-white truncate mb-3">
          {formData.image?.name || 'Current image'}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-semibold transition-all border border-white/20 shadow-sm"
          >
            Replace Image
          </button>
          <button
            type="button"
            onClick={removeImage}
            className="px-4 py-2 rounded-xl bg-red-500/80 hover:bg-red-600 backdrop-blur-md text-white text-xs font-semibold transition-all shadow-sm"
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
      className="w-full h-56 md:h-64 flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 border-dashed border-gray-300 dark:border-slate-700 hover:border-orange-500 dark:hover:border-orange-500 bg-gray-50/50 dark:bg-slate-800/30 hover:bg-orange-50/30 dark:hover:bg-slate-800/60 transition-all group"
    >
      <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-gray-200/80 dark:border-slate-700 text-gray-400 group-hover:text-orange-500 group-hover:scale-110 shadow-sm transition-all">
        <ImageIcon className="w-5 h-5" />
      </div>
      <div className="text-center">
        <span className="block text-sm font-semibold text-gray-800 dark:text-slate-200">
          Click to upload menu item image
        </span>
        <span className="block text-xs text-gray-400 dark:text-slate-500 mt-1">
          JPG, PNG or WebP — up to 2MB
        </span>
      </div>
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

{/* Status & Options Toggles - Improved */}

<div className="space-y-4">
  {/* Section Header */}
  <div>
    <label className="block text-sm font-semibold text-gray-800 dark:text-slate-200">
      Status & Visibility
    </label>
    <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
      Control how this menu item appears across your store
    </p>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
    {/* Active Status Toggle */}
    <div className="relative p-4 rounded-xl border-2 transition-all duration-200  cursor-pointer bg-white dark:bg-slate-800/40 border-gray-200 dark:border-slate-700/80">
      <label htmlFor="is_active" className="flex items-start gap-4 cursor-pointer">
        <div className="relative flex items-center justify-center mt-0.5">
          <input
            type="checkbox"
            id="is_active"
            className="w-5 h-5 text-orange-500 rounded-md border-2 border-gray-300 dark:border-slate-600 cursor-pointer transition-all checked:border-orange-500 checked:bg-orange-500 hover:border-orange-400"
            checked={formData.is_active !== false}
            onChange={(e) => handleChange('is_active', e.target.checked)}
          />
          {formData.is_active !== false && (
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
              Active Menu Item
            </span>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium transition-colors ${
              formData.is_active !== false
                ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                : 'bg-gray-100 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400'
            }`}>
              {formData.is_active !== false ? 'Active' : 'Inactive'}
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5 leading-relaxed">
            {formData.is_active !== false 
              ? 'Visible to customers and available for ordering' 
              : 'Hidden from customers and unavailable for ordering'}
          </p>
        </div>
      </label>
    </div>

    {/* Availability Toggle - Optional extra status */}
    <div className="relative p-4 rounded-xl border-2 transition-all duration-200  cursor-pointer bg-white dark:bg-slate-800/40 border-gray-200 dark:border-slate-700/80">
      <label htmlFor="is_available" className="flex items-start gap-4 cursor-pointer">
        <div className="relative flex items-center justify-center mt-0.5">
          <input
            type="checkbox"
            id="is_available"
            className="w-5 h-5 text-orange-500 rounded-md border-2 border-gray-300 dark:border-slate-600 cursor-pointer transition-all checked:border-orange-500 checked:bg-orange-500 hover:border-orange-400"
            checked={formData.is_available !== false}
            onChange={(e) => handleChange('is_available', e.target.checked)}
          />
          {formData.is_available !== false && (
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
              In Stock
            </span>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium transition-colors ${
              formData.is_available !== false
                ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                : 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300'
            }`}>
              {formData.is_available !== false ? 'Available' : 'Out of Stock'}
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5 leading-relaxed">
            {formData.is_available !== false 
              ? 'Item is in stock and ready for purchase' 
              : 'Item is currently out of stock'}
          </p>
        </div>
      </label>
    </div>
  </div>

  {errors.is_active && (
    <p className="text-xs text-red-500 mt-1">
      {Array.isArray(errors.is_active) ? errors.is_active[0] : errors.is_active}
    </p>
  )}
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