import nodemailer from "nodemailer";
import config from "./config.js";

export const transporter = nodemailer.createTransport({
  service: "SendGrid",
  auth: {
    user: "apikey", 
    pass: config.SENDGRID_API_KEY,
  },
});
