import { createAdmin, findOneAdmin } from "../dao/admin.dao.js";
import bcrypt, { hash } from "bcryptjs";
import config from "../config/config.js";
import jwt from "jsonwebtoken";

export async function createAdminController(req, res) {
  const {
    name,
    email,
    password,
    address: { street, city, state, postalCode, country },
  } = req.body;

  const isAdminExist = await findOneAdmin({
    $or: [{ name }, { email }],
  });
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
    address: {
      street,
      city,
      state,
      postalCode,
      country,
    },
    role: "admin",
  });
  const token = jwt.sign({ adminId: admin._id }, config.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.status(201).json({
    message: "Admin registered successfully.",
    admin: {
      userId: admin._id,
      name: admin.name,
      email: admin.email,
      address: admin.address,
      role: admin.role,
    },
    token,
  });
}
