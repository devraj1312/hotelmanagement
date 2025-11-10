import { adminDB } from '../config/db.js';
import { generateOwnerId } from '../helpers/ownerHelpers.js';

// ========================
// Check if Owner exists by email, phone, or owner_id
// ========================
export const getExistingOwner = async ({ owner_id, email, phone, excludeId }) => {
  let query = `SELECT * FROM owners WHERE `;
  const values = [];
  const conditions = [];

  // Case 1️⃣: Lookup by owner_id (for login or direct fetch)
  if (owner_id) {
    conditions.push(`owner_id = $${values.length + 1}`);
    values.push(owner_id);
  }

  // Case 2️⃣: Lookup by email or phone (for duplicate check)
  if (email || phone) {
    const emailOrPhoneConds = [];
    if (email) {
      emailOrPhoneConds.push(`owner_email = $${values.length + 1}`);
      values.push(email);
    }
    if (phone) {
      emailOrPhoneConds.push(`owner_phone = $${values.length + 1}`);
      values.push(phone);
    }
    conditions.push(`(${emailOrPhoneConds.join(" OR ")})`);
  }

  // Case 3️⃣: Exclude specific owner (during update)
  if (excludeId) {
    conditions.push(`owner_id != $${values.length + 1}`);
    values.push(excludeId);
  }

  // Final query assembly
  query += conditions.join(" AND ");

  const result = await adminDB.query(query, values);
  return result.rows[0] || null;
};


// ========================
// Create Owner
// ========================
export const createOwner = async ({ name, phone, email, address, password }) => {
  const newOwnerId = await generateOwnerId();
  const result = await adminDB.query(
    `INSERT INTO owners 
     (owner_id, owner_name, owner_phone, owner_email, owner_address, owner_password)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING owner_id`,
    [newOwnerId, name, phone, email, address, password]
  );
  return result.rows[0].owner_id;
};

// ========================
// Get All Owners
// ========================
export const getAllOwnersFromDB = async () => {
  try {
    const result = await adminDB.query(
      `SELECT owner_id, owner_name, owner_email, owner_phone, owner_address, owner_status
       FROM owners
       ORDER BY owner_id ASC`
    );
    return result.rows;
  } catch (error) {
    console.error("❌ getAllOwnersFromDB error:", error);
    throw error;
  }
};

// ========================
// Get Owner by ID
// ========================
export const getOwnerById = async (id) => {
  try {
    const result = await adminDB.query(
      `SELECT owner_id, owner_name, owner_email, owner_phone, owner_profile, owner_address, owner_status
       FROM owners 
       WHERE owner_id = $1`,
      [id]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error("❌ getOwnerById error:", error);
    throw error;
  }
};

// ========================
// Upload Owner
// ========================
export const updateOwnerProfile = async (owner_id, profilePath) => {
  const query = `
    UPDATE owners
    SET owner_profile = $1, updated_at = NOW()
    WHERE owner_id = $2
    RETURNING owner_id, owner_profile
  `;
  const values = [profilePath, owner_id];

  const result = await adminDB.query(query, values);
  return result.rowCount ? result.rows[0] : null;
};

// ========================
// Update Owner
// ========================
export const updateOwnerInDB = async (owner_id, { owner_name, owner_email, owner_phone, owner_address }) => {
  const query = `
    UPDATE owners
    SET 
      owner_name = $1,
      owner_email = $2,
      owner_phone = $3,
      owner_address = $4,
      updated_at = NOW()
    WHERE owner_id = $5
    RETURNING 
      owner_id, 
      owner_name, 
      owner_email, 
      owner_phone, 
      owner_address, 
      created_at, 
      updated_at;
  `;

  const values = [owner_name, owner_email, owner_phone, owner_address, owner_id];
  const result = await adminDB.query(query, values);

  return result.rowCount ? result.rows[0] : null;
};

// ========================
// Toggle Owner Status
// ========================
export const toggleOwnerStatusInDB = async (id) => {
  const result = await adminDB.query(
    `UPDATE owners 
     SET owner_status = NOT owner_status, updated_at = NOW()
     WHERE owner_id = $1
     RETURNING owner_status`,
    [id]
  );
  return result.rows[0];
};

// ========================
// Delete Owner
// ========================
// export const removeOwner = async (id) => {
//   const result = await adminDB.query(
//     `DELETE FROM owners WHERE owner_id=$1 RETURNING *`,
//     [id]
//   );
//   return result.rows[0];
// };

// ========================
// Refresh token
// ========================
// export const saveRefreshToken = async (ownerId, refreshToken, expiresAt) => {
//   const query = `
//     INSERT INTO refresh_tokens (user_id, refresh_token, expires_at)
//     VALUES ($1, $2, $3)
//   `;
//   await adminDB.query(query, [ownerId, refreshToken, expiresAt]);
// };

// export const deleteRefreshToken = async (refreshToken) => {
//   await adminDB.query(`DELETE FROM refresh_tokens WHERE refresh_token=$1`, [refreshToken]);
// };
export const deleteRefreshToken = async (refreshToken) => {
  try {
    await adminDB.query(
      `DELETE FROM refresh_tokens WHERE refresh_token = $1`,
      [refreshToken]
    );
    return true;
  } catch (error) {
    console.error("Error deleting refresh token:", error.message);
    throw error;
  }
};

// export const findRefreshToken = async (token) => {
//   const result = await adminDB.query(
//     `SELECT * FROM refresh_tokens WHERE refresh_token=$1`,
//     [token]
//   );
//   return result.rows[0] || null;
// };

// ========================
// Password
// ========================
// export const updateOwnerPassword = async (id, hashedPassword) => {
//   return await adminDB.query(
//     `UPDATE owners SET password=$1 WHERE owner_id=$2`,
//     [hashedPassword, id]
//   );
// };

// ✅ Find owner by phone
export const findOwnerByPhone = async (phone) => {
  const result = await adminDB.query("SELECT * FROM owners WHERE owner_phone = $1", [phone]);
  return result.rows[0];
};

// ✅ Update password by phone
export const updateOwnerPasswordByPhone = async (phone, hashedPassword) => {
  await adminDB.query("UPDATE owners SET owner_password = $1 WHERE owner_phone = $2", [hashedPassword, phone]);
};