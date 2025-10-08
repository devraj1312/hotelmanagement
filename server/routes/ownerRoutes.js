import express from "express";
import { registerOwner, loginOwner, logoutOwner, getAllOwners,
    toggleOwnerStatus, ownerDetailsById, } from "../controllers/owner/authController.js";
// import { upload } from '../middlewares/uploadMiddleware.js';
import { requestOtp, verifyOtp } from '../controllers/owner/otpController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Owner Signup
router.post("/register", registerOwner);
router.post('/login', loginOwner);
router.post('/logout', logoutOwner);
router.get('/fetch', getAllOwners);
router.get('/details/:id', authMiddleware, ownerDetailsById);
router.put('/toggle-status/:id', authMiddleware, toggleOwnerStatus);

// ✅ OTP endpoints
router.post('/otp/request', requestOtp);
router.post('/otp/verify', verifyOtp);


export default router;
