import React, { useState, useEffect } from "react";
import "../styles/components/uploadProfileModal.scss";
import profile from "../assets/images/admin.jpg";
import axios from "axios";
import { toast } from "react-toastify";

const UploadProfileModal = ({ show, handleClose, owner, setOwner }) => {
  const [preview, setPreview] = useState(
    owner?.owner_profile
      ? `http://localhost:5001${owner.owner_profile}`
      : profile
  );

  // ✅ Update preview whenever owner data changes
  useEffect(() => {
    setPreview(
      owner?.owner_profile
        ? `http://localhost:5001${owner.owner_profile}`
        : profile
    );
  }, [owner]);

  if (!show) return null;

  console.log("Current Owner:", owner);

  // 📤 Upload new profile
  const handleUpload = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (!owner?.owner_id) {
      toast.error("Owner ID not found.");
      return;
    }

    setPreview(URL.createObjectURL(selectedFile));

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("Authentication token missing.");
        return;
      }

      const formData = new FormData();
      formData.append("profile", selectedFile);

      const res = await axios.put(
        `http://localhost:5001/api/owner/upload-profile/${owner.owner_id}`,
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

      setOwner(res.data.owner);
      setPreview(
          res.data.owner?.owner_profile
            ? `http://localhost:5001${res.data.owner.owner_profile}`
            : profile
        );
    } catch (err) {
      console.error("❌ Upload profile error:", err);
      toast.error(err.response?.data?.message || "Failed to upload profile.");
    }
  };

  // ❌ Remove profile
  const handleRemove = async () => {
    if (!owner?.owner_id) {
      toast.error("Owner ID not found.");
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("Authentication token missing.");
        return;
      }

      const res = await axios.put(
        `http://localhost:5001/api/owner/upload-profile/${owner.owner_id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      toast.success(res.data.message || "Profile removed successfully.");
      setOwner(res.data.owner);
      setPreview(profile);
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
