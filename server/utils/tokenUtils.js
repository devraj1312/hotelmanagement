import jwt from 'jsonwebtoken';

// Access token
const JWT_SECRET = process.env.JWT_SECRET || 'r1d3i0e7t1v0u';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

// Refresh token
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'r1d3i0e7t1v0u';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

// Generate Access Token
export const generateAccessToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// Verify Access Token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
};

// Generate Refresh Token
export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN });
};

// Verify Refresh Token
export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET);
  } catch (err) {
    return null;
  }
};
