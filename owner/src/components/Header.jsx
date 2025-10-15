import { useEffect, useState, useCallback } from "react";
import { Dropdown, Button, Modal } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { List, X } from "lucide-react";

import AddHotelModal from "./AddHotelModal";
import UploadProfileModal from "./UploadProfileModal";
import ChangePasswordModal from "./ChangePasswordModal";
import Register from "../pages/Register";

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  const [dateTime, setDateTime] = useState(new Date());
  const [showHotelModal, setShowHotelModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [owner, setOwner] = useState(null);
  const [hasHotel, setHasHotel] = useState(false);
  const [hotels, setHotels] = useState([]);


  // Update clock every second
  useEffect(() => {
    const interval = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch hotels
  const fetchHotels = useCallback(async (ownerId, token) => {
    try {
      const res = await axios.get(
        `http://localhost:5001/api/hotel/fetch-hotels/${ownerId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setHotels(res.data?.hotels || []);
      setHasHotel((res.data?.hotels || []).length > 0);
    } catch (err) {
      console.error("❌ Failed to fetch hotels:", err);
    }
  }, []);

  // Fetch owner + hotels
  const fetchOwnerData = useCallback(async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;
      const decoded = jwtDecode(token);
      const ownerId = decoded.id;

      const res = await axios.get(
        `http://localhost:5001/api/owner/details/${ownerId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setOwner(res.data);
      await fetchHotels(ownerId, token);
    } catch (err) {
      console.error("❌ Failed to fetch owner or hotels:", err);
    }
  }, [fetchHotels]);

  useEffect(() => {
    fetchOwnerData();
  }, [fetchOwnerData]);

  return (
    <>
     <header className="header d-lg-flex align-items-center justify-content-between px-3 py-2">
        <button
          className="btn text-black d-lg-none"
          onClick={() => setSidebarOpen(true)}>
          <List size={26} />
        </button>
        <h1 className="dashboard-title">Owner Dashboard</h1>

        <div className="header-center">
          <input type="text" className="search-box" placeholder="Search..." />
          <i className="bi bi-bell-fill notification-icon"></i>

          <div className="datetime">
            <i className="bi bi-calendar-event"></i>
            <span>
              {dateTime.toLocaleDateString()} | {dateTime.toLocaleTimeString()}
            </span>
          </div>

          <Dropdown>
              {/* 📱 Mobile — icon only */}
              <Dropdown.Toggle as="div" className="icon-dropdown-btn d-flex d-lg-none">
                <i className="bi bi-gear-fill"></i>
              </Dropdown.Toggle>

              {/* 🖥️ Desktop — icon + text */}
              <Dropdown.Toggle as={Button} variant="primary" size="lg" className="settings-btn d-none d-lg-flex align-items-center gap-2">
                <i className="bi bi-gear-fill"></i> Settings
              </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setShowUploadModal(true)}>
                UPLOAD PROFILE
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setShowEditModal(true)}>
                UPDATE DETAILS
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setShowChangePassword(true)}>
                CHANGE PASSWORD
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setShowHotelModal(true)}>
                {hasHotel ? "UPDATE HOTEL" : "ADD HOTEL"}
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </header>

      {/* Upload Profile */}
      <UploadProfileModal
        show={showUploadModal}
        handleClose={() => setShowUploadModal(false)}
        owner={owner}
        setOwner={setOwner}
      />

      {/* Update Owner Details */}
      {showEditModal && owner && (
        <Register
          isUpdate={true}
          owner={owner}
          setOwner={setOwner}
          handleClose={() => setShowEditModal(false)}
        />
      )}

      {/* Change Password */}
      <ChangePasswordModal
        show={showChangePassword}
        handleClose={() => setShowChangePassword(false)}
      />

      {/* Add / Update Hotel */}
      <AddHotelModal
        show={showHotelModal}
        handleClose={() => setShowHotelModal(false)}
        owner={owner}
        hasHotel={hasHotel}
        existingHotel={hasHotel ? hotels[0] : null}
        onHotelChange={fetchOwnerData}
      />
      
    </>
  );
};

export default Header;
