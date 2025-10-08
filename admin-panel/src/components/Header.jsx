import { useEffect, useState } from "react";
import { Dropdown, Button } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import UploadProfileModal from "./UploadProfileModal";
import AddAdminModal from "./AddAdminModal";
import ChangePasswordModal from "./ChangePasswordModal"; 
import axios from "axios";
import { jwtDecode } from "jwt-decode";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

const Header = () => {
  const [dateTime, setDateTime] = useState(new Date());
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false); // ✅ new state
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        const decoded = jwtDecode(token);
        const adminId = decoded.id;

        const res = await axios.get(
          `http://localhost:5001/api/admin/details/${adminId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );

        setAdmin(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch admin:", err);
      }
    };

    fetchAdmin();
  }, []);

  // ✅ Update admin details and show toast for duplicates
  const handleUpdateAdmin = async (adminData) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      const decoded = jwtDecode(token);
      const adminId = decoded.id;

      const res = await axios.put(
        `http://localhost:5001/api/admin/update/${adminId}`,
        {
          admin_name: adminData.admin_name,
          admin_email: adminData.admin_email,
          admin_phone: adminData.admin_phone,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      setAdmin(res.data.admin);
      setShowEditModal(false);
      toast.success("Admin updated successfully!");
    } catch (err) {
      if (err.response && err.response.status === 400) {
        toast.error(err.response.data.message || "Validation error");
      } else {
        toast.error("Failed to update admin. Please try again.");
      }
      console.error("❌ Update admin failed:", err);
    }
  };

  return (
    <>
      {/* <ToastContainer position="top-right" autoClose={3000} /> */}

      <header className="header">
        <h1 className="dashboard-title">Admin Dashboard</h1>

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
            <Dropdown.Toggle
              as={Button}
              variant="primary"
              size="lg"
              className="settings-btn"
            >
              <i className="bi bi-gear-fill"></i> Settings
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setShowUploadModal(true)}>
                Upload Profile
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setShowEditModal(true)}>
                Update Details
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setShowChangePassword(true)}>
                Change Password
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </header>

      {/* ✅ Upload Profile Modal */}
      <UploadProfileModal
        show={showUploadModal}
        handleClose={() => setShowUploadModal(false)}
        admin={admin}
        setAdmin={setAdmin}
      />

      {/* ✅ Edit Admin Details Modal */}
      <AddAdminModal
        show={showEditModal}
        handleClose={() => setShowEditModal(false)}
        adminData={admin || {}}
        setAdminData={setAdmin}
        handleSubmitForm={handleUpdateAdmin}
        isEdit={true}
      />

      {/* ✅ Change Password Modal */}
      <ChangePasswordModal
        show={showChangePassword}
        handleClose={() => setShowChangePassword(false)}
      />
    </>
  );
};

export default Header;
