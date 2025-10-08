import { useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/register.scss";

const Register = () => {
  const [step, setStep] = useState(1); // 👈 Step control: 1 = Owner Info, 2 = Hotel Info
  const [ownerData, setOwnerData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
  });
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

  // ✅ Handle Owner Input Change
  const handleOwnerChange = (e) => {
    const { name, value } = e.target;
    setOwnerData({ ...ownerData, [name]: value });
  };

  // ✅ Handle Hotel Input Change
  const handleHotelChange = (e) => {
    const { name, value } = e.target;
    setHotelData({ ...hotelData, [name]: value });
  };

  // ✅ Handle Owner Registration (Step 1)
  const handleNext = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5001/api/owner/register", ownerData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (res.status === 201 || res.status === 200) {
        toast.success("Owner registered successfully! Continue to add your hotel.");

        // Store token (optional)
        if (res.data.token) {
          localStorage.setItem("accessToken", res.data.token);
          const decoded = jwtDecode(res.data.token);
          setHotelData((prev) => ({ ...prev, ownerId: decoded.id }));
        }

        // Go to Step 2
        setStep(2);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Owner registration failed");
      console.error("❌ Owner Registration Error:", err);
    }
  };

  // ✅ Handle Hotel Image / Doc Uploads
  const handleImageChange = (e) => setHotelImage(e.target.files[0]);
  const handleDocChange = (e) => setHotelLicenseDoc(e.target.files[0]);

  // ✅ Handle Hotel Submission (Step 2)
  const handleHotelSubmit = async (e) => {
    e.preventDefault();

    const { hotelName, hotelEmail, hotelLicenseNo, hotelPhone, hotelAddress } = hotelData;
    if (!hotelName || !hotelEmail || !hotelLicenseNo || !hotelPhone || !hotelAddress) {
      toast.error("Please fill all required fields");
      return;
    }
    if (!hotelLicenseDoc) {
      toast.error("Please upload a hotel license");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      Object.keys(hotelData).forEach((key) => formData.append(key, hotelData[key]));
      if (hotelImage) formData.append("hotelImage", hotelImage);
      if (hotelLicenseDoc) formData.append("hotelLicenseDoc", hotelLicenseDoc);

      const res = await axios.post("http://localhost:5001/api/hotel/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(`Hotel registered successfully! ID: ${res.data.hotel_id}`);
      setTimeout(() => (window.location.href = "/login"), 2000);
    } catch (error) {
      console.error("Error submitting hotel:", error);
      toast.error(error.response?.data?.message || "Failed to register hotel");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        {step === 1 ? (
          <>
            <h2>Step 1: Owner Registration</h2>
            <form onSubmit={handleNext} autoComplete="off">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={ownerData.name}
                  onChange={handleOwnerChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={ownerData.email}
                  onChange={handleOwnerChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={ownerData.phone}
                  onChange={handleOwnerChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Address</label>
                <textarea
                  name="address"
                  value={ownerData.address}
                  onChange={handleOwnerChange}
                  required
                ></textarea>
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={ownerData.password}
                  onChange={handleOwnerChange}
                  autoComplete="new-password"
                  required
                />
              </div>

              <button type="submit" className="register-btn">
                Next
              </button>
            </form>

            <p className="back-login">
              Already registered?{" "}
              <span onClick={() => (window.location.href = "/login")}>Login</span>
            </p>
          </>
        ) : (
          <>
            <h2>Step 2: Add Hotel Details</h2>
            <form onSubmit={handleHotelSubmit} autoComplete="off">
              <div className="form-group">
                <label>Owner ID</label>
                <input
                  type="text"
                  name="ownerId"
                  value={hotelData.ownerId}
                  readOnly
                />
              </div>

              <div className="form-group">
                <label>Hotel Name</label>
                <input
                  type="text"
                  name="hotelName"
                  value={hotelData.hotelName}
                  onChange={handleHotelChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Hotel Email</label>
                <input
                  type="email"
                  name="hotelEmail"
                  value={hotelData.hotelEmail}
                  onChange={handleHotelChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Hotel Phone</label>
                <input
                  type="text"
                  name="hotelPhone"
                  value={hotelData.hotelPhone}
                  onChange={handleHotelChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Hotel License No.</label>
                <input
                  type="text"
                  name="hotelLicenseNo"
                  value={hotelData.hotelLicenseNo}
                  onChange={handleHotelChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Hotel Address</label>
                <textarea
                  name="hotelAddress"
                  rows="3"
                  value={hotelData.hotelAddress}
                  onChange={handleHotelChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Hotel License Document</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={handleDocChange}
                  required
                />
                {hotelLicenseDoc && (
                  <p className="file-preview">Selected: {hotelLicenseDoc.name}</p>
                )}
              </div>

              <div className="form-group">
                <label>Hotel Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {hotelImage && (
                  <img
                    src={URL.createObjectURL(hotelImage)}
                    alt="Hotel Preview"
                    className="hotel-preview"
                  />
                )}
              </div>

              <div className="form-buttons">
                <button
                  type="button"
                  className="btn-back"
                  onClick={() => setStep(1)}
                  disabled={loading}
                >
                  Back
                </button>
                <button type="submit" className="btn-next" disabled={loading}>
                  {loading ? "Saving..." : "Submit"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Register;
