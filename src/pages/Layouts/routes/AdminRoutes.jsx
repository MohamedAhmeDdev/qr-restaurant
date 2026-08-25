import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';

import Layout from '../Layout';
import { ProtectedRoute } from '../../../utils/ProtectedRoute';
import AdminSidebar from '../sidebar/AdminSidebar';
import RestaurantList from '../../restaurant/restaurant/RestaurantList';
import CreateRestaurant from '../../restaurant/restaurant/CreateRestaurant';
import EditRestaurant from '../../restaurant/restaurant/EditRestaurant';


const DashboardPage = lazy(() => import('../../restaurant/DashboardPage'));
const OrdersPage = lazy(() => import('../../restaurant/OrdersPage'));
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
        { path: 'orders', element: <OrdersPage /> },
        { path: 'settings', element: <SettingsPage /> },
      ],
    },
  ],
};