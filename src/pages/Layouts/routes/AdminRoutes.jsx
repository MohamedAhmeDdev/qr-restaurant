import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';

import Layout from '../Layout';
import { ProtectedRoute } from '../../../utils/ProtectedRoute';
import AdminSidebar from '../sidebar/AdminSidebar';
import Restaurants from '../../restaurant/restaurant/Restaurants';
import CreateRestaurant from '../../restaurant/restaurant/CreateRestaurant';
import EditRestaurant from '../../restaurant/restaurant/EditRestaurant';

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
const SettingsPage = lazy(() => import('../../settings/Layout/SettingsPage'));

export const AdminRoutes = {
  path: '/',
  element: <ProtectedRoute allowedRoles={['restaurant_admin']} />,
  children: [
    { path: 'restaurant', element: <Restaurants /> },
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
        { path: 'categories', element: <Category /> },
        { path: 'category/create', element: <CreateCategory /> },
        { path: 'category/edit/:id', element: <EditCategory /> },
        { path: 'modifier-groups', element: <ModifierGroups /> },
        { path: 'modifier-groups/create', element: <CreateModifierGroup /> },
        { path: 'modifier-groups/edit/:id', element: <EditModifierGroup /> },
        { path: 'menu-items', element: <Menu /> },
        { path: 'menu-items-details/:id', element: <MenuItemsDetails /> },
        { path: 'menu-items/create', element: <CreateMenu /> },
        { path: 'menu-items/edit/:id', element: <EditMenu /> },
        { path: 'orders', element: <Orders /> },
        { path: 'orders-details/:orderId', element: <OrderDetails /> },
        { path: '/admin/settings', element: <SettingsPage /> },
      ],
    },
  ],
};