import dotenv from "dotenv";
dotenv.config();

import connectDB from "./config/database.js";
import app from "./app.js";
import startMqttBridge from "./config/mqtt.js";

// Penangkap error agar server tidak crash karena isu unhandled silaman
process.on("uncaughtException", (err) => {
  console.error("💥 CRASH PREVENTED - Uncaught Exception:", err.stack);
});
process.on("unhandledRejection", (reason, promise) => {
  console.error(
    "💥 CRASH PREVENTED - Unhandled Rejection at:",
    promise,
    "reason:",
    reason
  );
});

const startServer = async () => {
  try {
    // 1. Hubungkan ke MongoDB Atlas
    await connectDB();

    // 2. Jalankan MQTT bridge setelah MongoDB terhubung
    startMqttBridge();

    app.on("error", (err) => {
      console.error("Server error:", err);
      throw err;
    });

    // 3. Jalankan Server Express pada port dinamis Railway
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 server is running on port ${PORT}`);
    });

    // ====================================================================
    // 🔒 PENGUNCI EVENT LOOP ABADI (Mencegah Node.js Exit / Stopping Container)
    // ====================================================================
    console.log(
      "🔒 Event Loop Lock Activated - Keeping process alive forever..."
    );

    const keepAlive = () => {
      // Melakukan pemicuan loop kecil setiap 10 detik agar CPU kontainer
      // tahu bahwa Node.js Anda sedang bekerja aktif dan menolak perintah shutdown.
      setTimeout(keepAlive, 10000);
    };
    keepAlive();
  } catch (error) {
    console.log("❌ MongoDB connection failed", error);
    // Beri jeda agar server tidak restart terlalu cepat jika DB error
    setTimeout(() => process.exit(1), 5000);
  }
};

startServer();
