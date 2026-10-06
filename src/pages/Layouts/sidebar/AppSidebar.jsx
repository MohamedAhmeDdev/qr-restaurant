import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, QrCode, Tag, Layers,
  UtensilsCrossed, ShoppingCart, BarChart3, Settings,
  X, LogOut, PanelLeftClose, PanelLeftOpen, ChevronDown,
  FileBarChart, Plus, Building2, Loader2, ImageIcon,
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { useRestaurant } from '../../../contexts/RestaurantContext';
import api from '../../../services/api';
import { getImageUrl } from '../../../utils/getImageUrl';

const ALL_NAV = [
  { name: 'Dashboard',           href: '/app/dashboard',         icon: LayoutDashboard, permission: null },
  { name: 'Report',              href: '/app/report',            icon: FileBarChart,    permission: 'report.view' },
  { name: 'Staff',               href: '/app/staff',             icon: Users,           permission: 'staff.view' },
  { name: 'QR Codes & Tables',   href: '/app/table',             icon: QrCode,          permission: 'table.view' },
  { name: 'Categories',          href: '/app/categories',        icon: Tag,             permission: 'category.view' },
  { name: 'Modifiers',           href: '/app/modifier-groups',   icon: Layers,          permission: 'modifier.view' },
  { name: 'Menus',               href: '/app/menu-items',        icon: UtensilsCrossed, permission: 'menu.view' },
  { name: 'Live Orders',         href: '/app/orders',            icon: ShoppingCart,    permission: 'order.view' },
  { name: 'Sales',               href: '/app/sales',             icon: BarChart3,       permission: 'sales.view' },
  { name: 'Settings',            href: '/app/settings',          icon: Settings,        permission: null },
];

const COLLAPSED_WIDTH = 72;

