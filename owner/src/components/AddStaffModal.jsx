import React, { useState, useEffect } from "react";
import "../styles/addStaffModal.scss";

const AddStaffModal = ({
  show,
  handleClose,
  newStaff,
  setNewStaff,
  handleAddStaff,
  handleUpdateStaff,
  editMode,
}) => {
  useEffect(() => {
    if (!editMode && show) {
      setNewStaff({
        name: "",
        phone: "",
        email: "",
        address: "",
        password: "",
        role: "Manager",
      });
    }
  }, [editMode, show, setNewStaff]);

  if (!show) return null;

  const handleChange = (e) => {
    setNewStaff({ ...newStaff, [e.target.name]: e.target.value.trim() });
  };

  const handleSubmit = () => {
    const formData = new FormData();
    Object.keys(newStaff).forEach((key) => {
      formData.append(key, newStaff[key]);
    });

    if (editMode) {
      handleUpdateStaff(newStaff.staff_id, formData);
    } else {
      handleAddStaff(formData);
    }
  };

  return (
    <div className="custom-modal-backdrop">
      <div className="add-staff-modal">
        <div className="modal-header">
          <h4>{editMode ? "Update Staff" : "Add Staff"}</h4>
        </div>
        <div className="modal-body">
          {["name", "phone", "email", "address"].map((field) => (
            <div className="form-group mb-2" key={field}>
              <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
              <input
                type="text"
                className="form-control"
                name={field}
                value={newStaff[field] || ""}
                onChange={handleChange}
              />
            </div>
          ))}

          <div className="form-group mb-2">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={newStaff.password || ""}
              onChange={handleChange}
            />
          </div>

          <div className="form-group mb-2">
            <label>Role</label>
            <select
              className="form-control"
              name="role"
              value={newStaff.role}
              onChange={handleChange}
            >
              <option value="Manager">Manager</option>
              <option value="Receptionist">Receptionist</option>
            </select>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-cancel" onClick={handleClose}>
            Cancel
          </button>
          <button className="btn btn-add" onClick={handleSubmit}>
            {editMode ? "Update" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddStaffModal;
