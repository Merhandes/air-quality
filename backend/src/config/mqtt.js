import mqtt from "mqtt";
import Log from "../models/log.model.js"; // Pastikan menggunakan ekstensi .js

const startMqttBridge = () => {
  const mqttClient = mqtt.connect(process.env.MQTT_URL, {
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
  });

  mqttClient.on("connect", () => {
    console.log("📡 MQTT Bridge Connected to HiveMQ Cloud!");
    mqttClient.subscribe("esp32/sensor_data");
  });

  mqttClient.on("message", async (topic, message) => {
    try {
      const dataJson = JSON.parse(message.toString());

      // Hapus timestamp kiriman ESP32 jika masih terbawa, agar tidak merusak validasi database
      delete dataJson.timestamp;

      const newLog = new Log(dataJson);
      await newLog.save();

      console.log("🚀 Data ESP32 berhasil disimpan rata ke MongoDB Atlas!");
    } catch (err) {
      console.log("❌ Gagal parsing / simpan data MQTT:", err.message);
    }
  });
};

export default startMqttBridge;
