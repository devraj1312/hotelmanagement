// models/Admin.js
import { adminDB } from '../config/db.js';
import { generateAdminId } from '../helpers/adminHelpers.js';


// ✅ Check if admin already exists by email or phone, excluding the current admin being updated
export const getExistingAdmin = async ({ admin_id, admin_email, admin_phone, excludeId }) => {
  const conditions = [];
  const values = [];
  let idx = 1;

  if (admin_id) {
    conditions.push(`admin_id = $${idx++}`);
    values.push(admin_id.trim());
  }

  if (admin_email) {
    conditions.push(`LOWER(admin_email) = LOWER($${idx++})`);
    values.push(admin_email.trim());
  }

  if (admin_phone) {
    conditions.push(`admin_phone = $${idx++}`);
    values.push(admin_phone.trim());
  }

  if (conditions.length === 0) return null;

  let query = `SELECT * FROM admins WHERE (${conditions.join(" OR ")})`;

  if (excludeId) {
    query += ` AND admin_id != $${idx++}`;
    values.push(excludeId);
  }

  const result = await adminDB.query(query, values);
  return result.rows.length ? result.rows[0] : null;
};





// ✅ Create admin
export const createAdmin = async ({ admin_name, admin_phone, admin_email, admin_password, admin_role }) => {
  const newAdminId = await generateAdminId();
  const result = await adminDB.query(
    `INSERT INTO admins (admin_id, admin_name, admin_phone, admin_email, admin_password, admin_role)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING admin_id`,
    [newAdminId, admin_name, admin_phone, admin_email, admin_password, admin_role]
  );
  return result.rows[0].admin_id;
};

// ✅ Get All Admins
export const getAllAdminsFromDB = async () => {
  const result = await adminDB.query(
    `SELECT admin_id, admin_name, admin_phone, admin_email, admin_role, admin_status, admin_created_at, admin_updated_at
    FROM admins
    ORDER BY admin_id ASC`
  );
  return result.rows;
};


// Delete Admin
export const removeAdmin = async (id) => {
  const result = await adminDB.query(
    "DELETE FROM admins WHERE id = $1 RETURNING *",
    [id]
  );
  return result;
};

// Get Admin by ID
export const getAdminById = async (id) => {
  const result = await adminDB.query(
    `SELECT 
       admin_id, 
       admin_name, 
       admin_phone, 
       admin_email, 
       admin_role, 
       admin_profile, 
       admin_status, 
       admin_created_at, 
       admin_updated_at
     FROM admins 
     WHERE admin_id = $1`,
    [id]
  );

  return result.rows[0] || null;
};

// Update Admin
export const updateAdminInDB = async (admin_id, { admin_name, admin_email, admin_phone }) => {
  const query = `
    UPDATE admins
    SET admin_name = $1,
        admin_email = $2,
        admin_phone = $3,
        admin_updated_at = NOW()
    WHERE admin_id = $4
    RETURNING admin_id, admin_name, admin_email, admin_phone, admin_role, admin_profile;
  `;

  const values = [admin_name, admin_email, admin_phone, admin_id];
  const result = await adminDB.query(query, values);

  return result.rowCount ? result.rows[0] : null;
};




// Toggle Admin Status
export const toggleAdminStatusInDB = async (admin_id) => {
  const result = await adminDB.query(
    `UPDATE admins 
     SET admin_status = NOT admin_status, admin_updated_at = NOW()
     WHERE admin_id = $1
     RETURNING admin_status`,
    [admin_id]
  );

  return result.rows[0];
};

// refresh token save karne ke liye
// export const saveRefreshToken = async (adminId, refreshToken, expiresAt) => {
//   const query = `
//     INSERT INTO refresh_tokens (user_id, refresh_token, expires_at)
//     VALUES ($1, $2, $3)
//   `;
//   await adminDB.query(query, [adminId, refreshToken, expiresAt]);
// };

// Refresh Token Delete
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

// Check refresh token in DB
// export const findRefreshToken = async (token) => {
//   const result = await adminDB.query(
//     `SELECT * FROM refresh_tokens WHERE refresh_token = $1`,
//     [token]
//   );
//   return result.rows[0]; // single row return karega
// };

// Find admin by ID
export const findAdminById = async (id) => {
  const result = await adminDB.query(
    `SELECT * FROM admins WHERE id=$1`,
    [id]
  );
  return result.rows[0]; // single admin return karega
};

// Update admin password
// export const updateAdminPassword = async (id, hashedPassword) => {
//   return await adminDB.query(
//     `UPDATE admins SET password=$1 WHERE id=$2`,
//     [hashedPassword, id]
//   );
// };

// ✅ Find admin by phone
export const findAdminByPhone = async (phone) => {
  const result = await adminDB.query("SELECT * FROM admins WHERE admin_phone = $1", [phone]);
  return result.rows[0];
};

// ✅ Update password by phone
export const updateAdminPasswordByPhone = async (phone, hashedPassword) => {
  await adminDB.query("UPDATE admins SET admin_password = $1 WHERE admin_phone = $2", [hashedPassword, phone]);
};

// Update Profile Picture
export const updateAdminProfile = async (admin_id, profilePath) => {
  const query = `
    UPDATE admins
    SET admin_profile = $1,
        admin_updated_at = NOW()
    WHERE admin_id = $2
    RETURNING admin_id, admin_profile
  `;
  const values = [profilePath, admin_id];

  const result = await adminDB.query(query, values);
  return result.rowCount ? result.rows[0] : null;
};