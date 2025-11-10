import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/addHotelModal.scss";

const AddHotelModal = ({ show, handleClose, owner, hasHotel, existingHotel, onHotelChange }) => {
  const [hotelData, setHotelData] = useState({
    ownerId: "",
    hotelName: "",
    hotelAddress: "",
    hotelEmail: "",
    hotelLicenseNo: "",
    hotelPhone: "",
  });

  const [hotelImage, setHotelImage] = useState(null);
  const [hotelLicenseDoc, setHotelLicenseDoc] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Populate modal fields when opened
  useEffect(() => {
    if (!show) return;

    if (owner) {
      setHotelData((prev) => ({
        ...prev,
        ownerId: owner.owner_id || "",
      }));
    }

    if (hasHotel && existingHotel) {
      setHotelData({
        ownerId: existingHotel.owner_id,
        hotelName: existingHotel.hotel_name,
        hotelAddress: existingHotel.hotel_address,
        hotelEmail: existingHotel.hotel_email,
        hotelLicenseNo: existingHotel.hotel_license_no,
        hotelPhone: existingHotel.hotel_phone,
      });
    } else {
      // Reset fields in Add mode
      setHotelData((prev) => ({
        ...prev,
        hotelName: "",
        hotelAddress: "",
        hotelEmail: "",
        hotelLicenseNo: "",
        hotelPhone: "",
      }));
      setHotelImage(null);
      setHotelLicenseDoc(null);
    }
  }, [show, owner, hasHotel, existingHotel]);

  if (!show) return null;

  const handleChange = (e) => {
    setHotelData({ ...hotelData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => setHotelImage(e.target.files[0]);
  const handleDocChange = (e) => setHotelLicenseDoc(e.target.files[0]);

  const handleSubmit = async () => {
    const { hotelName, hotelEmail, hotelPhone, hotelAddress } = hotelData;

    if (!hotelName || !hotelEmail || !hotelPhone || !hotelAddress) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      let response;

      if (hasHotel) {
        // ✅ Update Mode with optional Image Upload
        const formData = new FormData();
        formData.append("hotelName", hotelData.hotelName);
        formData.append("hotelEmail", hotelData.hotelEmail);
        formData.append("hotelPhone", hotelData.hotelPhone);
        formData.append("hotelAddress", hotelData.hotelAddress);
        if (hotelImage) formData.append("hotelImage", hotelImage);

        response = await axios.put(
          `http://localhost:5001/api/hotel/update/${hotelData.ownerId}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        toast.success("Hotel updated successfully!");
      } else {
        // ✅ Add mode -> requires License document
        if (!hotelLicenseDoc) {
          toast.error("Please upload a Hotel License");
          setLoading(false);
          return;
        }

        const formData = new FormData();
        Object.keys(hotelData).forEach((key) => {
          formData.append(key, hotelData[key]);
        });

        if (hotelImage) formData.append("hotelImage", hotelImage);
        formData.append("hotelLicenseDoc", hotelLicenseDoc);

        response = await axios.post(
          "http://localhost:5001/api/hotel/register",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        toast.success("Hotel registered successfully!");
      }

      if (onHotelChange) onHotelChange();
      setTimeout(() => handleClose(), 1000);
    } catch (error) {
      console.error("❌ Error submitting hotel:", error);
      toast.error(error.response?.data?.message || "Failed to process hotel.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="custom-modal-backdrop">
      <div className="hotel-modal">
        <div className="modal-header">
          <h4>{hasHotel ? "Update Hotel" : "Add Hotel"}</h4>
        </div>

        <div className="modal-body">
          {/* Owner ID readonly */}
          <div className="form-group mb-2">
            <label>Owner ID</label>
            <input
              type="text"
              className="form-control"
              name="ownerId"
              value={hotelData.ownerId}
              readOnly
            />
          </div>

          {["hotelName", "hotelEmail", "hotelPhone"].map((field) => (
            <div className="form-group mb-2" key={field}>
              <label>{field === "hotelName" ? "Hotel Name" : field === "hotelEmail" ? "Hotel Email" : "Hotel Phone"}</label>
              <input
                type={field === "hotelEmail" ? "email" : "text"}
                className="form-control"
                name={field}
                value={hotelData[field]}
                onChange={handleChange}
              />
            </div>
          ))}

          <div className="form-group mb-2">
            <label>Hotel Address</label>
            <textarea
              className="form-control"
              name="hotelAddress"
              rows="3"
              value={hotelData.hotelAddress}
              onChange={handleChange}
            />
          </div>

          {/* Only visible in Add mode */}
          {!hasHotel && (
            <>
              <div className="form-group mb-2">
                <label>Hotel License No.</label>
                <input
                  type="text"
                  className="form-control"
                  name="hotelLicenseNo"
                  value={hotelData.hotelLicenseNo}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group mb-2">
                <label>Hotel License Document</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  className="form-control"
                  onChange={handleDocChange}
                />
                {hotelLicenseDoc && (
                  <div className="mt-2">
                    {hotelLicenseDoc.type.startsWith("image/") ? (
                      <img
                        src={URL.createObjectURL(hotelLicenseDoc)}
                        alt="License Preview"
                        style={{ width: "100px", height: "100px", borderRadius: "8px", objectFit: "cover" }}
                      />
                    ) : (
                      <p>Selected File: <strong>{hotelLicenseDoc.name}</strong></p>
                    )}
                  </div>
                )}
              </div>
            </>
          )}

          {/* ✅ Image upload visible in both modes */}
          <div className="form-group mb-2">
            <label>Hotel Image {hasHotel && <small>(optional)</small>}</label>
            <input
              type="file"
              accept="image/*"
              className="form-control"
              onChange={handleImageChange}
            />
            {hotelImage && (
              <div className="mt-2">
                <img
                  src={URL.createObjectURL(hotelImage)}
                  alt="Hotel Preview"
                  style={{ width: "100px", height: "100px", borderRadius: "8px", objectFit: "cover" }}
                />
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-cancel" onClick={handleClose} disabled={loading}>
            Cancel
          </button>
          <button className="btn btn-add" onClick={handleSubmit} disabled={loading}>
            {loading ? "Processing..." : hasHotel ? "Update" : "Add"}
          </button>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default AddHotelModal;
