// src/components/Hotel/HotelModal.jsx
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; 
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/addHotelModal.scss";

const AddHotelModal = ({ show, handleClose }) => {
  const [hotelData, setHotelData] = useState({
    ownerId: "", 
    hotelName: "",
    hotelAddress: "",
    hotelEmail: "",
    hotelLicenseNo: "",
    hotelPhone: "" 
  });

  const [hotelImage, setHotelImage] = useState(null);
  const [hotelLicenseDoc, setHotelLicenseDoc] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show) {
      const token = localStorage.getItem("accessToken");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          setHotelData((prev) => ({
            ...prev,
            ownerId: decoded.id, 
          }));
        } catch (err) {
          console.error("Invalid token:", err);
        }
      }
    } else {
      setHotelData({
        ownerId: "",
        hotelName: "",
        hotelAddress: "",
        hotelEmail: "",
        hotelLicenseNo: "",
        hotelPhone: ""
      });
      setHotelImage(null);
      setHotelLicenseDoc(null);
    }
  }, [show]);

  if (!show) return null;

  const handleChange = (e) => {
    setHotelData({ ...hotelData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setHotelImage(e.target.files[0]);
  };

  const handleDocChange = (e) => {
    setHotelLicenseDoc(e.target.files[0]);
  };

  const handleSubmit = async () => {
    // ✅ Required field validation
    const { hotelName, hotelEmail, hotelLicenseNo, hotelPhone, hotelAddress } = hotelData;

    if (!hotelName || !hotelEmail || !hotelLicenseNo || !hotelPhone || !hotelAddress) {
        toast.error("Please fill all required fields");
        return;
    }

    if (!hotelLicenseDoc) {
        toast.error("Please upload a Hotel License");
        return;
    }
    try {
      setLoading(true);

      const formData = new FormData();
      Object.keys(hotelData).forEach((key) => {
        formData.append(key, hotelData[key]);
      });

      if (hotelImage) formData.append("hotelImage", hotelImage);
      if (hotelLicenseDoc) formData.append("hotelLicenseDoc", hotelLicenseDoc);

      const response = await axios.post(
        "http://localhost:5001/api/hotel/register",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      toast.success(`Hotel registered successfully! ID: ${response.data.hotel_id}`);
    //   setTimeout(() => handleClose(), 200); 
    } catch (error) {
      console.error("Error submitting hotel:", error);
      toast.error(`${error.response?.data?.message || "Failed to register hotel"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="custom-modal-backdrop">
        <div className="hotel-modal">
          <div className="modal-header">
            <h4>Add Hotel</h4>
          </div>
          <div className="modal-body">
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

            {[
              { name: "hotelName", label: "Hotel Name" },
              { name: "hotelEmail", label: "Hotel Email", type: "email" },
              { name: "hotelPhone", label: "Hotel Phone", type: "text" },
              { name: "hotelLicenseNo", label: "Hotel License No." },
            ].map((field) => (
              <div className="form-group mb-2" key={field.name}>
                <label>{field.label}</label>
                <input
                  type={field.type || "text"}
                  className="form-control"
                  name={field.name}
                  value={hotelData[field.name]}
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

            <div className="form-group mb-2">
              <label>Hotel Image</label>
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
              {loading ? "Adding..." : "Add"}
            </button>
          </div>
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
      
  );
};

export default AddHotelModal;
