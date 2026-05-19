import mqtt from "mqtt";
import Log from "../models/log.model.js";

const startMqttBridge = () => {
  // Optimasi konfigurasi agar hemat konsumsi RAM di server awan Linux
  const options = {
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
    rejectUnauthorized: false,
    connectTimeout: 15000,
    keepalive: 60, // Mengurangi frekuensi ping agar RAM tidak membengkak
    clean: true, // Memaksa sesi dibersihkan dari memori secara berkala
  };

  const mqttClient = mqtt.connect(process.env.MQTT_URL, options);

  mqttClient.on("connect", () => {
    console.log("📡 MQTT Bridge Connected to HiveMQ Cloud via WSS Port 8884!");
    mqttClient.subscribe("esp32/sensor_data");
  });

  mqttClient.on("error", (err) => {
    console.error("❌ MQTT Client Error:", err.message);
  });

  mqttClient.on("message", async (topic, message) => {
    try {
      const dataJson = JSON.parse(message.toString());
      const newLog = new Log(dataJson);
      await newLog.save();
      console.log("🚀 Data stored successfully!");
    } catch (err) {
      console.log("❌ Failed to parse message:", err.message);
    }
  });
};

export default startMqttBridge;
