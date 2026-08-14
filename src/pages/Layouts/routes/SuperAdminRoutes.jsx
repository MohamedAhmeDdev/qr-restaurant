// src/pages/Layouts/routes/SuperAdminRoutes.jsx
import React from 'react';
import { Route } from 'react-router-dom';

import Layout from '../Layout';
import SuperAdminSidebar from '../sidebar/SuperAdminSidebar';

// Import Pages
import DashboardPage from '../../superAdmin/DashboardPage';
import TenantsPage from '../../superAdmin/Restaurants/Tenants';
import RestaurantList from '../../superAdmin/Restaurants/RestaurantList';
import RolesPage from '../../superAdmin/roles/Roles';
import CreateRole from '../../superAdmin/roles/CreateRole';
import EditRole from '../../superAdmin/roles/EditRole';
import PermissionsPage from '../../superAdmin/permission/Permissions';
import CreatePermission from '../../superAdmin/permission/CreatePermission';
import EditPermission from '../../superAdmin/permission/EditPermission';
import AdminList from '../../superAdmin/AdminList';
import AssignPermissions from '../../superAdmin/AssignPermissions';
import SettingsPage from '../../superAdmin/Settings';

export const SuperAdminRoutes = () => {
  return (
    <Route element={<Layout SidebarComponent={SuperAdminSidebar} />}>
      <Route path="/super-admin/dashboard" element={<DashboardPage />} />
      
      {/* Tenant Management */}
      <Route path="/super-admin/tenants" element={<TenantsPage />} />
      
      {/* Restaurant Management */}
      <Route path="/super-admin/restaurants" element={<RestaurantList />} />
      
      {/* User Management */}
      <Route path="/super-admin/admins" element={<AdminList />} />
      
      {/* RBAC - Roles */}
      <Route path="/super-admin/roles" element={<RolesPage />} />
      <Route path="/super-admin/roles/create" element={<CreateRole />} />
      <Route path="/super-admin/roles/edit/:id" element={<EditRole />} />
      
      {/* RBAC - Permissions */}
      <Route path="/super-admin/permissions" element={<PermissionsPage />} />
      <Route path="/super-admin/permissions/create" element={<CreatePermission />} />
      <Route path="/super-admin/permissions/edit/:id" element={<EditPermission />} />
      <Route path="/super-admin/assign-permissions" element={<AssignPermissions />} />
      
      {/* Settings */}
      <Route path="/super-admin/settings" element={<SettingsPage />} />
    </Route>
  );
};