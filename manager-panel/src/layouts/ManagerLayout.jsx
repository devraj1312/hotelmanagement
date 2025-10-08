// src/layouts/ManagerLayout.jsx
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ManagerLayout = () => {
  return (
    <div className="manager-layout">
      <Sidebar />

      {/* Main wrapper for header + content + footer */}
      <div className="main-wrapper">
        <Header />

        {/* Content Area */}
        <div className="page-content">
          <Outlet />
        </div>

        {/* Sticky Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default ManagerLayout;
