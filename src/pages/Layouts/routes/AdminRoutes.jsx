import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';

import Layout from '../Layout';
import { ProtectedRoute } from '../../../utils/ProtectedRoute';
import AdminSidebar from '../sidebar/AdminSidebar';
import RestaurantList from '../../restaurant/restaurant/RestaurantList';
import CreateRestaurant from '../../restaurant/restaurant/CreateRestaurant';
import EditRestaurant from '../../restaurant/restaurant/EditRestaurant';
import CreateStaff from '../../restaurant/staff/CreateStaff';
import EditStaff from '../../restaurant/staff/EditStaff';
import TableList from '../../restaurant/table/TableList';
import CreateTable from '../../restaurant/table/CreateTable';
import EditTable from '../../restaurant/table/EditTable';




const DashboardPage = lazy(() => import('../../restaurant/DashboardPage'));
const Staff = lazy(() => import('../../restaurant/staff/Staff'));
const SettingsPage = lazy(() => import('../../settings/Layout/SettingsPage'));

export const AdminRoutes = {
  path: '/',
  element: <ProtectedRoute allowedRoles={['restaurant_admin']} />,
  children: [
    { path: 'restaurant', element: <RestaurantList /> },
    { path: 'restaurant/create', element: <CreateRestaurant /> },
    { path: 'restaurant/edit/:id', element: <EditRestaurant /> },
    {
      element: <Layout SidebarComponent={AdminSidebar} />,
      children: [
        { index: true, element: <Navigate to="dashboard" replace /> },

        { path: 'dashboard', element: <DashboardPage /> },
        { path: 'staff', element: <Staff /> },
        { path: 'staff/create', element: <CreateStaff /> },
        { path: 'staff/edit/:id', element: <EditStaff /> },
        { path: 'table', element: <TableList /> },
        { path: 'table/create', element: <CreateTable /> },
        { path: 'table/edit/:id', element: <EditTable /> },
        { path: 'settings', element: <SettingsPage /> },
      ],
    },
  ],
};