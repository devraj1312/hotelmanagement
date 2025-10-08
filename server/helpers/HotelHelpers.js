import { adminDB } from '../config/db.js'; // db connection
import crypto from 'crypto';

// ==============================
// Generate next Hotel ID
// Format: HT001, HT002, ...
// ==============================
export const generateHotelId = async () => {
  const result = await adminDB.query(
    `SELECT hotel_id FROM hotels ORDER BY hotel_id DESC LIMIT 1`
  );

  if (result.rows.length === 0) return "HT001"; // first Hotel

  const lastId = result.rows[0].hotel_id;  // e.g. HT005
  const lastNum = parseInt(lastId.replace("HT", ""));
  const newNum = lastNum + 1;

  return `HT${newNum.toString().padStart(3, "0")}`;
};


// ==============================
// Generate next Hotel Code
// Format: YYMMHC###, e.g. 2509HC005
// ==============================
export const generateHotelCode = async () => {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2); // last 2 digits of year
  const month = String(now.getMonth() + 1).padStart(2, "0"); // 01–12
  const prefix = `${year}${month}HC`; // e.g. "2509HC"

  // Get last hotel_code starting with current prefix
  const result = await adminDB.query(
    `SELECT hotel_code 
     FROM hotels 
     WHERE hotel_code LIKE $1 
     ORDER BY hotel_code DESC 
     LIMIT 1`,
    [`${prefix}%`]
  );

  if (result.rows.length === 0) {
    // First code for this month
    return `${prefix}001`;
  }

  // Extract sequence and increment
  const lastCode = result.rows[0].hotel_code; // e.g. 2509HC005
  const lastSeq = parseInt(lastCode.replace(prefix, ""), 10); // 5
  const newSeq = (lastSeq + 1).toString().padStart(3, "0");

  return `${prefix}${newSeq}`;
};


/**
 * Fetch hotel DB credentials by ownerId
 */
// export const getHotelDBCredentials = async (ownerId) => {
//   const res = await adminDB.query(
//     "SELECT db_name, db_user, db_password FROM hotels WHERE owner_id=$1 LIMIT 1",
//     [ownerId]
//   );
//   if (res.rows.length === 0) throw new Error("Hotel not found for this owner");
//   return res.rows[0];
// };

/**
 * Generate unique staff ID for hotel
 */
export const generateStaffId = async (adminDB) => {
  const res = await adminDB.query("SELECT staff_id FROM staff ORDER BY created_at DESC LIMIT 1");
  if (!res.rows.length) return "ST001";
  const lastNum = parseInt(res.rows[0].staff_id.replace("ST", ""));
  return `ST${(lastNum + 1).toString().padStart(3, "0")}`;
};


// ==============================
// Example Combined Usage
// ==============================
export const generateHotelCredentials = async () => {
  const hotelId = await generateHotelId();           // HT006
  const hotelCode = await generateHotelCode();       // 2509HC006
  const dbName = generateDbName(hotelId);           // hotel_ht006
  const dbUser = generateDbUser();                  // user_a1b2c3
  const dbPassword = generateDbPassword(dbName);    // hotel_ht006_2509_P@ss

  return { hotelId, hotelCode, dbName, dbUser, dbPassword };
};