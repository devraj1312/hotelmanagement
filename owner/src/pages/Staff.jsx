import React, { useState, useEffect } from "react";
import "../styles/staff.scss";
import { Button, Table, Spinner } from "react-bootstrap";
import AddStaffModal from "../components/AddStaffModal";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BASE_URL = "http://localhost:5001";

const Staff = () => {
  const [staffs, setStaffs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [newStaff, setNewStaff] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    password: "",
    role: "Receptionist",
  });

  // 🔹 Fetch all staff
  const fetchStaffs = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/api/staff/fetch`, {
        withCredentials: true,
      });
      setStaffs(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch staff list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffs();
  }, []);

  // 🔹 Add new staff
  const handleAddStaff = async (staffData) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("Login expired or token missing");
        return;
      }

      const res = await axios.post(`${BASE_URL}/api/staff/register`, staffData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200 || res.status === 201) {
        toast.success("Staff added successfully!");
        fetchStaffs();
        setShowModal(false);
        resetStaffForm();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add staff");
    }
  };

  // 🔹 Update staff details
  const handleUpdateStaff = async (id, staffData) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("Login expired or token missing");
        return;
      }

      const res = await axios.put(`${BASE_URL}/api/staff/update/${id}`, staffData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200) {
        toast.success("Staff updated successfully!");
        fetchStaffs();
        setShowModal(false);
        setEditMode(false);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update staff");
    }
  };

  // 🔹 Toggle staff active/inactive
  const handleToggleStatus = async (id) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("Login expired or token missing");
        return;
      }

      const res = await axios.put(
        `${BASE_URL}/api/staff/toggle-status/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      toast.success(res.data.message || "Status updated successfully!");
      fetchStaffs();
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        toast.error("Unauthorized! Please login again.");
      } else {
        toast.error(err.response?.data?.message || "Something went wrong");
      }
    }
  };

  // 🔹 Open modal to edit staff
  const handleEditStaff = (staff) => {
    setNewStaff({
      staff_id: staff.staff_id,
      name: staff.staff_name || "",
      phone: staff.staff_phone || "",
      email: staff.staff_email || "",
      address: staff.staff_address || "",
      password: "",
      role: staff.staff_role || "Receptionist",
    });
    setEditMode(true);
    setShowModal(true);
  };

  // 🔹 Reset staff form
  const resetStaffForm = () => {
    setNewStaff({
      name: "",
      phone: "",
      email: "",
      address: "",
      password: "",
      role: "Receptionist",
    });
  };

  return (
    <div className="staff-page container-fluid p-2">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h2>🧑‍💼 Staffs</h2>
        <Button
          variant="success"
          size="lg"
          onClick={() => {
            resetStaffForm();
            setShowModal(true);
            setEditMode(false);
          }}
        >
          Add Staff
        </Button>
      </div>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
          <p>Loading staffs...</p>
        </div>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {staffs.length ? (
              staffs.map((staff) => {
                const isActive = staff.staff_status === true || staff.staff_status === 1;
                return (
                  <tr key={staff.staff_id}>
                    <td>{staff.staff_id}</td>
                    <td>{staff.staff_name}</td>
                    <td>{staff.staff_email}</td>
                    <td>{staff.staff_phone}</td>
                    <td>{staff.staff_address}</td>
                    <td>{staff.staff_role}</td>
                    <td>{isActive ? "Active" : "Inactive"}</td>
                    <td className="d-flex gap-2">
                      <Button
                        variant="warning"
                        size="md"
                        onClick={() => handleEditStaff(staff)}
                      >
                        Update
                      </Button>
                      <Button
                        variant={isActive ? "danger" : "success"}
                        size="md"
                        onClick={() => handleToggleStatus(staff.staff_id)}
                      >
                        {isActive ? "Inactivate" : "Activate"}
                      </Button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="8" className="text-center">
                  No staffs found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}

      <AddStaffModal
        show={showModal}
        handleClose={() => {
          setShowModal(false);
          setEditMode(false);
        }}
        newStaff={newStaff}
        setNewStaff={setNewStaff}
        handleAddStaff={handleAddStaff}
        handleUpdateStaff={handleUpdateStaff}
        editMode={editMode}
      />
    </div>
  );
};

export default Staff;
