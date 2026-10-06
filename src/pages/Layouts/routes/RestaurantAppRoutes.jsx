// routes/RestaurantAppRoutes.jsx
import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import Layout from '../Layout';
import { ProtectedRoute } from '../../../utils/ProtectedRoute';
import AppSidebar from '../sidebar/AppSidebar';
import RequirePermission from '../../../utils/RequirePermission';



// Lazy loads
const Dashboard = lazy(() => import('../../restaurant/Dashboard'));
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
const CreateModifier = lazy(() => import('../../restaurant/modifiers/CreateModifierGroup'));
const EditModifier = lazy(() => import('../../restaurant/modifiers/EditModifierGroup'));
const Menu = lazy(() => import('../../restaurant/menu/Menu'));
const MenuItemsDetails = lazy(() => import('../../restaurant/menu/MenuItemsDetails'));
const CreateMenu = lazy(() => import('../../restaurant/menu/CreateMenu'));
const EditMenu = lazy(() => import('../../restaurant/menu/EditMenu'));
const Orders = lazy(() => import('../../restaurant/orders/Orders'));
const OrderDetails = lazy(() => import('../../restaurant/orders/OrderDetails'));
const Report = lazy(() => import('../../restaurant/Report'));
const Sales = lazy(() => import('../../restaurant/sales/Sales'));
const SettingsPage = lazy(() => import('../../settings/Layout/SettingsPage'));

// All restaurant-app roles can access this route tree
const APP_ROLES = ['restaurant_admin', 'manager', 'cashier', 'waiter'];

export const RestaurantAppRoutes = {
    // NOTE: mounted at "/app" — see routing setup below
    path: '/app',
    element: <ProtectedRoute allowedRoles={APP_ROLES} />,
    children: [
        {
            element: <Layout SidebarComponent={AppSidebar} />,
            children: [
                { index: true, element: <Navigate to="dashboard" replace /> },
                { path: 'dashboard', element: <Dashboard /> },

                // Staff
                {
                    path: 'staff',
                    element: <RequirePermission permission="staff.view"><Staff /></RequirePermission>,
                },
                {
                    path: 'staff/create',
                    element: <RequirePermission permission="staff.create"><CreateStaff /></RequirePermission>,
                },
                {
                    path: 'staff/edit/:id',
                    element: <RequirePermission permission="staff.update"><EditStaff /></RequirePermission>,
                },

                // Tables
                {
                    path: 'table',
                    element: <RequirePermission permission="table.view"><TableList /></RequirePermission>,
                },
                {
                    path: 'table/create',
                    element: <RequirePermission permission="table.create"><CreateTable /></RequirePermission>,
                },
                {
                    path: 'table/edit/:id',
                    element: <RequirePermission permission="table.update"><EditTable /></RequirePermission>,
                },

                // Categories
                {
                    path: 'categories',
                    element: <RequirePermission permission="category.view"><Category /></RequirePermission>,
                },
                {
                    path: 'category/create',
                    element: <RequirePermission permission="category.create"><CreateCategory /></RequirePermission>,
                },
                {
                    path: 'category/edit/:id',
                    element: <RequirePermission permission="category.update"><EditCategory /></RequirePermission>,
                },

                // Modifiers
                {
                    path: 'modifier-groups',
                    element: <RequirePermission permission="modifier.view"><ModifierGroups /></RequirePermission>,
                },
                {
                    path: 'modifier-groups/create',
                    element: <RequirePermission permission="modifier.create"><CreateModifier /></RequirePermission>,
                },
                {
                    path: 'modifier-groups/edit/:id',
                    element: <RequirePermission permission="modifier.update"><EditModifier /></RequirePermission>,
                },

                // Menu
                {
                    path: 'menu-items',
                    element: <RequirePermission permission="menu.view"><Menu /></RequirePermission>,
                },
                {
                    path: 'menu-items-details/:id',
                    element: <RequirePermission permission="menu.view"><MenuItemsDetails /></RequirePermission>,
                },
                {
                    path: 'menu-items/create',
                    element: <RequirePermission permission="menu.create"><CreateMenu /></RequirePermission>,
                },
                {
                    path: 'menu-items/edit/:id',
                    element: <RequirePermission permission="menu.update"><EditMenu /></RequirePermission>,
                },

                // Orders
                {
                    path: 'orders',
                    element: <RequirePermission permission="order.view"><Orders /></RequirePermission>,
                },
                {
                    path: 'orders-details/:id',
                    element: <RequirePermission permission="order.view"><OrderDetails /></RequirePermission>,
                },


                {
                    path: 'report',
                    element: <RequirePermission permission="report.view"><Report /></RequirePermission>,
                },
                {
                    path: 'sales',
                    element: <RequirePermission permission="sales.view"><Sales /></RequirePermission>,
                },

                { path: 'settings', element: <SettingsPage /> },
            ],
        },
    ],
};