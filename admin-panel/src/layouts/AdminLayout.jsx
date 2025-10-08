import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/layout.scss";

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="admin-main">
        {/* Header */}
        <Header />

        {/* Page Content */}
        <div className="admin-content">
          <Outlet />
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default AdminLayout;
