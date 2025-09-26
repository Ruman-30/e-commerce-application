import jwt from "jsonwebtoken";
import config from "../config/config.js";

export const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { userId: user._id },
    config.JWT_ACCESS_SECRET,
    { expiresIn: "1d"}
  );

  const refreshToken = jwt.sign(
    { userId: user._id },
    config.JWT_REFRESH_SECRET,
    { expiresIn: "7d"}
  );

  return { accessToken, refreshToken };
};
