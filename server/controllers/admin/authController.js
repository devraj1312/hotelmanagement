// controllers/admin/authController.js
import { 
  getExistingAdmin, createAdmin,
  getAllAdminsFromDB, toggleAdminStatusInDB, getAdminById,
  findAdminByPhone, updateAdminPasswordByPhone, updateAdminProfile, updateAdminInDB,
  
// findRefreshToken, , removeAdmin
 } from '../../models/Admin.js';

import { hashPassword, comparePassword } from '../../utils/passwordUtils.js';
import { saveRefreshToken, deleteRefreshToken} from '../../models/refreshTokenModel.js';

import { 
  generateAccessToken, generateRefreshToken 
} from '../../utils/tokenUtils.js';

import { 
  isValidEmail, isValidPhone, isValidPassword 
} from "../../utils/validators.js";

import bcrypt from "bcryptjs";


// ========================
// Login Admin
// ========================
export const loginAdmin = async (req, res) => {
  try {
    const { admin_id, admin_password } = req.body;

    console.log("➡️ Login attempt for admin_id:", admin_id);

    // admin_id se lookup karna
    const admin = await getExistingAdmin({ admin_id, email: "", phone: "" });
    console.log("✅ Admin lookup result:", admin);

    if (!admin) {
      console.error("❌ Admin not found");
      return res.status(404).json({ message: 'Admin not found' });
    }

    if (!admin.admin_status) {
      console.error("❌ Admin account is deactivated:", admin.admin_id);
      return res.status(403).json({ message: "Your account is deactivated. Contact super admin." });
    }

    console.log("➡️ Checking password...");
    const isMatch = await comparePassword(admin_password, admin.admin_password);
    if (!isMatch) {
      console.error("❌ Invalid password for admin:", admin.admin_id);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log("➡️ Generating tokens...");
    const accessToken = generateAccessToken({ id: admin.admin_id, role: admin.admin_role });
    const refreshToken = generateRefreshToken({ id: admin.admin_id, role: admin.admin_role });

    // Save refresh token in DB
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days expiry
    await saveRefreshToken(admin.admin_id, refreshToken, expiresAt);

    // Set refresh token in cookie
    res.cookie('adminRefreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
    });

    // console.log("✅ Admin logged in successfully:", admin.admin_id);

    res.json({
      accessToken
    });

  } catch (error) {
    console.error('❌ Login Error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ========================
// Logout Admin
// ========================
export const logoutAdmin = async (req, res) => {
  try {
    const refreshToken = req.cookies.adminRefreshToken;

    if (refreshToken) {
      await deleteRefreshToken(refreshToken);
    }

    // Clear cookie
    res.clearCookie("adminRefreshToken", {
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

// ========================
// Update Profile Picture
// ========================
export const uploadProfile = async (req, res) => {
  try {
    const { id } = req.params; // admin_id

    let profilePath = null;

    // Case 1: New file uploaded
    if (req.file) {
      profilePath = `/uploads/${req.file.filename}`;
    }

    // Case 2: No file uploaded → remove profile
    const updatedAdmin = await updateAdminProfile(id, profilePath);

    if (!updatedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({
      message: profilePath
        ? "Profile uploaded successfully!"
        : "Profile removed successfully!",
      admin: updatedAdmin,
    });
  } catch (error) {
    console.error("❌ Upload Profile Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ========================
// Get Current Admin
// ========================
export const adminDetailsById = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await getAdminById(id);

    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    res.json(admin);
  } catch (error) {
    console.error('❌ AdminDetailsById Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ========================
// Register Admin
// ========================
export const registerAdmin = async (req, res) => {
  try {
    const { admin_name, admin_phone, admin_email, admin_password, admin_role } = req.body;

    console.log("➡️ Step 1: Input received", { admin_name, admin_phone, admin_email, admin_role });

    // ✅ Validation checks
    if (!isValidEmail(admin_email)) {
      console.error("❌ Invalid email format");
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (!isValidPhone(admin_phone)) {
      console.error("❌ Invalid phone format");
      return res.status(400).json({ message: "Phone must be 10 digits" });
    }

    if (!isValidPassword(admin_password)) {
      console.error("❌ Invalid password format");
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const existingAdmin = await getExistingAdmin({ admin_email, admin_phone });
    console.log("✅ Existing admin check result:", existingAdmin);

    if (existingAdmin) {
      if (existingAdmin.admin_phone === admin_phone) {
        console.error("❌ Phone number already exists");
        return res.status(400).json({ message: "Phone number already exists" });
      }
      if (existingAdmin.admin_email === admin_email) {
        console.error("❌ Email already exists");
        return res.status(400).json({ message: "Email already exists" });
      }
    }

    const hashedPassword = await hashPassword(admin_password);
    console.log("✅ Password hashed");

    const adminId = await createAdmin({
      admin_name,
      admin_phone,
      admin_email,
      admin_password: hashedPassword,
      admin_role: admin_role || 'admin'
    });
    console.log("✅ Admin created with ID:", adminId);

    res.status(201).json({
      message: 'Admin registered successfully',
      admin: { admin_id: adminId, admin_name, admin_phone, admin_email, admin_role: admin_role || 'admin' }
    });

  } catch (error) {
    console.error("❌ Register Error:", error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ========================
// Get All Admins
// ========================
export const getAllAdmins = async (req, res) => {
  try {
    const admins = await getAllAdminsFromDB();
    res.status(200).json(admins);
  } catch (error) {
    console.error("❌ Get Admins Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ========================
// Update Admin
// ========================
export const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { admin_name, admin_email, admin_phone } = req.body;

    if (!admin_name || !admin_email || !admin_phone) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // ✅ Validation checks
    if (!isValidEmail(admin_email)) {
      console.error("❌ Invalid email format");
      return res.status(400).json({ message: "Invalid email format" });
    }
    if (!isValidPhone(admin_phone)) {
      console.error("❌ Invalid phone format");
      return res.status(400).json({ message: "Phone must be 10 digits" });
    }

    const existingAdmin = await getExistingAdmin({
      admin_email: req.body.admin_email,  // must be the new email
      admin_phone: req.body.admin_phone,
      excludeId: req.params.id
    });

    if (existingAdmin) {
      if (existingAdmin.admin_email === admin_email)
        return res.status(400).json({ message: "Email already exists" });
      if (existingAdmin.admin_phone === admin_phone)
        return res.status(400).json({ message: "Phone number already exists" });
    }

    // ✅ Update only name, email, phone
    const updated = await updateAdminInDB(id, { admin_name, admin_email, admin_phone });

    if (!updated) return res.status(404).json({ message: "Admin not found." });

    res.status(200).json({ message: "Admin updated successfully.", admin: updated });
  } catch (error) {
    console.error("❌ Update Admin Error:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// ========================
// Toggle Admin Status
// ========================
export const toggleAdminStatus = async (req, res) => {
  const { id } = req.params;

  try {
    console.log("Toggle status for admin_id:", id);
    const updatedAdmin = await toggleAdminStatusInDB(id);

    if (!updatedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json({
      message: `Admin status updated to ${updatedAdmin.admin_status ? "Active" : "Inactive"}`,
      status: updatedAdmin.admin_status
    });
  } catch (err) {
    console.error("Error in toggleAdminStatus:", err);
    res.status(500).json({ message: "Error updating status", error: err.message });
  }
};

// ========================
// Change Password
// ========================
export const changePassword = async (req, res) => {
  try {
    const { phone, newPassword } = req.body;

    if (!phone || !newPassword) {
      return res.status(400).json({ message: "Phone number and new password are required." });
    }

    // ✅ Find admin by phone
    const admin = await findAdminByPhone(phone);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found with this phone number." });
    }

    if (!isValidPassword(newPassword)) {
      console.error("❌ Invalid password format");
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // ✅ Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // ✅ Update in DB
    await updateAdminPasswordByPhone(phone, hashedPassword);

    return res.status(200).json({ message: "Password updated successfully!" });
  } catch (error) {
    console.error("Change Password Error:", error.message);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// ========================
// Refresh Access Token
// ========================
// export const refreshToken = async (req, res) => {
//   try {
//     const token = req.cookies.adminRefreshToken;
//     if (!token) return res.status(401).json({ message: 'No refresh token provided' });

//     // DB se token check
//     const storedToken = await findRefreshToken(token);
//     if (!storedToken) {
//       return res.status(403).json({ message: "Refresh token not found in DB" });
//     }

//     // Verify refresh token
//     const payload = verifyRefreshToken(token);
//     if (!payload) return res.status(403).json({ message: 'Invalid refresh token' });

//     // Generate new access token
//     const accessToken = generateAccessToken({ id: payload.id, role: payload.role });

//     res.json({ accessToken });
//   } catch (error) {
//     console.error('❌ Refresh Token Error:', error);
//     res.status(403).json({ message: 'Invalid refresh token' });
//   }
// };

// ========================
// Delete Admin
// ========================
// export const deleteAdmin = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const result = await removeAdmin(id);

//     if (result.rowCount === 0) {
//       return res.status(404).json({ message: "Admin not found" });
//     }

//     res.status(200).json({ message: "Admin deleted successfully" });
//   } catch (error) {
//     console.error("❌ Delete Admin Error:", error.message);
//     res.status(500).json({ message: "Server error" });
//   }
// };