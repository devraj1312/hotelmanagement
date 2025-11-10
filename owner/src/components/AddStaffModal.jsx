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
        staff_name: "",
        staff_phone: "",
        staff_email: "",
        staff_address: "",
        staff_password: "",
        staff_role: "Receptionist",
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
          {[
            { label: "Name", key: "staff_name" },
            { label: "Phone", key: "staff_phone" },
            { label: "Email", key: "staff_email" },
            { label: "Address", key: "staff_address" },
          ].map((field) => (
            <div className="form-group mb-2" key={field.key}>
              <label>{field.label}</label>
              <input
                type="text"
                className="form-control"
                name={field.key}
                value={newStaff[field.key] || ""}
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
                name="staff_password"
                value={newStaff.staff_password || ""}
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
                name="staff_role"
                value={newStaff.staff_role}
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
