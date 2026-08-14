// src/pages/Layouts/Layout.jsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';


export default function Layout({ SidebarComponent }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-slate-950 overflow-hidden transition-colors duration-200">
      
      {/* 🌟 Dynamically render the passed Sidebar prop */}
      <SidebarComponent 
        mobileOpen={mobileOpen} 
        setMobileOpen={setMobileOpen} 
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        <Header setMobileOpen={setMobileOpen} />

        <main className={`flex-1 overflow-y-auto transition-all duration-300 ${collapsed ? 'lg:p-6' : 'lg:p-8'} p-4 sm:p-6`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}