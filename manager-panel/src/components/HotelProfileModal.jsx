import React from "react";
// import "../styles/hotelProfileModal.scss";
import "../styles/staffProfileModal.scss";

const HotelProfileModal = ({ show, handleClose, hotel }) => {
  if (!show) return null;

  return (
    <div className="custom-modal-backdrop">
      <div className="custom-modal">
        <div className="modal-header">
          <h5>Hotel Details</h5>
        </div>

        <div className="modal-body">
          {hotel ? (
            <div>
              <p><strong>Hotel ID:</strong> {hotel.hotel_id}</p>
              <p><strong>Name:</strong> {hotel.hotel_name}</p>
              <p><strong>Email:</strong> {hotel.hotel_email}</p>
              <p><strong>Phone:</strong> {hotel.hotel_phone}</p>
              <p><strong>Address:</strong> {hotel.hotel_address}</p>
              <p><strong>Status:</strong> {hotel.subscription ? "Active" : "Inactive"}</p>
              <p><strong>Registered On:</strong> {hotel.created_at ? new Date(hotel.created_at).toLocaleDateString() : "N/A"}</p>
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

export default HotelProfileModal;
