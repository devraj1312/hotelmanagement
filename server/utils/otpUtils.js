// utils/otpUtils.js
import crypto from 'crypto';

/**
 * Generate a simple numeric OTP
 * @param {number} digits - length of OTP (default 4)
 * @returns {string} OTP string with leading zeros if needed
 */
export const generateNumericOtp = (digits = 4) => {
  // secure random number in range 0 to 10^digits - 1
  const num = crypto.randomInt(0, 10 ** digits);
  return num.toString().padStart(digits, '0');
};
