import dotenv from "dotenv";
dotenv.config();

import connectDB from "./config/database.js";
import app from "./app.js";
import startMqttBridge from "./config/mqtt.js";

process.on("uncaughtException", (err) => {
  console.error("💥 SYSTEM CRASH - Uncaught Exception:", err.stack);
});
process.on("unhandledRejection", (reason, promise) => {
  console.error(
    "💥 SYSTEM CRASH - Unhandled Rejection at:",
    promise,
    "reason:",
    reason
  );
});

const startServer = async () => {
  try {
    // 1. Amankan Port Express Terlebih Dahulu agar Railway mendeteksinya aktif
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 server is running on port ${PORT}`);
    });

    // 2. Hubungkan ke MongoDB Atlas menggunakan Mongoose secara berurutan
    const dbConnection = await connectDB();

    // 3. JALANKAN MQTT BRIDGE HANYA JIKA DATABASE SUDAH SIAP
    if (dbConnection) {
      console.log("📡 Inisialisasi MQTT Bridge...");
      startMqttBridge();
    }

    // 4. Kunci Event Loop agar proses tetap menggantung hidup
    const keepAlive = () => {
      setTimeout(keepAlive, 15000);
    };
    keepAlive();
    console.log(
      "🔒 Event Loop Lock Activated - Keeping process alive forever..."
    );
  } catch (error) {
    console.error("❌ Critical startServer failed:", error.message);
    setTimeout(() => process.exit(1), 5000);
  }
};

startServer();
