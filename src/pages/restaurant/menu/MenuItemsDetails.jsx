import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Image as ImageIcon, 
  UtensilsCrossed, 
  AlertCircle, 
  Info,
  Edit3,
  RefreshCw,
  Sparkles,
  Power,
  Eye,
  EyeOff,
  AlertTriangle,
  PackageX
} from 'lucide-react';
import toast from 'react-hot-toast';

import api from '../../../services/api';
import { getImageUrl } from '../../../utils/getImageUrl';
import StatusBadge from '../../../components/StatusBadge';
import { useFormatPrice } from '../../../contexts/useFormatPrice';

export default function MenuItemsDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
const formatPrice = useFormatPrice();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Menu Item details
  const fetchItemDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/menu-items/${id}`);
      const data = response.data?.data;
      setItem(data);
    } catch (err) {
      setError(err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchItemDetails();
  }, [fetchItemDetails]);


  // ── 1. LOADING STATE (Skeleton Loader) ──
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 sm:p-8 animate-pulse">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex justify-between items-center">
            <div className="h-6 w-32 bg-slate-200 dark:bg-slate-800 rounded-lg" />
            <div className="h-10 w-28 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-6">
              <div className="aspect-video w-full bg-slate-200 dark:bg-slate-800 rounded-2xl" />
              <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
            </div>
            <div className="lg:col-span-5 space-y-6">
              <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── 2. ERROR STATE ──
if (error) {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6">
            <div className="max-w-md w-full text-center space-y-8">
              <div className="space-y-3 flex flex-col items-center">
                    <div className="p-4 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400">
                        <AlertTriangle className="w-12 h-12" />
                    </div>
                </div>

                {/* Copy */}
                <div className="space-y-3">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                        Couldn't load this item
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        An unexpected error occurred while fetching the menu item details.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 justify-center">
                    <button
                        type="button"
                        onClick={() => navigate('/menu-items')}
                        className="px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white underline underline-offset-4 decoration-slate-300 dark:decoration-slate-700 hover:decoration-slate-900 dark:hover:decoration-white transition-colors"
                    >
                        ← Back to list
                    </button>
                </div>
            </div>
        </div>
    );
}

  // ── 3. EMPTY STATE (Not Found / Removed) ──
  if (!item) {
    return (
       <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6">
            <div className="max-w-md w-full text-center space-y-8">
             <div className="space-y-3 flex flex-col items-center">
                    <div className="p-4 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-400 dark:text-slate-500">
                        <PackageX className="w-12 h-12" />
                    </div>
                </div>

                {/* Copy */}
                <div className="space-y-3">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                        Item Not Found
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
              The requested item does not exist or may have been permanently deleted.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 justify-center">
                    <button
                        type="button"
                        onClick={() => navigate('/menu-items')}
                        className="px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white underline underline-offset-4 decoration-slate-300 dark:decoration-slate-700 hover:decoration-slate-900 dark:hover:decoration-white transition-colors"
                    >
                        ← Back to list
                    </button>
                </div>
            </div>
        </div>
    );
  }

  // ── 4. SUCCESS LIST STATE ──
  const modifierGroups = item.modifier_groups || [];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 sm:p-8 transition-colors">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800/80 pb-5">
          <button 
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors w-fit"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Menu
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(`/menu-items/edit/${id}`)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 shadow-sm transition-all"
            >
              <Edit3 className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              Edit Item
            </button>
          </div>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Visuals & Modifiers */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Banner Image Display */}
            <div className="relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden group">
              {item.image ? (
                <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={getImageUrl(item.image)}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-full aspect-video bg-slate-100/70 dark:bg-slate-800/50 border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 gap-3">
                  <div className="p-4 rounded-full bg-slate-200/50 dark:bg-slate-800">
                    <ImageIcon className="w-8 h-8" />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wider">No Preview Image Uploaded</span>
                </div>
              )}
            </div>

            {/* Modifiers Section */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-100 dark:border-orange-500/20">
                    <UtensilsCrossed className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Customization & Modifiers</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Configured options and add-on pricing</p>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {modifierGroups.length} {modifierGroups.length === 1 ? 'Group' : 'Groups'}
                </span>
              </div>

              {modifierGroups.length > 0 ? (
                <div className="space-y-6">
                  {modifierGroups.map((mod, idx) => (
                    <div 
                      key={mod.id || idx} 
                      className="border border-slate-200/70 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50/50 dark:bg-slate-900/40"
                    >
                      {/* Modifier Header */}
                      <div className="bg-slate-100/70 dark:bg-slate-800/40 px-5 py-3.5 border-b border-slate-200/70 dark:border-slate-800 flex flex-wrap justify-between items-center gap-2">
                        <span className="font-bold text-slate-800 dark:text-slate-100 text-sm sm:text-base">
                          {mod.name}
                        </span>
                        
                        <div className="flex items-center gap-2 flex-wrap">
                          {mod.is_required ? (
                            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300 bg-amber-100/80 dark:bg-amber-900/30 px-2.5 py-0.5 rounded-md border border-amber-200 dark:border-amber-800/50">
                              Required
                            </span>
                          ) : (
                            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-200/60 dark:bg-slate-800 px-2.5 py-0.5 rounded-md">
                              Optional
                            </span>
                          )}

                          {mod.min_select !== undefined && mod.max_select !== undefined && (
                            <span className="text-xs font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 px-2.5 py-0.5 rounded-md border border-slate-200 dark:border-slate-700/80">
                              {mod.min_select > 0 ? `Min ${mod.min_select}` : ''}
                              {mod.min_select > 0 && mod.max_select < 999 ? ' • ' : ''}
                              {mod.max_select < 999 ? `Max ${mod.max_select}` : 'Unlimited'}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Modifier Options List / Empty State */}
                      {mod.options && mod.options.length > 0 ? (
                        <div className="divide-y divide-slate-100 dark:divide-slate-800/60 bg-white dark:bg-slate-900">
                          {mod.options.map((opt, optIdx) => (
                            <div key={opt.id || optIdx} className="px-5 py-3 flex justify-between items-center text-sm hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                              <div className="flex items-center gap-2.5">
                                <span className="font-medium text-slate-700 dark:text-slate-300">{opt.name}</span>
                                <StatusBadge status={opt.is_available ? 'Available' : 'Unavailable'} />
                              </div>
                              <span className="font-semibold font-mono text-slate-600 dark:text-slate-400">
                                {formatPrice(opt.price)}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="px-5 py-4 text-xs text-slate-400 dark:text-slate-500 italic flex items-center gap-2 bg-white dark:bg-slate-900">
                          <Info className="w-4 h-4 text-slate-400" /> No options configured for this group.
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 border-2 border-dashed border-slate-200 dark:border-slate-800/80 rounded-xl bg-slate-50/50 dark:bg-slate-900/30">
                  <Sparkles className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">No customizations or add-ons attached.</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Core Summary Sidebar */}
          <div className="lg:col-span-5 lg:sticky lg:top-8 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-4 sm:p-5 space-y-4">
              
              {/* Details Header */}
              <div className="space-y-4">

                {/* Category Label & Badge */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                    Category
                  </label>
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 text-[11px] font-bold uppercase tracking-wider border border-blue-100 dark:border-blue-500/20">
                      {item.category?.name}
                    </span>
                  </div>
                </div>

                {/* Item Name */}
                <div className="space-y-0.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                    Item Name
                  </label>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                    {item.name}
                  </h1>
                </div>

                {/* Slug */}
                {item.slug && (
                  <div className="space-y-0.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                      Slug
                    </label>
                    <div className="p-2 font-mono text-xs text-slate-600 dark:text-slate-300 break-all bg-slate-50 dark:bg-slate-800/40 rounded-lg">
                      {item.slug}
                    </div>
                  </div>
                )}

                {/* Description */}
                <div className="space-y-0.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                    Description
                  </label>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                    {item.description || 'No descriptive overview provided for this menu item.'}
                  </p>
                </div>

              </div>

              {/* Base Price Banner */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  Price
                </span>
                <span className="text-md font-black text-slate-900 dark:text-white tracking-tight">
                  {formatPrice(item.price)}
                </span>
              </div>

     {/* Status Toggles & Indicators */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Item Status</h4>
                
                {/* Availability Switch */}
                <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Availability</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    <StatusBadge status={item.is_available ? 'available' : 'sold_out'} />
                  </p>
                </div>

                {/* Active Switch */}
                <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Menu Visibility</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    <StatusBadge status={item.is_active ? 'active' : 'inactive'} />
                  </p>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}