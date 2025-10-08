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

  const fetchStaffs = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/api/staff/fetch`, { withCredentials: true });
      setStaffs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffs();
  }, []);

  const handleAddStaff = async (staffData) => {
    try {
      const token = localStorage.getItem("accessToken");
      console.log("Access Token:", token); 
      if (!token) {
        toast.error("Login expired or token missing");
        return;
      }

      const res = await axios.post(`${BASE_URL}/api/staff/register`, staffData, {
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        withCredentials: false,
      });

      if (res.status === 200 || res.status === 201) {
        toast.success("Staff added successfully!");
        fetchStaffs();
        setShowModal(false);
        setNewStaff({
          name: "",
          phone: "",
          email: "",
          address: "",
          password: "",
          role: "",
        });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add staff");
    }
  };

  const handleUpdateStaff = async (id, staffData) => {
    try {
      const res = await axios.put(`${BASE_URL}/api/staff/update/${id}`, staffData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
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

  const handleToggleStatus = async (id) => {
    try {
      const res = await axios.put(
        `${BASE_URL}/api/staff/toggle-status/${id}`,
        {},
        { withCredentials: true }
      );
      toast.success(res.data.message);
      fetchStaffs();
    } catch (err) {
      toast.error(err.response?.data?.message || "Server Error");
    }
  };

  // const handleEditStaff = (staff) => {
  //   setNewStaff({
  //     name: staff.name || "",
  //     phone: staff.phone || "",
  //     email: staff.email || "",
  //     address: staff.address || "",
  //     password: "", // Password should be empty on edit
  //     role: staff.role || "Receptionist",
  //     staff_id: staff.staff_id, // Keep the ID for update
  //   });
  //   setEditMode(true);
  //   setShowModal(true);
  // };

  return (
    <div className="staff-page container-fluid p-2">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h2>🧑‍💼 Staffs</h2>
        <Button
          variant="success"
          size="md"
          onClick={() => {
            setShowModal(true);
            setEditMode(false);
            setNewStaff({
              name: "",
              phone: "",
              email: "",
              address: "",
              password: "",
              role: "Receptionist",
            });
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
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {staffs.length ? (
              staffs.map((staff) => {
                const isActive = staff.status === true || staff.status === 1;
                return (
                  <tr key={staff.staff_id}>
                    <td>{staff.staff_id}</td>
                    <td>{staff.staff_name}</td>
                    <td>{staff.staff_email}</td>
                    <td>{staff.staff_phone}</td>
                    <td>{staff.staff_role}</td>
                    <td>{isActive ? "Active" : "Inactive"}</td>
                    <td className="d-flex gap-2">
                      <Button
                        variant="warning"
                        size="md"
                        onClick={() => handleUpdateStaff(staff.staff_id, {
                          name: staff.staff_name,
                          phone: staff.staff_phone,
                          email: staff.staff_email,
                          role: staff.staff_role,
                        })}
                      >
                        Update
                      </Button>
                      <Button
                        variant={isActive ? "danger" : "success"}
                        size="md"
                        onClick={() => handleToggleStatus(staff.staff_id)}
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
       <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar={false} 
        newestOnTop={false} 
        closeOnClick 
        rtl={false} 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover 
      />
    </div>
  );
};

export default Staff;
