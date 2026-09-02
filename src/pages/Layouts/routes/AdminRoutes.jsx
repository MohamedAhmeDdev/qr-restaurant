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
import Category from '../../restaurant/category/Category';
import CreateCategory from '../../restaurant/category/CreateCategory';
import EditCategory from '../../restaurant/category/EditCategory';
import ModifierGroups from '../../restaurant/modifiers/ModifierGroups';
import CreateModifierGroup from '../../restaurant/modifiers/CreateModifierGroup';
import EditModifierGroup from '../../restaurant/modifiers/EditModifierGroup';
import Menu from '../../restaurant/menu/Menu';
import CreateMenu from '../../restaurant/menu/CreateMenu';
import EditMenu from '../../restaurant/menu/EditMenu';




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

        { path: 'categories', element: <Category /> },
        { path: 'category/create', element: <CreateCategory /> },
        { path: 'category/edit/:id', element: <EditCategory /> },
        
 { path: 'modifier-groups', element: <ModifierGroups /> },
  { path: 'modifier-groups/create', element: <CreateModifierGroup /> },
        { path: 'modifier-groups/edit/:id', element: <EditModifierGroup /> },

         { path: 'menu-items', element: <Menu /> },
  { path: 'menu-items/create', element: <CreateMenu /> },
        { path: 'menu-items/edit/:id', element: <EditMenu /> },
        { path: 'settings', element: <SettingsPage /> },
      ],
    },
  ],
};