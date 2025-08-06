import jwt from "jsonwebtoken"
import dotenv from "dotenv";
dotenv.config()
const secretKey = process.env.JWT_SECRET;
const jwtExpiry = process.env.ACCESS_TOKEN_EXPIRY
;


export const generateToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, secretKey, {
    expiresIn: jwtExpiry,
  });
};

export const verifyToken = (token) => {
  console.log("token in verified header...", token);
  console.log("token in verified in env...", secretKey);

  try {
    return jwt.verify(token, secretKey);
  } catch (error) {
    console.log("JWT verification error:", error.message);
    return null;
  }
};
