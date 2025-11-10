import React from "react";
import "../styles/staffProfileModal.scss";

const StaffProfileModal = ({ show, handleClose, staff }) => {
  if (!show) return null;

  return (
    <div className="custom-modal-backdrop">
      <div className="custom-modal">
        <div className="modal-header">
          <h5>Staff Profile</h5>
        </div>

        <div className="modal-body">
          {staff ? (
            <div>
              <p><strong>ID:</strong> {staff.staff_id}</p>
              <p><strong>Name:</strong> {staff.staff_name}</p>
              <p><strong>Email:</strong> {staff.staff_email}</p>
              <p><strong>Phone:</strong> {staff.staff_phone}</p>
              <p><strong>Role:</strong> {staff.staff_role}</p>
              <p><strong>Address:</strong> {staff.staff_address}</p>
              <p><strong>Status:</strong> {staff.staff_status ? "Active" : "Inactive"}</p>
              <p><strong>Joined On:</strong> {staff.created_at ? new Date(staff.created_at).toLocaleDateString() : "N/A"}</p>
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

export default StaffProfileModal;
