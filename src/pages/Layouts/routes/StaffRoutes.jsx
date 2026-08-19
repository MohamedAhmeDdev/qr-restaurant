import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';

import Layout from '../Layout';
import { ProtectedRoute } from '../../../utils/ProtectedRoute';
import StaffSidebar from '../sidebar/StaffSidebar';

const OrdersPage = lazy(() => import('../../restaurant/OrdersPage'));
const SettingsPage = lazy(() => import('../../settings/Layout/SettingsPage'));

export const StaffRoutes = {
  path: '/',
  element: <ProtectedRoute allowedRoles={['staff']} />,
  children: [
    {
      path: 'r/:restaurantSlug/staff',
      element: <Layout SidebarComponent={StaffSidebar} />,
      children: [
        { index: true, element: <Navigate to="orders" replace /> },
        { path: 'orders', element: <OrdersPage /> },
        { path: 'settings', element: <SettingsPage /> },
      ],
    },
  ],
};