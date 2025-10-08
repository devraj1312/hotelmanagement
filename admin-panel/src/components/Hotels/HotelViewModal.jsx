import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "../../styles/hotelViewModal.scss";

const BASE_URL = "http://localhost:5001"; // backend base URL

const HotelViewModal = ({ show, handleClose, hotel, onUpdated }) => {
  const [openImage, setOpenImage] = useState(null); // image open karne ke liye state
  const [formData, setFormData] = useState({
    subscription: false,
  });

  useEffect(() => {
    if (hotel) {
      setFormData({
        subscription: hotel.subscription || false,
      });
    }
  }, [hotel]);

  if (!show) return null;
  if (!hotel) return null;

  const handleUpdate = async () => {
    try {
      await axios.put(
        `${BASE_URL}/api/hotel/updateSubscription/${hotel.hotel_id}`,
        formData,
        { withCredentials: true }
      );
      toast.success("Hotel updated successfully!");
      onUpdated();
      handleClose();
    } catch (err) {
      console.error("Error updating hotel:", err);
      toast.error("Failed to update hotel.");
    }
  };

  return (
    <div className="custom-modal-backdrop">
      <div className="hotel-view-modal wide">
        {/* Header */}
        <div className="modal-header">
          <h4>Hotel Details</h4>
        </div>

        {/* Body */}
        <div className="modal-body grid-3">
          <div className="form-group">
            <label>Hotel ID</label>
            <input type="text" value={hotel.hotel_id || ""} disabled />
          </div>

          <div className="form-group">
            <label>Hotel Code</label>
            <input type="text" value={hotel.hotel_code || ""} disabled />
          </div>

          <div className="form-group">
            <label>Name</label>
            <input type="text" value={hotel.hotel_name || ""} disabled />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="text" value={hotel.hotel_email || ""} disabled />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input type="text" value={hotel.hotel_phone || ""} disabled />
          </div>

          <div className="form-group">
            <label>License No</label>
            <input type="text" value={hotel.license_no || ""} disabled />
          </div>

          <div className="form-group">
            <label>Subscription</label>
            <select
              value={formData.subscription ? "true" : "false"}
              className="subscription-select"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  subscription: e.target.value === "true",
                })
              }
            >
              <option value="true">Active</option>
              <option value="false">Expired</option>
            </select>
          </div>

          <div className="form-group">
            <label>Created At</label>
            <input
              type="text"
              value={new Date(hotel.created_at).toLocaleString()}
              disabled
            />
          </div>

          <div className="form-group">
            <label>Owner ID</label>
            <input type="text" value={hotel.owner_id || ""} disabled />
          </div>

          {/* Address */}
          <div className="form-group col-span-3">
            <label>Address</label>
            <textarea value={hotel.hotel_address || ""} disabled />
          </div>

          {/* Image Section */}
          <div className="form-group">
            <label>Hotel Image</label>
            {hotel.hotel_image ? (
              <button
                className="btn btn-open"
                onClick={() =>
                  setOpenImage(`${BASE_URL}/uploads/${hotel.hotel_image}`)
                }
              >
                View
              </button>
            ) : (
              <p>No Image Available</p>
            )}
          </div>

          <div className="form-group">
            <label>Hotel Document</label>
            {hotel.hotel_document ? (
              <button
                className="btn btn-open"
                onClick={() =>
                  setOpenImage(`${BASE_URL}/uploads/${hotel.hotel_document}`)
                }
              >
                View
              </button>
            ) : (
              <p>No Document Available</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn btn-cancel" onClick={handleClose}>
            Close
          </button>
          <button className="btn btn-save" onClick={handleUpdate}>
            Save
          </button>
        </div>
      </div>

      {/* Fullscreen Image Modal */}
      {openImage && (
        <div className="image-modal-backdrop" onClick={() => setOpenImage(null)}>
          <img src={openImage} alt="Full View" className="image-full" />
        </div>
      )}
    </div>
  );
};

export default HotelViewModal;
