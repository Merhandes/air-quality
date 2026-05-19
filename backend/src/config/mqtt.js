import mqtt from "mqtt";
import Log from "../models/log.model.js"; // Pastikan gunakan akhiran .js saat import file lokal

const startMqttBridge = () => {
  const mqttClient = mqtt.connect(process.env.MQTT_URL, {
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
  });

  mqttClient.on("connect", () => {
    console.log("✅ MQTT Bridge Connected to HiveMQ Cloud!");
    mqttClient.subscribe("esp32/sensor_data");
  });

  mqttClient.on("message", async (topic, message) => {
    try {
      const data = JSON.parse(message.toString());
      const newLog = new Log({ value: data });
      await newLog.save();
      console.log("🚀 Data stored to MongoDB:", data);
    } catch (err) {
      console.log("❌ Failed to parse MQTT message:", err.message);
    }
  });
};

export default startMqttBridge;
