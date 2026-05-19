import dotenv from "dotenv";
dotenv.config();

import connectDB from "./config/database.js";
import app from "./app.js";
import startMqttBridge from "./config/mqtt.js";

// Amankan server dari crash unhandled
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
    // 1. LANGKAH UTAMA: Jalankan Server Express Terlebih Dahulu!
    // Ini mengunci port 8080 milik Railway secara instan agar jaringan luar mendeteksinya aktif
    const PORT = process.env.PORT || 8000;
    const server = app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 server is running on port ${PORT}`);
    });

    server.on("error", (err) => {
      console.error("❌ Express Server Error:", err);
    });

    // 2. Hubungkan ke MongoDB Atlas setelah server web aman menggantung
    await connectDB();

    // 3. JALANKAN MQTT BRIDGE DI AKHIR PROSES (BACKGROUND TASK)
    // Dengan menaruhnya di sini, proses TLS HiveMQ tidak akan menyumbat port Express Anda
    console.log("📡 Inisialisasi MQTT Bridge...");
    startMqttBridge();

    // 4. Kunci Event Loop secara rekursif agar kontainer tidak menutup paksa prosesnya
    const keepAlive = () => {
      setTimeout(keepAlive, 10000);
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
