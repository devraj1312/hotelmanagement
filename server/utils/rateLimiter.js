// utils/rateLimiter.js
// import { adminDB } from '../config/db.js';

// policy
// const MIN_SECONDS_BETWEEN = 60;      // 1 otp / 60s
// const WINDOW_MINUTES = 10;           // 10-minute window
// const MAX_ATTEMPTS_IN_WINDOW = 3;    // max 3 in window

// export const checkAndBumpThrottle = async (phone) => {
//   const now = new Date();
//   const { rows } = await adminDB.query(
//     `SELECT phone, last_sent_at, window_start, attempts_in_window
//      FROM admin_otp_throttle WHERE phone = $1`,
//     [phone]
//   );

//   if (rows.length === 0) {
//     await adminDB.query(
//       `INSERT INTO admin_otp_throttle (phone, last_sent_at, window_start, attempts_in_window)
//        VALUES ($1, $2, $2, 1)`,
//       [phone, now]
//     );
//     return { ok: true };
//   }

//   const r = rows[0];
//   const last = new Date(r.last_sent_at);
//   const windowStart = new Date(r.window_start);
//   const sinceLastSec = Math.floor((now - last) / 1000);
//   const sinceWindowMin = Math.floor((now - windowStart) / 60000);

//   if (sinceLastSec < MIN_SECONDS_BETWEEN) {
//     return { ok: false, reason: `Wait ${MIN_SECONDS_BETWEEN - sinceLastSec}s before requesting another OTP.` };
//   }

//   if (sinceWindowMin >= WINDOW_MINUTES) {
//     // reset window
//     await adminDB.query(
//       `UPDATE admin_otp_throttle
//        SET last_sent_at = $2, window_start = $2, attempts_in_window = 1
//        WHERE phone = $1`,
//       [phone, now]
//     );
//     return { ok: true };
//   }

//   if (r.attempts_in_window >= MAX_ATTEMPTS_IN_WINDOW) {
//     return { ok: false, reason: `Max ${MAX_ATTEMPTS_IN_WINDOW} OTPs in ${WINDOW_MINUTES} minutes reached.` };
//   }

//   await adminDB.query(
//     `UPDATE admin_otp_throttle
//      SET last_sent_at = $2, attempts_in_window = attempts_in_window + 1
//      WHERE phone = $1`,
//     [phone, now]
//   );
//   return { ok: true };
// };
