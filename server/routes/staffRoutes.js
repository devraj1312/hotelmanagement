import express from "express";
import { addStaff, fetchStaffs, updateStaff, toggleStaffStatus } from "../controllers/staff/staffController.js";
// import { verifyOwner } from "../middlewares/authMiddleware.js";
// import { upload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

// Add staff (with optional document upload)
router.post("/register/:ownerId", addStaff);
router.get("/fetch", fetchStaffs);
router.put("/update/:id", updateStaff);
router.put('/toggle-status/:id', toggleStaffStatus);

export default router;
