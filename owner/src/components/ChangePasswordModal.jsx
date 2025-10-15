import { useState, useEffect } from "react";
import "../styles/components/profileModal.scss";
import axios from "axios";
import { toast } from "react-toastify";
import { Button } from "react-bootstrap";

const API_BASE = "http://localhost:5001/api/owner";

const ChangePasswordModal = ({ show, handleClose }) => {
  const [step, setStep] = useState(1); // 1: phone | 2: verify OTP | 3: new password
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [cooldown, setCooldown] = useState(0);

  // Countdown for resend OTP
  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  if (!show) return null;

  // Step 1 → Request OTP
  const handleSendOtp = async () => {
    if (!phone) return toast.error("Please enter your phone number.");
    try {
      const res = await axios.post(`${API_BASE}/otp/request`, { phone });
      toast.success(`OTP generated: ${res.data.devOtp}`, { autoClose: 2500 });
      setCooldown(60);
      setStep(2);
    } catch (err) {
      console.error("OTP request error:", err);
      toast.error(err.response?.data?.message || "Failed to send OTP.");
    }
  };

  // Step 2 → Verify OTP
  const handleVerifyOtp = async () => {
    if (!otp) return toast.error("Please enter the OTP.");
    try {
      const res = await axios.post(`${API_BASE}/otp/verify`, { phone, otp });
      toast.success(res.data.message || "OTP verified successfully!");
      setStep(3);
    } catch (err) {
      console.error("OTP verify error:", err);
      toast.error(err.response?.data?.message || "Invalid OTP.");
    }
  };

  // Step 3 → Change Password
  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword)
      return toast.error("Both password fields are required.");
    if (newPassword !== confirmPassword)
      return toast.error("Passwords do not match.");

    try {
      const res = await axios.put(`${API_BASE}/change-password`, {
        phone,
        newPassword,
      });
      toast.success(res.data.message || "Password changed successfully!");

      // Reset state
      setStep(1);
      setPhone("");
      setOtp("");
      setNewPassword("");
      setConfirmPassword("");
      setCooldown(0);
      handleClose();
    } catch (err) {
      console.error("Password change error:", err);
      toast.error(err.response?.data?.message || "Failed to change password.");
    }
  };

  return (
    <div className="custom-modal-backdrop">
      <div className="custom-modal change-password-modal">
        <div className="modal-header">
          <h5>Change Password</h5>
        </div>

        <div className="modal-body">
          {/* Step 1 — Enter Phone */}
          {step === 1 && (
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, "");
                  if (digits.length <= 10) setPhone(digits);
                }}
                maxLength={10}
              />
              <Button
                variant="primary"
                className="mt-2"
                onClick={handleSendOtp}
                disabled={cooldown > 0}
              >
                {cooldown > 0 ? `Resend in ${cooldown}s` : "Send OTP"}
              </Button>
            </div>
          )}

          {/* Step 2 — Enter OTP */}
          {step === 2 && (
            <div className="form-group">
              <label>Enter OTP</label>
              <input
                type="text"
                placeholder="4-digit code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
              />
              <Button
                variant="primary"
                className="mt-2"
                onClick={handleVerifyOtp}
              >
                Verify OTP
              </Button>
            </div>
          )}

          {/* Step 3 — New Password */}
          {step === 3 && (
            <>
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <Button
                variant="success"
                className="mt-2"
                onClick={handleChangePassword}
              >
                Change Password
              </Button>
            </>
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

export default ChangePasswordModal;
