import React, { useState, useEffect } from "react";
import "../styles/Admins.scss";
import { Button, Table, Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import AddAdminModal from "../components/AddAdminModal";
import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = "http://localhost:5001";

const Admins = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    admin_name: "",
    admin_phone: "",
    admin_email: "",
    admin_password: "",
    admin_role: "Sub-Admin",
    admin_status: true,
  });

  // adminpaneldfghjsdfghdfghjk

  // Fetch Admins API
  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/api/admin/fetch`, {
        withCredentials: true,
      });
      setAdmins(res.data);
    } catch (error) {
      console.error("Error fetching admins:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // Add Admin API
  const handleAddAdmin = async (adminData) => {
    try {
      const res = await axios.post(`${BASE_URL}/api/admin/register`, adminData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      toast.success("Admin added successfully!");
      fetchAdmins();
      setShowModal(false);

      // Reset form
      setNewAdmin({
        admin_name: "",
        admin_phone: "",
        admin_email: "",
        admin_password: "",
        admin_role: "Sub-Admin",
        admin_status: true,
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add admin");
    }
  };

  // Toggle Status API
  const handleToggleStatus = async (id) => {
    try {
      const res = await axios.put(
        `${BASE_URL}/api/admin/toggle-status/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
          withCredentials: true,
        }
      );
      toast.success(res.data.message);
      fetchAdmins();
    } catch (err) {
      toast.error(err.response?.data?.message || "Unauthorized or Server Error");
    }
  };
// testing in branch srishti
  return (
    <div className="admins-page container-fluid p-2">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h2>👨‍💻 Admins</h2>
        <Button
          variant="success"
          size="lg"
          onClick={() => setShowModal(true)}
        >
          <i className="bi bi-person-plus"> </i> Add Admin
        </Button>
      </div>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
          <p>Loading admins...</p>
        </div>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Admin ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.length > 0 ? (
              admins.map((admin) => {
                const isActive = admin.admin_status === true || admin.admin_status === 1;
                return (
                  <tr key={admin.admin_id}>
                    <td>{admin.admin_id}</td>
                    <td>{admin.admin_name}</td>
                    <td>{admin.admin_email}</td>
                    <td>{admin.admin_phone}</td>
                    <td>{admin.admin_role}</td>
                    <td>{isActive ? "Active" : "Inactive"}</td>
                    <td>
                      <Button
                        variant={isActive ? "danger" : "success"}
                        size="md"
                        onClick={() => handleToggleStatus(admin.admin_id)}
                      >
                        {isActive ? "Deactivate" : "Activate"}
                      </Button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  No admins found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}

      <AddAdminModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        adminData={newAdmin}             // Correct
        setAdminData={setNewAdmin}       // Correct
        handleSubmitForm={handleAddAdmin} // Correct
        isEdit={false}                   // Correct
      />
    </div>
  );
};

export default Admins;
