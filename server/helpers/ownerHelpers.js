import { adminDB } from '../config/db.js'; // db connection
// ========================
// Generate Owner ID (like OW001)
// ========================
export const generateOwnerId = async () => {
  const result = await adminDB.query(
    `SELECT owner_id FROM owners ORDER BY owner_id DESC LIMIT 1`
  );

  if (result.rows.length === 0) return "OW001";

  const lastId = result.rows[0].owner_id; // e.g. OW005
  const lastNum = parseInt(lastId.replace("OW", ""));
  const newNum = lastNum + 1;

  return `OW${newNum.toString().padStart(3, "0")}`;
};