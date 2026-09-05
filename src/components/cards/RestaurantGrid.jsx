// src/pages/restaurants/components/RestaurantGrid.jsx
import React from 'react';
import { ChefHat, Archive, AlertCircle, RotateCcw, PlusCircle } from 'lucide-react';
import RestaurantCard from './RestaurantCard';
import EmptyState from '../common/EmptyState';

export default function RestaurantGrid({
    restaurants,
    activeSlug,
    isSwitching,
    pendingAction,
    openMenuId,
    menuRefs,
    isLoading,
    error,
    activeTab,
    searchQuery,
    onToggleMenu,
    onToggleStatus,
    onSoftDelete,
    onRestore,
    onOpenDeleteModal,
    onSwitchRestaurant,
    onRetry,
    onCreateRestaurant,
    onClearSearch,
}) {
    return (
        <>
            {isLoading ? (
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div
                            key={index}
                            className="rounded-2xl border border-slate-200 dark:border-slate-800 p-6 h-64 relative overflow-hidden bg-white dark:bg-slate-900"
                        >
                            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-slate-100 dark:via-slate-800/60 to-transparent" />
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-12 h-12 bg-slate-200 dark:bg-slate-800 rounded-xl" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-md w-3/4" />
                                        <div className="h-4 bg-slate-100 dark:bg-slate-800/60 rounded-md w-1/2" />
                                    </div>
                                </div>
                                <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-full" />
                                    <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-5/6" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : error ? (
                <div className="p-12">
                    <EmptyState
                        icon={AlertCircle}
                        title="Unable to load restaurants"
                        description={error}
                        action={
                            <button
                                onClick={onRetry}
                                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/30 rounded-lg transition-colors duration-200"
                            >
                                <RotateCcw className="w-4 h-4" /> Try again
                            </button>
                        }
                    />
                </div>
            ) : restaurants.length === 0 ? (
                <div className="p-16">
                    <EmptyState
                        icon={activeTab === 'trashed' ? Archive : ChefHat}
                        title={
                            searchQuery
                                ? 'No matching restaurants'
                                : activeTab === 'trashed'
                                    ? 'Trash is empty'
                                    : 'No restaurants yet'
                        }
                        description={
                            searchQuery
                                ? `No restaurants found matching "${searchQuery}".`
                                : activeTab === 'trashed'
                                    ? 'Deleted restaurants will appear here.'
                                    : 'Get started by creating your first restaurant location.'
                        }
                        action={
                            !searchQuery && activeTab === 'active' ? (
                                <button
                                    onClick={onCreateRestaurant}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg shadow-orange-500/25"
                                >
                                    <PlusCircle className="w-4 h-4" /> Create Restaurant
                                </button>
                            ) : searchQuery ? (
                                <button
                                    onClick={onClearSearch}
                                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors duration-200"
                                >
                                    Clear search
                                </button>
                            ) : null
                        }
                    />
                </div>
            ) : (
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {restaurants.map((restaurant) => {
                        const isActiveWorkspace = activeSlug === restaurant.slug && !restaurant.isTrashed;
                        const isSwitchingThis = isSwitching === restaurant.id;
                        const isBusy = pendingAction?.id === restaurant.id;
                        const isTogglingStatus = isBusy && pendingAction?.type === 'toggleStatus';
                        const isMenuOpen = openMenuId === restaurant.id;

                        const isRestaurant =
                            restaurant.is_active === true ||
                            restaurant.is_active === 1 ||
                            restaurant.is_active === 'active';

                        return (
                            <RestaurantCard
                                key={restaurant.id}
                                restaurant={restaurant}
                                isActiveWorkspace={isActiveWorkspace}
                                isSwitchingThis={isSwitchingThis}
                                isBusy={isBusy}
                                isTogglingStatus={isTogglingStatus}
                                isMenuOpen={isMenuOpen}
                                isRestaurantActive={isRestaurant}
                                menuRef={(el) => (menuRefs.current[restaurant.id] = el)}
                                onToggleMenu={onToggleMenu}
                                onToggleStatus={onToggleStatus}
                                onSoftDelete={onSoftDelete}
                                onRestore={onRestore}
                                onOpenDeleteModal={onOpenDeleteModal}
                                onSwitchRestaurant={onSwitchRestaurant}
                                pendingAction={pendingAction}
                            />
                        );
                    })}
                </div>
            )}
        </>
    );
}