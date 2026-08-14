// src/pages/Layouts/routes/AdminRoutes.jsx
import React from 'react';
import { Route } from 'react-router-dom';

import Layout from '../Layout';
import AdminSidebar from '../sidebar/AdminSidebar';

import DashboardPage from '../../restaurant/DashboardPage';
import OrdersPage from '../../restaurant/OrdersPage';

export const AdminRoutes = () => {
  return (
    <Route element={<Layout SidebarComponent={AdminSidebar} />}>
      <Route path="/admin/dashboard" element={<DashboardPage />} />
      <Route path="/admin/orders" element={<OrdersPage />} />
    </Route>
  );
};