import { NavLink, useNavigate } from "react-router-dom";
import profile from "../assets/images/admin.jpg"; // Default profile image
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode";

const Sidebar = () => {
  const navigate = useNavigate();
  const [owner, setOwner] = useState(null);

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

        setOwner(res.data);
      } catch (error) {
        console.error("❌ Failed to fetch owner:", error);
      }
    };

    fetchOwner();
  }, []);

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
      <div className="sidebar-logo">
        <img
          src={owner?.profile ? `http://localhost:5001${owner.profile}` : profile}
          alt="Owner Profile"
          className="rounded-circle"
          width="80"
        />
        {owner ? (
          <>
            <h2>{owner.name}</h2>
            <p className="text">Owner</p>
          </>
        ) : (
          <h2>Owner Panel</h2>
        )}
      </div>

      <nav>
        <ul>
          <li>
            <NavLink to="/dashboard" className="menu-link">
              <i className="bi bi-speedometer2"></i> Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/finance" className="menu-link">
              <i className="bi bi-currency-rupee"></i> Finance
            </NavLink>
          </li>
          <li>
            <NavLink to="/booking" className="menu-link">
              <i className="bi bi-calendar-check"></i> Bookings
            </NavLink>
          </li>
          <li>
            <NavLink to="/staff" className="menu-link">
              <i className="bi bi-people"></i> Staff
            </NavLink>
          </li>
          <li>
            <NavLink to="/maintenance" className="menu-link">
              <i className="bi bi-tools"></i> Maintenance
            </NavLink>
          </li>
          <li>
            <NavLink to="/review" className="menu-link">
              <i className="bi bi-star"></i> Reviews
            </NavLink>
          </li>
        </ul>
      </nav>

      <button className="btn btn-delete" onClick={handleLogout}>
        <i className="bi bi-box-arrow-right"></i> Logout
      </button>
    </aside>
  );
};

export default Sidebar;
