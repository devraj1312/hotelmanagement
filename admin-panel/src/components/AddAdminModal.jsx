import React from "react";
import "../styles/addAdminModal.scss";

const AddAdminModal = ({
  show,
  handleClose,
  adminData = {},
  setAdminData = () => {},
  handleSubmitForm = () => {},
  isEdit = false,
}) => {
  if (!show) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdminData((prev) => ({
      ...prev,
      [name]: name === "admin_email" ? value.trim() : value,
    }));
  };

  const handleSubmit = () => {
    handleSubmitForm(adminData);
  };

  return (
    <div className="custom-modal-backdrop">
      <div className="add-admin-modal">
        <div className="modal-header">
          <h4>{isEdit ? "Update Admin Details" : "Add Admin"}</h4>
        </div>

        <div className="modal-body">
          {/* Admin Name */}
          <div className="form-group mb-2">
            <label>Admin Name</label>
            <input
              type="text"
              className="form-control"
              name="admin_name"
              value={adminData.admin_name || ""}
              onChange={handleChange}
            />
          </div>

          {/* Phone */}
          <div className="form-group mb-2">
            <label>Phone</label>
            <input
              type="tel"
              className="form-control"
              name="admin_phone"
              value={adminData.admin_phone || ""}
              onChange={handleChange}
            />
          </div>

          {/* Email */}
          <div className="form-group mb-2">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              name="admin_email"
              value={adminData.admin_email || ""}
              onChange={handleChange}
            />
          </div>

          {/* Password (only in Add mode) */}
          {!isEdit && (
            <div className="form-group mb-2">
              <label>Password</label>
              <input
                type="password"
                className="form-control"
                name="admin_password"
                value={adminData.admin_password || ""}
                onChange={handleChange}
              />
            </div>
          )}

          {/* Role */}
          <div className="form-group mb-2">
            <label>Role</label>
            {isEdit ? (
              <input
                type="text"
                className="form-control"
                value={adminData.admin_role || "Sub-Admin"}
                disabled
                readOnly
              />
            ) : (
              <select
                className="form-control"
                name="admin_role"
                value={adminData.admin_role || "Sub-Admin"}
                onChange={handleChange}
              >
                <option value="Super-Admin">Super-Admin</option>
                <option value="Admin">Admin</option>
                <option value="Sub-Admin">Sub-Admin</option>
              </select>
            )}
          </div>

          {/* Status */}
          <div className="form-group mb-2">
            <label>Status</label>
            {isEdit ? (
              <input
                type="text"
                className="form-control"
                value={adminData.admin_status ? "Active" : "Inactive"}
                disabled
                readOnly
              />
            ) : (
              <select
                className="form-control"
                name="admin_status"
                value={adminData.admin_status ? "true" : "false"}
                onChange={(e) =>
                  setAdminData((prev) => ({
                    ...prev,
                    admin_status: e.target.value === "true",
                  }))
                }
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-cancel" onClick={handleClose}>
            Cancel
          </button>
          <button className="btn btn-add" onClick={handleSubmit}>
            {isEdit ? "Update" : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAdminModal;
