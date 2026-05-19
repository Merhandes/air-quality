import mqtt from "mqtt";
import Log from "../models/log.model.js";

const startMqttBridge = () => {
  const mqttClient = mqtt.connect(process.env.MQTT_URL, {
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
    rejectUnauthorized: false, // Wajib untuk server cloud Linux
    connectTimeout: 30000, // Batas waktu tunggu koneksi 30 detik
    reconnectPeriod: 5000, // Jika putus, coba hubungkan kembali setiap 5 detik
  });

  mqttClient.on("connect", () => {
    console.log("📡 MQTT Bridge Connected to HiveMQ Cloud!");
    mqttClient.subscribe("esp32/sensor_data", (err) => {
      if (err) console.error("❌ Gagal subscribe topik:", err.message);
    });
  });

  // Wajib menangkap event error agar koneksi tidak meruntuhkan server Node.js Anda
  mqttClient.on("error", (err) => {
    console.error("❌ MQTT Client Error:", err.message);
  });

  mqttClient.on("message", async (topic, message) => {
    try {
      const dataJson = JSON.parse(message.toString());
      const newLog = new Log(dataJson);
      await newLog.save();
      console.log("🚀 New data stored to Atlas:", dataJson);
    } catch (err) {
      console.log("❌ Failed to parse MQTT message:", err.message);
    }
  });
};

export default startMqttBridge;
