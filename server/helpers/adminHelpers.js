import { adminDB } from '../config/db.js'; // db connection

// helper: generate next admin_id
export const generateAdminId = async () => {
  const result = await adminDB.query(
    `SELECT admin_id FROM admins ORDER BY admin_id DESC LIMIT 1`
  );

  if (result.rows.length === 0) return "AD001"; // first admin

  const lastId = result.rows[0].admin_id;  // e.g. AD005
  const lastNum = parseInt(lastId.replace("AD", ""));
  const newNum = lastNum + 1;

  return `AD${newNum.toString().padStart(3, "0")}`;
};
