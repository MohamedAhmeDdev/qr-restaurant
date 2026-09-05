// src/pages/restaurants/components/RestaurantCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    MoreVertical, Edit, Trash2, RotateCcw,
    ArrowRight, Power, CheckCircle, XCircle, Loader2, Building2,
    Globe, Calendar, Activity, ChefHat, ImageIcon
} from 'lucide-react';
import StatusBadge from '../StatusBadge';
import { formatDate } from '../../utils/formatDate';
import { getImageUrl } from '../../utils/getImageUrl';

export default function RestaurantCard({
    restaurant,
    isActiveWorkspace,
    isSwitchingThis,
    isBusy,
    isTogglingStatus,
    isMenuOpen,
    isRestaurantActive,
    menuRef,
    onToggleMenu,
    onToggleStatus,
    onSoftDelete,
    onRestore,
    onOpenDeleteModal,
    onSwitchRestaurant,
    pendingAction,
}) {
    const navigate = useNavigate();

    return (
        <div
            key={restaurant.id}
            className={`
                      group relative rounded-2xl border p-4 transition-all duration-300 flex flex-col gap-3 outline-none
                      ${restaurant.isTrashed
                    ? 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 opacity-75'
                    : isActiveWorkspace
                        ? 'border-orange-400 dark:border-orange-500/60 bg-gradient-to-br from-orange-50/50 to-white dark:from-orange-950/20 dark:to-slate-900 ring-2 ring-orange-500/20 shadow-xl shadow-orange-500/10'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-orange-300 dark:hover:border-orange-700 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none'
                }
                      ${isSwitchingThis || isBusy ? 'opacity-60 pointer-events-none' : ''}
                    `}
        >
            {/* Card Header */}
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    {/* Restaurant Logo/Icon */}
                    {restaurant.logo ? (
                        <img
                            src={getImageUrl(restaurant.logo)}
                            alt={restaurant.name}
                            className="w-11 h-11 rounded-lg object-cover border border-gray-100 dark:border-slate-700 shrink-0"
                        />
                    ) : (
                        <div className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 ${restaurant.isTrashed
                            ? 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                            : isActiveWorkspace
                                ? 'bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
                            }`}>
                            <Building2 className="w-5 h-5" />
                        </div>
                    )}

                    <div className="flex-1 min-w-0">
                        <h3
                            className="font-bold text-sm leading-tight truncate text-slate-900 dark:text-white mb-1"
                            title={restaurant.name}
                        >
                            {restaurant.name}
                        </h3>
                    </div>
                </div>

                {/* More Options Menu */}
                {!isSwitchingThis && !isBusy && (
                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={(e) => onToggleMenu(e, restaurant.id)}
                            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                            aria-label="More options"
                        >
                            <MoreVertical className="w-4 h-4" />
                        </button>

                        {isMenuOpen && (
                            <div className="absolute right-0 top-full mt-1.5 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-10 overflow-hidden">
                                {!restaurant.isTrashed ? (
                                    <>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/restaurant/edit/${restaurant.id}`);
                                            }}
                                            className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 transition-colors"
                                        >
                                            <Edit className="w-4 h-4" />
                                            Edit Details
                                        </button>

                                        <button
                                            onClick={(e) => onToggleStatus(e, restaurant)}
                                            disabled={isTogglingStatus}
                                            className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 transition-colors disabled:opacity-50"
                                        >
                                            {isTogglingStatus ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : restaurant.status === 'active' ? (
                                                <Power className="w-4 h-4 text-amber-500" />
                                            ) : (
                                                <CheckCircle className="w-4 h-4 text-emerald-500" />
                                            )}
                                            {restaurant.status === 'active' ? 'Turn Off' : 'Turn On'}
                                        </button>

                                        <div className="border-t border-slate-200 dark:border-slate-700 my-1" />

                                        <button
                                            onClick={(e) => onSoftDelete(e, restaurant)}
                                            className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Move to Trash
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={(e) => onRestore(e, restaurant)}
                                            disabled={isBusy && pendingAction?.type === 'restore'}
                                            className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 transition-colors disabled:opacity-50"
                                        >
                                            {isBusy && pendingAction?.type === 'restore' ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <RotateCcw className="w-4 h-4" />
                                            )}
                                            Restore
                                        </button>

                                        <div className="border-t border-slate-200 dark:border-slate-700 my-1" />

                                        <button
                                            onClick={(e) => onOpenDeleteModal(e, restaurant)}
                                            className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2 transition-colors"
                                        >
                                            <XCircle className="w-4 h-4" />
                                            Delete Permanently
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Metadata */}
            <div className="space-y-2 pt-2.5 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <Globe className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">
                        <span className="font-mono text-slate-600 dark:text-slate-300">{restaurant.slug || '—'}</span>
                    </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>Created: {formatDate(restaurant.created_at)}</span>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <Activity className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {restaurant.currency}
                    </span>
                </div>

                <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-500 dark:text-slate-400">Status:</span>
                    <StatusBadge status={restaurant.status} />
                </div>

                <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-500 dark:text-slate-400">Restaurant:</span>
                    <StatusBadge
                        status={isRestaurantActive ? 'active' : 'inactive'}
                    />
                </div>
            </div>

            {/* Action Button */}
            <div className="pt-1.5">
                {!restaurant.isTrashed ? (
                    <button
                        type="button"
                        onClick={() => onSwitchRestaurant(restaurant)}
                        disabled={isSwitchingThis || !isRestaurantActive}
                        className={`w-full py-2 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 ${
                            !isRestaurantActive
                                ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed shadow-none'
                                : isActiveWorkspace
                                ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 active:scale-[0.98]'
                                : 'bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 shadow-md hover:shadow-lg active:scale-[0.98]'
                        }`}
                        title={!isRestaurantActive ? 'Cannot switch to a deactivated restaurant' : ''}
                    >
                        {isSwitchingThis ? (
                            <>
                                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                Switching...
                            </>
                        ) : !isRestaurantActive ? (
                            <>
                                <XCircle className="w-4 h-4" />
                               Restaurant is deactivated
                            </>
                        ) : isActiveWorkspace ? (
                            <>
                                <ChefHat className="w-4 h-4" />
                               Current workspace
                                <ArrowRight className="w-4 h-4" />
                            </>
                        ) : (
                            <>
                                Switch to this restaurant
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                ) : (
                    <div className="py-2 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-medium text-sm text-center">
                        {isBusy && pendingAction?.type === 'restore' ? (
                            <span className="flex items-center justify-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Restoring...
                            </span>
                        ) : (
                            'In trash'
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}