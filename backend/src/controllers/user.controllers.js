import { createUserRegister, FindOneUser } from "../dao/user.dao.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import { sendResetPasswordEmail } from "../services/emailService.js";
import { generateResetToken } from "../utils/token.js";

export async function createUserRegisterController(req, res) {
  const {
    name,
    email,
    password,
    address: { street, city, state, postalCode, country },
  } = req.body;
  const isUserExist = await FindOneUser({
  $or: [{ name }, { email }]
  });

  if (isUserExist) {
    return res.status(401).json({
      message: "User already exist.",
    });
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const user = await createUserRegister({
    name,
    email,
    password: hashPassword,
    address: {
      street,
      city,
      state,
      postalCode,
      country,
    },
    role: "customer",
  });

  const token = jwt.sign({ userId: user._id }, config.JWT_SECRET, {
    expiresIn: "1d",
  });
  res.cookie("token", token);
  res.status(201).json({
    mesasge: "User registered successfully.",
    user: {
      userId: user._id,
      name: user.name,
      email: user.email,
      address: user.address,
      role: user.role,
    },
    token,
  });
}

export async function createUserLoginController(req, res) {
  const { name, email, password } = req.body;
  const user = await FindOneUser({
    $or: [{name}, {email}],
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

  const token = jwt.sign({ userId: user._id }, config.JWT_SECRET, {
    expiresIn: "1d",
  });
  res.cookie("token", token)
  res.status(200).json({
    message: "User logged in successfully.",
    user: {
      userId: user._id,
      name: user.name,
      email: user.email,
      address: user.address,
      role: user.role,
    },
    token,
  });
}

export async function forgotPasswordController(req, res){
    try {
        const {email} = req.body 
        const user = await FindOneUser({email})
        if(!user){
            return res.status(404).json({message: "User not found!"})
        }

        const resetToken = generateResetToken()
        const resetTokenExpires = Date.now() + 15 * 60 * 1000 

        user.resetPasswordToken = resetToken
        user.resetPasswordExpires = resetTokenExpires
        await user.save()

        const resetUrl = `http://localhost:5173/reset-password?token=${resetToken}`
        await sendResetPasswordEmail(user.email, resetUrl)
        res.status(200).json({message: "Password reset email sent."})
    } catch (error) {
         res.status(500).json({ message: "Something went wrong", error });
    }
}

export async function resetPasswordController(req, res){
    try {
        const {token, newPassword} = req.body 
        const user = await FindOneUser({
            resetPasswordToken: token,
            resetPasswordExpires: {$gt: Date.now()}
        })

        if(!user){
              return res.status(400).json({ message: "Invalid or expired token." });
        }

        user.password = await bcrypt.hash(newPassword, 10)
        user.resetPasswordToken = null,
        user.resetPasswordExpires = null
        await user.save()

        res.status(200).json({
            message: "Password reset successfully.",
        })
    } catch (error) {
         res.status(500).json({ message: "Something went wrong", error });
    }
}