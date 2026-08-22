import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet, Navigate } from 'react-router-dom';

// Auth State Provider
import { AuthProvider } from './contexts/AuthContext';

// Route Modules
import { AdminRoutes } from './pages/Layouts/routes/AdminRoutes';
import { SuperAdminRoutes } from './pages/Layouts/routes/SuperAdminRoutes';
import { CashierRoutes } from './pages/Layouts/routes/CashierRoutes';
import { StaffRoutes } from './pages/Layouts/routes/StaffRoutes';

// Public Customer Pages
import MenuPage from './pages/customer/MenuPage';
import ItemDetailPage from './pages/customer/ItemDetailPage';
import CartPage from './pages/customer/CartPage';
import CheckOutPage from './pages/customer/CheckOutPage';
import OrderConfirmationPage from './pages/customer/OrderConfirmationPage';
import OrderTrackingPage from './pages/customer/OrderTrackingPage';

// Public Auth Pages
import Login from './pages/authentication/Login';
import ForgotPassword from './pages/authentication/ForgotPassword';
import ResetPassword from './pages/authentication/ResetPassword';
import Register from './pages/authentication/Register';

const router = createBrowserRouter([
  // 1. PUBLIC STAFF AUTHENTICATION ROUTES (No login required)
  { path: '/login', element: <Login /> },
  { path: '/forgot-password', element: <ForgotPassword /> },
  { path: '/reset-password/token', element: <ResetPassword /> },
  { path: '/register', element: <Register /> },

  // 2. PROTECTED ADMIN & STAFF MODULES (Auth Guards handle these internally)
  SuperAdminRoutes,
  AdminRoutes,
  CashierRoutes,
  StaffRoutes,

  // 3. 100% PUBLIC TENANT CUSTOMER ROUTES (No login check)
  {
    path: '/r/:restaurantSlug',
    element: <Outlet />, // Public Customer Outlet
    children: [
      { index: true, element: <MenuPage /> },
      { path: 'menu', element: <MenuPage /> },
      { path: 'table/:tableId', element: <MenuPage /> },
      { path: 'item/:itemId', element: <ItemDetailPage /> },
      { path: 'cart', element: <CartPage /> },
      { path: 'checkout', element: <CheckOutPage /> },
      { path: 'confirmation', element: <OrderConfirmationPage /> },
      { path: 'track/:orderId', element: <OrderTrackingPage /> },
    ],
  },



  // 5. FALLBACK PAGES
  {
    path: '/',
    element: (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <h1 className="text-4xl font-bold text-red-600">403 - Access Denied</h1>
        <p className="text-gray-500 mt-2">You do not have permission to view this section.</p>
      </div>
    ),
  },
  {
    path: '*',
    element: (
      <div className="flex items-center justify-center h-screen text-2xl font-semibold">
        404 - Page Not Found
      </div>
    ),
  },
]);

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}