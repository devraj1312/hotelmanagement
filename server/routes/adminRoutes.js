// routes/adminRoutes.js
import express from 'express';
import { 
    loginAdmin, logoutAdmin, getAllAdmins, toggleAdminStatus, changePassword,
    adminDetailsById, registerAdmin, uploadProfile,updateAdmin
// refreshToken, deleteAdmin
} from '../controllers/admin/authController.js';
import { requestOtp, verifyOtp } from '../controllers/admin/otpController.js';
// import { authMiddleware } from '../middlewares/authMiddleware.js';
import { upload, handleUploadErrors } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.post('/register', registerAdmin); 
router.post('/login', loginAdmin);
router.post('/logout', logoutAdmin);

router.get('/fetch', getAllAdmins);
// router.post('/refresh', refreshToken);
router.get('/details/:id', adminDetailsById);
// router.delete('/delete/:id', deleteAdmin);
// Upload profile route
router.put(
  "/upload-profile/:id",
  upload.single("profile"),
  handleUploadErrors,
  uploadProfile
);

router.put('/update/:id', updateAdmin);
router.put('/toggle-status/:id', toggleAdminStatus);
// router.put('/toggle-status/:id', authMiddleware, toggleAdminStatus);
router.put("/change-password", changePassword);

// ✅ OTP endpoints
router.post('/otp/request', requestOtp);
router.post('/otp/verify', verifyOtp);


export default router;


// router.post('/register', upload.single('profile'), registerAdmin); // Public
// router.post('/login', loginAdmin); // Public
// router.post('/refresh', refreshToken); // Public

// router.post('/logout', authMiddleware, logoutAdmin); // Protected
// router.get('/fetch', authMiddleware, getAllAdmins); // Protected
// router.get('/details/:id', authMiddleware, adminDetailsById); // Protected
// router.delete('/delete/:id', authMiddleware, deleteAdmin); // Protected
// router.put('/update/:id', authMiddleware, upload.single('profile'), updateAdmin); // Protected
// router.put('/toggle-status/:id', authMiddleware, toggleAdminStatus); // Protected
// router.put('/change-password/:id', authMiddleware, changePassword); // Protected