import React, { useState, useEffect } from "react";
import "../styles/components/uploadProfileModal.scss";
import profile from "../assets/images/admin.jpg";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

const UploadProfileModal = ({ show, handleClose, admin, setAdmin }) => {
  const [preview, setPreview] = useState(
    admin?.admin_profile
      ? `http://localhost:5001${admin.admin_profile}`
      : profile
  );

  // ✅ Update preview when admin changes (prop-based)
  useEffect(() => {
    setPreview(
      admin?.admin_profile
        ? `http://localhost:5001${admin.admin_profile}`
        : profile
    );
  }, [admin]);

  if (!show) return null;

  // 📤 Upload new profile
  const handleUpload = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setPreview(URL.createObjectURL(selectedFile));

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      const decoded = jwtDecode(token);
      const adminId = decoded.id;

      const formData = new FormData();
      formData.append("profile", selectedFile);

      const res = await axios.put(
        `http://localhost:5001/api/admin/upload-profile/${adminId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      toast.success(res.data.message);

      setAdmin(res.data.admin);
      setPreview(
        res.data.admin?.admin_profile
          ? `http://localhost:5001/${res.data.admin.admin_profile}`
          : profile
      );
      

      // ✅ Refresh parent data
    // if (refreshAdmin) refreshAdmin();

    } catch (err) {
      console.error("❌ Upload profile error:", err);
      toast.error(err.response?.data?.message || "Failed to upload profile.");
    }
  };

  // ❌ Remove profile
  const handleRemove = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      const decoded = jwtDecode(token);
      const adminId = decoded.id;

      const res = await axios.put(
        `http://localhost:5001/api/admin/remove-profile/${adminId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      toast.success(res.data.message);
      setAdmin(res.data.admin);
      setPreview(profile); // fallback
      

      // if (refreshAdmin) refreshAdmin();

    } catch (err) {
      console.error("❌ Remove profile error:", err);
      toast.error(err.response?.data?.message || "Failed to remove profile.");
    }
  };

  return (
    <div className="custom-modal-backdrop">
      <div className="custom-modal">
        <div className="modal-header">
          <h5>Upload Profile</h5>
        </div>

        <div className="modal-body text-center">
          <img
            src={preview}
            alt="Profile"
            className="rounded-circle mb-4"
            width="250"
            height="250"
          />

          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="d-none"
              id="upload-input"
            />
            <label htmlFor="upload-input" className="btn btn-primary me-2">
              Upload Profile
            </label>

            <button className="btn btn-danger" onClick={handleRemove}>
              Remove Profile
            </button>
          </div>
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

export default UploadProfileModal;
