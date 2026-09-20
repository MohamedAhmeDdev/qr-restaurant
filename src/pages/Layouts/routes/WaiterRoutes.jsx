import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';

import Layout from '../Layout';
import { ProtectedRoute } from '../../../utils/ProtectedRoute';
import WaiterSidebar from '../sidebar/WaitersSidebar';


// Lazy load all other components
const TableList = lazy(() => import('../../restaurant/table/TableList'));
const Category = lazy(() => import('../../restaurant/category/Category'));
const ModifierGroups = lazy(() => import('../../restaurant/modifiers/ModifierGroups'));
const Menu = lazy(() => import('../../restaurant/menu/Menu'));
const MenuItemsDetails = lazy(() => import('../../restaurant/menu/MenuItemsDetails'));
const Orders = lazy(() => import('../../restaurant/orders/Orders'));
const OrderDetails = lazy(() => import('../../restaurant/orders/OrderDetails'));
const SettingsPage = lazy(() => import('../../settings/Layout/SettingsPage'));

export const WaiterRoutes = {
  path: '/waiter',
  element: <ProtectedRoute allowedRoles={['waiter']} />,
  children: [
    {
      element: <Layout SidebarComponent={WaiterSidebar} />,
      children: [
        { index: true, element: <Navigate to="orders" replace /> },
        { path: 'orders', element: <Orders /> },
        { path: 'table', element: <TableList /> },
        { path: 'categories', element: <Category /> },
        { path: 'modifier-groups', element: <ModifierGroups /> },
        { path: 'menu-items', element: <Menu /> },
        { path: 'menu-items-details/:id', element: <MenuItemsDetails /> },
        { path: 'orders-details/:id', element: <OrderDetails /> },
        { path: 'settings', element: <SettingsPage /> },
      ],
    },
  ],
};