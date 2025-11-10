// controllers/staff/otpController.js
import { generateNumericOtp } from '../../utils/otpUtils.js';
import { createOtp, findValidOtp, markOtpUsed, findStaffById } from '../../models/Otp.js';
import { generateAccessToken, generateRefreshToken } from '../../utils/tokenUtils.js';
import { getExistingStaff } from '../../models/Staff.js';
import { saveRefreshToken } from '../../models/refreshTokenModel.js';

const OTP_TTL_MIN = 2; // minutes
// POST /api/staff/otp/request  { phone }
export const requestOtp = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ message: 'Phone is required' });

    // find staff by phone
    const staff = await getExistingStaff({ staff_id: "", staff_email: "", staff_phone: phone });

    if (!staff) return res.status(404).json({ message: 'Staff not found' });

    // check account status
    if (!staff.staff_status) {
      return res.status(403).json({ message: "Your account is deactivated. Contact Owner." });
    }

    // generate numeric OTP
    const otp = generateNumericOtp();
    const expires_at = new Date(Date.now() + OTP_TTL_MIN * 60 * 1000);

    // save OTP (store user_id as staff_id)
    await createOtp({ user_id: staff.staff_id, phone, otp, expires_at });

    // LOCAL DEV: return OTP in response
    return res.status(200).json({
      devOtp: otp,
      expiresInSec: OTP_TTL_MIN * 60
    });
  } catch (e) {
    console.error('manager requestOtp error:', e);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// POST /api/manager/otp/verify  { phone, otp }
export const verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) {
      return res.status(400).json({ message: "Phone & OTP required" });
    }

    // Validate OTP
    const row = await findValidOtp({ phone, otp });
    if (!row) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Fetch staff by ID (linked from OTP table’s user_id)
    const staff = await findStaffById(row.user_id);
    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    // Check status
    if (!staff.staff_status) {
      return res.status(403).json({ message: "Your account is deactivated. Contact Owner." });
    }
    
    // Check Hotel ID
    if (!staff.hotel_id) {
      return res.status(403).json({ message: "Your account is not associated with any hotel." });
    }

    // Mark OTP as used
    await markOtpUsed(row.id);

    // Generate tokens
    const accessToken = generateAccessToken({ id: staff.staff_id, role: staff.staff_role, hotel: staff.hotel_id });
    const refreshToken = generateRefreshToken({ id: staff.staff_id, role: staff.staff_role, hotel: staff.hotel_id });

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await saveRefreshToken(staff.staff_id, refreshToken, expiresAt);

    // Set refresh token cookie
    res.cookie("staffRefreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    // Return access token
    return res.json({ accessToken });
  } catch (e) {
    console.error("staff verifyOtp error:", e);
    return res.status(500).json({ message: "Internal server error" });
  }
};
