// src/components/Footer.jsx
import React from "react";

const Footer = () => {
  return (
    <footer className="dashboard-footer">
      <p>
        &copy; {new Date().getFullYear()} Admin Panel – Hotel Management System.
      </p>
    </footer>
  );
};

export default Footer;
