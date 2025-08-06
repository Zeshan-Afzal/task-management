import  jwt  from "jsonwebtoken";
import { verifyToken } from "../utils/utils.js";

export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;
  console.log("token...", token);

  if (!token) {
    return res.status(401).json({ error: "Required authorization token" });
  }
  const verifiedUser = verifyToken(token);
  console.log("verifiedUser...", verifiedUser);
  if (!verifiedUser) {
    return res
      .status(401)
      .json({ error: "Authorization failed, invalid or expire token" });
  }

  req.user = verifiedUser;
  next();
};

