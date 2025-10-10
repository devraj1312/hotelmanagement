// server/models/Hotel.js
import { adminDB } from '../config/db.js';
import { generateHotelId, generateHotelCode } from '../helpers/HotelHelpers.js';


export const getExistingHotel = async ({ hotel_email, hotel_phone, license_no, excludeId }) => {
  const conditions = [];
  const values = [];
  let idx = 1;

  if (hotel_email) {
    conditions.push(`LOWER(hotel_email) = LOWER($${idx++})`);
    values.push(hotel_email.trim());
  }

  if (hotel_phone) {
    conditions.push(`hotel_phone = $${idx++}`);
    values.push(hotel_phone.trim());
  }

  if (license_no) {
    conditions.push(`hotel_license_no = $${idx++}`);
    values.push(license_no.trim());
  }

  if (conditions.length === 0) return null;

  // ✅ Exclude all hotels of the current owner
  let query = `SELECT * FROM hotels WHERE (${conditions.join(" OR ")})`;

  if (excludeId) {
    query += ` AND owner_id != $${idx++}`;
    values.push(excludeId); // ✅ excludeId is ownerId here
  }

  const result = await adminDB.query(query, values);
  return result.rows.length ? result.rows[0] : null;
};


export const createHotel = async ({
  owner_id,
  hotel_name,
  hotel_address,
  hotel_email,
  hotel_phone,
  license_no,
  hotel_document,
  hotel_image,
}) => {
  const newHotelId = await generateHotelId();         // HT006
  const newHotelCode = await generateHotelCode();     // e.g. 2509HC005


  const result = await adminDB.query(
    `INSERT INTO hotels (
        hotel_id, owner_id, hotel_code, hotel_name, hotel_address, 
        hotel_email, hotel_phone, license_no, hotel_document, hotel_image
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
    RETURNING hotel_id`,
    [
        newHotelId,      // $1
        owner_id,        // $2
        newHotelCode,    // $3
        hotel_name,      // $4
        hotel_address,   // $5
        hotel_email,     // $6
        hotel_phone,     // $7
        license_no,      // $8
        hotel_document,  // $9
        hotel_image      // $10
    ]
  );

  return result.rows[0].hotel_id;
};

export const getAllHotels = async () => {
  const result = await adminDB.query("SELECT * FROM hotels ORDER BY created_at DESC");
  return result.rows;
};

// ✅ Query hotels by owner_id
export const getHotelsByOwner = async (ownerId) => {
  const result = await adminDB.query(
    "SELECT * FROM hotels WHERE owner_id = $1 ORDER BY created_at DESC",
    [ownerId]
  );
  return result.rows;
};

// Hotel update query - only subscription update
export const updateHotelById = async (hotelId, subscription) => {
  const query = `
    UPDATE hotels
    SET 
      subscription = $1,
      updated_at = NOW()
    WHERE hotel_id = $2
    RETURNING *;
  `;

  const values = [subscription, hotelId];
  const result = await adminDB.query(query, values);
  return result.rows[0];
};

// queries/hotelQueries.js
export const updateHotel = async ({ ownerId, hotelName, hotelPhone, hotelAddress, hotelEmail }) => {
  const query = `
    UPDATE hotels
    SET hotel_name = $1,
        hotel_phone = $2,
        hotel_address = $3,
        hotel_email = $4,
        updated_at = NOW()
    WHERE owner_id = $5
    RETURNING *;
  `;

  const values = [hotelName, hotelPhone, hotelAddress, hotelEmail, ownerId];
  const result = await adminDB.query(query, values);
  return result.rows[0]; // ✅ Return updated hotel
};


// export const getHotelById = async (hotel_id) => {
//   const result = await pool.query("SELECT * FROM hotels WHERE hotel_id = $1", [hotel_id]);
//   return result.rows[0];
// };

