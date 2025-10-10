// server/controllers/hotelController.js
import {
  createHotel,
  getExistingHotel,
  getAllHotels,
  updateHotelById,
  getHotelsByOwner,
  updateHotel,
//   getHotelById,
} from "../../models/Hotel.js";

import { 
  isValidEmail, isValidPhone, isValidLicenseNo 
} from "../../utils/validators.js";

export const registerHotel = async (req, res) => {
  try {
    const {
      ownerId,
      hotelName,
      hotelEmail,
      hotelPhone,
      hotelAddress,
      hotelLicenseNo
    } = req.body;

    const hotel_image = req.files?.hotelImage ? req.files.hotelImage[0].filename : null;
    const hotel_document = req.files?.hotelLicenseDoc ? req.files.hotelLicenseDoc[0].filename : null;

    // ✅ Validation checks
    if (!isValidEmail(hotelEmail)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (!isValidPhone(hotelPhone)) {
      return res.status(400).json({ message: "Phone must be 10 digits" });
    }

    if (!isValidLicenseNo(hotelLicenseNo)) {
      return res.status(400).json({
        message: "Invalid license format (e.g., MP-UJJ-1234-456)",
      });
    }

    // 🔍 Duplicate check
    const existingHotel = await getExistingHotel({
      hotel_email: hotelEmail,
      hotel_phone: hotelPhone,
      license_no: hotelLicenseNo,
    });

    if (existingHotel) {
      if (existingHotel.hotel_email === hotelEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }
      if (existingHotel.hotel_phone === hotelPhone) {
        return res.status(400).json({ message: "Number already exists" });
      }
      if (existingHotel.license_no === hotelLicenseNo) {
        return res.status(400).json({ message: "License number already exists" });
      }
    }

    const hotel = await createHotel({
      owner_id: ownerId,
      hotel_name: hotelName,
      hotel_email: hotelEmail,
      hotel_phone: hotelPhone,
      hotel_address: hotelAddress,
      license_no: hotelLicenseNo,
      hotel_document,
      hotel_image,
    });

    return res.status(201).json({
      message: "Hotel registered successfully",
      hotel_id: hotel,
    });

  } catch (error) {
    console.error("Error registering hotel:", error.message);

    // DB-specific errors ko friendly message me map kar sakte ho agar chaho
    let message = error.message;

    return res.status(500).json({ message });
  }
};

export const fetchAllHotels = async (req, res) => {
  try {
    const hotels = await getAllHotels();
    res.status(200).json({ success: true, hotels });
  } catch (error) {
    console.error("Error fetching hotels:", error.message);
    res.status(500).json({ success: false, message: "Failed to fetch hotels" });
  }
};

// ✅ Fetch all hotels for a specific owner
export const fetchHotelsByOwner = async (req, res) => {
  try {
    const { ownerId } = req.params;

    if (!ownerId) {
      return res.status(400).json({ success: false, message: "Owner ID is required" });
    }

    const hotels = await getHotelsByOwner(ownerId);

    if (!hotels.length) {
      return res.status(200).json({
        success: true,
        message: "No hotels found for this owner",
        hotels: [],
      });
    }

    res.status(200).json({ success: true, hotels });
  } catch (error) {
    console.error("Error fetching hotels by owner:", error.message);
    res.status(500).json({ success: false, message: "Failed to fetch owner hotels" });
  }
};

// controllers/hotelController.js
export const updateHotelByOwner = async (req, res) => {
  const { ownerId } = req.params;
  const { hotelName, hotelPhone, hotelAddress, hotelEmail } = req.body;

  try {
    // ✅ Validation
    if (!hotelName || !hotelPhone || !hotelAddress || !hotelEmail) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

        // ✅ Validation checks
    if (!isValidEmail(hotelEmail)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (!isValidPhone(hotelPhone)) {
      return res.status(400).json({ message: "Phone must be 10 digits" });
    }

    // 🔍 Duplicate check
     const existingHotel = await getExistingHotel({
      hotel_email: hotelEmail,
      hotel_phone: hotelPhone,
      license_no: null,
      excludeId: ownerId,
    });

    if (existingHotel) {
      if (existingHotel.hotel_email === hotelEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }
      if (existingHotel.hotel_phone === hotelPhone) {
        return res.status(400).json({ message: "Number already exists" });
      }
    }

    // ✅ Call query function
    const updatedHotel = await updateHotel({ ownerId, hotelName, hotelPhone, hotelAddress, hotelEmail });

    if (!updatedHotel) {
      return res.status(404).json({ success: false, message: "Hotel not found for this owner" });
    }

    res.status(200).json({ success: true, hotel: updatedHotel });
  } catch (error) {
    console.error("Error updating hotel:", error);
    res.status(500).json({ success: false, message: "Failed to update hotel" });
  }
};


// export const fetchHotelById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const hotel = await getHotelById(id);
//     if (!hotel) return res.status(404).json({ success: false, message: "Hotel not found" });
//     res.status(200).json({ success: true, hotel });
//   } catch (error) {
//     console.error("Error fetching hotel:", error.message);
//     res.status(500).json({ success: false, message: "Failed to fetch hotel" });
//   }
// };

export const updateSubscriptionDB = async (req, res) => {
  try {
    const { hotel_id } = req.params;
    const { subscription } = req.body;

    // 🔄 Update query
    const updatedHotel = await updateHotelById(hotel_id, subscription);

    if (!updatedHotel) {
      return res.status(404).json({
        success: false,
        message: "Hotel not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Subscription updated successfully",
      hotel: updatedHotel,
    });
  } catch (error) {
    console.error("❌ Error updating subscription:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to update subscription",
    });
  }
};

