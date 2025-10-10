import { 
  getExistingOwner,createOwner,deleteRefreshToken, getAllOwnersFromDB, toggleOwnerStatusInDB,
  getOwnerById, updateOwnerProfile, findOwnerByPhone, updateOwnerPasswordByPhone, updateOwnerInDB,
  // findRefreshToken, , removeOwner,saveRefreshToken
  //   updateOwnerPassword
} from '../../models/Owner.js';

import { saveRefreshToken } from '../../models/refreshTokenModel.js';

import { hashPassword, comparePassword } from '../../utils/passwordUtils.js';
import { generateAccessToken, generateRefreshToken, 
    // verifyRefreshToken 
} from '../../utils/tokenUtils.js';
import { isValidEmail, isValidPhone, isValidPassword } from '../../utils/validators.js';
import bcrypt from "bcryptjs";

// ========================
// Login Owner
// ========================
export const loginOwner = async (req, res) => {
  try {
    const { ownerID, password } = req.body;

    if (!ownerID || !password) {
      return res.status(400).json({ message: "Owner ID and password are required." });
    }

    // Fetch owner by owner_id
    const owner = await getExistingOwner({ owner_id: ownerID });

    if (!owner) 
      return res.status(404).json({ message: 'Owner not found' });

    if (!owner.owner_status) 
      return res.status(403).json({ message: "Your account is deactivated. Contact admin." });

    // Compare password
    const isMatch = await comparePassword(password, owner.owner_password);
    if (!isMatch) 
      return res.status(401).json({ message: 'Invalid credentials' });

    // Generate tokens
    const accessToken = generateAccessToken({ id: owner.owner_id, role: 'owner' });
    const refreshToken = generateRefreshToken({ id: owner.owner_id, role: 'owner' });

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await saveRefreshToken(owner.owner_id, refreshToken, expiresAt);

    // Set refresh token cookie
    res.cookie('ownerRefreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
    });

    // Return owner info according to new table
    res.json({ 
      accessToken, 
      owner: { 
        id: owner.owner_id, 
        name: owner.owner_name, 
        email: owner.owner_email, 
        phone: owner.owner_phone,
        address: owner.owner_address,
        profile: owner.owner_profile
      } 
    });

  } catch (error) {
    console.error('❌ Owner Login Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ========================
// Register Owner
// ========================
export const registerOwner = async (req, res) => {
  try {
    const { name, phone, email, password, address } = req.body;

    // 🔹 Validation checks
    if (!name || !phone || !email || !password || !address) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    if (!isValidPhone(phone)) {
      return res.status(400).json({ message: "Phone must be 10 digits" });
    }
    if (!isValidPassword(password)) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // 🔹 Check existing owner by email or phone
    const existingOwner = await getExistingOwner({ email, phone });
    if (existingOwner) {
      if (existingOwner.owner_phone === phone) {
        return res.status(400).json({ message: "Phone number already exists" });
      }
      if (existingOwner.owner_email === email) {
        return res.status(400).json({ message: "Email already exists" });
      }
    }

    // 🔹 Hash password
    const hashedPassword = await hashPassword(password);

    // 🔹 Profile image if uploaded
    const profileUrl = req.file ? `/uploads/${req.file.filename}` : null;

    // 🔹 Create Owner
    const ownerId = await createOwner({
      name,
      phone,
      email,
      address,
      password: hashedPassword,
      profile: profileUrl
    });

    return res.status(201).json({
      message: 'Owner registered successfully',
      owner: {
        owner_id: ownerId,
        owner_name: name,
        owner_phone: phone,
        owner_email: email,
        owner_address: address,
        owner_profile: profileUrl
      }
    });

  } catch (error) {
    console.error('❌ Register Owner Error:', error);

    // 🔹 Detailed debug info
    if (error.code === '23505') {
      // Unique violation in PostgreSQL
      return res.status(400).json({ message: 'Email or phone already exists (PG unique constraint)' });
    }

    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ========================
// Logout Owner
// ========================
export const logoutOwner = async (req, res) => {
  try {
    const refreshToken = req.cookies.ownerRefreshToken;
    if (refreshToken) {
      const deleted = await deleteRefreshToken(refreshToken);
      console.log("🗑️ Token delete result:", deleted);
    } else {
      console.log("❌ No refresh token found in cookies");
    }
    // if (refreshToken) await deleteRefreshToken(refreshToken);

    res.clearCookie("ownerRefreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout Owner Error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ========================
// Get Owner Details by ID
// ========================
export const ownerDetailsById = async (req, res) => {
  try {
    const { id } = req.params;
    const owner = await getOwnerById(id);
    if (!owner) return res.status(404).json({ message: 'Owner not found' });
    res.json(owner);
  } catch (error) {
    console.error('❌ OwnerDetailsById Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ========================
// Update Profile Picture
// ========================
export const uploadProfile = async (req, res) => {
  try {
    const { id } = req.params; 

    let profilePath = null;

    // Case 1: New file uploaded
    if (req.file) {
      profilePath = `/uploads/${req.file.filename}`;
    }

    // Case 2: No file uploaded → remove profile
    const updatedOwner = await updateOwnerProfile(id, profilePath);

    if (!updatedOwner) {
      return res.status(404).json({ message: "Owner not found" });
    }

    res.status(200).json({
      message: profilePath
        ? "Profile uploaded successfully!"
        : "Profile removed successfully!",
      owner: updatedOwner,
    });
  } catch (error) {
    console.error("❌ Upload Profile Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ========================
// Get All Owners
// ========================
export const getAllOwners = async (req, res) => {
  try {
    const owners = await getAllOwnersFromDB();
    res.status(200).json(owners);
  } catch (error) {
    console.error("❌ Get Owners Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ========================
// Delete Owner
// ========================
// export const deleteOwner = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const result = await removeOwner(id);
//     if (!result) return res.status(404).json({ message: "Owner not found" });
//     res.status(200).json({ message: "Owner deleted successfully" });
//   } catch (error) {
//     console.error("❌ Delete Owner Error:", error.message);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// ========================
// Update Owner
// ========================
export const updateOwner = async (req, res) => {
  try {
    const { id } = req.params;
    const { owner_name, owner_email, owner_phone, owner_address } = req.body;

    // ✅ Step 1: Required fields validation
    if (!owner_name || !owner_email || !owner_phone || !owner_address) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // ✅ Step 2: Format validations
    if (!isValidEmail(owner_email)) {
      console.error("❌ Invalid email format");
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (!isValidPhone(owner_phone)) {
      console.error("❌ Invalid phone format");
      return res.status(400).json({ message: "Phone must be 10 digits" });
    }

    // ✅ Step 3: Check for duplicate email or phone (excluding current owner)
    const existingOwner = await getExistingOwner({
      email: owner_email,
      phone: owner_phone,
      excludeId: id,
    });

    if (existingOwner) {
      if (existingOwner.owner_email === owner_email)
        return res.status(400).json({ message: "Email already exists" });
      if (existingOwner.owner_phone === owner_phone)
        return res.status(400).json({ message: "Phone number already exists" });
    }

    // ✅ Step 4: Update owner details in DB
    const updatedOwner = await updateOwnerInDB(id, {
      owner_name,
      owner_email,
      owner_phone,
      owner_address,
    });

    if (!updatedOwner)
      return res.status(404).json({ message: "Owner not found." });

    res.status(200).json({
      message: "Owner updated successfully.",
      owner: updatedOwner,
    });
  } catch (error) {
    console.error("❌ Update Owner Error:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// ========================
// Toggle Owner Status
// ========================
export const toggleOwnerStatus = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedOwner = await toggleOwnerStatusInDB(id);

    if (!updatedOwner) {
      return res.status(404).json({ message: "Owner not found" });
    }

    res.json({
      message: `Owner status updated to ${updatedOwner.status ? "Active" : "Inactive"}`,
      status: updatedOwner.status
    });
  } catch (err) {
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

    if (!isValidPassword(newPassword)) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // ✅ Find owner by phone
    const owner = await findOwnerByPhone(phone);
    if (!owner) {
      return res.status(404).json({ message: "Owner not found with this phone number." });
    }

    // ✅ Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // ✅ Update in DB
    await updateOwnerPasswordByPhone(phone, hashedPassword);

    return res.status(200).json({ message: "Password updated successfully!" });
  } catch (error) {
    console.error("Change Password Error:", error.message);
    return res.status(500).json({ message: "Internal server error." });
  }
};
