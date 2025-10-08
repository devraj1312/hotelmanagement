// src/components/ProfileModal.jsx
import React from "react";
import "../styles/components/changePasswordModal.scss";

const ProfileModal = ({ show, handleClose, admin }) => {
  if (!show) return null;

  return (
    <div className="custom-modal-backdrop">
      <div className="custom-modal">
        <div className="modal-header">
          <h5>Admin Profile</h5>
        </div>

        <div className="modal-body">
          {admin ? (
            <div>
              <p><strong>ID:</strong> {admin.admin_id}</p>
              <p><strong>Name:</strong> {admin.admin_name}</p>
              <p><strong>Email:</strong> {admin.admin_email}</p>
              <p><strong>Phone:</strong> {admin.admin_phone}</p>
              <p><strong>Role:</strong> {admin.admin_role}</p>
              <p><strong>Status:</strong> {admin.admin_status ? "Active" : "Inactive"}</p>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-cancel" onClick={handleClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
