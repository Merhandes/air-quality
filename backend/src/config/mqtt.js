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
      // Mengubah kiriman text ESP32 menjadi format JSON Objek
      const dataString = message.toString();
      let dataJson;

      try {
        dataJson = JSON.parse(dataString);
      } catch {
        dataJson = { raw_text: dataString }; // Jika ESP32 kirim text biasa (bukan JSON)
      }

      // Simpan menggunakan Mongoose Model
      const newLog = new Log({ value: dataJson });
      await newLog.save();

      console.log("🚀 New data stored to Atlas:", dataJson);
    } catch (err) {
      console.log("❌ Mongoose save error:", err.message);
    }
  });
};

export default startMqttBridge;
