// src/components/Sidebar.jsx
import { NavLink, useNavigate } from "react-router-dom";
import profile from "../assets/images/admin.jpg";
import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
import ProfileModal from "./ProfileModal";
import { Button } from "react-bootstrap";

const Sidebar = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [role, setRole] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch Current Admin
  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        const decoded = jwtDecode(token);
        const adminId = decoded.id;
        setRole(decoded.role);

        const res = await axios.get(
          `http://localhost:5001/api/admin/details/${adminId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        // console.log("✅ Admin API response:", res.data);
        setAdmin(res.data);
      } catch (error) {
        console.error("❌ Failed to fetch admin:", error);
      }
    };

    fetchAdmin();
  }, []);

  // Logout Function
  const handleLogout = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5001/api/admin/logout",
        {},
        { withCredentials: true }
      );

      if (res.status === 200) {
        localStorage.removeItem("accessToken");
        toast.success("Logout successful!");
        navigate("/");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error(error.response?.data?.message || "Server error. Try again later.");
    }
  };
//testing.........
  // ✅ Menu disable logic
  const isDisabled = (menu) => {
    if (role === "Sub-Admin") {
      if (menu === "Admins") return true;
    }
    if (role === "Admin") {
      if (menu === "Admins") return true;
    }
    return false; // Super-Admin sab access kar sakta hai
  };

  return (
    <aside className="sidebar">
      {/* Admin Logo or Image */}
      <div className="sidebar-logo text-center">
        <img
          src={
            admin?.admin_profile
              ? `http://localhost:5001${admin.admin_profile}`
              : profile
          }
          alt="Profile"
          className="rounded-circle"
          // width="50"
        />
        {admin ? (
          <>
            <h2 className="mt-2">{admin.admin_name}</h2>
            <p className="text">{admin.admin_role}</p>

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
          <h2>Admin Panel</h2>
        )}
      </div>

      {/* Navigation Menu */}
      <nav>
        <ul>
          <li>
            <NavLink
              to="/dashboard"
              className={`menu-link ${isDisabled("Dashboard") ? "disabled-link" : ""}`}
              onClick={(e) => isDisabled("Dashboard") && e.preventDefault()}
            >
              <i className="bi bi-speedometer2"></i> Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/hotels"
              className={`menu-link ${isDisabled("Hotels") ? "disabled-link" : ""}`}
              onClick={(e) => isDisabled("Hotels") && e.preventDefault()}
            >
              <i className="bi bi-building"></i> Hotels
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/clients"
              className={`menu-link ${isDisabled("Clients") ? "disabled-link" : ""}`}
              onClick={(e) => isDisabled("Clients") && e.preventDefault()}
            >
              <i className="bi bi-people"></i> Clients
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admins"
              className={`menu-link ${isDisabled("Admins") ? "disabled-link" : ""}`}
              onClick={(e) => isDisabled("Admins") && e.preventDefault()}
            >
              <i className="bi bi-person-badge"></i> Admins
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/subscriptions"
              className={`menu-link ${isDisabled("Subscriptions") ? "disabled-link" : ""}`}
              onClick={(e) => isDisabled("Subscriptions") && e.preventDefault()}
            >
              <i className="bi bi-credit-card"></i> Subscriptions
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/tickets"
              className={`menu-link ${isDisabled("Tickets") ? "disabled-link" : ""}`}
              onClick={(e) => isDisabled("Tickets") && e.preventDefault()}
            >
              <i className="bi bi-ticket-perforated"></i> Tickets
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* ✅ Logout Button (Bootstrap style) */}
      <Button
        variant="danger"
        size="lg"
        className="m-3 w-80"
        onClick={handleLogout}
      >
        <i className="bi bi-box-arrow-right"></i> Logout
      </Button>

      {/* Profile Modal */}
      <ProfileModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        admin={admin}
      />
    </aside>
  );
};

export default Sidebar;
