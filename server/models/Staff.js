import { generateStaffId } from "../helpers/HotelHelpers.js";
import { adminDB } from '../config/db.js';

// ========================
// Check if Staff exists by email, phone, or staff_id
// ========================
export const getExistingStaff = async ({ email, phone, excludeId }) => {
  const values = [email, phone];
  let query = `
    SELECT * FROM staff
    WHERE (staff_email = $1 OR staff_phone = $2)
  `;

  if (excludeId) {
    query += ` AND staff_id != $3`;
    values.push(excludeId);
  }

  const result = await adminDB.query(query, values);
  return result.rows[0] || null;
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
}) => {
  // Generate staff ID like ST001
  const staff_id = await generateStaffId(adminDB);

  const result = await adminDB.query(
    `INSERT INTO staff (
      staff_id, staff_name, staff_phone, staff_email, staff_role, staff_address, staff_password
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7)
    RETURNING staff_id`,
    [
      staff_id,        // $1
      staff_name,      // $2
      staff_phone,     // $3
      staff_email,     // $4
      staff_role,      // $5
      staff_address,   // $6
      staff_password,  // $7
    ]
  );

  // Return the newly inserted staff ID
  return result.rows[0].staff_id;
};

/**
 * Get all staff records from hotel database
 */
export const getAllStaffsFromHotel = async () => {
  const result = await adminDB.query(
    `SELECT staff_id, staff_name, staff_phone, staff_email, staff_role, staff_status, staff_address
     FROM staff
     ORDER BY staff_name ASC`
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
