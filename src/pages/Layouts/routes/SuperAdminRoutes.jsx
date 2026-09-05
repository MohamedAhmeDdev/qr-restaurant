import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';

import Layout from '../Layout';
import SuperAdminSidebar from '../sidebar/SuperAdminSidebar';
import { ProtectedRoute } from '../../../utils/ProtectedRoute';


const Organizations = lazy(() => import('../../superAdmin/Organizations/Organizations'));
const RestaurantList = lazy(() => import('../../superAdmin/Organizations/RestaurantList'));
const Invitations = lazy(() => import('../../superAdmin/Invitations'));
const RolesPage = lazy(() => import('../../superAdmin/roles/Roles'));
const CreateRole = lazy(() => import('../../superAdmin/roles/CreateRole'));
const EditRole = lazy(() => import('../../superAdmin/roles/EditRole'));
const PermissionsPage = lazy(() => import('../../superAdmin/permission/Permissions'));
const CreatePermission = lazy(() => import('../../superAdmin/permission/CreatePermission'));
const EditPermission = lazy(() => import('../../superAdmin/permission/EditPermission'));
const AssignPermissions = lazy(() => import('../../superAdmin/roles/AssignPermissions'));
const SuperAdminSettings = lazy(() => import('../../settings/settings/SuperAdminSettings'));

export const SuperAdminRoutes = {
  path: '/',
  element: <ProtectedRoute allowedRoles={['super_admin']} />,
  children: [
    {
      element: <Layout SidebarComponent={SuperAdminSidebar} />,
      children: [
        { index: true, element: <Navigate to="organizations" replace /> },
        { path: 'organizations', element: <Organizations /> },
        { path: 'restaurants/:id', element: <RestaurantList /> },
        { path: 'invitations', element: <Invitations /> },
        { path: 'roles', element: <RolesPage /> },
        { path: 'roles/create', element: <CreateRole /> },
        { path: 'roles/edit/:id', element: <EditRole /> },
        { path: 'permissions', element: <PermissionsPage /> },
        { path: 'permissions/create', element: <CreatePermission /> },
        { path: 'permissions/edit/:id', element: <EditPermission /> },
        { path: 'roles/:roleId/permissions', element: <AssignPermissions /> },
        { path: '/settings', element: <SuperAdminSettings /> },
      ],
    },
  ],
};