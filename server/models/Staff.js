import { generateStaffId } from "../helpers/HotelHelpers.js";
import { adminDB } from '../config/db.js';

// ========================
// Check if Staff exists by email, phone, or staff_id
// ========================
export const getExistingStaff = async ({ staff_id, staff_email, staff_phone, excludeId }) => {
  const conditions = [];
  const values = [];
  let idx = 1;

  if (staff_id) {
    conditions.push(`staff_id = $${idx++}`);
    values.push(String(staff_id).trim());
  }

  if (staff_email) {
    conditions.push(`LOWER(staff_email) = LOWER($${idx++})`);
    values.push(String(staff_email).trim());
  }

  if (staff_phone) {
    conditions.push(`staff_phone = $${idx++}`);
    values.push(String(staff_phone).trim());
  }

  // nothing to check
  if (conditions.length === 0) return null;

  let query = `SELECT * FROM staff WHERE (${conditions.join(' OR ')})`;

  if (excludeId) {
    query += ` AND staff_id != $${idx++}`;
    values.push(excludeId);
  }

  const result = await adminDB.query(query, values);
  return result.rows.length ? result.rows[0] : null;
};

/**
 * Fetch hotels for a given owner
 */
export const getHotelByOwner = async (ownerId) => {
  try {
    const result = await adminDB.query(
      `SELECT hotel_id 
       FROM hotels 
       WHERE owner_id = $1
       LIMIT 1`,
      [ownerId]
    );

    return result.rows[0] || null;
  } catch (err) {
    console.error("getHotelByOwner error:", err.message || err);
    throw err;
  }
};

/**
 * Inserts a new staff into the hotel DB
 */
export const addStaffToHotel = async ({
  staff_name,
  staff_phone,
  staff_email,
  staff_role,
  staff_address,
  staff_password,
  hotel_id,
}) => {
  // Generate staff ID like ST001
  const staff_id = await generateStaffId(adminDB);

  const result = await adminDB.query(
    `INSERT INTO staff (
      staff_id, staff_name, staff_phone, staff_email, staff_role, staff_address, staff_password,  hotel_id
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    RETURNING staff_id`,
    [
      staff_id,        // $1
      staff_name,      // $2
      staff_phone,     // $3
      staff_email,     // $4
      staff_role,      // $5
      staff_address,   // $6
      staff_password,  // $7
      hotel_id,       // $8
    ]
  );

  // Return the newly inserted staff ID
  return result.rows[0].staff_id;
};

/**
 * Get all staff records from hotel database
 */
export const getAllStaffsFromHotel = async (hotelId) => {
  const result = await adminDB.query(
    `SELECT staff_id, staff_name, staff_phone, staff_email, staff_role, staff_status, staff_address
     FROM staff
     WHERE hotel_id = $1
     ORDER BY staff_name ASC`,
    [hotelId]
  );
  return result.rows;
};

/**
 * Updates an existing staff in the hotel DB
 */
export const updateStaffInHotel = async (
  staff_id,
  { staff_name, staff_phone, staff_email, staff_role, staff_address }
) => {
  const result = await adminDB.query(
    `UPDATE staff
     SET staff_name = $1,
         staff_phone = $2,
         staff_email = $3,
         staff_role = $4,
         staff_address = $5
     WHERE staff_id = $6
     RETURNING staff_id`,
    [
      staff_name,   // $1
      staff_phone,  // $2
      staff_email,  // $3
      staff_role,   // $4
      staff_address, // $5
      staff_id,     // $6
    ]
  );

  // Return the updated staff ID
  return result.rows[0]?.staff_id;
};

// ========================
// Toggle Owner Status
// ========================
export const toggleStaffStatusInDB = async (id) => {
  const result = await adminDB.query(
    `UPDATE staff
     SET staff_status = NOT staff_status, updated_at = NOW()
     WHERE staff_id = $1
     RETURNING staff_status`,
    [id]
  );
  return result.rows[0];
};

// ========================
// Get Admin by ID
// ========================
export const getStaffById = async (id) => {
  const result = await adminDB.query(
    `SELECT 
       staff_id, 
       staff_name, 
       staff_phone, 
       staff_email, 
       staff_role, 
       staff_address, 
       hotel_id, 
       created_at, 
       updated_at
     FROM staff
     WHERE staff_id = $1`,
    [id]
  );

  return result.rows[0] || null;
};