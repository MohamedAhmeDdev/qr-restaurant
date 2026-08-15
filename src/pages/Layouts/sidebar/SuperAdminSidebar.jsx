import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Building2,
  Users,
  Shield,
  Key,
  Settings,
  UtensilsCrossed,
  X,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  FileText,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

const navigation = [
  { name: 'Tenants', href: '/super-admin/tenants', icon: Building2 },
  { name: 'Admin Users', href: '/super-admin/admins', icon: Users },
  {
    name: 'Access Control',
    icon: Shield,
    subItems: [
      { name: 'Permissions', href: '/super-admin/permissions', icon: Key },
      { name: 'Roles', href: '/super-admin/roles', icon: FileText },
    ]
  },
  { name: 'Settings', href: '/super-admin/settings', icon: Settings },
];

const COLLAPSED_WIDTH = 72;

export default function SuperAdminSidebar({ mobileOpen, setMobileOpen, collapsed, setCollapsed }) {
  const location = useLocation();

  // Tracks active submenu for inline expand (desktop uncollapsed)
  const [openInlineSubmenu, setOpenInlineSubmenu] = useState(null);

  // Tracks active floating popover submenu { index, top }
  const [activePopover, setActivePopover] = useState(null);
  const popoverRef = useRef(null);

  // Tracks hover tooltip for collapsed items { label, top }
  const [tooltip, setTooltip] = useState(null);

  // Auto-expand inline submenu if current route matches sub-item
  useEffect(() => {
    navigation.forEach((item, index) => {
      if (item.subItems) {
        const isSubItemActive = item.subItems.some(sub => location.pathname.startsWith(sub.href));
        if (isSubItemActive) {
          setOpenInlineSubmenu(index);
        }
      }
    });
  }, [location.pathname]);

  // Close floating popover submenu on route change
  useEffect(() => {
    setActivePopover(null);
  }, [location.pathname]);

  // Handle outside clicks to close popovers
  useEffect(() => {
    function handleClickOutside(event) {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setActivePopover(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={` 
          fixed inset-y-0 left-0 z-50 flex flex-col 
          bg-white dark:bg-slate-900 
          text-slate-900 dark:text-white 
          border-r border-slate-200/80 dark:border-slate-800 
          transition-all duration-300 ease-in-out 
          w-64 ${mobileOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0 lg:static lg:z-auto 
          ${collapsed ? "lg:w-[72px]" : "lg:w-64"} 
        `}
      >
        {/* --- Header / Logo Area --- */}
        <div className={`flex items-center justify-between h-16 border-b border-slate-200/80 dark:border-slate-800 px-4 ${collapsed ? 'lg:justify-center lg:px-0' : ''}`}>
          <div className={`flex items-center gap-2.5 font-bold text-xl tracking-tight overflow-hidden whitespace-nowrap ${collapsed ? 'lg:hidden' : ''}`}>
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-orange-500/10 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <span className="bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              RestoPOS
            </span>
          </div>

          {/* Mobile Close Button */}
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden ml-auto text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Desktop Collapse Toggle Button */}
          <button
            onClick={() => {
              setCollapsed(!collapsed);
              setActivePopover(null);
              setTooltip(null);
            }}
            className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
            title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {collapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>
        </div>

        {/* --- Navigation Links --- */}
        <nav className={`flex-1 py-4 space-y-1.5 overflow-y-auto overflow-x-hidden scrollbar-none ${collapsed ? 'lg:px-2' : 'px-3'}`}>
          {navigation.map((item, index) => {
            const isActive = item.href ? location.pathname === item.href : false;
            const isSubItemActive = item.subItems?.some(sub => location.pathname.startsWith(sub.href));
            const isInlineOpen = openInlineSubmenu === index;
            const isPopoverOpen = activePopover?.index === index;

            // 1. RENDER PARENT WITH SUBITEMS
            if (item.subItems) {
              return (
                <div key={item.name} className="relative">
                  <button
                    onClick={(e) => toggleSubmenu(index, e)}
                    onMouseEnter={(e) => !isPopoverOpen && showTooltip(e, item.name)}
                    onMouseLeave={hideTooltip}
                    className={`
                      relative flex items-center w-full rounded-xl transition-all duration-200 group
                      ${collapsed ? 'lg:justify-center lg:h-11 lg:w-11 lg:mx-auto' : 'px-3 py-2.5'} 
                      ${isSubItemActive || isPopoverOpen
                        ? "bg-orange-500/10 text-orange-600 dark:text-orange-400 font-medium"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
                      } 
                    `}
                  >
                    {isSubItemActive && !collapsed && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-orange-500 rounded-r-full" />
                    )}

                    <div className="flex-shrink-0 flex items-center justify-center">
                      <item.icon className={`w-5 h-5 transition-colors ${isSubItemActive || isPopoverOpen ? 'text-orange-600 dark:text-orange-400' : 'text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'}`} />
                    </div>

                    <span className={`flex-1 text-left text-sm whitespace-nowrap transition-all duration-200 ${collapsed ? 'lg:hidden' : 'ml-3'}`}>
                      {item.name}
                    </span>

                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${collapsed ? 'hidden' : ''} ${isInlineOpen ? 'rotate-180' : ''} ${isSubItemActive ? 'text-orange-500' : 'text-slate-400'}`}
                    />
                  </button>

                  {/* Inline Accordion Submenu */}
                  {!collapsed && (
                    <div
                      className={`
                        overflow-hidden transition-all duration-300 ease-in-out
                        ${isInlineOpen ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0'}
                      `}
                    >
                      <div className="pl-4 space-y-1 border-l-2 border-slate-100 dark:border-slate-800 ml-5 my-1">
                        {item.subItems.map((subItem) => {
                          const isSubActive = location.pathname.startsWith(subItem.href);
                          return (
                            <NavLink
                              key={subItem.name}
                              to={subItem.href}
                              onClick={() => setMobileOpen(false)}
                              className={`
                                flex items-center px-3 py-2 rounded-lg text-sm transition-all duration-150 group relative
                                ${isSubActive
                                  ? "text-orange-600 dark:text-orange-400 font-medium bg-orange-50/50 dark:bg-orange-500/10"
                                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white"
                                }
                              `}
                            >
                              <subItem.icon className={`w-4 h-4 mr-2.5 ${isSubActive ? 'text-orange-500' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`} />
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

            // 2. RENDER STANDARD LINK
            return (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={() => setMobileOpen(false)}
                onMouseEnter={(e) => showTooltip(e, item.name)}
                onMouseLeave={hideTooltip}
                className={` 
                  relative flex items-center rounded-xl transition-all duration-200 group
                  ${collapsed ? 'lg:justify-center lg:h-11 lg:w-11 lg:mx-auto' : 'px-3 py-2.5'} 
                  ${isActive
                    ? "bg-orange-500/10 text-orange-600 dark:text-orange-400 font-medium"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
                  } 
                `}
              >
                {isActive && !collapsed && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-orange-500 rounded-r-full" />
                )}

                <div className="flex-shrink-0 flex items-center justify-center">
                  <item.icon className={`w-5 h-5 transition-colors ${isActive ? 'text-orange-600 dark:text-orange-400' : 'text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'}`} />
                </div>

                <span className={`text-sm whitespace-nowrap transition-all duration-200 ${collapsed ? 'lg:hidden' : 'ml-3'}`}>
                  {item.name}
                </span>
              </NavLink>
            );
          })}
        </nav>

        {/* --- Footer / Logout --- */}
        <div className={`p-3 border-t border-slate-200/80 dark:border-slate-800 ${collapsed ? 'lg:justify-center lg:p-2' : ''}`}>
          <button
            onMouseEnter={(e) => showTooltip(e, 'Sign Out')}
            onMouseLeave={hideTooltip}
            className={` 
              flex items-center rounded-xl w-full text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200 group relative
              ${collapsed ? 'lg:justify-center lg:h-10 lg:w-10' : 'gap-3 px-3 py-2.5'} 
            `}
          >
            <LogOut className="w-5 h-5 flex-shrink-0 text-slate-400 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors" />

            <span className={`whitespace-nowrap transition-all duration-200 ${collapsed ? 'lg:hidden' : ''}`}>
              Sign Out
            </span>
          </button>
        </div>
      </aside>

      {/* --- Floating Hover Tooltip (collapsed desktop only) --- */}
      {collapsed && tooltip && !activePopover && (
        <div
          className="hidden lg:flex fixed z-[60] items-center -translate-y-1/2 pointer-events-none animate-in fade-in slide-in-from-left-1 duration-150"
          style={{ top: tooltip.top, left: COLLAPSED_WIDTH + 8 }}
        >
          <div className="w-1.5 h-1.5 rotate-45 bg-slate-900 dark:bg-slate-100 -mr-0.5 shrink-0" />
          <div className="px-2 py-1 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-[11px] font-semibold rounded-md shadow-md whitespace-nowrap">
            {tooltip.label}
          </div>
        </div>
      )}

      {/* --- Compact Floating Submenu Popover (collapsed desktop only) --- */}
      {collapsed && activePopover && (
        <div
          ref={popoverRef}
          className="hidden lg:block fixed z-[60] animate-in fade-in zoom-in-95 slide-in-from-left-1 duration-150"
          style={{ top: activePopover.top - 4, left: COLLAPSED_WIDTH + 8 }}
        >
          {/* Pointer connector arrow */}
          <div
            className="absolute w-2 h-2 rotate-45 bg-white dark:bg-slate-800 border-l border-b border-slate-200/80 dark:border-slate-700/60"
            style={{ top: 4 + (activePopover.height ?? 44) / 2 - 4, left: -4 }}
          />

          <div className="relative w-44 rounded-xl bg-white dark:bg-slate-800 p-1.5 shadow-lg shadow-slate-900/10 dark:shadow-black/30 ring-1 ring-slate-900/5 dark:ring-white/10 border border-slate-200/80 dark:border-slate-700/60 overflow-hidden">
            {/* Header */}
            {(() => {
              const ParentIcon = navigation[activePopover.index]?.icon;
              return (
                <div className="flex items-center gap-2 px-2 py-1 mb-1 border-b border-slate-100 dark:border-slate-700/50 pb-1.5">
                  {ParentIcon && (
                    <div className="flex items-center justify-center w-5 h-5 rounded-md bg-orange-500/10 dark:bg-orange-500/15 text-orange-600 dark:text-orange-400 shrink-0">
                      <ParentIcon className="w-3 h-3" />
                    </div>
                  )}
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 truncate">
                    {navigation[activePopover.index]?.name}
                  </span>
                </div>
              );
            })()}

            {/* Submenu items list */}
            <div className="space-y-0.5">
              {navigation[activePopover.index]?.subItems.map((subItem) => {
                const isSubActive = location.pathname.startsWith(subItem.href);
                return (
                  <NavLink
                    key={subItem.name}
                    to={subItem.href}
                    onClick={() => setActivePopover(null)}
                    className={`
                      flex items-center gap-2 px-2 py-1.5 rounded-md text-xs transition-colors duration-150
                      ${isSubActive
                        ? "bg-orange-500/10 text-orange-600 dark:text-orange-400 font-medium"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white"
                      }
                    `}
                  >
                    <subItem.icon className={`w-3.5 h-3.5 shrink-0 ${isSubActive ? 'text-orange-500' : 'text-slate-400'}`} />
                    <span className="truncate">{subItem.name}</span>
                    {isSubActive && <ChevronRight className="w-3 h-3 ml-auto text-orange-500 shrink-0" />}
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