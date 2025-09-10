import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env.test" });

export async function connectTestDb() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to test db.");
  } catch (err) {
    console.error("❌ Failed to connect to Test DB:", err.message);
    process.exit(1);
  }
}

export async function closeTestDb() {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  console.log("🛑 Test DB connection closed");
}
