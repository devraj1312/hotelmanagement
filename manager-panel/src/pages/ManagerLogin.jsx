import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import '../styles/login.scss';

const API_BASE = 'http://localhost:5001/api/staff';

const ManagerLogin = () => {
  const [mode, setMode] = useState('password'); // 'password' | 'otp'

  // password mode
  const [staffID, setStaffID] = useState('');
  const [password, setPassword] = useState('');

  // otp mode
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [cooldown, setCooldown] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    let t;
    if (cooldown > 0) {
      t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    }
    return () => clearTimeout(t);
  }, [cooldown]);

  // Password login
  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    if (!staffID || !password) {
      toast.error('Please enter Staff ID and password.');
      return;
    }
    try {
      const res = await axios.post(
        `${API_BASE}/login`,
        { staff_id: staffID, staff_password: password },
        { withCredentials: true }
      );

      toast.success('Login successful!', { autoClose: 1200 });
      localStorage.setItem('accessToken', res.data.accessToken);

      setTimeout(() => navigate('/manager/dashboard'), 600);
    } catch (err) {
      console.error('Login error:', err);
      toast.error(err.response?.data?.message || 'Failed to login', { autoClose: 1600 });
    }
  };

  // Request OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!phone) {
      toast.error('Please enter phone number.');
      return;
    }
    try {
      const res = await axios.post(
        `${API_BASE}/otp/request`,
        { phone },
        { withCredentials: true }
      );

      toast.success(`OTP generated: ${res.data.devOtp}`, { autoClose: 2500 });
      setCooldown(60);
    } catch (err) {
      console.error('OTP request error:', err);
      toast.error(err.response?.data?.message || 'Failed to generate OTP', { autoClose: 1600 });
    }
  };

  // Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!phone || !otp) {
      toast.error('Please enter phone and OTP.');
      return;
    }
    try {
      const res = await axios.post(
        `${API_BASE}/otp/verify`,
        { phone, otp },
        { withCredentials: true }
      );

      toast.success('Login successful!', { autoClose: 1200 });
      localStorage.setItem('accessToken', res.data.accessToken);
      setTimeout(() => navigate('/manager/dashboard'), 600);
    } catch (err) {
      console.error('OTP verify error:', err);
      toast.error(err.response?.data?.message || 'Invalid OTP', { autoClose: 1600 });
    }
  };

  return (
    <div className="login-page">
      <ToastContainer />
      <div className="login-card">
        <h2>Staff Login</h2>

        <div className="tab-toggle">
          <button className={mode === 'password' ? 'active' : ''} onClick={() => setMode('password')}>
            Password Login
          </button>
          <button className={mode === 'otp' ? 'active' : ''} onClick={() => setMode('otp')}>
            Login with OTP
          </button>
        </div>

        {mode === 'password' ? (
          <form onSubmit={handlePasswordLogin}>
            <div className="form-group">
              <label>Staff ID</label>
              <input type="text" placeholder="Enter Staff ID" value={staffID} onChange={(e) => setStaffID(e.target.value)} />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            <button type="submit" className="login-btn">Login</button>
          </form>
        ) : (
          <div className="otp-pane">
            <div className="form-group">
              <label>Phone</label>
              <input type="tel" placeholder="+91XXXXXXXXXX" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>

            <div className="actions-row">
              <button className="otp-btn" onClick={handleRequestOtp} disabled={cooldown > 0}>
                {cooldown > 0 ? `Resend in ${cooldown}s` : 'Send OTP'}
              </button>
            </div>

            <div className="form-group">
              <label>Enter OTP</label>
              <input type="text" placeholder="4-digit code" value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6} />
            </div>

            <button className="login-btn" onClick={handleVerifyOtp}>Verify & Login</button>
          </div>
        )}

        {/* Registration Link */}
        <div className="register-option">
          <p>New here? <span onClick={() => navigate('/register')}>Create an account</span></p>
        </div>
      </div>
    </div>
  );
};

export default ManagerLogin;
