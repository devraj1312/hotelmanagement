// models/Otp.js
import { adminDB } from '../config/db.js';

// Create OTP
export const createOtp = async ({ user_id, phone, otp, expires_at }) => {
  // 1️⃣ Delete expired OTPs
  await adminDB.query(`DELETE FROM user_otps WHERE expires_at < NOW()`);

  // 2️⃣ Delete old unused OTPs for same phone
  await adminDB.query(`DELETE FROM user_otps WHERE phone = $1 AND is_used = FALSE`, [phone]);

  // 3️⃣ Insert new OTP
  const { rows } = await adminDB.query(
    `INSERT INTO user_otps (user_id, phone, otp, expires_at)
     VALUES ($1, $2, $3, $4)
     RETURNING id, created_at`,
    [user_id, phone, otp, expires_at]
  );
  return rows[0];
};

// Find valid OTP
export const findValidOtp = async ({ phone, otp }) => {
  const { rows } = await adminDB.query(
    `SELECT * FROM user_otps
     WHERE phone = $1
       AND otp = $2
       AND is_used = FALSE
       AND expires_at > NOW()
     ORDER BY created_at DESC
     LIMIT 1`,
    [phone, otp]
  );
  return rows[0] || null;
};

// Find Admin by ID
export const findAdminById = async (admin_id) => {
  const { rows } = await adminDB.query(
    `SELECT admin_id, admin_name, admin_role, admin_status FROM admins WHERE admin_id = $1`,
    [admin_id]
  );
  return rows[0] || null;
};

// Find Owner by ID (generic, if needed for OTP)
export const findOwnerById = async (owner_id) => {
  const { rows } = await adminDB.query(
    `SELECT owner_id, owner_name, owner_status FROM owners WHERE owner_id = $1`,
    [owner_id]
  );
  return rows[0] || null;
};

// Mark OTP as used
export const markOtpUsed = async (otpId, userId) => {
  await adminDB.query(
    `UPDATE user_otps SET is_used = TRUE WHERE id = $1 AND user_id = $2`,
    [otpId, userId]
  );
};
