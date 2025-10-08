import { adminDB } from '../config/db.js';
import { generateOwnerId } from '../helpers/ownerHelpers.js';

// ========================
// Check if Owner exists by email, phone, or owner_id
// ========================
export const getExistingOwner = async ({ email, phone, owner_id, excludeId }) => {
  const values = [email, phone, owner_id];
  let query = `
    SELECT * FROM owners
    WHERE (owner_email = $1 OR owner_phone = $2 OR owner_id = $3)
  `;

  if (excludeId) {
    query += ` AND owner_id != $4`;
    values.push(excludeId);
  }

  const result = await adminDB.query(query, values);
  return result.rows[0] || null;
};




// ========================
// Create Owner
// ========================
export const createOwner = async ({ name, phone, email, address, password, profile }) => {
  const newOwnerId = await generateOwnerId();
  const result = await adminDB.query(
    `INSERT INTO owners 
     (owner_id, owner_name, owner_phone, owner_email, owner_address, owner_password, owner_profile)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING owner_id`,
    [newOwnerId, name, phone, email, address, password, profile]
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
      `SELECT owner_id, owner_name, owner_email, owner_phone, owner_profile 
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
// Update Owner
// ========================
// export const updateOwnerInDB = async (id, { name, phone, email, address, documentType, document, profile }) => {
//   let query, values;

//   if (profile !== undefined) {
//     query = `
//       UPDATE owners 
//       SET name=$1, phone=$2, email=$3, address=$4, document_type=$5, document=$6, profile=$7, updated_at=NOW()
//       WHERE owner_id=$8
//       RETURNING owner_id, name, phone, email, address, document_type, document, profile
//     `;
//     values = [name, phone, email, address, documentType, document, profile, id];
//   } else {
//     query = `
//       UPDATE owners 
//       SET name=$1, phone=$2, email=$3, address=$4, document_type=$5, document=$6, updated_at=NOW()
//       WHERE owner_id=$7
//       RETURNING owner_id, name, phone, email, address, document_type, document, profile
//     `;
//     values = [name, phone, email, address, documentType, document, id];
//   }

//   const result = await adminDB.query(query, values);
//   return result.rows[0];
// };

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
