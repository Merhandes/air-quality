import dotenv from "dotenv";
import connectDB from "./config/database.js";
import app from "./app.js";
import startMqttBridge from "./config/mqtt.js";

dotenv.config({
  path: "./.env",
});

const startServer = async () => {
  try {
    await connectDB();

    // Jalankan MQTT bridge setelah MongoDB terhubung
    startMqttBridge();

    app.on("error", (err) => {
      console.error("Server error:", err);
      throw err;
    });

    app.listen(process.env.PORT || 8000, () => {
      console.log(`server is running on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.log("MongoDb connection failed", error);
  }
};

startServer();
