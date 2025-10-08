import { adminDB } from "../config/db.js"; // database connection

// ========================
// Save Refresh Token (Generic for admin/owner/manager)
// ========================
export const saveRefreshToken = async (userId, refreshToken, expiresAt) => {
  const query = `
    INSERT INTO refresh_tokens (user_id, refresh_token, expires_at)
    VALUES ($1, $2, $3)
  `;
  try {
    await adminDB.query(query, [userId, refreshToken, expiresAt]);
    console.log(`✅ Refresh token saved/updated for user_id: ${userId}`);
  } catch (error) {
    console.error(`❌ Error saving refresh token for user_id: ${userId}`, error.message);
    throw error;
  }
};

// export const saveRefreshToken = async (ownerId, refreshToken, expiresAt) => {
//   const query = `
//     INSERT INTO refresh_tokens (user_id, refresh_token, expires_at)
//     VALUES ($1, $2, $3)
//   `;
//   await adminDB.query(query, [ownerId, refreshToken, expiresAt]);
// };


// Delete refresh token (logout)
export const deleteRefreshToken = async (refreshToken) => {
  try {
    await adminDB.query(
      `DELETE FROM refresh_tokens WHERE refresh_token = $1`,
      [refreshToken]
    );
    console.log(`✅ Refresh token deleted: ${refreshToken}`);
    return true;
  } catch (error) {
    console.error("❌ Error deleting refresh token:", error.message);
    throw error;
  }
};