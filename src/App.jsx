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


// Import the route modules

function App() {
  return ( 
    <BrowserRouter>
      <Routes>
        
        {/* Root redirect */}
        <Route path="/" element={<MenuPage/>} />
        <Route path="/item/:itemId" element={<ItemDetailPage/>} />
        <Route path="/cart" element={<CartPage/>} />
        <Route path="/checkout" element={<CheckOutPage/>} />
        <Route path="/order-confirmation" element={<OrderConfirmationPage/>} />
        <Route path="/order-tracking/:orderId" element={<OrderTrackingPage/>} />

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