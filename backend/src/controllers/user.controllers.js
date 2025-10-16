import {
  createUserRegister,
  findById,
  FindOneUser,
  saveRefreshToken,
  getAllUsers,
  countUsers,
  searchUsers,
  countSearchUsers,
} from "../dao/user.dao.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import { sendResetPasswordEmail } from "../services/emailService.js";
import { generateResetToken } from "../utils/token.js";
import { generateTokens } from "../utils/generateToken.js";

export async function createUserRegisterController(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const isUserExist = await FindOneUser({ email });

    if (isUserExist) {
      return res.status(400).json({
        message: "User already exist.",
      });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await createUserRegister({
      name,
      email,
      password: hashPassword,
      role: "customer",
    });

    const tokens = generateTokens(user);
    await saveRefreshToken(user._id, tokens.refreshToken);
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
      message: "User registered successfully.",
      user: {
        userId: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Email already exists." });
    }

    console.error("Register error:", error);
    res.status(500).json({ message: "Server error." });
  }
}

export async function createUserLoginController(req, res) {
  const { name, email, password } = req.body;
  const user = await FindOneUser({
    $or: [{ name }, { email }],
  });
  if (!user) {
    return res.status(401).json({
      message: "Invalid creadentials",
    });
  }

  const isPasswordMatched = await bcrypt.compare(password, user.password);
  if (!isPasswordMatched) {
    return res.status(401).json({
      message: "Invalid creadentials",
    });
  }
  const tokens = generateTokens(user);
  await saveRefreshToken(user._id, tokens.refreshToken);
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
    // maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.status(200).json({
    message: "User logged in successfully.",
    user: {
      userId: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    accessToken: tokens.accessToken,
  });
}

export async function registerUserByGoogleController(req, res) {
  try {
    const tokens = generateTokens(req.user);
    await saveRefreshToken(req.user._id, tokens.refreshToken);

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
      // maxAge: 15 * 60 * 1000, // 15 minutes
    });
    res.redirect("http://localhost:5173/"); // replace with your frontend URL
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
}

export async function forgotPasswordController(req, res) {
  try {
    const { email } = req.body;
    const user = await FindOneUser({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    const resetToken = generateResetToken();
    const resetTokenExpires = Date.now() + 15 * 60 * 1000;

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpires;
    await user.save();

    const resetUrl = `http://localhost:5173/reset-password?token=${resetToken}`;
    await sendResetPasswordEmail(user.email, resetUrl);
    res.status(200).json({ message: "Password reset email sent." });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
}

export async function resetPasswordController(req, res) {
  try {
    const { token, newPassword } = req.body;
    const user = await FindOneUser({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    (user.resetPasswordToken = null), (user.resetPasswordExpires = null);
    await user.save();

    res.status(200).json({
      message: "Password reset successfully.",
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
}

export async function logoutController(req, res) {
  try {
    if (req.user) {
      await saveRefreshToken(req.user._id, null);
    }
    // console.log("User in logout:", req.user);
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
}

export async function refreshTokenController(req, res) {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    const decoded = jwt.verify(refreshToken, config.JWT_REFRESH_SECRET);
    const user = await findById(decoded.userId);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const tokens = generateTokens(user);
    await saveRefreshToken(user._id, tokens.refreshToken);
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
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.status(200).json({
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    return res
      .status(403)
      .json({ message: "Invalid or expired refresh token" });
  }
}

export async function getCurrentUserController(req, res) {
  try {
    const token = req.cookies?.accessToken;

    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, config.JWT_ACCESS_SECRET);
    const user = await findById(decoded.userId);
    if (!user) return res.status(401).json({ message: "User not found" });
    console.log(user);

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
}

export async function getAllUsersController(req, res) {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;
    const search = req.query.search?.trim() || "";

    let users, totalUsers;
    if (search) {
      users = await searchUsers({ search, limit, skip });
      totalUsers = await countSearchUsers(search);
    } else {
      users = await getAllUsers({ limit, skip, sort: { createdAt: -1 } });
      totalUsers = await countUsers();
    }
    const totalPages = Math.ceil(totalUsers / limit);
    res.status(200).json({ users, totalPages, currentPage: page, totalUsers });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
}
