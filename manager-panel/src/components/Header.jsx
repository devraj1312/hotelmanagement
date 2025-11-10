import React, { useEffect, useState } from "react";
import { Dropdown, Button } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../styles/styles.scss";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import StaffProfileModal from "./StaffProfileModal";
import HotelProfileModal from "./HotelProfileModal";

const Header = () => {
  const [dateTime, setDateTime] = useState(new Date());
  const [staff, setStaff] = useState(null);
  const [role, setRole] = useState(null);
  const [hotel, setHotel] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showHotelModal, setShowHotelModal] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch staff details
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        const decoded = jwtDecode(token);
        const staffId = decoded.id;
        setRole(decoded.role);

        const res = await axios.get(
          `http://localhost:5001/api/staff/details/${staffId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );

        setStaff(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch staff:", err);
        toast.error("Unable to load profile");
      }
    };

    fetchStaff();
  }, []);

  // Fetch hotel details (using hotel id from token)
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

  const displayName = staff?.staff_name || "Profile";
  const displayRole = staff?.staff_role || "Role";

  return (
    <>
      <header className="header">
        <h3 className="hotel-name">🏨 {displayRole} Panel</h3>

        <div className="header-right d-flex align-items-center" style={{ gap: 16 }}>
          <div className="datetime">
            <i className="bi bi-calendar-event"></i>
            <span>
              {dateTime.toLocaleDateString()} | {dateTime.toLocaleTimeString()}
            </span>
          </div>

          <span className="staff-name">🧑 {displayName}</span>

          <Dropdown>
            <Dropdown.Toggle as={Button} variant="primary" size="lg" className="settings-btn">
              <i className="bi bi-gear-fill"></i> Settings
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setShowProfileModal(true)}>
                VIEW PROFILE
              </Dropdown.Item>

              <Dropdown.Item onClick={() => setShowHotelModal(true)} disabled={!hotel}>
                HOTEL DETAILS              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </header>

      {/* Staff profile modal */}
      <StaffProfileModal
        show={showProfileModal}
        handleClose={() => setShowProfileModal(false)}
        staff={staff}
      />

      {/* Hotel profile modal */}
      <HotelProfileModal
        show={showHotelModal}
        handleClose={() => setShowHotelModal(false)}
        hotel={hotel}
      />
    </>
  );
};

export default Header;
