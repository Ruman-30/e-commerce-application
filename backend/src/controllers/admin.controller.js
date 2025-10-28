import { createAdmin, findOneAdmin, getDashboardStatsDao } from "../dao/admin.dao.js";
import bcrypt from "bcryptjs";
import { generateTokens } from "../utils/generateToken.js";
import { saveRefreshToken } from "../dao/user.dao.js";

export async function createAdminController(req, res) {
  const { name, email, password } = req.body;

  const isAdminExist = await findOneAdmin({ email });
  if (isAdminExist) {
    return res.status(401).json({
      message: "Admin already exist.",
    });
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const admin = await createAdmin({
    name,
    email,
    password: hashPassword,
    role: "admin",
  });
  const tokens = generateTokens(admin);
  await saveRefreshToken(admin._id, tokens.refreshToken);
  res.cookie("refreshToken", tokens.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
  res.cookie("accessToken", tokens.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    // maxAge: 15 * 60 * 1000,
  });

  res.status(201).json({
    message: "Admin registered successfully.",
    admin: {
      userId: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    },
    accessToken: tokens.accessToken,
  });
}

export const getDashboardStats = async (req, res) => {
  try {
    const stats = await getDashboardStatsDao();
    res.status(200).json(stats);
  } catch (error) {
    console.error("Error fetching admin dashboard stats:", error);
    res.status(500).json({
      message: "Failed to fetch dashboard stats",
      error: error.message,
    });
  }
};

