import React from "react";
import "../styles/components/profileModal.scss";

const OwnerProfileModal = ({ show, handleClose, owner }) => {
  if (!show) return null;
   // ✅ Correct place for debugging
//   console.log("Owner Data:", owner);

  return (
    <div className="custom-modal-backdrop">
      <div className="custom-modal">
        <div className="modal-header">
          <h5>Owner Profile</h5>
        </div>

        <div className="modal-body">
          {owner ? (
            <div>
              <p><strong>ID:</strong> {owner.owner_id}</p>
              <p><strong>Name:</strong> {owner.owner_name}</p>
              <p><strong>Email:</strong> {owner.owner_email}</p>
              <p><strong>Phone:</strong> {owner.owner_phone}</p>
              <p><strong>Address:</strong> {owner.owner_address}</p>
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

export default OwnerProfileModal;
