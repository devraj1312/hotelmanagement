import { generateStaffId } from "../helpers/HotelHelpers.js";
import { adminDB } from '../config/db.js';

/**
 * Inserts a new staff into the hotel DB
 */
export const addStaffToHotel = async ({
  staff_name,
  staff_phone,
  staff_email,
  staff_role,
  staff_password,
}) => {
  // Generate staff ID like ST001
  const staff_id = await generateStaffId(adminDB);

  const result = await adminDB.query(
    `INSERT INTO staff (
      staff_id, staff_name, staff_phone, staff_email, staff_role, staff_password
    )
    VALUES ($1,$2,$3,$4,$5,$6)
    RETURNING staff_id`,
    [
      staff_id,        // $1
      staff_name,      // $2
      staff_phone,     // $3
      staff_email,     // $4
      staff_role,      // $5
      staff_password,  // $6
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
    `SELECT staff_id, staff_name, staff_phone, staff_email, staff_role, staff_status
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
  { staff_name, staff_phone, staff_email, staff_role }
) => {
  const result = await adminDB.query(
    `UPDATE staff
     SET staff_name = $1,
         staff_phone = $2,
         staff_email = $3,
         staff_role = $4
     WHERE staff_id = $5
     RETURNING staff_id`,
    [
      staff_name,   // $1
      staff_phone,  // $2
      staff_email,  // $3
      staff_role,   // $4
      staff_id,     // $5
    ]
  );

  // Return the updated staff ID
  return result.rows[0]?.staff_id;
};

