import jwt from "jsonwebtoken";
import config from "../config/config.js";
import { FindOneUser } from "../dao/user.dao.js";

export async function authentication(req, res, next) {
  try {
    let token;
   
    if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    } else if (
      req.headers.authorization &&
      req.headers.authorization?.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1].trim();
    }
    //  console.log("Authorization header:", req.headers.authorization);
    //  console.log("Token after split:", token);
    if (!token) {
      return res.status(401).json({
        message: "Unauthorized user, no token provided",
      });
    }

    const decoded = jwt.verify(token, config.JWT_ACCESS_SECRET);
    const user = await FindOneUser({ _id: decoded.userId });
    req.user = user;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({
        message: "Invalid or expired token, please login first.",
        error: error.message,
      });
  }
}
