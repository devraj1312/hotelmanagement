import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/register.scss";

const Register = ({ isUpdate = false, owner = null, handleClose = null, setOwner = () => {} }) => {
  const [ownerData, setOwnerData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
  });

  // Pre-fill when updating
  useEffect(() => {
    if (isUpdate && owner) {
      setOwnerData({
        name: owner.owner_name || "",
        email: owner.owner_email || "",
        phone: owner.owner_phone || "",
        address: owner.owner_address || "",
        password: "",
      });
    }
  }, [isUpdate, owner]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOwnerData({ ...ownerData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("accessToken");

      if (isUpdate) {
        const res = await axios.put(
          `http://localhost:5001/api/owner/update/${owner.owner_id}`,
          {
            owner_name: ownerData.name,
            owner_email: ownerData.email,
            owner_phone: ownerData.phone,
            owner_address: ownerData.address,
          },
          {
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );

        toast.success("Owner details updated successfully!");
        setOwner(res.data.updatedOwner);
        setTimeout(() => handleClose && handleClose(), 1500);
      } else {
        const res = await axios.post(
          "http://localhost:5001/api/owner/register",
          ownerData,
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );

        toast.success("Owner registered successfully!");
        if (res.data.token) {
          localStorage.setItem("accessToken", res.data.token);
          jwtDecode(res.data.token);
        }
        setTimeout(() => (window.location.href = "/login"), 2000);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
      console.error("❌ Owner Request Error:", err);
    }
  };

  return (
    <div className="custom-modal-backdrop">
      <div className="hotel-modal">
        <div className="modal-header">
          <h4>{isUpdate ? "Update Owner Details" : "Owner Registration"}</h4>
        </div>

        <div className="modal-body">
          {/* Owner Name */}
          <div className="form-group mb-2">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={ownerData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Owner Email */}
          <div className="form-group mb-2">
            <label>Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={ownerData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Owner Phone */}
          <div className="form-group mb-2">
            <label>Phone</label>
            <input
              type="tel"
              name="phone"
              className="form-control"
              value={ownerData.phone}
              onChange={handleChange}
              required
            />
          </div>

          {/* Owner Address */}
          <div className="form-group mb-2">
            <label>Address</label>
            <textarea
              name="address"
              className="form-control"
              rows="3"
              value={ownerData.address}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password field only in Register mode */}
          {!isUpdate && (
            <div className="form-group mb-2">
              <label>Password</label>
              <input
                type="password"
                name="password"
                className="form-control"
                value={ownerData.password}
                onChange={handleChange}
                required
              />
            </div>
          )}
        </div>

        <div className="modal-footer">
          {isUpdate && (
            <button className="btn btn-cancel" onClick={handleClose}>
              Cancel
            </button>
          )}
          <button
            className={`btn btn-add ${isUpdate ? "update" : "register"}`}
            onClick={handleSubmit}
          >
            {isUpdate ? "Update" : "Register"}
          </button>
        </div>

        {!isUpdate && (
          <p className="back-login" style={{ textAlign: "center", marginTop: "10px" }}>
            Already registered?{" "}
            <span style={{ cursor: "pointer", color: "#00bfa6" }} onClick={() => (window.location.href = "/login")}>
              Login
            </span>
          </p>
        )}
      </div>
    </div>
  );

};

export default Register;
