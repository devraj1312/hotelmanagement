import React, { useEffect } from "react";
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
        role: "Receptionist",
      });
    }
  }, [editMode, show, setNewStaff]);

  if (!show) return null;

  const handleChange = (e) => {
    setNewStaff({ ...newStaff, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (editMode) {
      handleUpdateStaff(newStaff.staff_id, newStaff);
    } else {
      handleAddStaff(newStaff);
    }
  };

  return (
    <div className="custom-modal-backdrop">
      <div className="add-staff-modal">
        <div className="modal-header">
          <h4>{editMode ? "Update Staff" : "ADD STAFF"}</h4>
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

          {!editMode && (
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
          )}

          {/* Role with custom arrow */}
          <div className="form-group mb-2">
            <label>Role</label>
            <div className="select-wrapper">
              <select
                className="form-control"
                name="role"
                value={newStaff.role}
                onChange={handleChange}
              >
                <option value="Manager">Manager</option>
                <option value="Receptionist">Receptionist</option>
              </select>
              <span className="arrow-down">&#9662;</span>
            </div>
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
