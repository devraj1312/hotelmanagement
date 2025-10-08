import { addStaffToHotel, getAllStaffsFromHotel, updateStaffInHotel } from "../../models/Staff.js";
import { isValidEmail, isValidPhone } from '../../utils/validators.js';
import bcrypt from 'bcryptjs';

/**
 * Owner adds staff to their hotel
 */
export const addStaff = async (req, res) => {
  try {
    const { name, phone, email, role, password } = req.body;

    // ✅ Validation checks
    if (!name || !phone || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (!isValidPhone(phone)) {
      return res.status(400).json({ message: "Phone must be 10 digits" });
    }

    // 🔐 Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 📝 Insert staff into DB
    console.log("Adding staff:", { name, phone, email, role });

    const staff_id = await addStaffToHotel({
      staff_name: name,
      staff_phone: phone,
      staff_email: email,
      staff_role: role,
      staff_password: hashedPassword,
    });

    console.log("Staff added successfully:", { staff_id, name, phone, email, role });

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
    const { name, phone, email, role } = req.body;

    // ✅ Validation checks
    if (!name || !phone || !email || !role) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (!isValidPhone(phone)) {
      return res.status(400).json({ message: "Phone must be 10 digits" });
    }

    // 🔄 Update staff in DB
    await updateStaffInHotel(id, {
      staff_name: name,
      staff_phone: phone,
      staff_email: email,
      staff_role: role,
    });

    return res.status(200).json({ message: "Staff updated successfully" });

  } catch (err) {
    console.error("Update staff error:", err.message || err);
    return res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
