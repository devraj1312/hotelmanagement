// controllers/admin/otpController.js
import { generateNumericOtp } from '../../utils/otpUtils.js'; 
import { createOtp, findValidOtp, markOtpUsed, findAdminById } from '../../models/Otp.js';
import { generateAccessToken, generateRefreshToken } from '../../utils/tokenUtils.js';
import { getExistingAdmin } from '../../models/Admin.js';
import { saveRefreshToken } from '../../models/refreshTokenModel.js';

const OTP_TTL_MIN = 2;

// POST /api/admin/otp/request  { phone }
export const requestOtp = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ message: 'Phone is required' });

    // find admin by phone
    const admin = await getExistingAdmin({ admin_id: "", admin_email: "", admin_phone: phone });

    if (!admin) return res.status(404).json({ message: 'Admin not found' });
   
    // // 🔒 check status
    if (!admin.admin_status) {
      return res.status(403).json({ message: "Your account is deactivated. Contact super admin." });
    }

    // generate 4-digit OTP
    const otp = generateNumericOtp();
    const expires_at = new Date(Date.now() + OTP_TTL_MIN * 60 * 1000);

    // save OTP
    await createOtp({ user_id: admin.admin_id, phone, otp, expires_at });

    // LOCAL DEV: return OTP in response
    return res.status(200).json({
      devOtp: otp,
      expiresInSec: OTP_TTL_MIN * 60
    });
  } catch (e) {
    console.error('requestOtp error:', e);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// POST /api/admin/otp/verify  { phone, otp }
export const verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) {
      return res.status(400).json({ message: "Phone & OTP required" });
    }

    // ✅ Validate OTP
    const row = await findValidOtp({ phone, otp });
    if (!row) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // ✅ Fetch admin by ID (linked from OTP table’s user_id)
    const admin = await findAdminById(row.user_id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // ✅ Check status
    if (!admin.admin_status) {
      return res.status(403).json({ message: "Your account is deactivated. Contact super admin." });
    }

    // ✅ Mark OTP as used
    await markOtpUsed(row.id); // user_id from OTP table maps to admin_id

    // ✅ Generate tokens
    const accessToken = generateAccessToken({ id: admin.admin_id, role: admin.admin_role });
    const refreshToken = generateRefreshToken({ id: admin.admin_id, role: admin.admin_role });

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await saveRefreshToken(admin.admin_id, refreshToken, expiresAt);

    // ✅ Set refresh token cookie
    res.cookie("adminRefreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    // ✅ Return response (similar to owner’s structure)
    res.json({
      accessToken
    });
  } catch (e) {
    console.error("verifyOtp error:", e);
    return res.status(500).json({ message: "Internal server error" });
  }
};

