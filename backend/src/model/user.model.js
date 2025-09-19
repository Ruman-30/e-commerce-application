import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      unique: true,
      sparse: true
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: function () {
        return !this.googleId; // required only if googleId is not present
      },
      minlength: [5, "Password must be at least 5 characters"],
      //   select: false, // hide password in queries
    },
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },
    address: {
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    refreshToken: { type: String },
  },
  { timestamps: true }
);

const userModel = mongoose.model("User", userSchema);

export default userModel;