export default function AppSidebar({ mobileOpen, setMobileOpen, collapsed, setCollapsed }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, can, hasRole } = useAuth();
  const {
    restaurants,
    activeRestaurant,
    isLoading,
    fetchRestaurants,
    switchRestaurant,
  } = useRestaurant();

  const isRestaurantAdmin = hasRole('restaurant_admin');

  // ── Admin-only: fetch restaurant details (logo + organization) ──
  const [restaurantDetails, setRestaurantDetails] = useState(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  useEffect(() => {
    if (!isRestaurantAdmin || !activeRestaurant?.id) {
      setRestaurantDetails(null);
      return;
    }

    let cancelled = false;
    setIsLoadingDetails(true);

    api.get(`/restaurants/${activeRestaurant.id}`)
      .then((res) => {
        if (!cancelled) setRestaurantDetails(res.data?.data ?? res.data);
      })
      .catch((err) => console.error('Sidebar: failed to fetch restaurant details', err))
      .finally(() => {
        if (!cancelled) setIsLoadingDetails(false);
      });

    return () => { cancelled = true; };
  }, [isRestaurantAdmin, activeRestaurant?.id]);

  // ── Admin-only: dropdown state ──
  const [isRestaurantDropdownOpen, setIsRestaurantDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (isRestaurantDropdownOpen) fetchRestaurants();
  }, [isRestaurantDropdownOpen, fetchRestaurants]);

  const handleAddRestaurant = () => {
    setIsRestaurantDropdownOpen(false);
    navigate('/restaurant/create');
  };

  const handleSwitchRestaurant = (restaurant) => {
    setIsRestaurantDropdownOpen(false);

    if (restaurant.slug === activeRestaurant?.slug) {
      navigate('/app/dashboard');
      return;
    }

    switchRestaurant(restaurant.slug);
    navigate('/app/dashboard');
  };

  // ── Standard sidebar bits ──
  const [openInlineSubmenu, setOpenInlineSubmenu] = useState(null);
  const [activePopover, setActivePopover] = useState(null);
  const popoverRef = useRef(null);
  const [tooltip, setTooltip] = useState(null);

  const navigation = ALL_NAV.filter(
    (item) => !item.permission || can(item.permission)
  );

  useEffect(() => {
    navigation.forEach((item, index) => {
      if (item.subItems) {
        const isSubItemActive = item.subItems.some((sub) =>
          location.pathname.startsWith(sub.href)
        );
        if (isSubItemActive) setOpenInlineSubmenu(index);
      }
    });
  }, [location.pathname, navigation]);

  useEffect(() => {
    setActivePopover(null);
  }, [location.pathname]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setActivePopover(null);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsRestaurantDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const toggleSubmenu = (index, e) => {
    if (collapsed) {
      setTooltip(null);
      if (activePopover?.index === index) {
        setActivePopover(null);
        return;
      }
      const rect = e.currentTarget.getBoundingClientRect();
      setActivePopover({ index, top: rect.top, height: rect.height });
    } else {
      setOpenInlineSubmenu(openInlineSubmenu === index ? null : index);
    }
  };

  const showTooltip = (e, label) => {
    if (!collapsed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({ label, top: rect.top + rect.height / 2 });
  };

  const hideTooltip = () => setTooltip(null);

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden bg-slate-900/50 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex flex-col
          bg-white dark:bg-slate-900 text-slate-900 dark:text-white
          border-r border-slate-200 dark:border-slate-800
          transition-all duration-200 ease-in-out
          w-64 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-auto
          ${collapsed ? 'lg:w-[72px]' : 'lg:w-64'}
        `}
      >
        {/* HEADER: admin → dropdown; non-admin → static name */}
        <div
          className={`relative flex items-center justify-between h-16 border-b border-slate-200 dark:border-slate-800 px-3 transition-colors duration-200 ${
            collapsed ? 'lg:justify-center lg:px-0' : ''
          }`}
          ref={dropdownRef}
        >
          {isRestaurantAdmin ? (
            /* ── ADMIN: full dropdown ── */
            <button
              onClick={() => {
                if (collapsed) {
                  setCollapsed(false);
                  setIsRestaurantDropdownOpen(true);
                } else {
                  setIsRestaurantDropdownOpen(!isRestaurantDropdownOpen);
                }
              }}
              className={`flex items-center gap-2.5 rounded-md p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors w-full text-left overflow-hidden ${
                collapsed ? 'lg:justify-center lg:w-auto' : ''
              }`}
            >
             
              <div className={`flex flex-col flex-1 overflow-hidden ${collapsed ? 'lg:hidden' : ''}`}>
                <span className="text-[11px] font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wider leading-none mb-1 truncate">
                  {restaurantDetails?.organization?.name}
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-white truncate leading-none">
                  {activeRestaurant?.name || 'Select Restaurant'}
                </span>
              </div>

              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                  collapsed ? 'lg:hidden' : ''
                } ${isRestaurantDropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>
          ) : (
            /* ── NON-ADMIN: static name ── */
            <div className={`flex items-center p-1.5 w-full overflow-hidden ${collapsed ? 'lg:hidden' : ''}`}>
              <span className="text-sm font-bold text-slate-900 dark:text-white truncate leading-none">
                {activeRestaurant?.name || 'Restaurant'}
              </span>
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center shrink-0">
            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white p-1 rounded-md transition-colors duration-200"
            >
              <X className="w-5 h-5" />
            </button>

            <button
              onClick={() => {
                setCollapsed(!collapsed);
                setActivePopover(null);
                setTooltip(null);
                setIsRestaurantDropdownOpen(false);
              }}
              className="hidden lg:flex items-center justify-center w-8 h-8 rounded-md text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors duration-200 ml-1"
              title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {collapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
            </button>
          </div>

          {/* ADMIN DROPDOWN MENU */}
          {isRestaurantAdmin && isRestaurantDropdownOpen && !collapsed && (
            <div className="absolute top-full left-2 right-2 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md shadow-lg z-50 overflow-hidden">
              {isLoading ? (
                <div className="p-1 space-y-1">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center gap-2 px-3 py-2 animate-pulse">
                      <div className="w-4 h-4 rounded bg-slate-200 dark:bg-slate-700 shrink-0" />
                      <div className="h-3.5 rounded bg-slate-200 dark:bg-slate-700" style={{ width: `${60 + (i % 3) * 15}%` }} />
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <div className="p-1 max-h-56 overflow-y-auto space-y-0.5">
                    {restaurants.length === 0 ? (
                      <div className="px-3 py-4 text-xs text-center text-slate-500 dark:text-slate-400">
                        No active restaurants
                      </div>
                    ) : (
                      restaurants.map((res) => (
                        <button
                          key={res.id}
                          onClick={() => handleSwitchRestaurant(res)}
                          className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                            activeRestaurant?.id === res.id
                              ? 'bg-orange-50 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400'
                              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50'
                          }`}
                        >
                          <Building2 className="w-4 h-4 shrink-0 opacity-70" />
                          <span className="truncate flex-1 text-left">{res.name}</span>
                        </button>
                      ))
                    )}
                  </div>

                  <div className="p-1 border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                    <div className="grid grid-cols-2 gap-1">
                      <button
                        onClick={() => {
                          setIsRestaurantDropdownOpen(false);
                          navigate('/restaurant');
                        }}
                        className="flex items-center justify-center gap-1.5 px-2 py-2 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-md transition-colors"
                      >
                        <Layers className="w-3.5 h-3.5" />
                        <span>View All</span>
                      </button>

                      <button
                        onClick={handleAddRestaurant}
                        className="flex items-center justify-center gap-1.5 px-2 py-2 text-xs font-semibold text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/50 rounded-md transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add New</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* NAVIGATION LINKS — unchanged */}
        <nav className={`flex-1 py-4 space-y-1.5 overflow-y-auto overflow-x-hidden scrollbar-none ${
          collapsed ? 'lg:px-2' : 'px-3'
        }`}>
          {navigation.map((item, index) => {
            const isActive = item.href ? location.pathname === item.href : false;
            const isSubItemActive = item.subItems?.some((sub) => location.pathname.startsWith(sub.href));
            const isInlineOpen = openInlineSubmenu === index;
            const isPopoverOpen = activePopover?.index === index;

            if (item.subItems) {
              return (
                <div key={item.name} className="relative">
                  <button
                    onClick={(e) => toggleSubmenu(index, e)}
                    onMouseEnter={(e) => !isPopoverOpen && showTooltip(e, item.name)}
                    onMouseLeave={hideTooltip}
                    className={`
                      relative flex items-center w-full rounded-md transition-colors duration-200 group
                      ${collapsed ? 'lg:justify-center lg:h-11 lg:w-11 lg:mx-auto' : 'px-3 py-2.5'}
                      ${isSubItemActive || isPopoverOpen
                        ? 'bg-orange-50 dark:bg-orange-950 text-orange-600 dark:text-orange-400 font-medium'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}
                    `}
                  >
                    {isSubItemActive && !collapsed && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-orange-500 rounded-r-full" />
                    )}
                    <div className="flex-shrink-0 flex items-center justify-center">
                      <item.icon className={`w-5 h-5 transition-colors duration-200 ${
                        isSubItemActive || isPopoverOpen
                          ? 'text-orange-600 dark:text-orange-400'
                          : 'text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'
                      }`} />
                    </div>
                    <span className={`flex-1 text-left text-sm whitespace-nowrap transition-all duration-200 ${
                      collapsed ? 'lg:hidden' : 'ml-3'
                    }`}>{item.name}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                      collapsed ? 'hidden' : ''
                    } ${isInlineOpen ? 'rotate-180' : ''} ${
                      isSubItemActive ? 'text-orange-500' : 'text-slate-400'
                    }`} />
                  </button>

                  {!collapsed && (
                    <div className={`overflow-hidden transition-all duration-200 ease-in-out ${
                      isInlineOpen ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0'
                    }`}>
                      <div className="pl-4 space-y-1 border-l-2 border-slate-100 dark:border-slate-800 ml-5 my-1">
                        {item.subItems.map((subItem) => {
                          const isSubActive = location.pathname.startsWith(subItem.href);
                          return (
                            <NavLink key={subItem.name} to={subItem.href}
                              onClick={() => setMobileOpen(false)}
                              className={`flex items-center px-3 py-2 rounded-md text-sm transition-colors duration-200 group relative ${
                                isSubActive
                                  ? 'text-orange-600 dark:text-orange-400 font-medium bg-orange-50 dark:bg-orange-950'
                                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                              }`}>
                              <subItem.icon className={`w-4 h-4 mr-2.5 transition-colors duration-200 ${
                                isSubActive ? 'text-orange-500' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                              }`} />
                              {subItem.name}
                            </NavLink>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <NavLink key={item.name} to={item.href}
                onClick={() => setMobileOpen(false)}
                onMouseEnter={(e) => showTooltip(e, item.name)}
                onMouseLeave={hideTooltip}
                className={`
                  relative flex items-center rounded-md transition-colors duration-200 group
                  ${collapsed ? 'lg:justify-center lg:h-11 lg:w-11 lg:mx-auto' : 'px-3 py-2.5'}
                  ${isActive
                    ? 'bg-orange-50 dark:bg-orange-950 text-orange-600 dark:text-orange-400 font-medium'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}
                `}>
                {isActive && !collapsed && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-orange-500 rounded-r-full" />
                )}
                <div className="flex-shrink-0 flex items-center justify-center">
                  <item.icon className={`w-5 h-5 transition-colors duration-200 ${
                    isActive
                      ? 'text-orange-600 dark:text-orange-400'
                      : 'text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'
                  }`} />
                </div>
                <span className={`text-sm whitespace-nowrap transition-all duration-200 ${
                  collapsed ? 'lg:hidden' : 'ml-3'
                }`}>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* FOOTER */}
        <div className={`p-3 border-t border-slate-200 dark:border-slate-800 transition-colors duration-200 ${
          collapsed ? 'lg:justify-center lg:p-2' : ''
        }`}>
          <button
            onClick={handleLogout}
            onMouseEnter={(e) => showTooltip(e, 'Sign Out')}
            onMouseLeave={hideTooltip}
            className={`
              flex items-center rounded-md w-full text-sm font-medium text-slate-600 dark:text-slate-400
              hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-600 dark:hover:text-red-400
              transition-colors duration-200 group relative
              ${collapsed ? 'lg:justify-center lg:h-10 lg:w-10' : 'gap-3 px-3 py-2.5'}
            `}
          >
            <LogOut className="w-5 h-5 flex-shrink-0 text-slate-400 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors duration-200" />
            <span className={`whitespace-nowrap transition-all duration-200 ${collapsed ? 'lg:hidden' : ''}`}>
              Sign Out
            </span>
          </button>
        </div>
      </aside>

      {/* TOOLTIP */}
      {collapsed && tooltip && !activePopover && (
        <div
          className="hidden lg:flex fixed z-[60] items-center -translate-y-1/2 pointer-events-none transition-opacity duration-200"
          style={{ top: tooltip.top, left: COLLAPSED_WIDTH + 8 }}
        >
          <div className="w-1.5 h-1.5 rotate-45 bg-slate-900 dark:bg-slate-100 -mr-0.5 shrink-0" />
          <div className="px-2 py-1 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-[11px] font-semibold rounded-md shadow-md whitespace-nowrap">
            {tooltip.label}
          </div>
        </div>
      )}

      {/* POPOVER FOR COLLAPSED SUBMENUS */}
      {collapsed && activePopover && (
        <div
          ref={popoverRef}
          className="hidden lg:block fixed z-[60] transition-all duration-200"
          style={{ top: activePopover.top - 4, left: COLLAPSED_WIDTH + 8 }}
        >
          <div
            className="absolute w-2 h-2 rotate-45 bg-white dark:bg-slate-800 border-l border-b border-slate-200 dark:border-slate-700"
            style={{ top: 4 + (activePopover.height ?? 44) / 2 - 4, left: -4 }}
          />
          <div className="relative w-44 rounded-md bg-white dark:bg-slate-800 p-1.5 shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors duration-200">
            {(() => {
              const ParentIcon = navigation[activePopover.index]?.icon;
              return (
                <div className="flex items-center gap-2 px-2 py-1 mb-1 border-b border-slate-100 dark:border-slate-700 pb-1.5">
                  {ParentIcon && (
                    <div className="flex items-center justify-center w-5 h-5 rounded-md bg-orange-50 dark:bg-orange-950 text-orange-600 dark:text-orange-400 shrink-0">
                      <ParentIcon className="w-3 h-3" />
                    </div>
                  )}
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 truncate">
                    {navigation[activePopover.index]?.name}
                  </span>
                </div>
              );
            })()}

            <div className="space-y-0.5">
              {navigation[activePopover.index]?.subItems?.map((subItem) => {
                const isSubActive = location.pathname.startsWith(subItem.href);
                return (
                  <NavLink
                    key={subItem.name}
                    to={subItem.href}
                    onClick={() => setActivePopover(null)}
                    className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-xs transition-colors duration-200 ${
                      isSubActive
                        ? 'bg-orange-50 dark:bg-orange-950 text-orange-600 dark:text-orange-400 font-medium'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <subItem.icon className={`w-3.5 h-3.5 shrink-0 transition-colors duration-200 ${
                      isSubActive ? 'text-orange-500' : 'text-slate-400'
                    }`} />
                    <span className="truncate">{subItem.name}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}