import { verifyToken } from '../utils/tokenUtils.js';
// import jwt from "jsonwebtoken";

/**
 * Generic auth middleware
 * Verifies token and attaches decoded info to req.user
 */
export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: Token missing' });
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }

  req.user = decoded; // generic user info
  next();
};


/**
 * Owner-specific middleware
 * Verifies token and attaches ownerId to req.ownerId
 */
// export const verifyOwner = (req, res, next) => {
//   const authHeader = req.headers['authorization'];
//   console.log("Auth Header:", authHeader);

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return res.status(401).json({ message: "Unauthorized: Token missing or malformed" });
//   }

//   const token = authHeader.split(" ")[1];
//   console.log("Token:", token);

//   try {
//     const decoded = verifyToken(token);
//     console.log("Decoded Token:", decoded);

//     if (!decoded || !decoded.id) {
//       return res.status(401).json({ message: "Unauthorized: Invalid token" });
//     }

//     req.ownerId = decoded.id;
//     next();
//   } catch (err) {
//     console.error("Token verification error:", err.message);
//     return res.status(401).json({ message: "Unauthorized: Invalid token" });
//   }
// };



