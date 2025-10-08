// server/models/Hotel.js
import { adminDB } from '../config/db.js';
import { generateHotelId, generateHotelCode } from '../helpers/HotelHelpers.js';

export const getExistingHotel = async ({ hotel_email, hotel_phone, license_no, excludeId }) => {
  const values = [hotel_email, hotel_phone, license_no];

  let query = `
    SELECT * FROM hotels
    WHERE (hotel_email = $1 OR hotel_phone = $2 OR license_no = $3)
  `;

  if (excludeId) {
    query += ` AND hotel_id != $4`;
    values.push(excludeId);
  }

  const result = await adminDB.query(query, values);
  return result.rows[0] || null;
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


// export const getHotelById = async (hotel_id) => {
//   const result = await pool.query("SELECT * FROM hotels WHERE hotel_id = $1", [hotel_id]);
//   return result.rows[0];
// };

