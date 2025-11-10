import express from "express";
import { addStaff, fetchStaffs, updateStaff, toggleStaffStatus, loginStaff, logoutStaff,
staffDetailsById } from "../controllers/staff/staffController.js";
import { requestOtp, verifyOtp } from '../controllers/staff/otpController.js';
// import { verifyOwner } from "../middlewares/authMiddleware.js";
// import { upload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

// Add staff (with optional document upload)
router.post('/login', loginStaff);
router.post("/logout", logoutStaff);
router.post("/register/:ownerId", addStaff);
router.get("/fetch/:ownerId", fetchStaffs);
router.put("/update/:id", updateStaff);
router.put('/toggle-status/:id', toggleStaffStatus);
router.get('/details/:id', staffDetailsById);

// ✅ OTP endpoints
router.post('/otp/request', requestOtp);
router.post('/otp/verify', verifyOtp);

export default router;
