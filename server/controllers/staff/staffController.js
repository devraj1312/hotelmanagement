import { getExistingStaff, addStaffToHotel, getAllStaffsFromHotel, getHotelByOwner,
  updateStaffInHotel, toggleStaffStatusInDB } from "../../models/Staff.js";
import { isValidEmail, isValidPhone } from '../../utils/validators.js';
import bcrypt from 'bcryptjs';

/**
 * Owner adds staff to their hotel
 */
export const addStaff = async (req, res) => {
  try {
    const { ownerId } = req.params;
    console.log("Owner ID:", ownerId);
    const { name, phone, email, role, password, address } = req.body;

    // ✅ Validation checks
    if (!name || !phone || !email || !password || !address) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (!isValidPhone(phone)) {
      return res.status(400).json({ message: "Phone must be 10 digits" });
    }

    // 🔹 Check if staff already exists
    const existingStaff = await getExistingStaff({ email, phone });
    if (existingStaff) {
      if (existingStaff.staff_email === email) {
        return res.status(400).json({ message: "Email already exists" });
      }
      if (existingStaff.staff_phone === phone) {
        return res.status(400).json({ message: "Phone number already exists" });
      }
    }

    // 🔐 Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 🔹 Fetch hotel of this owner
    const hotel = await getHotelByOwner(ownerId);
    if (!hotel) {
      return res.status(400).json({ message: "Owner has no hotel" });
    }

    const hotel_id = hotel.hotel_id; 

    const staff_id = await addStaffToHotel({
      staff_name: name,
      staff_phone: phone,
      staff_email: email,
      staff_role: role,
      staff_address: address,
      staff_password: hashedPassword,
      hotel_id,
    });

    // ✅ Return response
    return res.status(201).json({
      message: "Staff added successfully",
      staff_id,
    });
    

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
    const staffs = await getAllStaffsFromHotel(); // Fetch all staff records

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
    const { name, phone, email, role, address } = req.body;

    // ✅ Validation checks
    if (!name || !phone || !email || !role || !address) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (!isValidPhone(phone)) {
      return res.status(400).json({ message: "Phone must be 10 digits" });
    }

    // ✅ Check if another staff member already has same email or phone
    const existingStaff = await getExistingStaff({ email, phone, excludeId: id });

    if (existingStaff) {
      if (existingStaff.staff_phone === phone) {
        return res.status(400).json({ message: "Phone number already exists" });
      }
      if (existingStaff.staff_email === email) {
        return res.status(400).json({ message: "Email already exists" });
      }
    }

    // 🔄 Update staff in DB
    await updateStaffInHotel(id, {
      staff_name: name,
      staff_phone: phone,
      staff_email: email,
      staff_role: role,
      staff_address: address,
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