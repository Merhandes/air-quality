import mqtt from "mqtt";
import Log from "../models/log.model.js";

const startMqttBridge = () => {
  const mqttClient = mqtt.connect(process.env.MQTT_URL, {
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
    // WAJIB UNTUK CLOUD: Mencegah Node.js mati mendadak akibat isu validasi sertifikat TLS Linux
    rejectUnauthorized: false,
    reconnectPeriod: 1000, // Otomatis coba hubungkan kembali setiap 1 detik jika putus
  });

  mqttClient.on("connect", () => {
    console.log("📡 MQTT Bridge Connected to HiveMQ Cloud!");
    mqttClient.subscribe("esp32/sensor_data");
  });

  // WAJIB: Tangkap error agar tidak memicu 'Stopping Container' secara mendadak
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
