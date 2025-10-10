import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { Button } from "react-bootstrap";
import profile from "../assets/images/admin.jpg";
import ProfileModal from "./OwnerProfileModal"; 

const Sidebar = () => {
  const navigate = useNavigate();
  const [owner, setOwner] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // ✅ Fetch Current Owner Details
  useEffect(() => {
    const fetchOwner = async () => {
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
        // console.log("Fetched owner:", res.data);
        setOwner(res.data);
      } catch (error) {
        console.error("❌ Failed to fetch owner:", error);
      }
    };

    fetchOwner();
  }, []);

  // ✅ Logout Function
  const handleLogout = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5001/api/owner/logout",
        {},
        { withCredentials: true }
      );

      if (res.status === 200) {
        localStorage.removeItem("accessToken");
        toast.success("Logout successful!");
        navigate("/login");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error(error.response?.data?.message || "Server error. Try again later.");
    }
  };

  return (
    <aside className="sidebar">
      {/* ✅ Owner Profile Section */}
      <div className="sidebar-logo text-center">
        <img
          src={owner?.owner_profile ? `http://localhost:5001${owner.owner_profile}` : profile}
          alt="Owner Profile"
          className="rounded-circle"
        />

        {owner ? (
          <>
            <h2 className="mt-2">{owner.owner_name}</h2>
            <p className="text">Hotel Owner</p>

            {/* ✅ View Profile Button */}
            <Button
              variant="success"
              size="lg"
              className="mt-3 w-100"
              onClick={() => setShowModal(true)}
            >
              <i className="bi bi-person-lines-fill"></i> View Profile
            </Button>
          </>
        ) : (
          <h2>Owner Panel</h2>
        )}
      </div>

      {/* ✅ Navigation Menu */}
      <nav>
        <ul>
          <li>
            <NavLink to="/dashboard" className="menu-link">
              <i className="bi bi-speedometer2"></i> Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/finance" className="menu-link">
              <i className="bi bi-currency-rupee"></i> Finance & Reports
            </NavLink>
          </li>
          <li>
            <NavLink to="/booking" className="menu-link">
              <i className="bi bi-calendar-check"></i> Booking Overview
            </NavLink>
          </li>
          <li>
            <NavLink to="/staff" className="menu-link">
              <i className="bi bi-people"></i> Staff Overview
            </NavLink>
          </li>
          <li>
            <NavLink to="/maintenance" className="menu-link">
              <i className="bi bi-tools"></i> Maintenance
            </NavLink>
          </li>
          <li>
            <NavLink to="/reviews" className="menu-link">
              <i className="bi bi-star"></i> Reviews
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* ✅ Logout Button (Bootstrap Style) */}
      <Button
        variant="danger"
        size="lg"
        className="m-3 w-80"
        onClick={handleLogout}
      >
        <i className="bi bi-box-arrow-right"></i> Logout
      </Button>

      {/* ✅ Profile Modal */}
      <ProfileModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        owner={owner}
      />
    </aside>
  );
};

export default Sidebar;
