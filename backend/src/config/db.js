import mongoose from "mongoose";

const connectDB = async () => {
  const MONGO_URI = process.env.MONGODB_URI;

  if (!MONGO_URI) {
    console.error("❌ ERROR: MONGODB_URI is not defined.");
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
