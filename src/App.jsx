// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import MenuPage from './pages/customer/MenuPage';
import ItemDetailPage from './pages/customer/ItemDetailPage';
import CartPage from './pages/customer/CartPage';
import OrderTrackingPage from './pages/customer/OrderTrackingPage';
import CheckOutPage from './pages/customer/CheckOutPage';
import { AdminRoutes } from './pages/Layouts/routes/AdminRoutes';
import { SuperAdminRoutes } from './pages/Layouts/routes/SuperAdminRoutes';
import OrderConfirmationPage from './pages/customer/OrderConfirmationPage';
import Login from './pages/authentication/Login';
import ForgotPassword from './pages/authentication/ForgotPassword';
import Register from './pages/authentication/Register';
import ResetPassword from './pages/authentication/ResetPassword';
import TwoFactorAuthentication from './pages/authentication/TwoFactorAuthentication';


// Import the route modules

function App() {
  return ( 
    <BrowserRouter>
      <Routes>
        
     {/* 1. PUBLIC CUSTOMER ROUTES */}
        <Route path="/" element={<MenuPage />} />
        <Route path="/item/:itemId" element={<ItemDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckOutPage />} />
        <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
        <Route path="/order-tracking/:orderId" element={<OrderTrackingPage />} />

        {/* 2. PUBLIC STAFF AUTH ROUTES */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/two-factor-authentication" element={<TwoFactorAuthentication />} />
        <Route path="/register" element={<Register />} />

        {/* 🌟 Inject the Modules */}
       {AdminRoutes()}
        {SuperAdminRoutes()}

        {/* 404 Fallback */}
        <Route path="*" element={<div className="flex items-center justify-center h-screen text-2xl">404 - Page Not Found</div>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;