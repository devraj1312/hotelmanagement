import express from "express";
import { registerOwner, loginOwner, logoutOwner, getAllOwners,uploadProfile, changePassword,
    toggleOwnerStatus, ownerDetailsById, updateOwner} from "../controllers/owner/authController.js";
import { requestOtp, verifyOtp } from '../controllers/owner/otpController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { upload, handleUploadErrors } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// Owner Signup
router.post("/register", registerOwner);
router.post('/login', loginOwner);
router.post('/logout', logoutOwner);
router.get('/fetch', getAllOwners); 
router.get('/details/:id', ownerDetailsById);
router.put(
  "/upload-profile/:id",
  upload.single("profile"),
  handleUploadErrors,
  uploadProfile
);
router.put("/update/:id", updateOwner);
router.put("/change-password", changePassword);

router.put('/toggle-status/:id', authMiddleware, toggleOwnerStatus);

// ✅ OTP endpoints
router.post('/otp/request', requestOtp);
router.post('/otp/verify', verifyOtp);


export default router;
