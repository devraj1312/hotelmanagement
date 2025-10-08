import { generateNumericOtp } from '../../utils/otpUtils.js'; 
import { createOtp, findValidOtp, markOtpUsed, findOwnerById } from '../../models/Otp.js';
import { generateAccessToken, generateRefreshToken } from '../../utils/tokenUtils.js';
import { getExistingOwner } from '../../models/Owner.js';
import { saveRefreshToken } from '../../models/refreshTokenModel.js';

const OTP_TTL_MIN = 2;

// POST /api/owner/otp/request  { phone }
export const requestOtp = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ message: 'Phone is required' });

    // find owner by phone
    const owner = await getExistingOwner({ email: '', phone });

    if (!owner) return res.status(404).json({ message: 'Owner not found' });

    // 🔒 check status
    if (!owner.owner_status) {
      return res.status(403).json({ message: "Your account is deactivated. Contact Service Provider." });
    }

    // generate 4-digit OTP
    const otp = generateNumericOtp(); // e.g., "0427"
    const expires_at = new Date(Date.now() + OTP_TTL_MIN * 60 * 1000);

    // save OTP
    await createOtp({ user_id: owner.owner_id, phone, otp, expires_at });

    // LOCAL DEV: return OTP in response (for popup)
    return res.status(200).json({
      devOtp: otp,
      expiresInSec: OTP_TTL_MIN * 60
    });
  } catch (e) {
    console.error('requestOtp error:', e);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// POST /api/owner/otp/verify  { phone, otp }
export const verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) {
      return res.status(400).json({ message: "Phone & OTP required" });
    }

    const row = await findValidOtp({ phone, otp });
    if (!row) return res.status(400).json({ message: 'Invalid or expired OTP' });

    // fetch owner
    const owner = await findOwnerById(row.user_id);
    if (!owner) return res.status(404).json({ message: "Owner not found" });

    if (!owner.owner_status) {
      return res.status(403).json({ message: "Your account is deactivated. Contact Service Provider." });
    }

    // mark OTP as used
    await markOtpUsed(row.id); // user_id, user_id (OTP table field & owner_id)

    // generate tokens
    const accessToken = generateAccessToken({ id: owner.owner_id, role: 'owner' });
    const refreshToken = generateRefreshToken({ id: owner.owner_id, role: 'owner' });

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await saveRefreshToken(owner.owner_id, refreshToken, expiresAt);

    res.cookie('ownerRefreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict'
    });

    return res.status(200).json({
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
  } catch (e) {
    console.error('verifyOtp error:', e);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
