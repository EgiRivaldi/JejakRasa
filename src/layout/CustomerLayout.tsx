import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { useApp } from "../context/AppContext";

export const CustomerLayout: React.FC = () => {
  const { customerName, tableNumber } = useApp();

  // Protect customer routes - must have a selected table and customer name
  if (!customerName || !tableNumber) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>
    </div>
  );
};
export default CustomerLayout;
