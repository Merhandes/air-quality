import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGO_URI);
    console.log(
      `\n ✅ MongoDB connected !!! HOST: ${connectionInstance.connection.host}`
    );
    return connectionInstance; // WAJIB: Mengembalikan objek koneksi agar bisa dibaca di index.js
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    return null;
  }
};

export default connectDB;
