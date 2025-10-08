// server/routes/hotelRoutes.js
import express from "express";
import {
  registerHotel,
  fetchAllHotels,
  updateSubscriptionDB,
//   removeHotel,
//   updateHotelStatus,
} from "../controllers/hotel/hotelController.js";
import { upload } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// 🔹 Routes
router.post(
  "/register",
  upload.fields([
    { name: "hotelImage", maxCount: 1 },   // hotel profile image
    { name: "hotelLicenseDoc", maxCount: 1 },  // hotel document (pdf/image)
  ]),
  registerHotel
);
router.get("/fetch-hotels", fetchAllHotels);
router.put("/updateSubscription/:hotel_id", updateSubscriptionDB);
// router.get("/:id", fetchHotelById);
// router.delete("/:id", removeHotel);
// router.put("/toggle-status/:id", updateHotelStatus);

export default router;
