import React, { useState, useEffect } from 'react'; 
import { NavLink, useLocation } from 'react-router-dom'; 
import { 
  LayoutDashboard, Building2, Users, Shield, Key, Settings, 
  UtensilsCrossed, ShoppingCart, QrCode, BarChart3, X, ChefHat, 
  LogOut, PanelLeftClose, PanelLeftOpen, FileText, ChevronDown 
} from 'lucide-react';

const navigation = [ 
  { name: 'Dashboard', href: '/super-admin/dashboard', icon: LayoutDashboard }, 
  { name: 'Tenants', href: '/super-admin/tenants', icon: Building2 }, 
  { name: 'Restaurants', href: '/super-admin/restaurants', icon: UtensilsCrossed }, 
  { name: 'Admin Users', href: '/super-admin/admins', icon: Users }, 
  { 
    name: 'Access Control', 
    icon: Shield,
    // No href here because it's a parent container
    subItems: [
      { name: 'Roles', href: '/super-admin/roles', icon: FileText },
      { name: 'Permissions', href: '/super-admin/permissions', icon: Key },
      { name: 'Assign Access', href: '/super-admin/assign-permissions', icon: Shield },
    ]
  },
  { name: 'Settings', href: '/super-admin/settings', icon: Settings }, 
];

export default function SuperAdminSidebar({ mobileOpen, setMobileOpen, collapsed, setCollapsed }) { 
  const location = useLocation(); 
  
  // State to track which submenu is open (by index or name)
  const [openSubmenu, setOpenSubmenu] = useState(null);

  // Auto-expand submenu if the current route matches a sub-item
  useEffect(() => {
    navigation.forEach((item, index) => {
      if (item.subItems) {
        const isSubItemActive = item.subItems.some(sub => location.pathname.startsWith(sub.href));
        if (isSubItemActive) {
          setOpenSubmenu(index);
        }
      }
    });
  }, [location.pathname]);

  const toggleSubmenu = (index) => {
    setOpenSubmenu(openSubmenu === index ? null : index);
  };

  return ( 
    <> 
      {mobileOpen && ( 
        <div  
          className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm lg:hidden transition-opacity duration-300"  
          onClick={() => setMobileOpen(false)} 
        /> 
      )} 
 
      <aside  
        className={` 
          fixed inset-y-0 left-0 z-50 flex flex-col 
          bg-white dark:bg-slate-900 
          text-gray-900 dark:text-white 
          border-r border-gray-200/80 dark:border-slate-700/50 
          transition-[width,transform,background-color,border-color] duration-300 ease-in-out 
          w-64 ${mobileOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0 lg:static lg:z-auto 
          ${collapsed ? "lg:w-[72px]" : "lg:w-64"} 
        `} 
      > 
        {/* --- Header / Logo Area --- */} 
        <div className={`flex items-center h-16 border-b border-gray-200/80 dark:border-slate-700/50 px-4 transition-colors duration-300 ${collapsed ? 'lg:justify-center lg:px-0' : 'lg:justify-between'}`}> 
          <div className={`flex items-center gap-2 font-bold text-xl tracking-tight overflow-hidden whitespace-nowrap ${collapsed ? 'lg:hidden' : ''}`}> 
            <UtensilsCrossed className="w-7 h-7 text-orange-500 flex-shrink-0" /> 
            <span>RestoPOS</span> 
          </div> 
 
          <button  
            onClick={() => setMobileOpen(false)} 
            className="lg:hidden text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white flex-shrink-0 transition-colors duration-200" 
          > 
            <X className="w-6 h-6" /> 
          </button> 
 
          <button  
            onClick={() => setCollapsed(!collapsed)} 
            className="hidden lg:flex items-center justify-center w-9 h-9 rounded-lg text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white transition-colors duration-200" 
          > 
            {collapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />} 
          </button> 
        </div> 

        {/* --- Navigation Links --- */} 
        <nav className={`flex-1 py-4 space-y-1 overflow-y-auto overflow-x-hidden scrollbar-hide ${collapsed ? 'lg:px-2' : 'px-3'}`}> 
          {navigation.map((item, index) => { 
            // Check if this specific item is active (for non-subitems)
            const isActive = item.href ? location.pathname === item.href : false;
            
            // Check if any subitem is active (for parent highlighting)
            const isSubItemActive = item.subItems?.some(sub => location.pathname.startsWith(sub.href));
            const isParentActive = isSubItemActive;
            
            // Determine if submenu should be open
            const isSubmenuOpen = openSubmenu === index;

            // 1. RENDER PARENT WITH SUBITEMS
            if (item.subItems) {
              return (
                <div key={item.name} className="space-y-1">
                  {/* Parent Button */}
                  <button
                    onClick={() => !collapsed && toggleSubmenu(index)}
                    className={`
                      relative flex items-center w-full rounded-lg transition-all duration-200 group
                      ${collapsed ? 'lg:justify-center lg:h-11 lg:w-11 lg:mx-auto lg:px-0' : 'px-3 py-2.5'} 
                      ${isParentActive  
                        ? "bg-orange-500/10 text-orange-600 dark:text-orange-400"  
                        : "text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800/80 hover:text-gray-900 dark:hover:text-white" 
                      } 
                    `}
                  >
                    {isParentActive && !collapsed && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-orange-500 rounded-r-md"></div>
                    )}

                    <div className="relative flex-shrink-0 flex items-center justify-center">
                      <item.icon className={`w-5 h-5 transition-colors duration-200 ${isParentActive ? 'text-orange-600 dark:text-orange-400' : 'text-gray-500 dark:text-slate-400 group-hover:text-gray-900 dark:group-hover:text-white'}`} />
                    </div>

                    <span className={`flex-1 text-left text-sm font-medium whitespace-nowrap transition-all duration-200 ${collapsed ? 'lg:opacity-0 lg:w-0 lg:overflow-hidden lg:ml-0' : 'ml-3'}`}>
                      {item.name}
                    </span>

                    {/* Chevron Icon (Hidden when collapsed) */}
                    {!collapsed && (
                      <ChevronDown 
                        className={`w-4 h-4 transition-transform duration-200 ${isSubmenuOpen ? 'rotate-180' : ''} ${isParentActive ? 'text-orange-500' : 'text-gray-400'}`} 
                      />
                    )}

                    {/* Tooltip for collapsed mode */}
                    {collapsed && (
                      <div className="hidden lg:block absolute left-full ml-4 px-2.5 py-1.5 bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-xl border border-gray-200 dark:border-slate-700">
                        {item.name}
                      </div>
                    )}
                  </button>

                  {/* Submenu Items (Accordion) */}
                  <div 
                    className={`
                      overflow-hidden transition-all duration-300 ease-in-out
                      ${isSubmenuOpen && !collapsed ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0'}
                      ${collapsed ? 'lg:hidden' : ''}
                    `}
                  >
                    <div className="pl-4 space-y-1 border-l border-gray-200 dark:border-slate-700 ml-5">
                      {item.subItems.map((subItem) => {
                        const isSubActive = location.pathname.startsWith(subItem.href);
                        return (
                          <NavLink
                            key={subItem.name}
                            to={subItem.href}
                            onClick={() => setMobileOpen(false)}
                            className={`
                              flex items-center px-3 py-2 rounded-lg text-sm transition-all duration-200 group relative
                              ${isSubActive
                                ? "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400 font-medium"
                                : "text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white"
                              }
                            `}
                          >
                            {/* Active Dot Indicator */}
                            {isSubActive && (
                              <div className="absolute -left-[21px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-orange-500 border-2 border-white dark:border-slate-900"></div>
                            )}
                            
                            <subItem.icon className={`w-4 h-4 mr-2 ${isSubActive ? 'text-orange-500' : 'text-gray-400 group-hover:text-gray-600'}`} />
                            {subItem.name}
                          </NavLink>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            }

            // 2. RENDER STANDARD LINK (No Subitems)
            return ( 
              <NavLink 
                key={item.name} 
                to={item.href} 
                onClick={() => setMobileOpen(false)} 
                className={` 
                  relative flex items-center rounded-lg transition-all duration-200 group
                  ${collapsed ? 'lg:justify-center lg:h-11 lg:w-11 lg:mx-auto lg:px-0' : 'px-3 py-2.5'} 
                  ${isActive  
                    ? "bg-orange-500/10 text-orange-600 dark:text-orange-400"  
                    : "text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800/80 hover:text-gray-900 dark:hover:text-white" 
                  } 
                `} 
              > 
                {isActive && ( 
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-orange-500 rounded-r-md"></div> 
                )} 
 
                <div className="relative flex-shrink-0 flex items-center justify-center"> 
                  <item.icon className={`w-5 h-5 transition-colors duration-200 ${isActive ? 'text-orange-600 dark:text-orange-400' : 'text-gray-500 dark:text-slate-400 group-hover:text-gray-900 dark:group-hover:text-white'}`} /> 
                   
                  {item.badge && ( 
                    <span className={`absolute -top-1.5 -right-1.5 bg-red-500 text-white font-bold rounded-full leading-none border-2 border-white dark:border-slate-900 flex items-center justify-center transition-colors duration-300 ${ 
                      collapsed ? 'lg:w-2.5 lg:h-2.5 lg:p-0' : 'text-[10px] px-1.5 py-0.5' 
                    }`}> 
                      <span className={collapsed ? 'lg:hidden' : ''}>{item.badge}</span> 
                    </span> 
                  )} 
                </div> 
 
                <span className={`text-sm font-medium whitespace-nowrap transition-all duration-200 ${collapsed ? 'lg:opacity-0 lg:w-0 lg:overflow-hidden lg:ml-0' : 'ml-3'}`}> 
                  {item.name} 
                </span> 
 
                {collapsed && ( 
                  <div className="hidden lg:block absolute left-full ml-4 px-2.5 py-1.5 bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-xl border border-gray-200 dark:border-slate-700 flex items-center gap-2"> 
                    {item.name} 
                    {item.badge && <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 rounded-full flex items-center justify-center h-4">{item.badge}</span>} 
                  </div> 
                )} 
              </NavLink> 
            ); 
          })} 
        </nav> 
 
        {/* --- Footer / Logout --- */} 
        <div className={`p-3 border-t border-gray-200/80 dark:border-slate-700/50 flex transition-colors duration-300 ${collapsed ? 'lg:justify-center lg:p-2' : ''}`}> 
          <button  
            className={` 
              flex items-center rounded-lg w-full text-sm font-medium text-gray-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200 group relative
              ${collapsed ? 'lg:justify-center lg:h-10 lg:w-10 lg:p-0' : 'gap-3 px-3 py-2'} 
            `} 
          > 
            <LogOut className="w-5 h-5 flex-shrink-0" /> 
             
            <span className={`whitespace-nowrap transition-all duration-200 ${collapsed ? 'lg:opacity-0 lg:w-0 lg:overflow-hidden lg:ml-0' : 'ml-3'}`}> 
              Sign Out 
            </span> 
 
            {collapsed && ( 
              <div className="hidden lg:block absolute left-full ml-4 px-2.5 py-1.5 bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-xl border border-gray-200 dark:border-slate-700"> 
                Sign Out 
              </div> 
            )} 
          </button> 
        </div> 
      </aside> 
    </> 
  ); 
}