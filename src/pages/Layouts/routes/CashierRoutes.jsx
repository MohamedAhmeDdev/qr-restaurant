import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';

import Layout from '../Layout';
import { ProtectedRoute } from '../../../utils/ProtectedRoute';
import CashierSidebar from '../sidebar/CashierSidebar';

const OrdersPage = lazy(() => import('../../restaurant/OrdersPage'));
const SettingsPage = lazy(() => import('../../settings/Layout/SettingsPage'));

export const CashierRoutes = {
  path: '/',
  element: <ProtectedRoute allowedRoles={['cashier']} />,
  children: [
    {
      path: 'r/:restaurantSlug/cashier',
      element: <Layout SidebarComponent={CashierSidebar} />,
      children: [
        { index: true, element: <Navigate to="orders" replace /> },
        { path: 'orders', element: <OrdersPage /> },
        { path: 'settings', element: <SettingsPage /> },
      ],
    },
  ],
};