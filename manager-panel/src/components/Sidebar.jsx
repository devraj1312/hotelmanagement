// src/components/ManagerSidebar.jsx
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import profile from "../assets/images/admin.jpg";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // default import
import { toast } from "react-toastify";
import { Button } from "react-bootstrap";
import "../styles/styles.scss";

const ManagerSidebar = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [hotel, setHotel] = useState(null);

  useEffect(() => {
    const fetchStaffRole = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        let decoded;
        try {
          decoded = jwtDecode(token);
          console.log("Decoded token:", decoded);
        } catch (err) {
          console.error("Token decode failed:", err);
          return;
        }

        const staffId = decoded.id;
        if (!staffId) {
          console.warn("No staff id found in token");
          return;
        }

        const res = await axios.get(
          `http://localhost:5001/api/staff/details/${staffId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );

        setRole(res.data.staff_role);
      } catch (err) {
        console.error("❌ Failed to fetch staff role:", err);
      }
    };

    fetchStaffRole();
  }, []);

  useEffect(() => {
    const fetchHotelDetails = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        let decoded;
        try {
          decoded = jwtDecode(token);
        } catch (err) {
          console.error("Token decode failed:", err);
          return;
        }

        const hotelID = decoded.hotel;
        if (!hotelID) {
          console.warn("No hotel id found in token");
          return;
        }

        const res = await axios.get(
          `http://localhost:5001/api/hotel/details/${hotelID}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );

        setHotel(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch hotel details:", err);
      }
    };

    fetchHotelDetails();
  }, []);

  // Logout
  const handleLogout = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5001/api/staff/logout",
        {},
        { withCredentials: true }
      );

      if (res.status === 200) {
        localStorage.removeItem("accessToken");
        toast.success("Logout successful!");
        navigate("/login");
      }
    } catch (err) {
      console.error("Logout error:", err);
      toast.error(err.response?.data?.message || "Server error. Try again later.");
    }
  };

  // Disable certain menus based on role
  const isDisabled = (menu) => {
    if (!role) return false; // default allow while role is loading
    if (role === "Receptionist") {
      if (["Rooms", "Staff", "Settings", "Expenses"].includes(menu)) return true;
    }
    return false;
  };

  // const displayRole = role || "Manager";
  const hotelImg = hotel?.hotel_image
    ? `http://localhost:5001/uploads/${hotel.hotel_image}`
    : profile;

  return (
    <aside className="sidebar">
      <div className="sidebar-logo text-center">
        <img src={hotelImg} alt="Hotel" />
        {/* <h4 className="mt-1"> HOTEL</h4> */}
        {hotel ? <h2 className="mt-3">🏨  {hotel.hotel_name.split(" ").slice(0, 2).join(" ")}</h2> : <h2>Hotel Panel</h2>}
        {/* <img src={hotelImg} alt="Hotel" /> */}
        {/* {hotel ? <p className="mt-1">Hotel Code : {hotel.hotel_code}</p> : <h4>Hotel Code</h4>} */}
      </div>

      <nav>
        <ul>
          <li>
            <NavLink
              to="/manager/dashboard"
              className={`menu-link ${isDisabled("Dashboard") ? "disabled-link" : ""}`}
              onClick={(e) => isDisabled("Dashboard") && e.preventDefault()}
            >
              <i className="bi bi-house-door"></i> Dashboard
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/manager/rooms"
              className={`menu-link ${isDisabled("Rooms") ? "disabled-link" : ""}`}
              onClick={(e) => isDisabled("Rooms") && e.preventDefault()}
            >
              <i className="bi bi-house"></i> Room Management
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/manager/staff"
              className={`menu-link ${isDisabled("Staff") ? "disabled-link" : ""}`}
              onClick={(e) => isDisabled("Staff") && e.preventDefault()}
            >
              <i className="bi bi-people"></i> Staff Management
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/manager/bookings"
              className={`menu-link ${isDisabled("Bookings") ? "disabled-link" : ""}`}
              onClick={(e) => isDisabled("Bookings") && e.preventDefault()}
            >
              <i className="bi bi-journal-bookmark"></i> Booking Overview
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/manager/maintenance"
              className={`menu-link ${isDisabled("Maintenance") ? "disabled-link" : ""}`}
              onClick={(e) => isDisabled("Maintenance") && e.preventDefault()}
            >
              <i className="bi bi-tools"></i> Maintenance Logs
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/manager/tickets"
              className={`menu-link ${isDisabled("Tickets") ? "disabled-link" : ""}`}
              onClick={(e) => isDisabled("Tickets") && e.preventDefault()}
            >
              <i className="bi bi-ticket-perforated"></i> Ticket Management
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/manager/expenses"
              className={`menu-link ${isDisabled("Expenses") ? "disabled-link" : ""}`}
              onClick={(e) => isDisabled("Expenses") && e.preventDefault()}
            >
              <i className="bi bi-cash-stack"></i> Expenses
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/manager/settings"
              className={`menu-link ${isDisabled("Settings") ? "disabled-link" : ""}`}
              onClick={(e) => isDisabled("Settings") && e.preventDefault()}
            >
              <i className="bi bi-gear"></i> Settings
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/manager/book-room"
              className={`menu-link ${isDisabled("BookRoom") ? "disabled-link" : ""}`}
              onClick={(e) => isDisabled("BookRoom") && e.preventDefault()}
            >
              <i className="bi bi-door-open"></i> Book Room
            </NavLink>
          </li>
        </ul>
      </nav>

      <Button variant="danger" size="lg" className="m-3 w-80" onClick={handleLogout}>
        <i className="bi bi-box-arrow-right"></i> Logout
      </Button>
    </aside>
  );
};

export default ManagerSidebar;
