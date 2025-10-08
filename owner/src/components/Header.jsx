import { useEffect, useState } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import HotelModal from "./AddHotelModal"; // Corrected path assuming this is in the same directory

const Header = () => {
  const [dateTime, setDateTime] = useState(new Date());
  const [showDropdown, setShowDropdown] = useState(false);
  const [showHotelModal, setShowHotelModal] = useState(false);

  const hotels = ["Hotel Paradise", "Sunrise Inn", "Ocean View", "Mountain Lodge"];

  useEffect(() => {
    const interval = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="header">
      <h1 className="dashboard-title">Dashboard</h1>

      <div className="header-center">
        <input type="text" className="search-box" placeholder="Search..." />
        <i className="bi bi-bell-fill notification-icon"></i>
        <div className="datetime">
          <i className="bi bi-calendar-event"></i>
          <span>
            {dateTime.toLocaleDateString()} | {dateTime.toLocaleTimeString()}
          </span>
        </div>

        <div className="hotel-dropdown-wrapper">
          <button
            className="hotel-btn"
            onClick={() => setShowDropdown((prev) => !prev)}
          >
            Hotel +
          </button>

          {showDropdown && (
            <ul className="hotel-dropdown">
              {hotels.map((hotel, index) => (
                <li key={index} className="hotel-item">
                  {hotel}
                </li>
              ))}
              <li
                className="hotel-item add-hotel"
                onClick={() => {
                  setShowHotelModal(true);
                  setShowDropdown(false);
                }}
              >
                ➕ Add Hotel
              </li>
            </ul>
          )}
        </div>
      </div>

      <HotelModal
        show={showHotelModal}
        handleClose={() => setShowHotelModal(false)}
      />
    </header>
  );
};

export default Header;
