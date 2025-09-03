import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      unique: true
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
      required: [true, "Password is required"],
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
  },
  { timestamps: true }
);

// userSchema.index({ name: 1 }, { unique: true });
// userSchema.index({ email: 1 }, { unique: true });

const userModel = mongoose.model("User", userSchema);

export default userModel
