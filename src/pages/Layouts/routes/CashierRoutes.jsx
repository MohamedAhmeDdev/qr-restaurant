import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';

import Layout from '../Layout';
import { ProtectedRoute } from '../../../utils/ProtectedRoute';
import CashierSidebar from '../sidebar/CashierSidebar';


// Lazy load all other components
const DashboardPage = lazy(() => import('../../restaurant/DashboardPage'));
const Staff = lazy(() => import('../../restaurant/staff/Staff'));
const CreateStaff = lazy(() => import('../../restaurant/staff/CreateStaff'));
const EditStaff = lazy(() => import('../../restaurant/staff/EditStaff'));
const TableList = lazy(() => import('../../restaurant/table/TableList'));
const CreateTable = lazy(() => import('../../restaurant/table/CreateTable'));
const EditTable = lazy(() => import('../../restaurant/table/EditTable'));
const Category = lazy(() => import('../../restaurant/category/Category'));
const CreateCategory = lazy(() => import('../../restaurant/category/CreateCategory'));
const EditCategory = lazy(() => import('../../restaurant/category/EditCategory'));
const ModifierGroups = lazy(() => import('../../restaurant/modifiers/ModifierGroups'));
const CreateModifierGroup = lazy(() => import('../../restaurant/modifiers/CreateModifierGroup'));
const EditModifierGroup = lazy(() => import('../../restaurant/modifiers/EditModifierGroup'));
const Menu = lazy(() => import('../../restaurant/menu/Menu'));
const MenuItemsDetails = lazy(() => import('../../restaurant/menu/MenuItemsDetails'));
const CreateMenu = lazy(() => import('../../restaurant/menu/CreateMenu'));
const EditMenu = lazy(() => import('../../restaurant/menu/EditMenu'));
const Orders = lazy(() => import('../../restaurant/orders/Orders'));
const OrderDetails = lazy(() => import('../../restaurant/orders/OrderDetails'));
const Sales = lazy(() => import('../../restaurant/sales/Sales'));
const SettingsPage = lazy(() => import('../../settings/Layout/SettingsPage'));

export const CashierRoutes = {
  path: '/cashier',
  element: <ProtectedRoute allowedRoles={['cashier']} />,
  children: [
    {
      element: <Layout SidebarComponent={CashierSidebar} />,
      children: [
        { index: true, element: <Navigate to="dashboard" replace /> },
        { path: 'dashboard', element: <DashboardPage /> },
        { path: 'table', element: <TableList /> },
        { path: 'categories', element: <Category /> },
        { path: 'modifier-groups', element: <ModifierGroups /> },
        { path: 'menu-items', element: <Menu /> },
        { path: 'menu-items-details/:id', element: <MenuItemsDetails /> },
        { path: 'orders', element: <Orders /> },
        { path: 'orders-details/:id', element: <OrderDetails /> },
        { path: 'sales', element: <Sales /> },
        { path: 'settings', element: <SettingsPage /> },
      ],
    },
  ],
};