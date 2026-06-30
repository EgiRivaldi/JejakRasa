import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./context/AppContext";

// Shared Layouts
import CustomerLayout from "./layout/CustomerLayout";
import AdminLayout from "./layout/AdminLayout";

// Landing and Login
import Landing from "./pages/Landing";
import Login from "./pages/Login";

// Customer Pages
import CustomerHome from "./pages/customer/Home";
import CustomerCart from "./pages/customer/Cart";
import CustomerCheckout from "./pages/customer/Checkout";
import CustomerPayment from "./pages/customer/Payment";
import CustomerOrders from "./pages/customer/Orders";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminMenus from "./pages/admin/Menus";
import AdminCategories from "./pages/admin/Categories";
import AdminOrders from "./pages/admin/Orders";
import AdminReports from "./pages/admin/Reports";
import AdminSettings from "./pages/admin/Settings";
import AdminTables from "./pages/admin/Tables";

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Gateway routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />

          {/* Customer Application - Guarded inside CustomerLayout */}
          <Route path="/customer" element={<CustomerLayout />}>
            <Route index element={<Navigate to="home" replace />} />
            <Route path="home" element={<CustomerHome />} />
            <Route path="cart" element={<CustomerCart />} />
            <Route path="checkout" element={<CustomerCheckout />} />
            <Route path="payment" element={<CustomerPayment />} />
            <Route path="orders" element={<CustomerOrders />} />
          </Route>

          {/* Admin Dashboard - Guarded inside AdminLayout */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="menu" element={<AdminMenus />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="tables" element={<AdminTables />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* Catch all fallback redirects to landing gateway */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
