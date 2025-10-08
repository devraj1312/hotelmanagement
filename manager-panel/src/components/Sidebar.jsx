// src/components/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/styles.scss';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h4 className="sidebar-title">🧑 Manager Panel</h4>
      <ul className="sidebar-menu">
        <li><NavLink to="/manager/dashboard">🏠 Dashboard</NavLink></li>
        <li><NavLink to="/manager/rooms">🛏 Room Management</NavLink></li>
        <li><NavLink to="/manager/staff">👥 Staff Management</NavLink></li>
        <li><NavLink to="/manager/bookings">📘 Booking Overview</NavLink></li> 
        <li><NavLink to="/manager/maintenance">🛠 Maintenance Logs</NavLink></li>
        <li><NavLink to="/manager/tickets">🎟 Ticket Management</NavLink></li>
        <li><NavLink to="/manager/expenses">💸 Expenses</NavLink></li>
        <li><NavLink to="/manager/settings">⚙️ Settings</NavLink></li>
        <li><NavLink to="/manager/book-room">⚙️ Book Room</NavLink></li>
      </ul>
    </div>
  );
};

export default Sidebar;
