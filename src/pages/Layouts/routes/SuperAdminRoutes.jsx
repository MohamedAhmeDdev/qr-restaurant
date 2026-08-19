import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';

import Layout from '../Layout';
import SuperAdminSidebar from '../sidebar/SuperAdminSidebar';
import { ProtectedRoute } from '../../../utils/ProtectedRoute';

const Tenants = lazy(() => import('../../superAdmin/Restaurants/Tenants'));
const RestaurantList = lazy(() => import('../../superAdmin/Restaurants/RestaurantList'));
const AdminList = lazy(() => import('../../superAdmin/AdminList'));
const RolesPage = lazy(() => import('../../superAdmin/roles/Roles'));
const CreateRole = lazy(() => import('../../superAdmin/roles/CreateRole'));
const EditRole = lazy(() => import('../../superAdmin/roles/EditRole'));
const PermissionsPage = lazy(() => import('../../superAdmin/permission/Permissions'));
const CreatePermission = lazy(() => import('../../superAdmin/permission/CreatePermission'));
const EditPermission = lazy(() => import('../../superAdmin/permission/EditPermission'));
const AssignPermissions = lazy(() => import('../../superAdmin/AssignPermissions'));
const SettingsPage = lazy(() => import('../../settings/Layout/SettingsPage'));

export const SuperAdminRoutes = {
  path: '/',
  element: <ProtectedRoute allowedRoles={['super_admin']} />,
  children: [
    {
      element: <Layout SidebarComponent={SuperAdminSidebar} />,
      children: [
        { index: true, element: <Navigate to="tenants" replace /> },
        { path: 'tenants', element: <Tenants /> },
        { path: 'restaurants/:id', element: <RestaurantList /> },
        { path: 'admins', element: <AdminList /> },
        { path: 'roles', element: <RolesPage /> },
        { path: 'roles/create', element: <CreateRole /> },
        { path: 'roles/edit/:id', element: <EditRole /> },
        { path: 'permissions', element: <PermissionsPage /> },
        { path: 'permissions/create', element: <CreatePermission /> },
        { path: 'permissions/edit/:id', element: <EditPermission /> },
        { path: 'assign-permissions/:id', element: <AssignPermissions /> },
        { path: 'settings', element: <SettingsPage /> },
      ],
    },
  ],
};