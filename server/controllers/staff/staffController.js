import { getExistingStaff, addStaffToHotel, getAllStaffsFromHotel, getHotelByOwner,
  updateStaffInHotel, toggleStaffStatusInDB, getStaffById } from "../../models/Staff.js";
import { isValidEmail, isValidPhone } from '../../utils/validators.js';
// import bcrypt from 'bcryptjs';
import { generateAccessToken, generateRefreshToken } from '../../utils/tokenUtils.js';
import { saveRefreshToken, deleteRefreshToken } from '../../models/refreshTokenModel.js';
import { hashPassword, comparePassword } from '../../utils/passwordUtils.js';

/**
 * Login Staff
 */
export const loginStaff = async (req, res) => {
  try {
    const { staff_id, staff_password } = req.body;

    console.log('➡️ Login attempt for staff_id:', staff_id);

    // lookup staff by staff_id
    const staff = await getExistingStaff({ staff_id, staff_email: "", staff_phone: "" });
    console.log('✅ Staff lookup result:', staff);

    if (!staff) {
      console.error('❌ Staff not found');
      return res.status(404).json({ message: 'Staff not found' });
    }

    if (!staff.staff_status) {
      console.error('❌ Staff account is deactivated:', staff.staff_id);
      return res.status(403).json({ message: 'Your account is deactivated. Contact Owner.' });
    }

     // Check Hotel ID
    if (!staff.hotel_id) {
      return res.status(403).json({ message: "Your account is not associated with any hotel." });
    }

    console.log('➡️ Checking password...');
    const isMatch = await comparePassword(staff_password, staff.staff_password);
    if (!isMatch) {
      console.error('❌ Invalid password for staff:', staff.staff_id);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('➡️ Generating tokens...');
    const accessToken = generateAccessToken({ id: staff.staff_id, role: staff.staff_role, hotel: staff.hotel_id });
    const refreshToken = generateRefreshToken({ id: staff.staff_id, role: staff.staff_role, hotel: staff.hotel_id });

    // Save refresh token in DB
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days expiry
    await saveRefreshToken(staff.staff_id, refreshToken, expiresAt);

    // Set refresh token in cookie
    res.cookie('staffRefreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
    });

    console.log('✅ Staff logged in successfully:', staff.staff_id);

    return res.json({ accessToken });
  } catch (error) {
    console.error('❌ Staff Login Error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ========================
// Logout Staff
// ========================
export const logoutStaff = async (req, res) => {
  try {
    const refreshToken = req.cookies.staffRefreshToken;

    if (refreshToken) {
      await deleteRefreshToken(refreshToken);
    }

    // Clear cookie
    res.clearCookie("staffRefreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: 'Strict'
    });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("❌ Logout Error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
/**
 * Owner adds staff to their hotel
 */
export const addStaff = async (req, res) => {
  try {
    const { ownerId } = req.params;
    const {
      staff_name,
      staff_phone,
      staff_email,
      staff_role,
      staff_password,
      staff_address,
    } = req.body;

    // ✅ Validation checks
    if (!staff_name || !staff_phone || !staff_email || !staff_role || !staff_password || !staff_address) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!isValidEmail(staff_email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (!isValidPhone(staff_phone)) {
      return res.status(400).json({ message: "Phone must be 10 digits" });
    }

    // 🔹 Check if staff already exists
    const existingStaff = await getExistingStaff({ staff_email, staff_phone });
    if (existingStaff) {
      if (existingStaff.staff_email === staff_email) {
        return res.status(400).json({ message: "Email already exists" });
      }
      if (existingStaff.staff_phone === staff_phone) {
        return res.status(400).json({ message: "Phone number already exists" });
      }
    }

    // 🔐 Hash the password
    const hashedPassword = await hashPassword(staff_password);

    // 🔹 Fetch hotel of this owner
    const hotel = await getHotelByOwner(ownerId);
    if (!hotel) {
      return res.status(400).json({ message: "Owner has no hotel" });
    }

    const hotel_id = hotel.hotel_id;

    const staff_id = await addStaffToHotel({
      staff_name,
      staff_phone,
      staff_email,
      staff_role,
      staff_address,
      staff_password: hashedPassword,
      hotel_id,
    });

    return res.status(201).json({ message: "Staff added successfully", staff_id });
  } catch (err) {
    console.error("Add staff error:", err.message || err);
    return res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

/**
 * Get all staff from hotel
 */
export const fetchStaffs = async (req, res) => {
  try {
    const { ownerId } = req.params;
    // 🔹 Fetch hotel of this owner
    const hotel = await getHotelByOwner(ownerId);
    if (!hotel) {
      return res.status(400).json({ message: "Owner has no hotel" });
    }

    const hotel_id = hotel.hotel_id;

    // Fetch staff with this hotel_id
    const staffs = await getAllStaffsFromHotel(hotel_id);

    return res.status(200).json(staffs);

  } catch (err) {
    console.error("Fetch staffs error:", err.message || err);
    return res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

/**
 * Update staff information
 */
export const updateStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const { staff_name, staff_phone, staff_email, staff_role, staff_address } = req.body;

    // ✅ Validation checks
    if (!staff_name || !staff_phone || !staff_email || !staff_role || !staff_address) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!isValidEmail(staff_email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (!isValidPhone(staff_phone)) {
      return res.status(400).json({ message: "Phone must be 10 digits" });
    }

    // ✅ Check if another staff member already has same email or phone
    const existingStaff = await getExistingStaff({ staff_email, staff_phone, excludeId: id });

    if (existingStaff) {
      if (existingStaff.staff_phone === staff_phone) {
        return res.status(400).json({ message: "Phone number already exists" });
      }
      if (existingStaff.staff_email === staff_email) {
        return res.status(400).json({ message: "Email already exists" });
      }
    }

    // 🔄 Update staff in DB
    await updateStaffInHotel(id, {
      staff_name,
      staff_phone,
      staff_email,
      staff_role,
      staff_address,
    });

    return res.status(200).json({ message: "Staff updated successfully" });
  } catch (err) {
    console.error("Update staff error:", err.message || err);
    return res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

// ========================
// Toggle Staff Status
// ========================
export const toggleStaffStatus = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedStaff = await toggleStaffStatusInDB(id);

    if (!updatedStaff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    res.json({
      message: `Staff status updated to ${updatedStaff.staff_status ? "Active" : "Inactive"}`,
      status: updatedStaff.staff_status
    });
  } catch (err) {
    res.status(500).json({ message: "Error updating status", error: err.message });
  }
};

// ========================
// Get Current Staff
// ========================
export const staffDetailsById = async (req, res) => {
  try {
    const { id } = req.params;
    const staff = await getStaffById(id);

    if (!staff) return res.status(404).json({ message: 'Staff not found' });

    res.json(staff);
  } catch (error) {
    console.error('❌ StaffDetailsById Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};